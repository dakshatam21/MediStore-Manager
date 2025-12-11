// Utility functions for better UX

// Toast notification system
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Loading state management
function setLoading(element, isLoading) {
  if (!element) return;
  
  if (isLoading) {
    element.disabled = true;
    element.dataset.originalText = element.textContent;
    element.innerHTML = '<span class="spinner"></span> Loading...';
  } else {
    element.disabled = false;
    element.textContent = element.dataset.originalText || element.textContent;
  }
}

// Form validation
function validateForm(formData, requiredFields) {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].toString().trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

// Escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// API error handler
function handleApiError(error, res) {
  if (res && !res.ok) {
    return res.json().then(data => {
      throw new Error(data.error || 'An error occurred');
    }).catch(e => {
      throw new Error(e.message || 'An error occurred');
    });
  }
  throw error;
}

// ==================== Advanced Modal System ====================
class Modal {
  constructor(id, content) {
    this.id = id;
    this.content = content;
    this.modal = this.createModal();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = this.id;
    modal.className = 'modal';
    modal.innerHTML = this.content;
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    // Close button functionality
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    return modal;
  }

  open() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  destroy() {
    this.modal.remove();
  }
}

// ==================== Dropdown Menu ====================
class DropdownMenu {
  constructor(toggleSelector, menuSelector) {
    this.toggle = document.querySelector(toggleSelector);
    this.menu = document.querySelector(menuSelector);
    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;

    this.toggle.addEventListener('click', () => this.toggleMenu());
    this.menu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectItem(item);
        this.closeMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.menu.classList.toggle('active');
    this.toggle.classList.toggle('active');
  }

  openMenu() {
    this.menu.classList.add('active');
    this.toggle.classList.add('active');
  }

  closeMenu() {
    this.menu.classList.remove('active');
    this.toggle.classList.remove('active');
  }

  selectItem(item) {
    this.menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  }
}

// ==================== Skeleton Loader ====================
function createSkeletonLoader(count = 5) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton skeleton-large"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
    `;
  }
  return html;
}

function showSkeletonLoader(container) {
  container.innerHTML = createSkeletonLoader(3);
}

// ==================== Progress Indicator ====================
class ProgressBar {
  constructor(container, max = 100) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.max = max;
    this.current = 0;
    this.create();
  }

  create() {
    this.container.innerHTML = `
      <div class="progress-label">
        <span class="progress-text">Progress</span>
        <span class="progress-percentage">0%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
      </div>
    `;
    this.fill = this.container.querySelector('.progress-fill');
    this.percentage = this.container.querySelector('.progress-percentage');
  }

  set(value) {
    this.current = Math.min(value, this.max);
    const percent = (this.current / this.max) * 100;
    this.fill.style.width = percent + '%';
    this.percentage.textContent = Math.round(percent) + '%';
  }

  increment(amount = 1) {
    this.set(this.current + amount);
  }

  reset() {
    this.set(0);
  }
}

// ==================== Form Validator ====================
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.errors = {};
    this.init();
  }

  init() {
    if (!this.form) return;
    
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('change', () => this.validateField(input));
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.onSubmit();
      }
    });
  }

  validateField(field) {
    const rules = {
      required: (value) => value.trim() !== '',
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      phone: (value) => /^\d{10,}$/.test(value.replace(/\D/g, '')),
      number: (value) => !isNaN(value) && value !== '',
      minLength: (value, min) => value.length >= min,
      maxLength: (value, max) => value.length <= max,
    };

    const validators = field.dataset.validate?.split('|') || [];
    let isValid = true;

    validators.forEach(validator => {
      const [rule, ...params] = validator.split(':');
      if (!rules[rule]?.(field.value, ...params)) {
        isValid = false;
        this.setError(field, `${field.name} is invalid`);
      }
    });

    if (isValid) {
      this.clearError(field);
    }

    return isValid;
  }

  validate() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  setError(field, message) {
    field.parentElement.classList.add('has-error');
    let errorElement = field.parentElement.querySelector('.form-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearError(field) {
    field.parentElement.classList.remove('has-error');
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) errorElement.remove();
  }

  onSubmit() {
    // Override this method to handle form submission
  }
}

// ==================== Stock Level Indicator ====================
function getStockLevel(quantity, lowThreshold = 10, mediumThreshold = 50) {
  if (quantity <= 0) return { level: 'critical', label: 'Out of Stock', icon: '🔴' };
  if (quantity < lowThreshold) return { level: 'low', label: 'Low Stock', icon: '🟠' };
  if (quantity < mediumThreshold) return { level: 'medium', label: 'Medium Stock', icon: '🟡' };
  return { level: 'high', label: 'In Stock', icon: '🟢' };
}

function createStockIndicator(quantity, lowThreshold = 10, mediumThreshold = 50) {
  const stock = getStockLevel(quantity, lowThreshold, mediumThreshold);
  return `<div class="stock-indicator stock-${stock.level}">${stock.icon} ${stock.label}</div>`;
}

// ==================== Status Badge ====================
function createStatusBadge(status, text) {
  const statusMap = {
    active: 'success',
    inactive: 'secondary',
    pending: 'warning',
    completed: 'success',
    failed: 'danger'
  };
  
  const badgeClass = statusMap[status] || status;
  return `<div class="status ${status}">${text || status.toUpperCase()}</div>`;
}

// ==================== Animated Counter ====================
function animateCounter(element, target, duration = 1000, prefix = '', suffix = '') {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = prefix + target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = prefix + Math.floor(current) + suffix;
    }
  }, 16);
}

// ==================== Lazy Load Images ====================
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// ==================== Notification System ====================
class Notification {
  static info(message) {
    showToast(message, 'info');
  }

  static success(message) {
    showToast(message, 'success');
  }

  static warning(message) {
    showToast(message, 'warning');
  }

  static error(message) {
    showToast(message, 'error');
  }
}

// ==================== Data Table Helper ====================
class DataTable {
  constructor(tableSelector, options = {}) {
    this.table = document.querySelector(tableSelector);
    this.tbody = this.table.querySelector('tbody');
    this.sortColumn = options.sortColumn || 0;
    this.sortOrder = options.sortOrder || 'asc';
    this.perPage = options.perPage || 10;
    this.currentPage = 1;
    this.data = [];
  }

  setData(data) {
    this.data = data;
    this.render();
  }

  addRow(rowData) {
    this.data.push(rowData);
    this.render();
  }

  removeRow(index) {
    this.data.splice(index, 1);
    this.render();
  }

  sort(columnIndex) {
    if (this.sortColumn === columnIndex) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnIndex;
      this.sortOrder = 'asc';
    }
    this.render();
  }

  render() {
    this.tbody.innerHTML = '';
    this.data.forEach((row, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = row;
      this.tbody.appendChild(tr);
    });
  }

  paginate() {
    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    return this.data.slice(start, end);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  lazyLoadImages();
});
