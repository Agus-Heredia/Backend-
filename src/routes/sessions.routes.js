import { Router } from "express";
import { userModel } from "../models/users.model.js";

const sessionRouter = new Router()

sessionRouter.post('/login', async(req,res) => {
    const {email, password} = req.body
    try {
        if(req.session.login){
            res.status(200).send({message: 'Login already exists'})
        }
        const user = await userModel.findOne({email: email})

        if(user){
            if (user.password == password) {
                req.session.login = true
                res.status(200).send({ resultado: 'Login successfully', message: user })
                // res.status(200).redirect('/realtimeproducts') // Dejo comentado hasta lograr que funcione
            } else {
                res.status(401).send({result: 'Unahutorized', message: user})
            }
        } else{
            res.status(404).send({result: 'Not Found', message: user})
        }
    } catch(error) {
        res.status(400).send({error: `Login error, please try again, ${error}`})
    }
})

sessionRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.status(200).send({ resultado: 'Login eliminado' })
})


export default sessionRouter