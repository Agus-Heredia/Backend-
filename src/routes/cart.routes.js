import { Router } from 'express'
import cartModel from '../models/carts.models.js'

const cartsRouter = Router()

cartsRouter.get('/', async(req, res) => {
  res.send('<h1>Carts</h1>')
})

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body
  try {
      const cart = await cartModel.findById(cid)
      if (cart) {
          cart.products.push({ id_prod: pid, quantity: quantity })
          const respuesta = await cartModel.findByIdAndUpdate(cid, cart) //Actualizo el carrito de mi BDD con el nuevo producto
          res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
      }
  } catch (error) {
      res.status(400).send({ error: error.message })
  }
})


export default cartsRouter