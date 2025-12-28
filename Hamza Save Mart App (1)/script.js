/* ================= API ================= */
const API_URL =
  location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://hamzamart-production.up.railway.app/api';

/* ================= STATE ================= */
let cart = JSON.parse(localStorage.getItem('hsm_cart')) || [];

/* ================= HELPERS ================= */
const saveCart = () => {
  localStorage.setItem('hsm_cart', JSON.stringify(cart));
  updateCartBadge();
};

const updateCartBadge = () => {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;

  const total = cart.reduce((s, i) => s + i.quantity, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
};

/* ================= CART ACTIONS ================= */
const increaseQty = (id) => {
  const item = cart.find(i => i._id === id);
  if (!item) return;

  item.quantity++;
  saveCart();
  renderCart();
};

const decreaseQty = (id) => {
  const item = cart.find(i => i._id === id);
  if (!item) return;

  item.quantity--;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i._id !== id);
  }

  saveCart();
  renderCart();
};

const removeItem = (id) => {
  cart = cart.filter(i => i._id !== id);
  saveCart();
  renderCart();
};

/* ================= RENDER CART ================= */
const renderCart = () => {
  const container = document.querySelector('.cart-content');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <a href="index.html" class="btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }

  let total = 0;

  container.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return `
          <div class="cart-item">
            <div class="cart-item-details">
              <h3 class="cart-item-name">${item.name}</h3>
              <p class="cart-item-price">Rs. ${item.price}</p>

              <div class="cart-item-quantity">
                <button class="cart-item-quantity-btn" data-action="minus" data-id="${item._id}">−</button>
                <span class="cart-item-quantity-value">${item.quantity}</span>
                <button class="cart-item-quantity-btn" data-action="plus" data-id="${item._id}">+</button>
              </div>
            </div>

            <div class="cart-item-total">
              <p>Rs. ${itemTotal}</p>
              <button class="cart-item-remove" data-action="remove" data-id="${item._id}">
                Remove
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="order-summary">
      <h2>Order Summary</h2>
      <div class="summary-row">
        <span>Total</span>
        <strong>Rs. ${total}</strong>
      </div>
      <a href="checkout.html" class="btn-primary checkout-btn">
        Proceed to Checkout
      </a>
    </div>
  `;
};

/* ================= EVENTS ================= */
document.addEventListener('click', (e) => {
  const btn = e.target;
  const id = btn.dataset.id;

  if (!id) return;

  if (btn.dataset.action === 'plus') increaseQty(id);
  if (btn.dataset.action === 'minus') decreaseQty(id);
  if (btn.dataset.action === 'remove') removeItem(id);
});

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCart();
});
