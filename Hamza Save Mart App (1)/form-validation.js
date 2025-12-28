document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1️⃣ form se data uthao
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;

    // 2️⃣ cart data uthao
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

    // 3️⃣ 👇 YE FETCH YAHI AATA HAI
    try {
      const response = await fetch(
        'https://hamzamart-production.up.railway.app/api/orders',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        }
      );

      const result = await response.json();

      alert('Order placed successfully ✅');
      localStorage.removeItem('hsm_cart');

      window.location.href =
        'order-confirmation.html?orderId=' + result.orderId;

    } catch (err) {
      alert('Order failed ❌');
      console.error(err);
    }
  });
});
