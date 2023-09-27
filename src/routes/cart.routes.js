import { Router } from 'express'
import cartModel from '../models/carts.models.js'

const cartsRouter = Router()

cartsRouter.get ('/', async(req, res) => {
  const { limit } = req.query
  try {
      const prods = await cartModel.find().limit(limit)
      res.status(200).send(prods)

  } catch(error) {
      res.status(400).send({Error: `Products cannot be found. ${error.message}`})
      }
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