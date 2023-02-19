function removeFromWishlist(productId) {
    fetch('/remove-from-wishlist', {
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