# 🚀 Quick Start Guide - Medical Shop Management System

## Step-by-Step Instructions

### Step 1: Install Dependencies (First Time Only)

Open PowerShell or Command Prompt in the project root, then:

```bash
cd backend
npm install
```

This will install all required packages (express, mysql2, cors, dotenv).

### Step 2: Set Up Database

1. **Make sure MySQL is running** on your system

2. **Create the database** (if not already created):
   - Open MySQL Command Line or MySQL Workbench
   - Run:
     ```sql
     CREATE DATABASE IF NOT EXISTS medicalshopsystem;
     ```

3. **Import the database schema**:
   - **Option A - Using Command Line:**
     ```bash
     mysql -u root -p medicalshopsystem < database/medical_shop_full.sql
     ```
   - **Option B - Using MySQL Workbench:**
     - Open MySQL Workbench
     - Connect to your MySQL server
     - Go to Server → Data Import
     - Select `database/medical_shop_full.sql`
     - Click "Start Import"

### Step 3: Configure Database Connection (Optional)

If your MySQL has a password or different settings, create a `.env` file in the `backend` folder:

**Create `backend/.env` file:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password_here
DB_NAME=medicalshopsystem
OWNER_PASSWORD=owner123
```

**Note:** If you don't create `.env`, it uses defaults:
- Port: 5000
- DB User: root
- DB Password: (empty - no password)
- DB Name: medicalshopsystem
- Owner Password: owner123

### Step 4: Start the Server

In PowerShell/Command Prompt, navigate to backend folder:

```bash
cd backend
npm start
```

**Or:**
```bash
cd backend
node server.js
```

### Step 5: Verify Server is Running

You should see output like:
```
✅ Connected to MySQL database.
🚀 Server running on http://localhost:5000
📱 Frontend available at http://localhost:5000
🔌 API available at http://localhost:5000/api
```

### Step 6: Open in Browser

Open your web browser and go to:

**Main Dashboard:**
```
http://localhost:5000
```

**All Pages Available:**
- 🏠 Dashboard: `http://localhost:5000/index.html`
- 💊 Medicine: `http://localhost:5000/medicine.html`
- 👥 Buyers: `http://localhost:5000/buyer.html`
- 🛒 Purchases: `http://localhost:5000/purchase.html`
- 🚚 Suppliers: `http://localhost:5000/supplier.html`
- 🩺 Consultations: `http://localhost:5000/consultation.html`
- 💳 Billing: `http://localhost:5000/billing.html`
- 📊 Reports: `http://localhost:5000/reports.html`

---

## 🔐 Default Credentials

- **Owner Password:** `owner123` (for Medicine and Supplier management)

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Cannot find module" error
**Solution:**
```bash
cd backend
npm install
```

### Issue 2: "DB connection error"
**Solutions:**
- Make sure MySQL is running
- Check your database credentials in `.env` file
- Verify database `medicalshopsystem` exists
- Try: `mysql -u root -p` to test MySQL connection

### Issue 3: Port 5000 already in use
**Solution:**
- Change port in `backend/.env`: `PORT=3000` (or any other port)
- Update `base` variable in frontend files from `http://localhost:5000` to your new port

### Issue 4: "Access denied" for MySQL
**Solution:**
- Check your MySQL username and password in `.env` file
- Make sure MySQL user has proper permissions

---

## 📝 Quick Commands Reference

```bash
# Navigate to backend
cd backend

# Install dependencies (first time)
npm install

# Start server
npm start

# Or directly
node server.js
```

---

## 🎉 You're All Set!

Once the server is running, open `http://localhost:5000` in your browser and start using the Medical Shop Management System!

**Tip:** Keep the terminal window open while using the application. Press `Ctrl+C` to stop the server.


