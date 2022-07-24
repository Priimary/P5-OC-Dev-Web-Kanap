// récupération de l'id dans l'url et affichage sur la page
let params = new URLSearchParams(document.location.search);
let orderId = params.get('orderId');
document.getElementById('orderId').textContent = `${orderId}`;