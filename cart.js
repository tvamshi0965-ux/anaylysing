/* ============================================
   SHOPZONE - CART LOGIC
   localStorage-based cart with full CRUD
   ============================================ */

const CART_KEY = 'shopzone_cart';

/* ---- Read / Write ---- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ---- Add to Cart ---- */
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    if (existing.qty < 10) existing.qty += 1;
  } else {
    cart.push({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      image:    product.image,
      category: product.category,
      qty:      1
    });
  }

  saveCart(cart);
}

/* ---- Remove from Cart ---- */
function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
}

/* ---- Update Quantity ---- */
function updateCartQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  item.qty = Math.min(qty, 10);
  saveCart(cart);
}

/* ---- Clear Cart ---- */
function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/* ---- Cart Count ---- */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/* ---- Cart Total ---- */
function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

/* ---- Update UI count badge ---- */
function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ---- Cart item check ---- */
function isInCart(id) {
  return getCart().some(item => item.id === id);
}
