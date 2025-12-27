document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  function clearError(id) {
    const e = document.getElementById(id + 'Error');
    if (e) e.textContent = '';
  }

  function showError(id, msg) {
    const e = document.getElementById(id + 'Error');
    if (e) e.textContent = msg;
  }

  function validate(id, condition, msg) {
    if (!condition) {
      showError(id, msg);
      return false;
    }
    clearError(id);
    return true;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;

    const ok =
      validate('fullName', fullName.length >= 3, 'Full name required') &&
      validate('email', email.includes('@'), 'Valid email required') &&
      validate('phone', phone.length >= 11, 'Valid phone required') &&
      validate('address', address.length >= 10, 'Address required') &&
      validate('city', city.length >= 2, 'City required') &&
      validate('zipCode', zipCode.length === 5, 'ZIP must be 5 digits') &&
      validate('paymentMethod', paymentMethod !== '', 'Select payment method');

    if (!ok) return;

    const cart = JSON.parse(localStorage.getItem('hsm_cart')) || [];
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    const orderData = {
      customerName: fullName,
      email,
      phone,
      address,
      city,
      paymentMethod,
      items: cart,
      total
    };

    try {
      const response = await fetch(
        location.hostname === 'localhost'
          ? 'http://localhost:5000/api/orders'
          : 'https://hamzamart-production.up.railway.app/api/orders',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        }
      );

      const result = await response.json();
      localStorage.removeItem('hsm_cart');
      window.location.href =
        'order-confirmation.html?orderId=' + result.orderId;

    } catch (err) {
      alert('Order failed. Please try again.');
      console.error(err);
    }
  });
});
