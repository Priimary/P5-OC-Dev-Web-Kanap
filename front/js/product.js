// récupération id du produit depuis l'url
let params = new URLSearchParams(document.location.search);
let productId = params.get('id');
// récupération des données du produit depuis l'API
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res) {
        return res.json();
    })
    .then(function(product) {
        // insertion détails du produit de la page
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
        // création de balise html <option> pour chaque couleur reçues
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

document
    .getElementById('addToCart')
    .addEventListener('click', function(e) {
        e.stopPropagation();
        let productQty = parseInt(document.getElementById('quantity').value); // récupération nombre de canapé
        let productClr = document.getElementById('colors').value; // récupération couleur de canapé
        let arrayCartLS = JSON.parse(localStorage.getItem('arrayCart')); // récupération tableau des produits du panier localstorage
        if(!productQty || !productClr) { // message d'érreur si les champs ne sont pas remplis
            alert("Veuillez choisir la couleur ainsi que la quantité du produit demandé.");
        }           
        else if(arrayCartLS){ // vérification si contenu dans le localstorage
            // si couleur + id existant dans un élément de l'array, alors incrémente la quantité et le renvoie dans le localstorage
            if(arrayCartLS.find(productLS => productLS.id === productId && productLS.color === productClr)){
                arrayCartLS.find(productLS => productLS.id === productId && productLS.color === productClr).quantity += productQty;
                localStorage.setItem('arrayCart', JSON.stringify(arrayCartLS));
                alert('Vous avez bien ajouté ces produits à votre panier');
            }
            else{ // si aucun produit trouvé, création d'un array, puis y le localstorage actuel + objet avec id, couleur, et quantité, et envoie en localstorage
                let arrayCart = [];
                let newProductJson = {
                    id : productId,
                    color : productClr,
                    quantity : productQty
                }
                arrayCart.push(arrayCartLS);
                arrayCart.push(newProductJson);
                let newArrayCart = JSON.stringify(arrayCart);
                localStorage.setItem('arrayCart', newArrayCart);
                alert("Ce produit a bien été ajouté à votre panier !");
            }
        }
        else{ // créé un array, puis y ajoute un objet contenant l'id, la couleur, et la quantité du produit sélectionné, et envoie dans le localstorage
            let arrayCart = [];
            let newProductJson = {
                id : productId,
                color : productClr,
                quantity : productQty
            }
            arrayCart.push(newProductJson);
            let newArrayCart = JSON.stringify(arrayCart);
            localStorage.setItem('arrayCart', newArrayCart);
            alert("Ce produit a bien été ajouté à votre panier !");
        }
    });
