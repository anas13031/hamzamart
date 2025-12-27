
const API_URL =
  location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://hamzamart-production.up.railway.app/api';


const STATE = {
  cart: JSON.parse(localStorage.getItem('hsm_cart')) || [],
  products: []
};


const cartBadges = document.querySelectorAll('.cart-badge');


const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0
  }).format(price);

const saveCart = () => {
  localStorage.setItem('hsm_cart', JSON.stringify(STATE.cart));
  updateCartBadge();
};

const updateCartBadge = () => {
  const totalItems = STATE.cart.reduce((s, i) => s + i.quantity, 0);
  cartBadges.forEach(badge => {
    if (totalItems > 0) {
      badge.style.display = 'flex';
      badge.textContent = totalItems;
    } else {
      badge.style.display = 'none';
    }
  });
};


fetch(`${API_URL}/products`)
  .then(res => res.json())
  .then(data => {
    STATE.products = data;
  })
  .catch(err => console.error('Product fetch error:', err));


const addToCart = (product, quantity = 1) => {
  const existing = STATE.cart.find(i => i._id === product._id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    STATE.cart.push({ ...product, quantity });
  }
  saveCart();
  alert('Product added to cart');
};

const removeFromCart = (id) => {
  STATE.cart = STATE.cart.filter(i => i._id !== id);
  saveCart();
  renderCartPage();
};

const updateQuantity = (id, change) => {
  const item = STATE.cart.find(i => i._id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) removeFromCart(id);
  saveCart();
  renderCartPage();
};


const renderCartPage = () => {
  const container = document.querySelector('.cart-content');
  if (!container) return;

  if (STATE.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <a href="index.html" class="btn-primary">Start Shopping</a>
      </div>`;
    return;
  }

  const total = STATE.cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const itemsHTML = STATE.cart.map(item => `
    <div class="cart-item" style="display:flex;gap:1rem;margin-bottom:1rem;">
      <img src="${item.image}" width="80">
      <div>
        <h3>${item.name}</h3>
        <p>${formatPrice(item.price)}</p>
        <div>
          <button onclick="updateQuantity('${item._id}',-1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item._id}',1)">+</button>
        </div>
        <button onclick="removeFromCart('${item._id}')">Remove</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    ${itemsHTML}
    <h3>Total: ${formatPrice(total)}</h3>
    <a href="checkout.html" class="btn-primary">Proceed to Checkout</a>
  `;
};


document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  
  const addBtn = document.querySelector('.add-to-cart-action');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const title = document.querySelector('.product-detail-name')?.textContent;
      const product = STATE.products.find(p => p.name === title);
      if (product) addToCart(product);
    });
  }

  
  if (window.location.pathname.includes('cart.html')) {
    renderCartPage();
  }
});

window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
