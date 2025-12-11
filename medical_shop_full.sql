-- medical_shop_full.sql
DROP DATABASE IF EXISTS medicalshopsystem;
CREATE DATABASE medicalshopsystem;
USE medicalshopsystem;

-- Owner
CREATE TABLE Owner (
  OwnerID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(100) UNIQUE NOT NULL,
  PasswordHash VARCHAR(255) NOT NULL,
  FullName VARCHAR(150),
  Contact VARCHAR(30)
) ENGINE=InnoDB;
INSERT INTO Owner (Username, PasswordHash, FullName, Contact) VALUES ('owner','owner123','Shop Owner','9000000000');

-- Supplier
CREATE TABLE Supplier (
  SupplierID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(150) NOT NULL,
  Address VARCHAR(255),
  Phone VARCHAR(20),
  Email VARCHAR(100)
) ENGINE=InnoDB;
INSERT INTO Supplier (Name, Address, Phone, Email) VALUES
('Medline Supplies','Deccan, Pune','02011112222','contact@medline.com'),
('HealthMart Distributors','Dadar, Mumbai','02233334444','sales@healthmart.in'),
('Global Pharma','Viman Nagar, Pune','02055556666','info@globalpharma.com'),
('Wellness Wholesalers','Kothrud, Pune','02077778888','orders@wellness.com'),
('City Medicals Supplier','Andheri, Mumbai','02299990000','citymed@suppliers.com'),
('Sunrise Pharmaceuticals','Kolkata','03311112222','sunrise@pharma.co'),
('Eastside Distributors','Bengaluru','08022223333','east@dist.com'),
('NorthStar Supplies','Delhi','01144445555','northstar@supply.in'),
('Rapid Medicals','Nagpur','07122777777','rapid@meds.in'),
('Prime Health Supply','Chennai','04488889999','prime@health.com');

-- Pharma_Company
CREATE TABLE Pharma_Company (
  CompanyID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(150) NOT NULL,
  LicenseNo VARCHAR(100),
  Contact VARCHAR(30),
  Email VARCHAR(100)
) ENGINE=InnoDB;
INSERT INTO Pharma_Company (Name, LicenseNo, Contact, Email) VALUES
('GoodHealth Pharma','LIC-GH-001','01111110001','contact@goodhealth.com'),
('WellCare Labs','LIC-WC-002','01111110002','info@wellcarelabs.com'),
('CureAll Pharmaceuticals','LIC-CA-003','01111110003','support@cureall.com'),
('NatureMed Co','LIC-NM-004','01111110004','hello@naturemed.com'),
('SafeDose Ltd','LIC-SD-005','01111110005','sales@safedose.com'),
('RemedyWorks','LIC-RW-006','01111110006','contact@remedyworks.com'),
('HealWell Corporation','LIC-HW-007','01111110007','inquiries@healwell.com'),
('Optima Pharma','LIC-OP-008','01111110008','optima@pharma.com'),
('Vitalix Labs','LIC-VL-009','01111110009','info@vitalix.com'),
('Zenith Biotech','LIC-ZB-010','01111110010','zenith@biotech.com');

-- Item
CREATE TABLE Item (
  ItemID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(200) NOT NULL,
  Type VARCHAR(50),
  Price DECIMAL(10,2),
  ExpiryDate DATE,
  StockQty INT DEFAULT 0,
  ReorderLevel INT DEFAULT 5,
  SupplierID INT,
  CompanyID INT,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (CompanyID) REFERENCES Pharma_Company(CompanyID) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
INSERT INTO Item (Name, Type, Price, ExpiryDate, StockQty, ReorderLevel, SupplierID, CompanyID) VALUES
('Paracetamol 500mg','Tablet',12.00,'2026-12-31',150,20,1,1),
('Amoxicillin 250mg','Capsule',28.50,'2026-09-30',90,15,2,3),
('Cough Syrup 100ml','Syrup',85.00,'2025-11-15',40,10,3,2),
('Cetirizine 10mg','Tablet',18.00,'2027-05-20',110,20,4,5),
('Dolo 650','Tablet',35.00,'2026-08-11',80,10,1,6),
('Vicks Vaporub 50g','Ointment',60.00,'2028-01-01',60,10,5,4),
('Insulin 10ml','Injection',250.00,'2026-03-31',25,5,6,7),
('Bandage Roll 5m','FirstAid',40.00,'2030-12-31',200,30,7,8),
('Combiflam Tablet','Tablet',30.00,'2026-12-15',120,20,8,9),
('Antacid Gel 100g','Gel',55.00,'2027-09-01',70,10,9,10);

-- SuppliedBy
CREATE TABLE SuppliedBy (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  SupplierID INT,
  ItemID INT,
  SupplyPrice DECIMAL(10,2),
  FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (ItemID) REFERENCES Item(ItemID) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
INSERT INTO SuppliedBy (SupplierID, ItemID, SupplyPrice) VALUES
(1,1,8.00),(2,2,18.00),(3,3,60.00),(4,4,10.00),(1,5,40.00),
(6,6,180.00),(6,7,180.00),(7,8,20.00),(8,9,22.00),(9,10,35.00);

-- Buyer
CREATE TABLE Buyer (
  BuyerID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(150) NOT NULL,
  Phone VARCHAR(20),
  Address VARCHAR(255),
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
INSERT INTO Buyer (Name, Phone, Address) VALUES
('Rohan Patil','9876543210','Deccan, Pune'),
('Priya Sharma','9888777666','Kothrud, Pune'),
('Karan Mehta','9765432100','Viman Nagar, Pune'),
('Meena Joshi','9654321987','Andheri East, Mumbai'),
('Sita Verma','9554412345','Vashi, Navi Mumbai'),
('Amit Singh','9445566778','Akurdi, Pune'),
('Neha Kapoor','9332211456','Baner, Pune'),
('Vijay Rao','9223344556','Pune Station Road'),
('Pooja Nair','9101122334','Hinjewadi'),
('Suresh Kumar','9009900990','Pune Nagar');

-- Purchase
CREATE TABLE Purchase (
  PurchaseID INT AUTO_INCREMENT PRIMARY KEY,
  BuyerID INT,
  ItemID INT,
  Quantity INT,
  PurchaseDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (BuyerID) REFERENCES Buyer(BuyerID) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (ItemID) REFERENCES Item(ItemID) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
INSERT INTO Purchase (BuyerID, ItemID, Quantity, PurchaseDate) VALUES
(1,1,2,'2025-10-01 10:12:00'),
(2,3,1,'2025-10-02 11:20:00'),
(3,2,3,'2025-10-03 09:45:00'),
(4,1,1,'2025-10-04 12:00:00'),
(5,5,2,'2025-10-05 14:30:00'),
(6,8,5,'2025-10-06 16:10:00'),
(7,9,1,'2025-10-07 13:00:00'),
(8,4,2,'2025-10-08 15:25:00'),
(9,10,1,'2025-10-09 17:45:00'),
(10,7,1,'2025-10-10 08:05:00');

-- Doctors
CREATE TABLE Doctors (
  DoctorID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(150) NOT NULL,
  Specialization VARCHAR(150),
  Contact VARCHAR(30),
  Email VARCHAR(100)
) ENGINE=InnoDB;
INSERT INTO Doctors (Name, Specialization, Contact, Email) VALUES
('Dr. Aakash Kulkarni','General Physician','9001001001','aakash.k@clinic.com'),
('Dr. Bhavna Desai','Pediatrics','9001001002','bhavna.d@clinic.com'),
('Dr. Chetan Rao','Cardiology','9001001003','chetan.r@clinic.com'),
('Dr. Deepa Menon','Gynecology','9001001004','deepa.m@clinic.com'),
('Dr. Esha Patel','Dermatology','9001001005','esha.p@clinic.com'),
('Dr. Farhan Ahmed','ENT','9001001006','farhan.a@clinic.com'),
('Dr. Gauri Shinde','Orthopedics','9001001007','gauri.s@clinic.com'),
('Dr. Harish Verma','Neurology','9001001008','harish.v@clinic.com'),
('Dr. Isha Kapoor','Psychiatry','9001001009','isha.k@clinic.com'),
('Dr. Jatin Mehra','Endocrinology','9001001010','jatin.m@clinic.com');

-- Patients
CREATE TABLE Patients (
  PatientID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(150) NOT NULL,
  Age INT,
  Contact VARCHAR(30),
  Address VARCHAR(255)
) ENGINE=InnoDB;
INSERT INTO Patients (Name, Age, Contact, Address) VALUES
('Alice Fernandes',30,'8800000001','Pune'),
('Bob Fernandes',45,'8800000002','Pune'),
('Carla D''Souza',28,'8800000003','Mumbai'),
('Deep Kumar',35,'8800000004','Pune'),
('Evelyn George',22,'8800000005','Bangalore'),
('Faisal Khan',50,'8800000006','Hyderabad'),
('Gita Rao',60,'8800000007','Chennai'),
('Hitesh Shah',40,'8800000008','Mumbai'),
('Ila Menon',55,'8800000009','Kochi'),
('Jatin Gupta',18,'8800000010','Delhi');

-- Consultations
CREATE TABLE Consultations (
  ConsultationID INT AUTO_INCREMENT PRIMARY KEY,
  DoctorID INT,
  PatientID INT,
  Date DATE,
  Diagnosis VARCHAR(500),
  FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (PatientID) REFERENCES Patients(PatientID) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
INSERT INTO Consultations (DoctorID, PatientID, Date, Diagnosis) VALUES
(1,1,'2025-09-01','Fever and body ache'),
(2,2,'2025-09-02','Cough & cold'),
(3,3,'2025-09-03','Chest pain — follow up'),
(4,4,'2025-09-04','Routine checkup'),
(5,5,'2025-09-05','Skin rash'),
(6,6,'2025-09-06','Ear infection'),
(7,7,'2025-09-07','Knee pain'),
(8,8,'2025-09-08','Migraines'),
(9,9,'2025-09-09','Depression follow-up'),
(10,10,'2025-09-10','Thyroid evaluation');

-- Prescriptions
CREATE TABLE Prescriptions (
  PrescriptionID INT AUTO_INCREMENT PRIMARY KEY,
  ConsultationID INT,
  ItemID INT,
  Dosage VARCHAR(100),
  Duration VARCHAR(100),
  FOREIGN KEY (ConsultationID) REFERENCES Consultations(ConsultationID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (ItemID) REFERENCES Item(ItemID) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
INSERT INTO Prescriptions (ConsultationID, ItemID, Dosage, Duration) VALUES
(1,1,'500 mg, twice a day','5 days'),
(2,3,'10 ml, thrice a day','7 days'),
(3,2,'250 mg, thrice a day','7 days'),
(4,1,'500 mg, once a day','3 days'),
(5,4,'10 mg, once a day','10 days'),
(6,3,'10 ml, twice a day','5 days'),
(7,8,'Use as needed','Until healed'),
(8,9,'1 tablet, twice a day','5 days'),
(9,4,'10 mg, once a day','14 days'),
(10,7,'10 IU subcutaneous','Daily');

-- Views
CREATE OR REPLACE VIEW purchase_details AS
SELECT p.PurchaseID, p.PurchaseDate, b.BuyerID, b.Name AS BuyerName, i.ItemID, i.Name AS ItemName, p.Quantity
FROM Purchase p
LEFT JOIN Buyer b ON p.BuyerID = b.BuyerID
LEFT JOIN Item i ON p.ItemID = i.ItemID
ORDER BY p.PurchaseDate DESC;
