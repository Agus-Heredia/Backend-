import express, { urlencoded } from 'express'
import prodsRouter from './routes/products.routes.js'
import cartsRouter from './routes/cart.routes.js'
import { __dirname } from './path.js'
import path from 'path'
import { engine } from 'express-handlebars'

const PORT = 4000
const app = express()

app.get ('/', (req, res) => {
    res.send('Welcome to the Express server of Agus! :)')
})


//Routes
app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)
app.use(express.static(__dirname + '/public'))


//Hbs
app.get('/static', (req,res) => {
    res.render('home', {
        
    })
})



//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))




//Ruta para error 404
app.get('*', (req, res) => {
    res.send('Error 404: Page not found')
})


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}!`);
})