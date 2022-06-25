fetch('http://localhost:3000/api/products/')
    .then(function(res) {
        return res.json();
    })
    .then(function(result) {
        let product = [];
        for(let i in result) {
            product[i] = `<a href="./product.html?id=${result[i]._id}">
                            <article>
                                <img src="${result[i].imageUrl}" alt="${result[i].altTxt}">
                                <h3 class="productName">${result[i].name}</h3>
                                <p class="productDescription">${result[i].description}</p>
                            </article>
                        </a>`
            product.push();
        }
        document
            .getElementById('items')
            .innerHTML = product.join('');
    })
    .catch(function(err) {
        console.log(err);
        document
            .getElementById('items')
            .innerHTML = "<p>Une erreur est survenue lors de la requête de nos produits, veuillez nous excuser pour ce désagrément.</p>";
    });

