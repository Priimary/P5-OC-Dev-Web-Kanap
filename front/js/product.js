var urlId = location.search.substring(location.search.lastIndexOf('=') + 1);
fetch(`http://localhost:3000/api/products/${urlId}`)
    .then(function(res) {
        return res.json();
    })
    .then(function(product) {
        document
            .querySelector('.item__img')
            .innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
        document
            .getElementById('title')
            .textContent = `${product.name}`;
        document
            .getElementById('price')
            .textContent = `${product.price}`;
        document
            .getElementById('description')
            .textContent = `${product.description}`;
        for(let color in product.colors) {
            newColor = document.createElement('option');
            newColor.setAttribute('value', product.colors[color]);
            newColor.textContent = `${product.colors[color]}`;
            document.getElementById('colors').appendChild(newColor);
        }
    })
    .catch(function(err) {
        console.log(err);
    });
