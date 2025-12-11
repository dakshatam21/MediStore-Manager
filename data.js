// Medicine stock (only owner can modify)
let medicines = [
  { id: 1, name: "Paracetamol", type: "Tablet", price: 20, stock: 100 },
  { id: 2, name: "Amoxicillin", type: "Capsule", price: 50, stock: 80 },
  { id: 3, name: "Cetrizine", type: "Tablet", price: 15, stock: 60 },
  { id: 4, name: "Crocin", type: "Tablet", price: 25, stock: 90 },
  { id: 5, name: "Vicks", type: "Ointment", price: 30, stock: 40 },
  { id: 6, name: "Dolo 650", type: "Tablet", price: 35, stock: 100 },
  { id: 7, name: "ORS", type: "Powder", price: 10, stock: 120 },
  { id: 8, name: "Disprin", type: "Tablet", price: 12, stock: 75 },
  { id: 9, name: "Combiflam", type: "Tablet", price: 28, stock: 50 },
  { id: 10, name: "Savlon", type: "Liquid", price: 60, stock: 25 }
];

let buyers = [
  { id: 1, name: "Rohan Patil", contact: "9876543210" },
  { id: 2, name: "Sneha Shah", contact: "9822012345" }
];

let purchases = [
  { id: 1, buyerId: 1, medicineId: 2, quantity: 2, date: "2025-10-10" },
  { id: 2, buyerId: 2, medicineId: 1, quantity: 5, date: "2025-10-12" }
];
