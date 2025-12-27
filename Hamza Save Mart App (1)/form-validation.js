form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isAddressValid = validateAddress();
    const isCityValid = validateCity();
    const isZipCodeValid = validateZipCode();
    const isPaymentMethodValid = validatePaymentMethod();

    if (isFullNameValid && isEmailValid && isPhoneValid && isAddressValid &&
        isCityValid && isZipCodeValid && isPaymentMethodValid) {

        

        const cartItems = JSON.parse(localStorage.getItem('hsm_cart')) || [];

        const totalAmount = cartItems.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
        );

        const orderData = {
            customerName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            paymentMethod: document.getElementById('paymentMethod').value,
            items: cartItems,
            total: totalAmount
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            
            localStorage.removeItem('hsm_cart');

            
            window.location.href =
                'order-confirmation.html?orderId=' + result.orderId;

        } catch (error) {
            alert('Order failed. Please try again.');
            console.error(error);
        }

    } else {
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});
