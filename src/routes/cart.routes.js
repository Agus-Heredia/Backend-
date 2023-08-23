import { Router } from 'express'
const cartsRouter = Router()

import CartManager from '../manager/CartManager.js'
const cartManager = new CartManager('../carts.txt')


cartsRouter.get('/', async(req, res) => {
    try {
        const cart = await cartManager.getCarts()
        res.status(200).json(cart)
    } catch (error) {
        res.status(400).send({ message: error.message})
    }
})


cartsRouter.get('/:cartId', async (req, res) => {
    const cartId = parseInt(req.params.cartId);
    try {
      const cart = await cartManager.getCartById(cartId);
      if (!cart) {
        res.status(404).send(`No se ha enontrado el carrito con el id ${cartId}`);
        return;
      }
      const products = await Promise.all(
        cart.products.map(async (product) => {
          const p = await productManager.getProductById(product.pid);
          return { ...product, ...p };
        })
      );
      res.json(products);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error: Server error');
    }
  });


  cartsRouter.post('/', async (req, res) => {
    try {
      const newCart = await cartManager.createCart()
      res.status(200).json(newCart);
    } catch (error) {
      request.status(404).json({message: error.message});
    }
  })

  cartsRouter.post('/:cartId/product/:prodId', async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const prodId = req.params.prodId;
      const productAdd = await cartManager.addProductToCart(cartId, prodId)
      if(productAdd){
        res.status(200).send('producto agregado al carrito')
      }else{
        res.status(404).send('producto no encontrado')
      }
      } catch (error) {
      res.status(500).send('Server error');
    }
  })


  cartsRouter.delete('/', async(req, res) =>{
    try {
        await cartManager.deleteCarts()
        res.send('Todos los carritos han sido eliminados de manera exitosa!')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})

cartsRouter.delete('/:cartId', async(req, res) =>{
  try {
      const { cartId } = req.params;
      const carts = await cartManager.getCarts();  
      if(carts.length > 0) {
          await cartManager.deleteCartById(Number(cartId));
          res.send(`El carrito con el id: ${cartId} ha sido eliminado corectamente!`);
      } else {
          res.send(`No se ha encontrado el carrito`)
      }
  } catch (error) {
      res.status(404).json({message: error.message});
  }
})






export default cartsRouter