document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('checkoutForm');
  if (!form) return;

  // ⬇️ baqi sara code yahan


form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem('hsm_cart')) || [];

  if (cart.length === 0) {
    alert('Cart is empty. Add product first.');
    return;
  }

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

    if (!response.ok) {
      throw new Error('Server error');
    }

    const result = await response.json();

    alert('Order placed successfully!');
    localStorage.removeItem('hsm_cart');

    window.location.href =
      'order-confirmation.html?orderId=' + result.orderId;

  } catch (err) {
    alert('Order failed. Check console.');
    console.error(err);
  }
});

});