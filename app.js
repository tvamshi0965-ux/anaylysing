/* ============================================
   SHOPZONE - APP LOGIC
   Filtering, sorting, search, toast system
   ============================================ */

/* ============================================
   TOAST NOTIFICATION SYSTEM
   ============================================ */
function showToast(message, type = 'success') {
  // Create container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const iconMap = {
    success: 'fa-check-circle',
    error:   'fa-times-circle',
    info:    'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${iconMap[type] || iconMap.success}"></i>
    <span>${message}</span>
    <button class="toast-close" onclick="dismissToast(this.parentElement)">
      <i class="fas fa-times"></i>
    </button>`;

  container.appendChild(toast);

  // Auto-dismiss after 3.5 seconds
  setTimeout(() => dismissToast(toast), 3500);
}

function dismissToast(toast) {
  if (!toast || !toast.parentElement) return;
  toast.classList.add('removing');
  setTimeout(() => {
    if (toast.parentElement) toast.parentElement.removeChild(toast);
  }, 300);
}

/* ============================================
   PRODUCTS PAGE: FILTER + SORT + SEARCH
   ============================================ */
function applyFilters() {
  // Only run on products page
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  // Gather filter values
  const searchTerm = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  const maxPrice   = parseFloat(document.getElementById('price-range')?.value || 1000);
  const minRating  = parseFloat(document.querySelector('input[name="rating"]:checked')?.value || 0);
  const inStockOnly = document.getElementById('in-stock-filter')?.checked || false;
  const sortBy     = document.getElementById('sort-select')?.value || 'default';

  // Selected categories
  const selectedCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value);

  // Filter
  let filtered = products.filter(p => {
    const matchCat    = selectedCats.length === 0 || selectedCats.includes(p.category);
    const matchPrice  = p.price <= maxPrice;
    const matchRating = p.rating >= minRating;
    const matchStock  = !inStockOnly || p.inStock;
    const matchSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm);

    return matchCat && matchPrice && matchRating && matchStock && matchSearch;
  });

  // Sort
  switch (sortBy) {
    case 'price-asc':  filtered.sort((a, b) => a.price - b.price);          break;
    case 'price-desc': filtered.sort((a, b) => b.price - a.price);          break;
    case 'rating':     filtered.sort((a, b) => b.rating - a.rating);        break;
    case 'name':       filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break;
  }

  // Render
  const noResults = document.getElementById('no-results');
  const countEl   = document.getElementById('results-count');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.classList.remove('hidden');
    if (countEl)   countEl.innerHTML = 'No products found';
  } else {
    if (noResults) noResults.classList.add('hidden');
    grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
    if (countEl)   countEl.innerHTML = `Showing <strong>${filtered.length}</strong> product${filtered.length !== 1 ? 's' : ''}`;
  }
}

/* ============================================
   CLEAR ALL FILTERS
   ============================================ */
function clearFilters() {
  // Uncheck category filters
  document.querySelectorAll('.cat-filter').forEach(cb => cb.checked = false);

  // Reset price range
  const priceRange = document.getElementById('price-range');
  if (priceRange) {
    priceRange.value = 1000;
    const label = document.getElementById('price-label');
    if (label) label.textContent = '$1000';
  }

  // Reset rating
  const allRating = document.querySelector('input[name="rating"][value="0"]');
  if (allRating) allRating.checked = true;

  // Uncheck in-stock
  const stockFilter = document.getElementById('in-stock-filter');
  if (stockFilter) stockFilter.checked = false;

  // Clear search
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  // Reset sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'default';

  applyFilters();
}

/* ============================================
   CART ICON BOUNCE ANIMATION (CSS injection)
   ============================================ */
(function injectBounceStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%,100% { transform: scale(1); }
      40%      { transform: scale(1.4); }
      70%      { transform: scale(0.9); }
    }
    .bounce { animation: bounce 0.4s ease; }
  `;
  document.head.appendChild(style);
})();

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
(function createBackToTop() {
  const btn = document.createElement('button');
  btn.id        = 'back-to-top';
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 4px 16px rgba(108,99,255,0.4);
    z-index: 999;
    transition: opacity 0.3s, transform 0.3s;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.display = 'flex';
      btn.style.opacity = '1';
    } else {
      btn.style.opacity = '0';
      setTimeout(() => { if (window.scrollY <= 400) btn.style.display = 'none'; }, 300);
    }
  });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
})();

/* ============================================
   LAZY IMAGE LOADING FALLBACK
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('error', function () {
      this.src = 'https://via.placeholder.com/400x400?text=No+Image';
    });
  });
});

/* ============================================
   ACTIVE NAV LINK HIGHLIGHT
   ============================================ */
(function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith(path)) {
      link.classList.add('active');
    }
  });
})();
