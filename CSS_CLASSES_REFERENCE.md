# 🎨 CSS & Component Classes Quick Reference

## Table of Contents
1. [Layout Classes](#layout-classes)
2. [Button Classes](#button-classes)
3. [Card Classes](#card-classes)
4. [Status & Badge Classes](#status--badge-classes)
5. [Form Classes](#form-classes)
6. [Table Classes](#table-classes)
7. [Animation Classes](#animation-classes)
8. [Utility Classes](#utility-classes)

---

## Layout Classes

### Container & Grid
```html
<!-- Main container -->
<div class="container">Content</div>

<!-- Responsive grids -->
<div class="grid grid-2">  <!-- 2 columns on desktop, 1 on mobile -->
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
</div>

<div class="grid grid-3">  <!-- 3 columns -->
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>

<div class="grid grid-4">  <!-- 4 columns -->
  <div class="card">Item</div>
  <!-- ... -->
</div>

<!-- Flexbox utilities -->
<div class="flex">Display as flex</div>
<div class="flex-between">Space between items</div>
```

### Spacing
```html
<div class="mt-1">Margin top 0.5rem</div>
<div class="mt-2">Margin top 1rem</div>
<div class="mt-3">Margin top 1.5rem</div>

<div class="mb-1">Margin bottom 0.5rem</div>
<div class="mb-2">Margin bottom 1rem</div>
<div class="mb-3">Margin bottom 1.5rem</div>

<div class="gap-1">Gap 0.5rem</div>
<div class="gap-2">Gap 1rem</div>
<div class="gap-3">Gap 1.5rem</div>
```

### Text Alignment
```html
<div class="text-center">Center aligned text</div>
<div class="text-right">Right aligned text</div>
```

---

## Button Classes

### Button Types
```html
<!-- Primary button (default) -->
<button class="btn">Primary Button</button>

<!-- Secondary button -->
<button class="btn btn-secondary">Secondary Button</button>

<!-- Danger button -->
<button class="btn btn-danger">Delete Button</button>

<!-- Small button -->
<button class="btn btn-sm">Small Button</button>

<!-- Icon button -->
<button class="btn btn-icon">🔍</button>

<!-- Button group -->
<div class="btn-group">
  <button>Edit</button>
  <button>Delete</button>
  <button>More</button>
</div>
```

### Button States
```html
<button class="btn" disabled>Disabled Button</button>

<!-- Button with loading state (use with setLoading function) -->
<button class="btn" id="submitBtn">Submit</button>

<script>
  setLoading(document.getElementById('submitBtn'), true);
  // Button shows: ⏳ Loading...
</script>
```

### Action Buttons
```html
<div class="action-group">
  <button class="btn btn-sm">Edit</button>
  <button class="btn btn-sm btn-secondary">View</button>
  <button class="btn btn-sm btn-danger">Delete</button>
</div>
```

---

## Card Classes

### Basic Cards
```html
<!-- Standard card -->
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>

<!-- Card with header -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <span class="badge badge-warning">5</span>
  </div>
  <p>Card content</p>
</div>

<!-- Card with animations -->
<div class="card animate-in">Content with fade-in</div>
<div class="card hover-lift">Lifts on hover</div>
<div class="card hover-glow">Glows on hover</div>
```

### Stat Cards
```html
<div class="stats-grid">
  <!-- Primary stat card -->
  <div class="stat-card">
    <div class="stat-value">245</div>
    <div class="stat-label">Total Medicines</div>
  </div>

  <!-- Secondary stat card -->
  <div class="stat-card secondary">
    <div class="stat-value">28</div>
    <div class="stat-label">Purchases Today</div>
  </div>

  <!-- Warning stat card -->
  <div class="stat-card warning">
    <div class="stat-value">12</div>
    <div class="stat-label">Low Stock Items</div>
  </div>

  <!-- Danger stat card -->
  <div class="stat-card danger">
    <div class="stat-value">3</div>
    <div class="stat-label">Out of Stock</div>
  </div>
</div>
```

---

## Status & Badge Classes

### Badges
```html
<!-- Info badge -->
<span class="badge badge-info">Info</span>

<!-- Success badge -->
<span class="badge badge-success">Success</span>

<!-- Warning badge -->
<span class="badge badge-warning">Warning</span>

<!-- Danger badge -->
<span class="badge badge-danger">Danger</span>
```

### Status Indicators
```html
<!-- Active status (with pulse effect) -->
<div class="status active">Active</div>

<!-- Inactive status -->
<div class="status inactive">Inactive</div>

<!-- Pending status (with pulse effect) -->
<div class="status pending">Pending</div>
```

### Stock Indicators
```html
<!-- High stock (green) -->
<div class="stock-indicator stock-high">🟢 In Stock</div>

<!-- Medium stock (yellow) -->
<div class="stock-indicator stock-medium">🟡 Medium Stock</div>

<!-- Low stock (orange) -->
<div class="stock-indicator stock-low">🟠 Low Stock</div>

<!-- Critical stock (red, with pulse) -->
<div class="stock-indicator stock-critical">🔴 Out of Stock</div>
```

### Tags
```html
<div class="tag primary">Urgent</div>
<div class="tag success">In Stock</div>
<div class="tag warning">Expiring Soon</div>
<div class="tag danger">Out of Stock</div>
```

### Info Boxes
```html
<!-- Info box -->
<div class="info-box info">
  <div class="info-box-icon">ℹ️</div>
  <div class="info-box-content">
    <h3>Information</h3>
    <p>This is an informational message.</p>
  </div>
</div>

<!-- Success box -->
<div class="info-box success">
  <div class="info-box-icon">✅</div>
  <div class="info-box-content">Success Message</div>
</div>

<!-- Warning box -->
<div class="info-box warning">
  <div class="info-box-icon">⚠️</div>
  <div class="info-box-content">Warning Message</div>
</div>

<!-- Danger box -->
<div class="info-box danger">
  <div class="info-box-icon">❌</div>
  <div class="info-box-content">Error Message</div>
</div>
```

---

## Form Classes

### Form Groups
```html
<!-- Basic form group -->
<div class="form-group">
  <label>Field Label</label>
  <input type="text" placeholder="Enter value">
</div>

<!-- Form row (multiple fields) -->
<div class="form-row">
  <div class="form-group">
    <label>Field 1</label>
    <input type="text">
  </div>
  <div class="form-group">
    <label>Field 2</label>
    <input type="text">
  </div>
</div>

<!-- Form group with error -->
<div class="form-group has-error">
  <label>Email</label>
  <input type="email" value="invalid">
  <div class="form-error">Please enter a valid email</div>
</div>

<!-- Form group with success -->
<div class="form-group form-success">
  <label>Username</label>
  <input type="text" value="john_doe">
  <div class="form-success-message">Username is available</div>
</div>
```

### Input Types
```html
<!-- All input types have enhanced styling -->
<input type="text" placeholder="Text input">
<input type="email" placeholder="Email input">
<input type="number" placeholder="Number input">
<input type="date">
<input type="tel" placeholder="Phone number">
<input type="password" placeholder="Password">
<select><option>Select option</option></select>
<textarea placeholder="Message"></textarea>

<!-- Small input -->
<input type="text" class="small" placeholder="Small width">
```

### Radio & Checkbox
```html
<div class="radio-group">
  <label>
    <input type="radio" name="option"> Option 1
  </label>
  <label>
    <input type="radio" name="option"> Option 2
  </label>
</div>

<div class="checkbox-group">
  <label>
    <input type="checkbox"> Checkbox 1
  </label>
  <label>
    <input type="checkbox"> Checkbox 2
  </label>
</div>
```

### Search Box
```html
<div class="search-box">
  <input type="text" placeholder="Search...">
  <!-- Automatically shows 🔍 icon -->
</div>
```

### Filter Section
```html
<div class="filter-section">
  <div class="filter-group">
    <label>Search:</label>
    <input type="text" placeholder="Medicine name">
  </div>
  
  <div class="filter-group">
    <label>Sort:</label>
    <select>
      <option>Latest</option>
      <option>Price: Low to High</option>
    </select>
  </div>
  
  <button class="filter-btn">Apply Filters</button>
</div>
```

---

## Table Classes

### Table Structure
```html
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
      <td><button class="btn btn-sm">Edit</button></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Total:</td>
      <td class="text-right">$1,000</td>
    </tr>
  </tfoot>
</table>
```

### Row Classes (Color-coded)
```html
<tbody>
  <!-- Success row (green left border) -->
  <tr class="success">
    <td>Aspirin</td>
    <td>In Stock</td>
  </tr>

  <!-- Warning row (yellow left border) -->
  <tr class="warning">
    <td>Paracetamol</td>
    <td>Low Stock</td>
  </tr>

  <!-- Danger row (red left border) -->
  <tr class="danger">
    <td>Ibuprofen</td>
    <td>Out of Stock</td>
  </tr>

  <!-- Highlight row (blue highlight) -->
  <tr class="highlight">
    <td>Amoxicillin</td>
    <td>In Stock</td>
  </tr>
</tbody>
```

### Table Actions
```html
<td>
  <div class="table-actions">
    <button class="btn btn-sm">View</button>
    <button class="btn btn-sm btn-secondary">Edit</button>
    <button class="btn btn-sm btn-danger">Delete</button>
  </div>
</td>
```

---

## Animation Classes

### Hover Effects
```html
<!-- Lift on hover with shadow -->
<div class="card hover-lift">Hover to lift</div>

<!-- Glow on hover -->
<div class="card hover-glow">Hover to glow</div>

<!-- Animate in on page load -->
<div class="card animate-in">Fades in on load</div>
```

### Animation States
```css
/* Available animations in CSS */
fadeIn        /* Fade in from invisible */
slideInLeft   /* Slide in from left */
slideInRight  /* Slide in from right */
pulse         /* Pulsing effect */
shimmer       /* Shimmer loading effect */
bounce        /* Bounce effect */
glow          /* Glowing effect */
scaleIn       /* Scale up from small */
```

---

## Utility Classes

### Display
```html
<div class="hidden">Hidden element</div>
<div class="flex">Display as flex</div>
<div class="flex-between">Justify space-between</div>
```

### Visibility
```html
<!-- Show/hide with JavaScript -->
<div id="element" class="hidden">Hidden initially</div>

<script>
  element.classList.remove('hidden'); // Show
  element.classList.add('hidden');    // Hide
</script>
```

### Loading State
```html
<div class="loading">
  <div class="spinner"></div>
  <span>Loading...</span>
</div>
```

### Empty State
```html
<div class="empty-state hidden">
  <div class="empty-state-icon">📦</div>
  <div class="empty-state-text">No items found</div>
</div>
```

### Skeleton Loading
```html
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-large"></div>
<div class="skeleton skeleton-avatar"></div>
```

---

## Modal & Dropdown

### Modal Structure
```html
<div id="myModal" class="modal active">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Modal Title</h2>
      <button class="modal-close">×</button>
    </div>
    <div class="modal-body">
      <p>Modal content here</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn">Confirm</button>
    </div>
  </div>
</div>
```

### Dropdown Structure
```html
<div class="dropdown">
  <button class="dropdown-toggle">Menu ▼</button>
  <div class="dropdown-menu">
    <button class="dropdown-item active">Option 1</button>
    <button class="dropdown-item">Option 2</button>
    <button class="dropdown-item">Option 3</button>
  </div>
</div>
```

---

## Progress & Navigation

### Progress Bar
```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 50%"></div>
</div>

<!-- With label -->
<div class="progress-label">
  <span>Progress</span>
  <span>50%</span>
</div>
<div class="progress-bar">
  <div class="progress-fill" style="width: 50%"></div>
</div>
```

### Breadcrumb
```html
<div class="breadcrumb">
  <div class="breadcrumb-item">
    <a href="index.html">Home</a>
  </div>
  <div class="breadcrumb-divider">/</div>
  <div class="breadcrumb-item">
    <a href="page.html">Page</a>
  </div>
  <div class="breadcrumb-divider">/</div>
  <div class="breadcrumb-item active">Current</div>
</div>
```

---

## Color Variables

```css
:root {
  /* Primary Colors */
  --primary-color: #2563eb;      /* Blue */
  --primary-dark: #1d4ed8;
  --primary-light: #3b82f6;

  /* Status Colors */
  --secondary-color: #10b981;    /* Green - Success */
  --secondary-dark: #059669;
  --danger-color: #ef4444;       /* Red - Error */
  --danger-dark: #dc2626;
  --warning-color: #f59e0b;      /* Orange - Warning */
  --success-color: #10b981;      /* Green - Success */
  --info-color: #3b82f6;         /* Blue - Info */

  /* Text Colors */
  --text-primary: #1f2937;       /* Dark gray */
  --text-secondary: #6b7280;     /* Medium gray */
  --text-light: #9ca3af;         /* Light gray */

  /* Background Colors */
  --bg-primary: #ffffff;         /* White */
  --bg-secondary: #f9fafb;       /* Light gray */
  --bg-tertiary: #f3f4f6;        /* Lighter gray */
  --border-color: #e5e7eb;
}
```

---

## Common Patterns

### Complete Form Example
```html
<form>
  <div class="form-group">
    <label>Name *</label>
    <input type="text" data-validate="required">
  </div>
  
  <div class="form-row">
    <div class="form-group">
      <label>Email *</label>
      <input type="email" data-validate="required|email">
    </div>
    <div class="form-group">
      <label>Phone *</label>
      <input type="tel" data-validate="required|phone">
    </div>
  </div>

  <button type="submit" class="btn">Submit</button>
</form>
```

### Complete Table Example
```html
<table>
  <thead>
    <tr>
      <th>Medicine</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr class="success">
      <td>Aspirin</td>
      <td>150</td>
      <td>₹5.50</td>
      <td><span class="status active">In Stock</span></td>
      <td><button class="btn btn-sm">Edit</button></td>
    </tr>
  </tbody>
</table>
```

### Complete Card Layout
```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value">245</div>
    <div class="stat-label">Total Medicines</div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    <h3 class="card-title">Recent Orders</h3>
    <span class="badge badge-info">5</span>
  </div>
  <!-- Content -->
</div>
```

---

## Tips & Tricks

1. **Combine classes** for flexibility: `btn btn-sm btn-danger`
2. **Use grid classes** for responsive layouts: `grid grid-3`
3. **Add animations** with hover effects: `hover-lift`, `hover-glow`
4. **Color-code rows** for quick scanning: `class="success"`, `class="warning"`
5. **Stack utility classes** for spacing: `mt-2 mb-3`

---

**For live examples, open `components-demo.html` in your browser!**
