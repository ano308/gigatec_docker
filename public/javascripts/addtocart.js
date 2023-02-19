function addToCart(productId) {
    fetch('/add-to-cart', {
        method: 'POST',
        body: JSON.stringify({productId: productId}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
 }
 