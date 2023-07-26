//Creamos la clase que se encargara de manejar los productos que vayamos agregando
class ProductManager {
    constructor() {
        this.products = [];
    }

    #newId(){
        let id = 0;
        this.products.map((product) => {
            if (product.id >= id) id = product.id;
        })
        return id
    }


    addProduct(title, description, price, thumbnail, code, stock) {
        const newProduct = {
            id: this.#newId() + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,

        }
    }

    getProducts(){
       return this.products;
    }

    getProductById(idProduct){
        return this.products.find((product) => product.id === idProduct)
    }


}


// Instanciamos
const productManager = new ProductManager()


//Añadimos productos a nuestro array Products[]
productManager.addProduct('Remera', 'Remera negra', '199', 'www.imgExample.com', '#A001', '8')
productManager.addProduct('Pantalón', 'Short liso', '49', 'www.imgExample.com', '#A002', '4')
productManager.addProduct('Medias', 'Medias cortas blancas', '19', 'www.imgExample.com', '#A003', '12')

//Imprimimos por consola nuestro array con los productos agregados
console.log(productManager.getProducts());