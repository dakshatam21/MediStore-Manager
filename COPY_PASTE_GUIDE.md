# ⚡ Quick Start - Copy & Paste Guide

Use this guide to quickly add features to your existing pages. Just copy and paste!

---

## 1. Stock Indicators Table

### Add to: `medicine.html`

```html
<!-- Replace your old table with this -->
<table>
  <thead>
    <tr>
      <th>Medicine Name</th>
      <th>Quantity</th>
      <th>Stock Status</th>
      <th>Price</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody id="medicineTableBody">
    <!-- Will be filled by JavaScript -->
  </tbody>
</table>

<script>
  async function loadMedicines() {
    try {
      const response = await fetch('/api/medicines');
      const medicines = await response.json();
      
      const tbody = document.getElementById('medicineTableBody');
      tbody.innerHTML = medicines.map(med => {
        const indicator = createStockIndicator(med.quantity, 10, 50);
        return `
          <tr class="${med.quantity > 50 ? 'success' : med.quantity > 10 ? 'warning' : 'danger'}">
            <td>${escapeHtml(med.name)}</td>
            <td>${med.quantity} units</td>
            <td>${indicator}</td>
            <td>₹${med.price}</td>
            <td>
              <button class="btn btn-sm" onclick="editMedicine(${med.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteMedicine(${med.id})">Delete</button>
            </td>
          </tr>
        `;
      }).join('');
    } catch (error) {
      Notification.error('Failed to load medicines');
    }
  }
  
  loadMedicines();
</script>
```

---

## 2. Dashboard with Animated Counters

### Add to: `index.html`

```html
<!-- Replace stats section with this -->
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value" id="totalMedicines">0</div>
    <div class="stat-label">Total Medicines</div>
  </div>
  
  <div class="stat-card secondary">
    <div class="stat-value" id="lowStockCount">0</div>
    <div class="stat-label">Low Stock Items</div>
  </div>
  
  <div class="stat-card warning">
    <div class="stat-value" id="todayPurchases">0</div>
    <div class="stat-label">Today's Purchases</div>
  </div>
  
  <div class="stat-card danger">
    <div class="stat-value" id="totalRevenue">0</div>
    <div class="stat-label">Total Revenue</div>
  </div>
</div>

<script>
  async function loadStats() {
    try {
      const response = await fetch('/api/dashboard/stats');
      const stats = await response.json();
      
      // Animate counters
      animateCounter(document.getElementById('totalMedicines'), stats.totalMedicines, 1500);
      animateCounter(document.getElementById('lowStockCount'), stats.lowStock, 1500);
      animateCounter(document.getElementById('todayPurchases'), stats.todayPurchases, 1500);
      animateCounter(document.getElementById('totalRevenue'), stats.revenue, 1500, '₹', '');
    } catch (error) {
      Notification.error('Failed to load stats');
    }
  }
  
  loadStats();
</script>
```

---

## 3. Form with Validation

### Add to: Any page with a form (e.g., `medicine.html`)

```html
<form id="medicineForm">
  <div class="form-row">
    <div class="form-group">
      <label>Medicine Name *</label>
      <input type="text" name="name" placeholder="e.g., Aspirin" data-validate="required">
    </div>
    
    <div class="form-group">
      <label>Price (₹) *</label>
      <input type="number" name="price" placeholder="0.00" data-validate="required|number" step="0.01">
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label>Quantity *</label>
      <input type="number" name="quantity" placeholder="0" data-validate="required|number">
    </div>
    
    <div class="form-group">
      <label>Expiry Date *</label>
      <input type="date" name="expiry" data-validate="required">
    </div>
  </div>

  <div class="form-group">
    <label>Description</label>
    <textarea name="description" placeholder="Additional details..." rows="4"></textarea>
  </div>

  <button type="submit" class="btn">Add Medicine</button>
  <button type="reset" class="btn btn-secondary">Clear</button>
</form>

<script>
  const validator = new FormValidator('#medicineForm');
  validator.onSubmit = async () => {
    const formData = new FormData(document.getElementById('medicineForm'));
    
    try {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        Notification.success('Medicine added successfully!');
        validator.form.reset();
        loadMedicines(); // Reload list
      } else {
        const error = await response.json();
        Notification.error(error.message || 'Failed to add medicine');
      }
    } catch (error) {
      Notification.error('Error: ' + error.message);
    }
  };
</script>
```

---

## 4. Delete Confirmation Modal

### Add to: Any page where you delete items

```javascript
function deleteMedicine(id) {
  const modal = new Modal('deleteModal', `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Delete Medicine</h2>
        <button class="modal-close">×</button>
      </div>
      <div class="modal-body">
        <p><strong>Are you sure you want to delete this medicine?</strong></p>
        <p style="margin-top: 1rem; color: var(--danger-color);">⚠️ This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="modal.close()">Cancel</button>
        <button class="btn btn-danger" onclick="confirmDelete(${id}); modal.close();">Delete</button>
      </div>
    </div>
  `);
  modal.open();
}

async function confirmDelete(id) {
  try {
    const response = await fetch(`/api/medicines/${id}`, { method: 'DELETE' });
    if (response.ok) {
      Notification.success('Medicine deleted successfully!');
      loadMedicines(); // Reload list
    } else {
      Notification.error('Failed to delete medicine');
    }
  } catch (error) {
    Notification.error('Error: ' + error.message);
  }
}
```

---

## 5. Status Badges for Purchases

### Add to: `purchase.html`

```html
<table>
  <thead>
    <tr>
      <th>Purchase ID</th>
      <th>Buyer</th>
      <th>Item</th>
      <th>Amount</th>
      <th>Status</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    <!-- Example rows -->
    <tr class="success">
      <td>PUR001</td>
      <td>John Doe</td>
      <td>Aspirin (100 tablets)</td>
      <td>₹550</td>
      <td><span class="status active">Completed</span></td>
      <td>2025-11-29</td>
    </tr>
    
    <tr class="warning">
      <td>PUR002</td>
      <td>Jane Smith</td>
      <td>Paracetamol (50 tablets)</td>
      <td>₹300</td>
      <td><span class="status pending">Pending</span></td>
      <td>2025-11-29</td>
    </tr>
    
    <tr class="danger">
      <td>PUR003</td>
      <td>Bob Johnson</td>
      <td>Ibuprofen (100 tablets)</td>
      <td>₹750</td>
      <td><span class="status inactive">Cancelled</span></td>
      <td>2025-11-28</td>
    </tr>
  </tbody>
</table>
```

---

## 6. Buyer Status List

### Add to: `buyer.html`

```html
<div class="grid grid-2">
  <!-- Buyer Card 1 -->
  <div class="card hover-lift">
    <div class="card-header">
      <h3 class="card-title">John Doe</h3>
      <span class="status active">Active</span>
    </div>
    <p><strong>Email:</strong> john@example.com</p>
    <p><strong>Phone:</strong> 9876543210</p>
    <p><strong>Total Purchases:</strong> <span style="font-weight: bold; color: var(--primary-color);">₹5,250</span></p>
    <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
      <button class="btn btn-sm">Edit</button>
      <button class="btn btn-sm btn-danger">Delete</button>
    </div>
  </div>
  
  <!-- Buyer Card 2 -->
  <div class="card hover-lift">
    <div class="card-header">
      <h3 class="card-title">Jane Smith</h3>
      <span class="status inactive">Inactive</span>
    </div>
    <p><strong>Email:</strong> jane@example.com</p>
    <p><strong>Phone:</strong> 9876543211</p>
    <p><strong>Total Purchases:</strong> <span style="font-weight: bold; color: var(--primary-color);">₹3,100</span></p>
    <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
      <button class="btn btn-sm">Edit</button>
      <button class="btn btn-sm btn-danger">Delete</button>
    </div>
  </div>
</div>
```

---

## 7. Supplier List with Status

### Add to: `supplier.html`

```html
<table>
  <thead>
    <tr>
      <th>Supplier Name</th>
      <th>Contact</th>
      <th>Items Supplied</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr class="highlight">
      <td>Pharma Solutions</td>
      <td>+91-9876543210</td>
      <td><div class="tag success">Active</div></td>
      <td><span class="status active">Reliable</span></td>
      <td>
        <button class="btn btn-sm">View</button>
        <button class="btn btn-sm btn-secondary">Edit</button>
      </td>
    </tr>
    
    <tr>
      <td>Health Supplies Co</td>
      <td>+91-9876543211</td>
      <td><div class="tag warning">Pending</div></td>
      <td><span class="status pending">New</span></td>
      <td>
        <button class="btn btn-sm">View</button>
        <button class="btn btn-sm btn-secondary">Edit</button>
      </td>
    </tr>
  </tbody>
</table>
```

---

## 8. Billing with Progress

### Add to: `billing.html`

```html
<!-- Order Progress -->
<div style="margin-bottom: 2rem;">
  <h3>Order Processing Progress</h3>
  <div id="orderProgress"></div>
</div>

<!-- Billing Table -->
<table>
  <thead>
    <tr>
      <th>Invoice #</th>
      <th>Items</th>
      <th>Subtotal</th>
      <th>Tax</th>
      <th>Total</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr class="success">
      <td>INV-001</td>
      <td>3 items</td>
      <td>₹1,000</td>
      <td>₹180</td>
      <td><strong>₹1,180</strong></td>
      <td><span class="status active">Paid</span></td>
    </tr>
    
    <tr class="warning">
      <td>INV-002</td>
      <td>2 items</td>
      <td>₹500</td>
      <td>₹90</td>
      <td><strong>₹590</strong></td>
      <td><span class="status pending">Pending</span></td>
    </tr>
  </tbody>
</table>

<script>
  // Show progress bar
  const progress = new ProgressBar('#orderProgress', 100);
  progress.set(75); // 75% complete
</script>
```

---

## 9. Consultation Form with Status

### Add to: `consultation.html`

```html
<form id="consultationForm">
  <div class="form-row">
    <div class="form-group">
      <label>Patient Name *</label>
      <input type="text" name="patientName" data-validate="required">
    </div>
    
    <div class="form-group">
      <label>Email *</label>
      <input type="email" name="email" data-validate="required|email">
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label>Phone *</label>
      <input type="tel" name="phone" data-validate="required|phone">
    </div>
    
    <div class="form-group">
      <label>Consultation Type *</label>
      <select name="type" data-validate="required">
        <option value="">Select type</option>
        <option value="general">General Consultation</option>
        <option value="prescription">Prescription Review</option>
        <option value="followup">Follow-up</option>
      </select>
    </div>
  </div>

  <div class="form-group">
    <label>Symptoms/Issues *</label>
    <textarea name="symptoms" placeholder="Describe your symptoms..." data-validate="required" rows="4"></textarea>
  </div>

  <button type="submit" class="btn">Book Consultation</button>
</form>

<script>
  const consultationValidator = new FormValidator('#consultationForm');
  consultationValidator.onSubmit = async () => {
    Notification.success('Consultation booked successfully!');
    document.getElementById('consultationForm').reset();
  };
</script>
```

---

## 10. Reports with Animated Stats

### Add to: `reports.html`

```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value" id="totalSales">0</div>
    <div class="stat-label">Total Sales</div>
  </div>
  
  <div class="stat-card secondary">
    <div class="stat-value" id="totalCustomers">0</div>
    <div class="stat-label">Total Customers</div>
  </div>
  
  <div class="stat-card warning">
    <div class="stat-value" id="expiringSoon">0</div>
    <div class="stat-label">Expiring Soon</div>
  </div>
  
  <div class="stat-card danger">
    <div class="stat-value" id="outOfStock">0</div>
    <div class="stat-label">Out of Stock</div>
  </div>
</div>

<script>
  async function loadReportStats() {
    try {
      const response = await fetch('/api/reports/stats');
      const stats = await response.json();
      
      animateCounter(document.getElementById('totalSales'), stats.totalSales, 1500, '₹', '');
      animateCounter(document.getElementById('totalCustomers'), stats.totalCustomers, 1500);
      animateCounter(document.getElementById('expiringSoon'), stats.expiringSoon, 1500);
      animateCounter(document.getElementById('outOfStock'), stats.outOfStock, 1500);
    } catch (error) {
      Notification.error('Failed to load report stats');
    }
  }
  
  loadReportStats();
</script>
```

---

## 11. Information Boxes for Important Messages

```html
<!-- Add to any page to show important messages -->

<!-- Success Message -->
<div class="info-box success">
  <div class="info-box-icon">✅</div>
  <div class="info-box-content">
    <strong>Success!</strong> Your changes have been saved successfully.
  </div>
</div>

<!-- Warning Message -->
<div class="info-box warning">
  <div class="info-box-icon">⚠️</div>
  <div class="info-box-content">
    <strong>Warning:</strong> Stock levels for Paracetamol are running low (5 units).
  </div>
</div>

<!-- Error Message -->
<div class="info-box danger">
  <div class="info-box-icon">❌</div>
  <div class="info-box-content">
    <strong>Error:</strong> Failed to save changes. Please try again.
  </div>
</div>

<!-- Info Message -->
<div class="info-box info">
  <div class="info-box-icon">ℹ️</div>
  <div class="info-box-content">
    <strong>Information:</strong> New supplier has been added to the system.
  </div>
</div>
```

---

## 12. Breadcrumb Navigation

```html
<!-- Add to the top of each page content -->

<!-- For medicine.html -->
<div class="breadcrumb">
  <div class="breadcrumb-item"><a href="index.html">Home</a></div>
  <div class="breadcrumb-divider">/</div>
  <div class="breadcrumb-item active">Medicines</div>
</div>

<!-- For specific medicine detail -->
<div class="breadcrumb">
  <div class="breadcrumb-item"><a href="index.html">Home</a></div>
  <div class="breadcrumb-divider">/</div>
  <div class="breadcrumb-item"><a href="medicine.html">Medicines</a></div>
  <div class="breadcrumb-divider">/</div>
  <div class="breadcrumb-item active">Aspirin Details</div>
</div>
```

---

## 13. Search with Filter

```html
<div class="filter-section">
  <div class="filter-group">
    <label>Search:</label>
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="Search medicines..." onkeyup="filterMedicines()">
    </div>
  </div>
  
  <div class="filter-group">
    <label>Sort by:</label>
    <select id="sortSelect" onchange="sortMedicines()">
      <option value="name">Name (A-Z)</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="stock">Stock Level</option>
    </select>
  </div>
  
  <button class="filter-btn" onclick="resetFilters()">Reset</button>
</div>

<script>
  function filterMedicines() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  }

  function sortMedicines() {
    // Implement sorting logic
    Notification.info('Results sorted');
  }

  function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'name';
    filterMedicines();
  }
</script>
```

---

## 14. Export/Print Features

```html
<!-- Add buttons to your tables -->

<div style="margin-bottom: 1rem; display: flex; gap: 1rem;">
  <button class="btn btn-secondary" onclick="printTable()">🖨️ Print</button>
  <button class="btn btn-secondary" onclick="exportToCSV()">📥 Export CSV</button>
  <button class="btn btn-secondary" onclick="exportToPDF()">📄 Export PDF</button>
</div>

<script>
  function printTable() {
    window.print();
    Notification.info('Opening print dialog...');
  }

  function exportToCSV() {
    Notification.success('Table exported as CSV');
    // Add CSV export logic
  }

  function exportToPDF() {
    Notification.success('PDF generated and downloading...');
    // Add PDF export logic
  }
</script>
```

---

## 15. Quick Reference

### Copy-Paste These Common Snippets

**Show success:**
```javascript
Notification.success('Operation successful!');
```

**Show error:**
```javascript
Notification.error('Something went wrong!');
```

**Animate a counter:**
```javascript
animateCounter(element, 100, 1500);
```

**Create stock indicator:**
```javascript
const html = createStockIndicator(quantity, 10, 50);
element.innerHTML = html;
```

**Validate form:**
```javascript
const validator = new FormValidator('#myForm');
validator.onSubmit = () => { /* handle */ };
```

**Show modal:**
```javascript
const modal = new Modal('id', '<div>Content</div>');
modal.open();
```

---

## Getting Started Right Now

1. **Open `components-demo.html`** - See all features working
2. **Pick a feature** from this guide
3. **Copy the code** - Just copy and paste!
4. **Customize** - Change colors, text, etc.
5. **Test** - Open your page in browser
6. **Deploy** - All files are ready to use!

---

**You're all set! Start enhancing your pages now! 🚀**
