fetch('http://localhost:3000/api/products/')
    .then(function(res) {
        return res.json();
    })
    .then(function(products) {
        let htmlProducts = [];
        for(let product in products) {
            htmlProducts[product] = `<a href="./product.html?id=${products[product]._id}">
                                        <article>
                                        <img src="${products[product].imageUrl}" alt="${products[product].altTxt}">
                                        <h3 class="productName">${products[product].name}</h3>
                                        <p class="productDescription">${products[product].description}</p>
                                        </article>
                                    </a>`
        }
        document
            .getElementById('items')
            .innerHTML = htmlProducts.join('');
    })
    .catch(function(err) {
        console.log(err);
        document
            .getElementById('items')
            .innerHTML = "<p>Une erreur est survenue lors de la requête de nos produits, veuillez nous excuser pour ce désagrément.</p>";
    });