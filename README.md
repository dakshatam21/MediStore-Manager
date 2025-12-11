# MediStore Manager
MediStore Manager is a web-based Medical Shop Management System built using HTML, CSS, JavaScript, Node.js, Express, and MySQL. It provides a centralized platform to manage medicines, suppliers, buyers, purchases, doctors, patients, consultations, and prescriptions efficiently. The system supports secure owner access, inventory updates, and smooth day-to-day operations for medical shops.

---

## Features

### Core Functionalities

* Medicine inventory management
* Add, update, and track stock levels
* Supplier and supply record management
* Buyer registration and purchase tracking
* Doctor details and patient consultation records
* Prescription management
* Auto-updated stock after purchases
* Preloaded sample data + ability to add new entries

### Owner Access

* Password-protected owner login
* Owner can add medicines, update stock, view reports, and manage all data entries

### User-Friendly Interface

* Clean and simple frontend
* Fully responsive layouts
* Easily navigable dashboard
* Error handling and form validation
* Real-time updates and smooth interaction

---

## Technology Stack

**Frontend:**

* HTML
* CSS
* JavaScript

**Backend:**

* Node.js
* Express.js

**Database:**

* MySQL

---

## Project Structure

```
MediStore Manager /
│
├── backend/
│   ├── server.js
│   ├── db.js
│   └── routes/
│       ├── medicines.js
│       ├── buyers.js
│       ├── suppliers.js
│       ├── purchases.js
│       ├── doctors.js
│       ├── patients.js
│       └── consultations.js
│
├── frontend/
│   ├── index.html
│   ├── medicine.html
│   ├── buyer.html
│   ├── purchase.html
│   ├── supplier.html
│   ├── doctor.html
│   ├── patient.html
│   ├── consultation.html
│   ├── billing.html
│   ├── style.css
│   └── utils.js
│
└── README.md

---

## How to Run the Project

### 1. Install Dependencies

Navigate to the backend folder and run:

```
npm install
```

### 2. Import MySQL Database

* Open phpMyAdmin or MySQL Workbench
* Create database:

  ```
  medicalshopsystem
  ```
* Import the provided SQL file

### 3. Configure Database Credentials

Open **db.js** or **server.js** (depending on your version):

```
host: 'localhost',
user: 'root',
password: 'your_mysql_password',
database: 'medicalshopsystem'
```

### 4. Start the Server

```
node server.js
```

### 5. Open the Frontend

Open any HTML file directly or use Live Server in VS Code.

---

## Use Cases

* Small and medium-sized medical shops
* Pharmacy inventory management
* Tracking medicines, suppliers, and their deliveries
* Managing buyers, doctors, and consultations
* Maintaining organized and accessible digital records

---

## Future Enhancements

* Role-based authentication (Owner/Employee/Admin)
* GST billing and invoice generation
* Expiry date alerts
* Advanced analytics and graphs
* PDF export for reports
* Cloud database integration

---
