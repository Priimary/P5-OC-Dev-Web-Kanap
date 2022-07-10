let calcPrice = 0;
let totalPrice = 0;
async function htmlProduct(productCart) {
    try {
        // récupération données du produit via API
        let response = await fetch(`http://localhost:3000/api/products/${productCart.id}`);
        let product = await response.json();
        // calcul du prix total
        calcPrice = productCart.quantity * product.price;
        totalPrice += calcPrice;
        // création élément html avec class, attributs et contenu
        document.getElementById('totalPrice').textContent = `${totalPrice}`;
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
    }
    catch(err) {
        console.log(err);
    }
}
// récupération array des produits du local storage
let arrayCartLS = JSON.parse(localStorage.getItem('arrayCart'));
// initie la fonction pour chaque objet contenu dans l'array
arrayCartLS.forEach((productCart) => {
    htmlProduct(productCart);
});
// calcul nombre total d'articles puis affichage
let totalQuantity = 0;
for (let partialSum in arrayCartLS) {
    totalQuantity += arrayCartLS[partialSum].quantity;
}
document.getElementById('totalQuantity').textContent = `${totalQuantity}`;



