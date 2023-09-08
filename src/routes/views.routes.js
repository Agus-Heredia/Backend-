import { Router } from 'express';
const viewsRouter = Router()

import ProductManager from "../manager/ProductManager.js"; 
const productManager = new ProductManager('../products.txt');

viewsRouter.get("/home", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.log(error);
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.log(error);
    }
});

export default viewsRouter