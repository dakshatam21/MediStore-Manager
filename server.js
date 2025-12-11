// backend/server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const path = require('path');

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'medicalshopsystem',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
db.getConnection((err, conn) => {
  if (err) {
    console.error('❌ DB connection error:', err.message);
  } else {
    console.log('✅ Connected to MySQL database.');
    conn.release();
  }
});

/* ------------------- Helper ------------------- */
function ownerAuthorized(password) {
  const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'owner123';
  return password && password === OWNER_PASSWORD;
}

/* ------------------- Medicines ------------------- */
// Get all medicines
app.get('/api/medicines', (req, res) => {
  db.query('SELECT ItemID, Name, Type, Price, ExpiryDate, StockQty, ReorderLevel, SupplierID, CompanyID FROM Item ORDER BY ItemID', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add new medicine (owner only)
app.post('/api/medicines', (req, res) => {
  const { Name, Type, Price, ExpiryDate, StockQty, SupplierID, CompanyID, ReorderLevel, password } = req.body;
  if (!ownerAuthorized(password)) return res.status(403).json({ error: 'Unauthorized' });
  db.query(
    'INSERT INTO Item (Name, Type, Price, ExpiryDate, StockQty, ReorderLevel, SupplierID, CompanyID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [Name, Type, Price||0, ExpiryDate||null, StockQty||0, ReorderLevel||5, SupplierID||null, CompanyID||null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Medicine added', id: result.insertId });
    }
  );
});

// Update stock (owner only)
app.put('/api/medicines/:id/stock', (req, res) => {
  const id = req.params.id;
  const { StockQty, password } = req.body;
  if (!ownerAuthorized(password)) return res.status(403).json({ error: 'Unauthorized' });
  db.query('UPDATE Item SET StockQty = ? WHERE ItemID = ?', [Number(StockQty), id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Stock updated', affectedRows: result.affectedRows });
  });
});

// Low stock
app.get('/api/medicines/lowstock', (req, res) => {
  db.query('SELECT ItemID, Name, StockQty, ReorderLevel FROM Item WHERE StockQty <= ReorderLevel ORDER BY StockQty ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* ------------------- Buyers ------------------- */
app.get('/api/buyers', (req, res) => {
  db.query('SELECT BuyerID, Name, Phone, Address FROM Buyer ORDER BY BuyerID', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/buyers', (req, res) => {
  const { Name, Phone, Address } = req.body;
  if (!Name) return res.status(400).json({ error: 'Name required' });
  db.query('INSERT INTO Buyer (Name, Phone, Address) VALUES (?, ?, ?)', [Name, Phone||null, Address||null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Buyer added', id: result.insertId });
  });
});

/* ------------------- Purchases ------------------- */
app.get('/api/purchases', (req, res) => {
  const { buyerId, startDate, endDate, itemId } = req.query;
  let sql = `SELECT p.PurchaseID, p.PurchaseDate, b.BuyerID, b.Name AS BuyerName, b.Phone AS BuyerPhone, b.Address AS BuyerAddress,
             i.ItemID, i.Name AS ItemName, i.Price, p.Quantity, (i.Price * p.Quantity) AS TotalAmount
             FROM Purchase p
             LEFT JOIN Buyer b ON p.BuyerID = b.BuyerID
             LEFT JOIN Item i ON p.ItemID = i.ItemID
             WHERE 1=1`;
  const params = [];
  
  if (buyerId) {
    sql += ' AND b.BuyerID = ?';
    params.push(buyerId);
  }
  if (startDate) {
    sql += ' AND DATE(p.PurchaseDate) >= ?';
    params.push(startDate);
  }
  if (endDate) {
    sql += ' AND DATE(p.PurchaseDate) <= ?';
    params.push(endDate);
  }
  if (itemId) {
    sql += ' AND i.ItemID = ?';
    params.push(itemId);
  }
  
  sql += ' ORDER BY p.PurchaseDate DESC, p.PurchaseID DESC';
  
  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get purchase by ID for billing
app.get('/api/purchases/:id', (req, res) => {
  const sql = `SELECT p.PurchaseID, p.PurchaseDate, b.BuyerID, b.Name AS BuyerName, b.Phone AS BuyerPhone, b.Address AS BuyerAddress,
               i.ItemID, i.Name AS ItemName, i.Price, p.Quantity, (i.Price * p.Quantity) AS TotalAmount
               FROM Purchase p
               LEFT JOIN Buyer b ON p.BuyerID = b.BuyerID
               LEFT JOIN Item i ON p.ItemID = i.ItemID
               WHERE p.PurchaseID = ?`;
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Purchase not found' });
    res.json(rows[0]);
  });
});

// Add purchase (supports new buyer creation) - transactional
app.post('/api/purchases', async (req, res) => {
  const { BuyerID, newBuyer, BuyerName, BuyerPhone, BuyerAddress, ItemID, Quantity } = req.body;
  if (!ItemID || !Quantity) return res.status(400).json({ error: 'ItemID and Quantity required' });

  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    let buyerIdToUse = BuyerID;
    if (newBuyer) {
      if (!BuyerName) { await conn.rollback(); conn.release(); return res.status(400).json({ error: 'BuyerName required' }); }
      const [r] = await conn.query('INSERT INTO Buyer (Name, Phone, Address) VALUES (?, ?, ?)', [BuyerName, BuyerPhone||null, BuyerAddress||null]);
      buyerIdToUse = r.insertId;
    } else {
      if (!buyerIdToUse) { await conn.rollback(); conn.release(); return res.status(400).json({ error: 'BuyerID required or set newBuyer true' }); }
    }

    // check stock
    const [rows] = await conn.query('SELECT StockQty FROM Item WHERE ItemID = ?', [ItemID]);
    if (!rows || rows.length === 0) { await conn.rollback(); conn.release(); return res.status(404).json({ error: 'Item not found' }); }
    const currentStock = rows[0].StockQty;
    const qty = Number(Quantity);
    if (currentStock < qty) { await conn.rollback(); conn.release(); return res.status(400).json({ error: 'Insufficient stock' }); }

    // decrement
    await conn.query('UPDATE Item SET StockQty = StockQty - ? WHERE ItemID = ?', [qty, ItemID]);

    // insert purchase
    const [ins] = await conn.query('INSERT INTO Purchase (BuyerID, ItemID, Quantity, PurchaseDate) VALUES (?, ?, ?, NOW())', [buyerIdToUse, ItemID, qty]);

    await conn.commit();
    conn.release();
    res.json({ message: 'Purchase recorded', purchaseId: ins.insertId });
  } catch (err) {
    await conn.rollback();
    conn.release();
    res.status(500).json({ error: err.message });
  }
});

/* ------------------- Suppliers & SuppliedBy ------------------- */
// Get suppliers
app.get('/api/suppliers', (req, res) => {
  db.query('SELECT SupplierID, Name, Address, Phone, Email FROM Supplier ORDER BY SupplierID', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add supplier (owner only)
app.post('/api/suppliers', (req, res) => {
  const { Name, Address, Phone, Email, password } = req.body;
  if (!ownerAuthorized(password)) return res.status(403).json({ error: 'Unauthorized' });
  db.query('INSERT INTO Supplier (Name, Address, Phone, Email) VALUES (?, ?, ?, ?)', [Name, Address||null, Phone||null, Email||null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Supplier added', id: result.insertId });
  });
});

// Update supplier (owner only)
app.put('/api/suppliers/:id', (req, res) => {
  const id = req.params.id;
  const { Name, Address, Phone, Email, password } = req.body;
  if (!ownerAuthorized(password)) return res.status(403).json({ error: 'Unauthorized' });
  db.query('UPDATE Supplier SET Name=?, Address=?, Phone=?, Email=? WHERE SupplierID=?', [Name, Address||null, Phone||null, Email||null, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Supplier updated', affectedRows: result.affectedRows });
  });
});

// Delete supplier (owner only)
app.delete('/api/suppliers/:id', (req, res) => {
  const id = req.params.id;
  const { password } = req.body;
  if (!ownerAuthorized(password)) return res.status(403).json({ error: 'Unauthorized' });
  db.query('DELETE FROM Supplier WHERE SupplierID = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Supplier deleted', affectedRows: result.affectedRows });
  });
});

// SuppliedBy: link supplier to item (owner only)
app.post('/api/suppliedby', (req, res) => {
  const { SupplierID, ItemID, SupplyPrice, password } = req.body;
  if (!ownerAuthorized(password)) return res.status(403).json({ error: 'Unauthorized' });
  db.query('INSERT INTO SuppliedBy (SupplierID, ItemID, SupplyPrice) VALUES (?, ?, ?)', [SupplierID, ItemID, SupplyPrice||0], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Linked supplier->item', id: result.insertId });
  });
});

// Get items supplied by supplier
app.get('/api/suppliedby/:supplierId', (req, res) => {
  const sid = req.params.supplierId;
  const sql = `SELECT sb.ID, sb.SupplyPrice, i.ItemID, i.Name AS ItemName, i.StockQty
               FROM SuppliedBy sb
               LEFT JOIN Item i ON sb.ItemID = i.ItemID
               WHERE sb.SupplierID = ?`;
  db.query(sql, [sid], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Remove SuppliedBy link (owner)
app.delete('/api/suppliedby/:id', (req, res) => {
  const id = req.params.id;
  const { password } = req.body;
  if (!ownerAuthorized(password)) return res.status(403).json({ error: 'Unauthorized' });
  db.query('DELETE FROM SuppliedBy WHERE ID = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Link removed', affectedRows: result.affectedRows });
  });
});

/* ------------------- Doctors / Patients / Consultations ------------------- */
// Doctors CRUD
app.get('/api/doctors', (req, res) => {
  db.query('SELECT DoctorID, Name, Specialization, Contact, Email FROM Doctors ORDER BY DoctorID', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/api/doctors', (req, res) => {
  const { Name, Specialization, Contact, Email } = req.body;
  db.query('INSERT INTO Doctors (Name, Specialization, Contact, Email) VALUES (?, ?, ?, ?)', [Name, Specialization||null, Contact||null, Email||null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Doctor added', id: result.insertId });
  });
});
app.put('/api/doctors/:id', (req, res) => {
  const id = req.params.id;
  const { Name, Specialization, Contact, Email } = req.body;
  db.query('UPDATE Doctors SET Name=?, Specialization=?, Contact=?, Email=? WHERE DoctorID=?', [Name, Specialization||null, Contact||null, Email||null, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Doctor updated', affectedRows: result.affectedRows });
  });
});
app.delete('/api/doctors/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Doctors WHERE DoctorID=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Doctor deleted', affectedRows: result.affectedRows });
  });
});

// Patients CRUD
app.get('/api/patients', (req, res) => {
  db.query('SELECT PatientID, Name, Age, Contact, Address FROM Patients ORDER BY PatientID', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/api/patients', (req, res) => {
  const { Name, Age, Contact, Address } = req.body;
  db.query('INSERT INTO Patients (Name, Age, Contact, Address) VALUES (?, ?, ?, ?)', [Name, Age||null, Contact||null, Address||null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Patient added', id: result.insertId });
  });
});
app.put('/api/patients/:id', (req, res) => {
  const id = req.params.id;
  const { Name, Age, Contact, Address } = req.body;
  db.query('UPDATE Patients SET Name=?, Age=?, Contact=?, Address=? WHERE PatientID=?', [Name, Age||null, Contact||null, Address||null, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Patient updated', affectedRows: result.affectedRows });
  });
});
app.delete('/api/patients/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Patients WHERE PatientID=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Patient deleted', affectedRows: result.affectedRows });
  });
});

// Consultations CRUD (link doctor & patient)
app.get('/api/consultations', (req, res) => {
  const sql = `SELECT c.ConsultationID, c.Date, c.Diagnosis, d.DoctorID, d.Name AS DoctorName, p.PatientID, p.Name AS PatientName
               FROM Consultations c
               LEFT JOIN Doctors d ON c.DoctorID = d.DoctorID
               LEFT JOIN Patients p ON c.PatientID = p.PatientID
               ORDER BY c.Date DESC, c.ConsultationID DESC`;
  db.query(sql, (err, rows) => { if (err) return res.status(500).json({ error: err.message }); res.json(rows); });
});
app.post('/api/consultations', (req, res) => {
  const { DoctorID, PatientID, Date, Diagnosis } = req.body;
  if (!DoctorID || !PatientID) return res.status(400).json({ error: 'DoctorID and PatientID required' });
  db.query('INSERT INTO Consultations (DoctorID, PatientID, Date, Diagnosis) VALUES (?, ?, ?, ?)', [DoctorID, PatientID, Date || null, Diagnosis || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Consultation added', id: result.insertId });
  });
});
app.put('/api/consultations/:id', (req, res) => {
  const id = req.params.id;
  const { DoctorID, PatientID, Date, Diagnosis } = req.body;
  db.query('UPDATE Consultations SET DoctorID=?, PatientID=?, Date=?, Diagnosis=? WHERE ConsultationID=?', [DoctorID, PatientID, Date||null, Diagnosis||null, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Consultation updated', affectedRows: result.affectedRows });
  });
});
app.delete('/api/consultations/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Consultations WHERE ConsultationID=?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Consultation deleted', affectedRows: result.affectedRows });
  });
});

/* ------------------- Reports ------------------- */
// Sales report
app.get('/api/reports/sales', (req, res) => {
  const { startDate, endDate } = req.query;
  let sql = `SELECT 
             DATE(p.PurchaseDate) AS SaleDate,
             COUNT(DISTINCT p.PurchaseID) AS TotalPurchases,
             SUM(p.Quantity) AS TotalQuantity,
             SUM(i.Price * p.Quantity) AS TotalRevenue,
             COUNT(DISTINCT p.BuyerID) AS UniqueBuyers
             FROM Purchase p
             LEFT JOIN Item i ON p.ItemID = i.ItemID
             WHERE 1=1`;
  const params = [];
  
  if (startDate) {
    sql += ' AND DATE(p.PurchaseDate) >= ?';
    params.push(startDate);
  }
  if (endDate) {
    sql += ' AND DATE(p.PurchaseDate) <= ?';
    params.push(endDate);
  }
  
  sql += ' GROUP BY DATE(p.PurchaseDate) ORDER BY SaleDate DESC';
  
  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Top selling medicines
app.get('/api/reports/top-medicines', (req, res) => {
  const { limit = 10 } = req.query;
  const sql = `SELECT 
               i.ItemID, i.Name AS ItemName, i.Price,
               SUM(p.Quantity) AS TotalSold,
               SUM(i.Price * p.Quantity) AS TotalRevenue
               FROM Purchase p
               LEFT JOIN Item i ON p.ItemID = i.ItemID
               GROUP BY i.ItemID, i.Name, i.Price
               ORDER BY TotalSold DESC
               LIMIT ?`;
  db.query(sql, [parseInt(limit)], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Buyer statistics
app.get('/api/reports/buyer-stats', (req, res) => {
  const sql = `SELECT 
               b.BuyerID, b.Name AS BuyerName, b.Phone, b.Address,
               COUNT(p.PurchaseID) AS TotalPurchases,
               SUM(p.Quantity) AS TotalItems,
               SUM(i.Price * p.Quantity) AS TotalSpent
               FROM Buyer b
               LEFT JOIN Purchase p ON b.BuyerID = p.BuyerID
               LEFT JOIN Item i ON p.ItemID = i.ItemID
               GROUP BY b.BuyerID, b.Name, b.Phone, b.Address
               HAVING TotalPurchases > 0
               ORDER BY TotalSpent DESC`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* ------------------- Misc ------------------- */
// API root endpoint
app.get('/api', (req, res) => res.json({ message: 'Medical shop API' }));

// Serve static files from frontend directory (must be after API routes)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend available at http://localhost:${PORT}`);
  console.log(`🔌 API available at http://localhost:${PORT}/api`);
});
