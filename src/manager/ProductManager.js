//Hacemos un require al manejador de archivos nativo de NodeJs nombrado 'File System' 
import fs from 'fs'

//Creamos la clase que se encargara de manejar los productos que vayamos agregando, junto con sus archivos
class ProductManager {
  constructor() {
    this.path = "././products.txt";
  }

  async #getNewId(){
    let newId = 0;
    const products = await this.getProducts();
    products.map((p) =>{
        if (p.id > newId) newId = p.id;
    });
    return newId;
}


  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, 'utf-8');
        const productsJS = JSON.parse(products);
        return productsJS;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }


  async addProduct(title, category, description, price, thumbnail, code, stock) {
    try {
      const productInfo = await this.getProducts();
      const repeatedCode = productInfo.find((item) => item.code === code);

      if (repeatedCode) {
        console.log(`Error: El producto con el código: ${code}, ya existe!`);
      } else {
        const lastAddedProduct = productInfo[productInfo.length - 1];
        const newId = lastAddedProduct ? lastAddedProduct.id + 1 : 1;

        const newProduct = {
          id: newId,
          title,
          category,
          description,
          price,
          thumbnail,
          code,
          stock,
        };

        productInfo.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(productInfo));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(prodId) {
    try {
      const productInfo = await this.getProducts();
      const prodIndex = productInfo.find((product) => product.id === prodId);

      if (prodIndex === -1) {
        console.log('No se encontró el producto con el ID especificado');
      } else {
        productInfo.splice(prodIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(productInfo));
        console.log('Has eliminado el producto correctamente');
      }
    } catch (error) {
      console.log(error);
    }
  }

    async deleteAllProducts() {
    try {
        if(fs.existsSync(this.path)) {
           fs.promises.unlink(this.path)
        }
    } catch(error) {
        console.log(error);  
      }
    }


  async updateProduct(prodId, updatingProd) {
    try {
      const productInfo = await this.getProducts();
      const prodIndex = productInfo.find((product) => product.id === prodId);

      if (prodIndex === -1) {
        console.log('Producto no encontrado');
      } else {
        const updatedProduct = {
          ...productInfo[prodIndex],
          ...updatingProd,
          id: prodId,
        };
        productInfo[prodIndex] = updatedProduct;
        await fs.promises.writeFile(this.path, JSON.stringify(productInfo));
        console.log('Producto actualizado y modificado con éxito');
      }
    } catch (error) {
      console.log(error);
    }
  }



  async #repeatedProduct(prodId) {
    try {
      const productInfo = await this.getProducts();
      return productInfo.find((products) => products.id === prodId);
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(prodId) {
    try {
      const product = this.#repeatedProduct(prodId);
      if (!product) {
        console.log('Error: Not found product');
      } else {
        return product;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default ProductManager

// //Instanciamos nuestra clase ProductManager
// const productManager = new ProductManager();


// //Definimos la función asíncrona para manipular los productos
// const handleManager = async () => {

//   // Agregamos productos
//   await productManager.addProduct('Remera', 'Remeras', 'Remera negra', 199, 'imgExample.jpg', '#A001', 8);
//   await productManager.addProduct('Pantalón', 'Pantalones', 'Short liso', 49, 'imgExample.jpg', '#A002', 4);
//   await productManager.addProduct('Medias', 'Medias', 'Medias cortas blancas', 19, 'imgExample.jpg', '#A003', 12);
  
//   const get = await productManager.getProducts();
//   console.log("--- Llamado al array ---", get);


//   // Buscamos producto por su ID
//   // const getNo2 = await productManager.getProductById(2);
//   // console.log("Producto buscado por ID:", getNo2);


//   // OPCIONAL: Con esta función podemos eliminar un producto en específico por su ID
//   // await productManager.deleteProduct(1);
//   // const getNo4 = await productManager.getProducts();
//   // console.log("--- Tercer llamado al array ---", getNo4);



//   // OPCIONAL: Con esta función actualizamos las caracteristicas de un producto mediante su ID
//   // await productManager.updateProduct(1, {
//   //   price: this.price + 300,
//   //   stock: this.stock + 15,
//   // });



// };

// handleManager();