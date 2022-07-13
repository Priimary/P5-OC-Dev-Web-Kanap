// initie les fonctions pour afficher le panier, la quantité total de produits ainsi que le prix total
getCart();
calcTotalNumberProducts();
calcTotalPrice();

// fonction pour afficher le panier
function getCart() {
    // récupération données du produit via API
    let arrayCartLS = JSON.parse(localStorage.getItem('arrayCart'));
    // parcours chaque ligne du tableau du localstorage et récupère les données du produit concerné avec une request à l'api
    arrayCartLS.forEach((productCart) => {
        fetch(`http://localhost:3000/api/products/${productCart.id}`)
        .then((response) => response.json())
        .then((product) => {
            // puis créé un article avec sa classe, ses attributs, et le contenu correspondants au produit et l'ajoute à la section parent
            let articleProduct = document.createElement('article');
            articleProduct.classList.add('cart__item');
            articleProduct.setAttribute('data-id', product._id);
            articleProduct.setAttribute('data-color', productCart.color);
            articleProduct.innerHTML = `<div class="cart__item__img">
                                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                                        </div>
                                        <div class="cart__item__content">
                                            <div class="cart__item__content__description">
                                            <h2>${product.name}</h2>
                                            <p>${productCart.color}</p>
                                            <p>${product.price} €</p>
                                            </div>
                                            <div class="cart__item__content__settings">
                                                <div class="cart__item__content__settings__quantity">
                                                    <p>Qté : </p>
                                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productCart.quantity}">
                                                </div>
                                                <div class="cart__item__content__settings__delete">
                                                    <p class="deleteItem">Supprimer</p>
                                                </div>
                                            </div>
                                        </div>`;
            document.getElementById('cart__items').appendChild(articleProduct);
            // initie les fonctions permettants d'écouter les évènements sur les boutons supprimer ainsi que les input de quantité
            deleteOnClick(productCart);
            changeQuantity(productCart);
            })
        .catch((err) => console.log(err));
        })
  

}

// fonction pour afficher le nombre total de produits dans le panier
function calcTotalNumberProducts() {
    // récupère les données du localstorage
    let arrayCartLS = JSON.parse(localStorage.getItem('arrayCart'));
    // calcul la quantité totale de produits dans le tableau du localstorage puis l'affiche
    let totalQuantity = arrayCartLS.reduce(function(accumulator, object) {return accumulator + object.quantity;}, 0);
    document.getElementById('totalQuantity').textContent = `${totalQuantity}`;
}

// fonction pour afficher le prix total du panier
function calcTotalPrice() {
    let totalPrice = 0;
    // récupération des données du localstorage
    let arrayCartLS = JSON.parse(localStorage.getItem('arrayCart'));
    // si le localstorage est vide, alors affiche 0€ de prix total
    if(arrayCartLS.length < 1){
        document.getElementById('totalPrice').textContent = '0';
    }
    else{
    // sinon parcours chaque ligne du tableau du localstorage et récupère les données de l'api du produit  correspondant
    arrayCartLS.forEach((a) => {
        fetch(`http://localhost:3000/api/products/${a.id}`)
        .then(function(res) {
            return res.json();
        })
        .then(function(prod) {
            // puis met à jour la variable du prix total avec la quantité du produit * son prix et l'affiche 
            totalPrice += a.quantity * prod.price;
            document.getElementById('totalPrice').textContent = `${totalPrice}`;
        })
        .catch(function(err) {
            console.log(err);
        })
    });
    }
}

// fonction pour supprimer sur clique du bouton son produit correspondant
function deleteOnClick(productCart){
    // récupère le bouton supprimer de l'article correspondant puis ajoute un évenement onclick
    let deleteBtn = document.querySelector(`article[data-id="${productCart.id}"][data-color="${productCart.color}"] .deleteItem`);
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        // récupère l'article le plus proche du bouton supprimer cliqué dans une variable
        let articleToDelete = deleteBtn.closest('.cart__item');
        // récupère les données du localstorage
        let arrayCartLS = JSON.parse(localStorage.getItem('arrayCart'));
        // cherche un objet correspondant à l'id et à la couleur du produit changé, renvoie son index si existant
        let filter = (element) => element.id === productCart.id && element.color === productCart.color;
        let indexArticle = arrayCartLS.findIndex(filter);
        // retire l'objet du tableau puis renvoie le tableau en localstorage et supprime l'article du DOM
        arrayCartLS.splice([indexArticle], 1);
        localStorage.setItem("arrayCart", JSON.stringify(arrayCartLS));
        articleToDelete.remove();
        // relance les fonctions de calcul de la quantité et du prix total
        calcTotalNumberProducts();
        calcTotalPrice();
    })
}

// fonction pour mettre à jour la quantité de produits correspondant à l'input
function changeQuantity(productCart){
    // récupère l'input de la quantité du produit
    let inputQuantity = document.querySelector(`article[data-id="${productCart.id}"][data-color="${productCart.color}"] .itemQuantity`);
    inputQuantity.addEventListener('change', function(e) {
        e.stopPropagation();
        // si la quantité n'est pas entre 1-99 affiche une erreur
        if(e.target.value < 1 || e.target.value > 99)
        {
            alert('Veuillez sélectionner entre 1 et 99 articles.');
        }
        else{
        // récupère les données du localstorage
        let arrayCartLS = JSON.parse(localStorage.getItem('arrayCart'));
        // cherche un objet correspondant à l'id et à la couleur du produit changé, renvoie son index si existant
        let filter = (element) => element.id === productCart.id && element.color === productCart.color;
        let indexArticle = arrayCartLS.findIndex(filter);
        // met à jour la quantité dans le tableau par celle de l'input puis renvoie dans le localstorage
        arrayCartLS[indexArticle].quantity = parseInt(e.target.value);
        localStorage.setItem("arrayCart", JSON.stringify(arrayCartLS));
        // relance les fonctions de calcul de la quantité et du prix total
        calcTotalNumberProducts();
        calcTotalPrice();
        }
    })
}