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

import ProductManager from './manager/ProductManager.js'   
const productManager = new ProductManager()

io.on('connection', async (socket) => {
        console.log('✓ User connected successfully!', `-- Your ID is: (${socket.id}) --`);
        socket.on('disconnect', () => {
            console.log('✗ User disconnected');
        })

        const products = await productManager.getProducts()
        socket.on('newProduct', async(prod) => {
            await productManager.addProduct(prod.name, {...prod})
        })
        socket.emit('getProducts', products)
})



//Routes
app.use('/static', express.static(path.join('src','public')))
app.get ('/', (req, res) => {
    res.send('<h3>Welcome to the Express server of Agus! :)</h3>')
})
app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)


//Cookies
app.get('/setCookie', (req, res) => {
    res.cookie('MiCookie', 'Esta es mi primera Cookie', { maxAge: 60000, signed: true }).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies) //Consultar solo las cookies firmadas
    //res.send(req.cookies) Consultar TODAS las cookies
})




//Session config
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}))

function auth(req, res, next) {
    console.log(req.session.email)
    if (req.session.email === 'adminCoder@coder.com' && req.session.password === 'adminCod3r123') {
        return next() //Puede ingresar a la seccion para admins
    } else {
        res.send('No sos admin')
    }
}

//MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB conected successfully :)'))
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


//Sessions

app.get('/session', (req,res) => {
    if(req.session.counter) {
        req.session.counter++
        res.send(`Hola, ya vas ingresando ${req.session.counter} veces a mi página, gracias!`)
    } else {
        req.session.counter = 1
        res.send('Hola, bienvenido!')
    }
})

app.get('/admin', auth, (req, res) => {
    res.send("Bienvenido admin")
})



app.get('/login', (req,res) => {
    const {email, password} = req.body

    req.session.email = email
    req.session.password = password

    return res.render('Usuario logueado correctamente')
})



app.get('/logout', (req,res) => {
    req.session.destroy((error) => {
        if(error) {
            res.send(error)
        } else { 
            res.send('Usuario deslogueado')
        }

    })
})


// Ruta para error 404
app.get('*', (req, res) => {
    res.send('<h2>Error 404: Page not found</h2>')
})








