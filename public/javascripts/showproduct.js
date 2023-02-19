function showproduct(productId) {
    fetch('/all/', {
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