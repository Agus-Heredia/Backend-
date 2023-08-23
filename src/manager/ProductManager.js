//Hacemos un require al manejador de archivos nativo de NodeJs nombrado 'File System' 
import fs from 'fs'

//Creamos la clase que se encargara de manejar los productos que vayamos agregando, junto con sus archivos
class ProductManager {
  constructor() {
    this.path = "././products.json";
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