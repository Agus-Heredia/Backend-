import { Router } from 'express'
import productsModel from '../models/products.models.js'


const prodsRouter = Router()


prodsRouter.get ('/', async(req, res) => {
    const { limit } = req.query
    try {
        const prods = await productsModel.find().limit(limit)
        res.status(200).send(prods)

    } catch(error) {
        res.status(400).send({Error: `Products cannot be found. ${error.message}`})
        }
})


prodsRouter.get ('/:id', async(req, res) => {
    const { id } = req.params
    try {
        const prod = await productsModel.findById(id)

        if (prod) {
            res.status(200).send(prod)
        } else {
            res.status(404).send({Error: `Product with ID: ${id} does not exist`})
        }

        
    } catch(error) {
        res.status(400).send({Error: `Product with ID: ${id} does not exist` })
        }
})



prodsRouter.post('/', async(req,res) => {
    const { title, description, price, stock, category, code} = req.body

    try {    
        const prod = await productsModel.create({title, description, price, stock, category, code})
        res.status(200).send(prod)

    } catch(error) {
        res.status(400).send({Error: `Error creating product: ${error}`})
    }

})




prodsRouter.put ('/:id', async(req, res) => {
    const { id } = req.params
    const { title, description, price, stock, category, code, status } = req.body
    try {
        const prod = await productsModel.findByIdAndUpdate(id, {title, description, price, stock, category, code, status})

        if (prod) {
            res.status(200).send(prod)
        } else {
            res.status(404).send({Error: `Product with ID: ${id} does not exist`})
        }

        
    } catch(error) {
        res.status(400).send({Error: `Cannot update this product.`, error })
        }
})



prodsRouter.delete ('/:id', async(req, res) => {
    const { id } = req.params
    const { title, description, price, stock, category, code, status } = req.body
    try {
        const prod = await productsModel.findByIdAndDelete(id)

        if (prod) {
            res.status(200).send(prod)
        } else {
            res.status(404).send({Error: `Cannot delete this product.`, error })
        }

        
    } catch(error) {
        res.status(400).send({Error: `Product with ID: ${id} does not exist` })
        }
})



prodsRouter.delete('/', async(req, res) =>{
    try {
        await productsModel.deleteMany()
        res.send('Todos los productos han sido eliminados correctamente!')
    } catch (error) {
        res.status(404).send({Error: `Cant delete products.`, error})
    }
})






export default prodsRouter