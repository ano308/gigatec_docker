function removeFromCart(productId) {
    fetch('/remove-from-cart', {
        method: 'POST',
        body: JSON.stringify({productId: productId}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        return response.json();
    });
}