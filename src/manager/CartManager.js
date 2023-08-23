import fs from 'fs';


export default class cartManager {
    constructor() {
        this.path = "././carts.json";
    }


    async #getNewId() {
        let newId = 0;
        const carts = await this.getCarts();
        carts.map((cart) => {
            if (cart.cid > newId) newId = cart.cid;
        });
        return newId;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, 'utf8');
                return JSON.parse(carts);
            } else {
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }


    async createCart() {
        try {
            const cart = {
                cartId: await this.#getNewId() + 1,
                products: []
            };
            const carts = await this.getCarts();
            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return cart;
        } catch (error) {
            console.log(error);
        }
    }


    async getCartById(cartId) {
        try {
            const carts = await this.getCarts();
            const cart = await carts.find(cart => cart.cid === cartId);
            if (cart) {
                return cart;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }


    async addProductToCart(prodId, cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (cart) {
                const productIndex = cart.products.findIndex(prod => prod.product === prodId);
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity += 1;
                } else {
                    cart.products.push(
                        { 
                        id: product.prodId,
                        quantity: 1
                    });
                }
                const cartsFile = await this.getCarts();
                const index = cartsFile.findIndex(crt => crt.cartId === cartId);
                cartsFile[index] = cart;
                await fs.promises.writeFile(this.pathCart, JSON.stringify(cartsFile));
                return cart;
            }
            throw new Error(`Cart with id ${cartId} not found`);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCartById(cartId) {
        try {
            const cartsFile = await this.getCarts();
            if (cartsFile.length > 0) {
                const newArray = cartsFile.filter(c => c.cartId !== cartId);
                await fs.promises.writeFile(this.pathCart, JSON.stringify(newArray));
            } else {
                throw new Error(`Cart with id: ${cartId} not found`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCarts() {
        try {
            if(fs.existsSync(this.path)) {
               fs.promises.unlink(this.path)
            }
        } catch(error) {
            console.log(error);  
          }
        }


}