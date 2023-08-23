import express, { urlencoded } from 'express'
import prodsRouter from './routes/products.routes.js'
import cartsRouter from './routes/cart.routes.js'
import { __dirname } from './path.js'
import path from 'path'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

const PORT = 4000
const app = express()

//Server
 const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}!`);
})

const io = new Server(server)


//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve( __dirname, './views'))

//Conectamos Socket.io
io.on("connection", async (socket) => {
    console.log("Conecction with Socket.io succesfully!");

    socket.on('msg', info => {
        console.log(info);
    })

    const products = await productManager.getProducts()
    // console.log(products)

    socket.on('newProduct', async(prod) => {
        await productManager.addProduct(prod.name, {...prod})
        console.log(prod);
    })
    socket.emit('getProducts', products)
})



//Routes
app.use('/static', express.static(path.join(__dirname, './public')))
app.get ('/', (req, res) => {
    res.send('<h3>Welcome to the Express server of Agus! :)</h3>')
})
app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)


//Hbs
app.get('/static', (req,res) => {

    res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    })

})


// Ruta para error 404
app.get('*', (req, res) => {
    res.send('<h2>Error 404: Page not found</h2>')
})








