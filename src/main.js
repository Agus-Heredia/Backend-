import 'dotenv/config'
import express from 'express'
import { urlencoded } from 'express'
import prodsRouter from './routes/products.routes.js'
import cartsRouter from './routes/cart.routes.js'
import viewsRouter from './routes/views.routes.js'
import { __dirname } from './path.js'
import path from 'path'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import productsModel from './models/products.models.js'
import MongoStore from 'connect-mongo'
import userRouter from './routes/users.routes.js'
import sessionRouter from './routes/sessions.routes.js'

const PORT = 4000
const app = express()

//Server
 const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}!`);
})

const io = new Server(server)


//Middlewares
app.use(express.json())
app.use(cookieParser(process.env.SIGNED_COOKIE)) //Firmo la cookie
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve( __dirname, './views'))


io.on('connection', async (socket) => {
        console.log('✓ User connected successfully!', `-- Your ID is: (${socket.id}) --`);
        socket.on('disconnect', () => {
            console.log('✗ User disconnected');
        })

        const products = await productsModel.find()
        socket.on('newProduct', async(prod) => {
            await productsModel.create(prod.name, {...prod})
        })
        socket.emit('getProducts', products)
})



//Session config
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {useNewUrlParser: true},
        ttl: 90 //Segundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))



//Routes
app.use('/static', express.static(path.join('src','public')))
app.get ('/', (req, res) => {
    res.send('<h3>Welcome to the Express server of Agus! :)</h3>')
})
app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.use('/api/users', userRouter)
app.use('/api/sessions', sessionRouter)

//Cookies
app.get('/setCookie', (req, res) => {
    res.cookie('MiCookie', 'Esta es mi primera Cookie', { maxAge: 60000, signed: true }).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies) //Consultar solo las cookies firmadas
    //res.send(req.cookies) Consultar TODAS las cookies
})

//MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() =>
    console.log('DB conected successfully :)')
    )
    .catch((error) => console.log('Error on connection with MongoDB Atlas: ', error))



//Handlebars
app.get('/static', (req,res) => {

    res.render("realTimeProducts", {
        rutaJS: "realTimeProducts",
        rutaCSS: "realTimeProducts"
    })

    // res.render('chat', {
    //     rutaJS: 'chat',        
    //     rutaCSS: 'styles'
    // })

})


// Ruta para error 404
app.get('*', (req, res) => {
    res.send('<h2>Error 404: Page not found</h2>')
})








