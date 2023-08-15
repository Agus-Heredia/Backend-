import { Router } from 'express'
const prodsRouter = Router()

import ProductManager from '../manager/ProductManager.js'
const productManager = new ProductManager('../products.txt')



prodsRouter.get ('/', async(req, res) => {
    try {
        const { limit } = req.query
        const prods = await productManager.getProducts()
        const limitedProducts = prods.slice(0, limit)
        res.status(200).json(limitedProducts)
    } catch {
        res.status(400).send({ message: error.message})
    }
})


prodsRouter.get('/:id', async (req, res) => {
    try {
    const { id } = req.params                                                                                                                                                                                                              
    const filtredProducts = await productManager.getProductById(Number(id))
    if (filtredProducts){
        res.status(200).json(filtredProducts)       
    } else {
        res.status(404).send('Error: Product not found')
    }
    } catch {
        res.status(400).send({message : error.message})
    }
})



prodsRouter.post('/', async(req,res) => {
    try {
        const msgValidation = await productManager.addProduct(req.body)

        if(msgValidation) {
            res.status(200).send('Producto creado correctamente!')
        } else {
            res.status(404).send('Error: No se ha podido crear el producto o el mismo ya existe')
        }
    } catch {
        res.status(400).send({message : error.message})
    }   
})



prodsRouter.put('/:id', async(req,res) => {
    const msgValidation = await productManager.updateProduct(req.params.id, req.body)

    if(msgValidation) {
        res.status(200).send('Producto actualizado correctamente!')
    } else {
        res.status(404).send('Error: Product not found')
    }
})



prodsRouter.delete('/:id', async(req, res) =>{
    try {
        const { id } = req.params;
        const products = await productManager.getProducts(); 
        if(products.length > 0) {
            await productManager.deleteProduct(Number(id));
            res.send(`El producto con el id: ${id} ha sido eliminado corectamente!`);
        } else {
            res.send(`No se ha encontrado el producto`)
        }
    } catch (error) {
        res.status(404).json({message: error.message});
    }
})



prodsRouter.delete('/', async(req, res) =>{
    try {
        await productManager.deleteAllProducts()
        res.send('Todos los productos han sido eliminados correctamente!')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})






export default prodsRouter