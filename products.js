/* ============================================
   SHOPZONE - PRODUCTS DATA & RENDERING
   ============================================ */

const products = [
  // Electronics
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "electronics",
    price: 89.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviews: 2340,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality for an immersive listening experience.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 2,
    name: "4K Ultra HD Smart TV 55\"",
    category: "electronics",
    price: 499.99,
    originalPrice: 699.99,
    rating: 4.7,
    reviews: 1820,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80",
    description: "Experience stunning 4K visuals with HDR10, built-in streaming apps, and voice control. Transform your living room entertainment.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 3,
    name: "Mechanical Gaming Keyboard",
    category: "electronics",
    price: 79.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 987,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80",
    description: "RGB backlit mechanical keyboard with tactile switches, anti-ghosting, and durable aluminum frame for the ultimate gaming setup.",
    inStock: true,
    badge: "new",
    featured: false
  },
  {
    id: 4,
    name: "Smartphone Pro Max 256GB",
    category: "electronics",
    price: 799.99,
    originalPrice: 999.99,
    rating: 4.9,
    reviews: 5430,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80",
    description: "Flagship smartphone with a 108MP camera, AMOLED display, 5G connectivity, and all-day battery life. The future is in your hands.",
    inStock: true,
    badge: "hot",
    featured: true
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    category: "electronics",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.5,
    reviews: 1234,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    description: "Waterproof portable speaker with 360° sound, 20-hour playtime, and a built-in microphone for hands-free calls.",
    inStock: true,
    badge: null,
    featured: true
  },
  {
    id: 6,
    name: "Wireless Gaming Mouse",
    category: "electronics",
    price: 59.99,
    originalPrice: null,
    rating: 4.4,
    reviews: 756,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
    description: "High-precision wireless gaming mouse with 25K DPI sensor, 70-hour battery, and customizable RGB lighting.",
    inStock: true,
    badge: "new",
    featured: false
  },
  {
    id: 7,
    name: "Laptop Ultrabook 14\"",
    category: "electronics",
    price: 1099.99,
    originalPrice: 1299.99,
    rating: 4.8,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    description: "Ultra-thin and lightweight laptop with Intel Core i7, 16GB RAM, 512GB SSD, and a stunning IPS display. Work and play anywhere.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 8,
    name: "Smart Watch Series 6",
    category: "electronics",
    price: 249.99,
    originalPrice: 329.99,
    rating: 4.7,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80",
    description: "Track your fitness, receive notifications, and monitor your health with GPS, heart rate sensor, and a 3-day battery.",
    inStock: true,
    badge: null,
    featured: true
  },

  // Fashion
  {
    id: 9,
    name: "Classic Leather Sneakers",
    category: "fashion",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 1450,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    description: "Timeless leather sneakers with cushioned insoles, durable outsoles, and a clean minimalist design for every occasion.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 10,
    name: "Premium Denim Jacket",
    category: "fashion",
    price: 64.99,
    originalPrice: null,
    rating: 4.4,
    reviews: 678,
    image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=400&q=80",
    description: "Versatile denim jacket made from 100% premium cotton. A wardrobe staple that pairs with anything.",
    inStock: true,
    badge: "new",
    featured: false
  },
  {
    id: 11,
    name: "Floral Summer Dress",
    category: "fashion",
    price: 44.99,
    originalPrice: 64.99,
    rating: 4.5,
    reviews: 890,
    image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&q=80",
    description: "Light and breezy floral dress perfect for summer outings. Available in multiple colors with a flattering A-line silhouette.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 12,
    name: "Leather Crossbody Bag",
    category: "fashion",
    price: 74.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 1120,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    description: "Elegant genuine leather crossbody bag with adjustable strap, multiple compartments, and a sleek modern design.",
    inStock: true,
    badge: null,
    featured: true
  },
  {
    id: 13,
    name: "Men's Casual Chinos",
    category: "fashion",
    price: 39.99,
    originalPrice: null,
    rating: 4.3,
    reviews: 560,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
    description: "Smart-casual chino trousers in stretch cotton blend. A perfect balance of comfort and style for work and weekends.",
    inStock: true,
    badge: null,
    featured: false
  },
  {
    id: 14,
    name: "Aviator Sunglasses",
    category: "fashion",
    price: 29.99,
    originalPrice: 44.99,
    rating: 4.5,
    reviews: 2030,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    description: "UV400 protected aviator sunglasses with polarized lenses and a metal frame. Classic style that never goes out of fashion.",
    inStock: true,
    badge: "sale",
    featured: false
  },

  // Home & Living
  {
    id: 15,
    name: "Scented Soy Candle Set",
    category: "home",
    price: 34.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 1780,
    image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&q=80",
    description: "Set of 3 hand-poured soy wax candles in relaxing fragrances — lavender, vanilla, and sandalwood. Perfect for creating a cozy atmosphere.",
    inStock: true,
    badge: "new",
    featured: true
  },
  {
    id: 16,
    name: "Minimalist Desk Lamp",
    category: "home",
    price: 44.99,
    originalPrice: 59.99,
    rating: 4.6,
    reviews: 920,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    description: "LED desk lamp with adjustable color temperature, touch dimmer, and USB charging port. Perfect for work and study.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 17,
    name: "Ceramic Plant Pot Set",
    category: "home",
    price: 27.99,
    originalPrice: null,
    rating: 4.4,
    reviews: 640,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
    description: "Set of 3 handcrafted ceramic pots in muted tones. Perfect for succulents, herbs, and small indoor plants.",
    inStock: true,
    badge: null,
    featured: false
  },
  {
    id: 18,
    name: "Throw Blanket - Knit Wool",
    category: "home",
    price: 54.99,
    originalPrice: 74.99,
    rating: 4.9,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1580873074591-b6e8c89ce0bb?w=400&q=80",
    description: "Ultra-soft chunky knit throw blanket in premium merino wool blend. Drape over your sofa or curl up in comfort.",
    inStock: true,
    badge: "sale",
    featured: true
  },

  // Sports
  {
    id: 19,
    name: "Yoga Mat Premium",
    category: "sports",
    price: 39.99,
    originalPrice: 54.99,
    rating: 4.7,
    reviews: 3400,
    image: "https://images.unsplash.com/photo-1601925228743-3bf57e5f7b1a?w=400&q=80",
    description: "Eco-friendly non-slip yoga mat with alignment lines, 6mm cushioning, and a carrying strap. Ideal for yoga, pilates, and stretching.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 20,
    name: "Adjustable Dumbbell Set",
    category: "sports",
    price: 119.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviews: 1560,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
    description: "Space-saving adjustable dumbbells from 5 to 52.5 lbs. Replace 15 sets of weights with a single compact design.",
    inStock: true,
    badge: "hot",
    featured: true
  },
  {
    id: 21,
    name: "Running Shoes Pro",
    category: "sports",
    price: 109.99,
    originalPrice: 139.99,
    rating: 4.6,
    reviews: 2300,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    description: "Lightweight running shoes with responsive cushioning, breathable mesh upper, and a durable rubber outsole for all terrains.",
    inStock: false,
    badge: null,
    featured: false
  },
  {
    id: 22,
    name: "Water Bottle - Insulated 32oz",
    category: "sports",
    price: 29.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 4500,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
    description: "Vacuum-insulated stainless steel water bottle. Keeps drinks cold for 24 hours and hot for 12 hours. BPA-free and leak-proof.",
    inStock: true,
    badge: "new",
    featured: false
  },

  // Beauty
  {
    id: 23,
    name: "Vitamin C Face Serum",
    category: "beauty",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.7,
    reviews: 5600,
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80",
    description: "Brightening vitamin C serum with hyaluronic acid and niacinamide. Reduces dark spots and gives your skin a natural glow.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 24,
    name: "Luxury Perfume - Bloom",
    category: "beauty",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.9,
    reviews: 1890,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80",
    description: "A floral-woody fragrance with notes of jasmine, rose, and sandalwood. Long-lasting and elegant for any occasion.",
    inStock: true,
    badge: null,
    featured: true
  },
  {
    id: 25,
    name: "Hair Care Gift Set",
    category: "beauty",
    price: 49.99,
    originalPrice: 64.99,
    rating: 4.5,
    reviews: 980,
    image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&q=80",
    description: "Complete hair care bundle including sulfate-free shampoo, deep conditioner, and leave-in treatment. For all hair types.",
    inStock: true,
    badge: "sale",
    featured: false
  },

  // Books
  {
    id: 26,
    name: "The Art of Thinking Clearly",
    category: "books",
    price: 14.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    description: "A practical guide to 99 cognitive biases that lead to poor decisions — and how to overcome them. A must-read for clearer thinking.",
    inStock: true,
    badge: null,
    featured: false
  },
  {
    id: 27,
    name: "Atomic Habits",
    category: "books",
    price: 16.99,
    originalPrice: 24.99,
    rating: 4.9,
    reviews: 12400,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    description: "James Clear's #1 New York Times bestseller on building good habits and breaking bad ones through tiny, incremental changes.",
    inStock: true,
    badge: "hot",
    featured: true
  },
  {
    id: 28,
    name: "JavaScript: The Good Parts",
    category: "books",
    price: 19.99,
    originalPrice: null,
    rating: 4.5,
    reviews: 4100,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80",
    description: "Douglas Crockford's classic guide to the good parts of JavaScript — a must-have for every web developer's bookshelf.",
    inStock: true,
    badge: null,
    featured: false
  },

  // Mini Coolers
  {
    id: 29,
    name: "Personal Mini Fridge Cooler 6L",
    category: "appliances",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.6,
    reviews: 1870,
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80",
    description: "Compact 6-litre thermoelectric mini cooler perfect for your desk, bedroom, or car. Keeps drinks cold and skincare cool. Whisper-quiet operation with AC and DC adapters included.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 30,
    name: "Portable Mini Cooler & Warmer 12L",
    category: "appliances",
    price: 79.99,
    originalPrice: 109.99,
    rating: 4.7,
    reviews: 1340,
    image: "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=400&q=80",
    description: "Dual-function 12-litre mini cooler and warmer with digital temperature display. Ideal for office, dorm, or road trips. Compatible with car 12V and home 110V power.",
    inStock: true,
    badge: "hot",
    featured: true
  },
  {
    id: 31,
    name: "Skincare Mini Fridge 4L Rose Gold",
    category: "appliances",
    price: 44.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviews: 3210,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
    description: "Chic 4-litre mini refrigerator designed for skincare, serums, and face masks. Rose gold finish, LED interior light, ultra-quiet fan, and compact countertop design.",
    inStock: true,
    badge: "new",
    featured: true
  },
  {
    id: 32,
    name: "Car Mini Cooler Box 8L",
    category: "appliances",
    price: 34.99,
    originalPrice: null,
    rating: 4.4,
    reviews: 760,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    description: "8-litre plug-in car cooler box with 12V DC connector. Fits 12 cans, keeps contents up to 40°F below ambient temperature. Lightweight and portable for camping and travel.",
    inStock: true,
    badge: null,
    featured: false
  },
  {
    id: 33,
    name: "Smart Mini Cooler with App Control 10L",
    category: "appliances",
    price: 129.99,
    originalPrice: 169.99,
    rating: 4.9,
    reviews: 620,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80",
    description: "Wi-Fi enabled 10-litre smart cooler with app control, precise temperature settings (32–50°F), and voice assistant support. Features a tempered glass door and USB charging port.",
    inStock: true,
    badge: "new",
    featured: true
  },

  // Bags
  {
    id: 34,
    name: "Canvas Tote Bag - Natural",
    category: "bags",
    price: 22.99,
    originalPrice: null,
    rating: 4.5,
    reviews: 2890,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80",
    description: "Spacious heavy-duty canvas tote bag with reinforced handles and interior pocket. Perfect for shopping, beach days, or everyday carry. 100% organic cotton.",
    inStock: true,
    badge: null,
    featured: false
  },
  {
    id: 35,
    name: "Leather Laptop Backpack 15.6\"",
    category: "bags",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 3150,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    description: "Premium genuine leather backpack with padded laptop compartment, anti-theft back pocket, and USB charging port. Fits up to 15.6\" laptops. Business meets style.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 36,
    name: "Mini Quilted Chain Bag",
    category: "bags",
    price: 39.99,
    originalPrice: 54.99,
    rating: 4.6,
    reviews: 1780,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",
    description: "Chic quilted mini bag with gold chain strap, magnetic closure, and suede interior. Available in black, beige, and dusty pink. Perfect for evenings and daily use.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 37,
    name: "Travel Duffel Bag 40L",
    category: "bags",
    price: 54.99,
    originalPrice: 74.99,
    rating: 4.7,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a45?w=400&q=80",
    description: "Lightweight 40-litre duffel bag with multiple compartments, detachable shoulder strap, and water-resistant nylon exterior. Fits carry-on requirements for most airlines.",
    inStock: true,
    badge: null,
    featured: true
  },
  {
    id: 38,
    name: "Transparent Clear PVC Tote",
    category: "bags",
    price: 19.99,
    originalPrice: null,
    rating: 4.3,
    reviews: 940,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80",
    description: "Trendy clear PVC tote bag with vegan leather trim and top zipper closure. Stadium-approved size. Includes an inner removable pouch. Great for concerts and events.",
    inStock: true,
    badge: "new",
    featured: false
  },
  {
    id: 39,
    name: "Vintage Rucksack Backpack",
    category: "bags",
    price: 64.99,
    originalPrice: 84.99,
    rating: 4.7,
    reviews: 1560,
    image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400&q=80",
    description: "Waxed canvas vintage-style rucksack with leather accents, roll-top closure, and padded back panel. Ideal for hiking, commuting, or weekend adventures.",
    inStock: true,
    badge: "sale",
    featured: true
  },
  {
    id: 40,
    name: "Luxury Satchel Handbag",
    category: "bags",
    price: 109.99,
    originalPrice: 149.99,
    rating: 4.9,
    reviews: 870,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80",
    description: "Structured top-handle satchel in full-grain leather with gold hardware, detachable shoulder strap, and suede lining. A sophisticated piece for any wardrobe.",
    inStock: true,
    badge: "hot",
    featured: true
  }
];

/* ============================================
   STAR RENDERING
   ============================================ */
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<span class="stars">' +
    '<i class="fas fa-star"></i>'.repeat(full) +
    (half ? '<i class="fas fa-star-half-alt"></i>' : '') +
    '<i class="far fa-star"></i>'.repeat(empty) +
    '</span>'
  );
}

/* ============================================
   PRODUCT CARD TEMPLATE
   ============================================ */
function createProductCard(p) {
  const stars    = renderStars(p.rating);
  const discount = p.originalPrice
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : 0;

  const badgeMap = {
    sale: '<span class="product-card-badge badge-sale">Sale</span>',
    new:  '<span class="product-card-badge badge-new">New</span>',
    hot:  '<span class="product-card-badge badge-hot">Hot</span>',
  };
  const badge = p.badge ? badgeMap[p.badge] : '';

  return `
    <div class="product-card" data-id="${p.id}" data-category="${p.category}" data-price="${p.price}" data-rating="${p.rating}">
      <div class="product-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer" />
        ${badge}
        ${!p.inStock ? '<span class="product-card-badge" style="background:#6b7280;color:white;left:auto;right:10px">Out of Stock</span>' : ''}
        <div class="product-card-actions">
          <button onclick="event.stopPropagation(); quickAddToCart(${p.id})" title="Add to Cart" ${!p.inStock ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart"></i>
          </button>
          <button onclick="event.stopPropagation(); window.location.href='product-detail.html?id=${p.id}'" title="Quick View">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="event.stopPropagation(); toggleWishlistCard(this)" title="Wishlist">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${p.category}</span>
        <h3 class="product-card-title" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">${p.name}</h3>
        <div class="product-card-rating">
          ${stars}
          <span>${p.rating}</span>
          <span>(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-card-price">
          <span class="current-price">$${p.price.toFixed(2)}</span>
          ${p.originalPrice ? `<span class="original-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
          ${discount ? `<span class="product-card-badge badge-sale" style="position:static;padding:2px 8px;font-size:0.72rem">-${discount}%</span>` : ''}
        </div>
        <div class="product-card-footer">
          <button class="btn-add-cart" onclick="quickAddToCart(${p.id})" ${!p.inStock ? 'disabled' : ''}>
            <i class="fas fa-${p.inStock ? 'cart-plus' : 'ban'}"></i>
            ${p.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          <button class="btn-view" onclick="window.location.href='product-detail.html?id=${p.id}'">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
    </div>`;
}

/* ============================================
   RENDER FEATURED PRODUCTS (homepage)
   ============================================ */
function renderFeaturedProducts() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = products.filter(p => p.featured).slice(0, 8);
  grid.innerHTML = featured.map(p => createProductCard(p)).join('');
}

/* ============================================
   QUICK ADD TO CART (from card)
   ============================================ */
function quickAddToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product || !product.inStock) return;
  addToCart(product);
  updateCartCount();
  showToast(`${product.name} added to cart!`, 'success');

  // Animate cart icon
  const cartIcon = document.getElementById('cart-count');
  if (cartIcon) {
    cartIcon.classList.add('bounce');
    setTimeout(() => cartIcon.classList.remove('bounce'), 400);
  }
}

/* ============================================
   WISHLIST TOGGLE (from card)
   ============================================ */
function toggleWishlistCard(btn) {
  const icon = btn.querySelector('i');
  icon.classList.toggle('far');
  icon.classList.toggle('fas');
  if (icon.classList.contains('fas')) {
    btn.style.background = 'var(--secondary)';
    btn.style.color = 'white';
    showToast('Added to wishlist!', 'info');
  } else {
    btn.style.background = '';
    btn.style.color = '';
    showToast('Removed from wishlist', 'info');
  }
}
