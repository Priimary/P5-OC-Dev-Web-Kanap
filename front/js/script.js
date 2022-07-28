// récupération données des produits à depuis l'api
fetch('http://localhost:3000/api/products/')
    .then(function(res) {
        return res.json();
    })
    .then(function(products) {
        let htmlProducts = [];
        // parcours le tableau de résultat contenant les produits avec une boucle for, ajoutant le code html pour chaque produit dans l'array htmlProducts
        for(let product in products) {
            htmlProducts[product] = `<a href="./product.html?id=${products[product]._id}">
                                        <article>
                                        <img src="${products[product].imageUrl}" alt="${products[product].altTxt}">
                                        <h3 class="productName">${products[product].name}</h3>
                                        <p class="productDescription">${products[product].description}</p>
                                        </article>
                                    </a>`
        }
        // change ensuite le contenu de la section items par le contenu de la variable htmlProducts
        document
            .getElementById('items')
            .innerHTML = htmlProducts.join('');
    })
    // récupère la possible erreur et l'affiche dans la console, ainsi qu'un message d'erreur pour l'utilisateur
    .catch(function(err) {
        console.log(err);
        document
            .getElementById('items')
            .innerHTML = "<p>Une erreur est survenue lors de la requête de nos produits, veuillez nous excuser pour ce désagrément.</p>";
    });