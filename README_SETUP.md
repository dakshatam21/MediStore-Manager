# Medical Shop Management System - Setup Guide

## 📋 Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MySQL** - Make sure MySQL is installed and running
3. **Database** - Import the SQL file from `database/medical_shop_full.sql`

## 🚀 Quick Start Guide

### Step 1: Set Up Database

1. Open MySQL command line or MySQL Workbench
2. Create the database (if not exists):
   ```sql
   CREATE DATABASE medicalshopsystem;
   ```
3. Import the database schema:
   ```bash
   mysql -u root -p medicalshopsystem < database/medical_shop_full.sql
   ```
   Or use MySQL Workbench to import the SQL file.

### Step 2: Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory (optional):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=medicalshopsystem
   OWNER_PASSWORD=owner123
   ```
   
   **Note:** If you don't create a `.env` file, the system will use default values:
   - Port: 5000
   - DB Host: localhost
   - DB User: root
   - DB Password: (empty)
   - DB Name: medicalshopsystem
   - Owner Password: owner123

### Step 3: Start the Server

1. In the `backend` directory, run:
   ```bash
   npm start
   ```
   
   Or:
   ```bash
   node server.js
   ```

2. You should see:
   ```
   ✅ Connected to MySQL database.
   🚀 Server running on http://localhost:5000
   📱 Frontend available at http://localhost:5000
   🔌 API available at http://localhost:5000/api
   ```

### Step 4: Access the Application

Open your web browser and navigate to:

**🌐 Main Dashboard:**
```
http://localhost:5000
```

**📄 Available Pages:**
- Home/Dashboard: `http://localhost:5000/index.html`
- Medicine Management: `http://localhost:5000/medicine.html`
- Buyer Management: `http://localhost:5000/buyer.html`
- Purchase Management: `http://localhost:5000/purchase.html`
- Supplier Management: `http://localhost:5000/supplier.html`
- Consultation Management: `http://localhost:5000/consultation.html`

## 🔐 Owner Password

The default owner password is: **`owner123`**

You can change this by setting `OWNER_PASSWORD` in your `.env` file.

## 🛠️ Troubleshooting

### Database Connection Error

If you see "❌ DB connection error":
1. Check if MySQL is running
2. Verify your database credentials in `.env` file
3. Make sure the database `medicalshopsystem` exists

### Port Already in Use

If port 5000 is already in use:
1. Change the `PORT` in your `.env` file to another port (e.g., 3000, 8000)
2. Update the `base` URL in frontend files from `http://localhost:5000` to your new port

### Dependencies Not Found

If you get module errors:
```bash
cd backend
npm install
```

### CORS Issues

If you see CORS errors in the browser console, make sure:
1. The backend server is running
2. You're accessing the frontend through the same server (http://localhost:5000)
3. The API calls are using the correct base URL

## 📱 Features

- ✅ Modern, responsive UI design
- ✅ Real-time dashboard with statistics
- ✅ Medicine inventory management (owner only)
- ✅ Buyer management
- ✅ Purchase recording
- ✅ Supplier management
- ✅ Doctor-Patient consultation tracking
- ✅ Low stock alerts
- ✅ Search and filter functionality

## 🎨 Frontend Features

- Beautiful gradient design
- Toast notifications instead of alerts
- Loading states and spinners
- Responsive layout (mobile-friendly)
- Search functionality
- Real-time updates

Enjoy using your Medical Shop Management System! 🎉

