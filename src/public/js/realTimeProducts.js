const socket = io();


socket.on('msgFromBack', (msg) => {
    console.log('El personal de la parte de Backend dice:', msg);
})


const form = document.getElementById('form');
const inputName = document.getElementById('inputName');
const inputPrice = document.getElementById('inputPrice');
// const products = document.getElementById('products');


 form.onsubmit = (e) => {
    e.preventDefault();
    const name = inputName;
    const price = inputPrice;
    socket.emit('newProduct', { name, price })
}

socket.on('getProducts', (array) => {
    let infoProducts = '';

    array.forEach( (p) => {
        infoProducts += `
            <div class="prodsDiv">
                <ul class="prodsList">
                    <li><b>Nombre:</b>  ${p.title}</li> 
                    <li><b>Descripción:</b> ${p.description}</li>
                    <li><b>Precio:</b> $${p.price}</li>
                    <li><b>Stock:</b> ${p.stock}</li>
                    <li><b>Categoría:</b> ${p.category}</li>
                    <li><b>Código:</b> ${p.code}</li>
                </ul>
            </div>

         `;
    });
    console.log(infoProducts);
    const products = document.getElementById('formProducts');
    products.innerHTML = infoProducts;
})