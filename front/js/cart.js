if(localStorage.length === 0){
    document.getElementById('totalPrice').textContent = '0';
    document.getElementById('totalQuantity').textContent = '0';
}
else{
getCart();
calcTotalNumberProducts();
calcTotalPrice();
}
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
        // s'il y a un seul produit dans le localstorage, le supprime directement
        if(arrayCartLS.length == 1){
            localStorage.clear("arrayCart");
            articleToDelete.remove();
            // relance les fonctions de calcul de la quantité et du prix total
            calcTotalNumberProducts();
            calcTotalPrice();
        }
        else{
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
        }
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
// initiation variable pour retenir les informations de contact
let firstName = '';
let lastName = '';
let address = '';
let city = '';
let email = '';
// récupère les données de l'input prénom et lui ajoute un évènement change
document.getElementById('firstName').addEventListener('change', function(e) {
    e.stopPropagation();
    // vérifie le contenu de l'input avec une regex(champ rempli, seulement des lettres majuscules et minuscules, certains caractères spéciaux)
    if(e.target.value.match(/^(?![ ,.'-])(?!.*[ ,.'-]{2})[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž ,.'-]+$/gi)){
        firstName = e.target.value;
        document.getElementById('firstNameErrorMsg').textContent = "";
    }
    // si le contenu n'est pas celui attendu, alors affiche un message d'erreur
    else{
        document.getElementById('firstNameErrorMsg').textContent = "Veuillez remplir ce champ d'information en commencant par une lettre et sans utiliser de chiffre. (ex : Alexis)";
    }
})
// récupère les données de l'input nom et lui ajoute un évènement change
document.getElementById('lastName').addEventListener('change', function(e) {
    e.stopPropagation();
    // vérifie le contenu de l'input avec une regex(champ rempli, seulement des lettres majuscules et minuscules, certains caractères spéciaux)
    if(e.target.value.match(/^(?![ ,.'-])(?!.*[ ,.'-]{2})[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž ,.'-]+$/gi)){
        lastName = e.target.value;
        document.getElementById('lastNameErrorMsg').textContent = "";
    }
    // si le contenu n'est pas celui attendu, alors affiche un message d'erreur
    else{
        document.getElementById('lastNameErrorMsg').textContent = "Veuillez remplir ce champ d'information en commencant par une lettre et sans utiliser de chiffre. (ex: Dupont)";
    }
})
// récupère les données de l'input addresse et lui ajoute un évènement change
document.getElementById('address').addEventListener('change', function(e) {
    e.stopPropagation();
    // vérifie le contenu de l'input avec une regex(champ rempli, seulement des lettres majuscules et minuscules, certains caractères spéciaux)
    if(e.target.value.match(/^[#.0-9a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž\s,'-]+$/gi)){
        address = e.target.value;
        document.getElementById('addressErrorMsg').textContent = ""
    }
    // si le contenu n'est pas celui attendu, alors affiche un message d'erreur
    else{
        document.getElementById('addressErrorMsg').textContent = "Veuillez remplir ce champ d'information en suivant l'exemple. (ex: 19 rue du jardin-gallois)"
    }
})
// récupère les données de l'input ville et lui ajoute un évènement change
document.getElementById('city').addEventListener('change', function(e) {
    e.stopPropagation();
    // vérifie le contenu de l'input avec une regex(champ rempli, seulement des lettres majuscules et minuscules, certains caractères spéciaux)
    if(e.target.value.match(/^(?![ ,.'-])(?!.*[ ,.'-]{2})[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšž ,.'-]+$/gi)){
        city = e.target.value;
        document.getElementById('cityErrorMsg').textContent = "";
    }
    // si le contenu n'est pas celui attendu, alors affiche un message d'erreur
    else{
        document.getElementById('cityErrorMsg').textContent = "Veuillez remplir ce champ d'information en commencant par une lettre et sans utiliser de chiffre. (ex : Dijon)"
    }
})
// récupère les données de l'input email et lui ajoute un évènement change
document.getElementById('email').addEventListener('change', function(e) {
    e.stopPropagation();
    // vérifie le contenu de l'input avec une regex(champ rempli, seulement des lettres majuscules et minuscules, certains caractères spéciaux)
    if(e.target.value.match(/^(?![0-9._-])[a-z0-9._-]+@(?![0-9._-])[a-z0-9._-]+\.[a-z]{2,}$/gi)){
        email = e.target.value;
        document.getElementById('emailErrorMsg').textContent = ""
    }
    // si le contenu n'est pas celui attendu, alors affiche un message d'erreur
    else{
        document.getElementById('emailErrorMsg').textContent = "Veuillez remplir ce champ d'information en commencant par une lettre. (ex : Jean-Pierre82@outlook.com)"
    }
})
// récupère les données du bouton commander et lui ajoute un évènement au clique
document.getElementById('order').addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    // vérifie si les variables du formulaire de contact sont remplies
    if(firstName && lastName && address && city && email){
        // créé un objet contact avec les informations du formulaire de contact
        let contact = {
            firstName : firstName,
            lastName : lastName,
            address : address,
            city : city,
            email : email
        }
        // créé un tableau contenant des string de l'id de chaque produits
        let products = [];
        let arrayCartLS = JSON.parse(localStorage.getItem('arrayCart'));
        arrayCartLS.forEach((productCart) => {
            products.push(productCart.id);
        })
        // ajoute l'objet contact ainsi que l'array products à l'objet order pour l'interraction avec l'api
        let order = {contact, products};
        if(!contact){
            alert('Une erreur est survenue, veuillez remplir le formulaire.')
        }
        else if(!products){
            alert('Votre panier est vide, veuillez le remplir avant de passer commande.')
        }
        else if(contact && products){
            // requête post à l'api avec envoie en json de l'objet order
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            })
            .then((response) => response.json())
            // puis on récupère la réponse de l'api
            .then((res) => {
                // on change l'url pour nous renvoyer sur la page de confirmation avec le numéro de commande 
                window.location.href = "./confirmation.html?orderId=" + res.orderId;
                // on supprime le panier du localstorage vu que la commande est passée
                localStorage.clear(arrayCart);
            })
            .catch((err) => {
                console.log(err);
                alert("Une erreur s'est déroulé lors de la commande, veuillez réessayer plus tard.");
            })
        }
        else{
            alert("Une erreur s'est produite, veuillez réessayer.");
        }
    }
    else{
        alert("Veuillez renseigner les champs de texte du formulaire.");
    }
})