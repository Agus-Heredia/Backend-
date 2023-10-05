import { Router } from "express";
import { userModel } from "../models/users.model.js";
import { validatePassword } from "../utils/bcrypt.js";
import passport from "passport";

const sessionRouter = new Router()

sessionRouter.post('/login', passport.authenticate('login'), async(req,res) => {
    
    try {
        if(!req.user){
            return res.status(401).send({message: 'Invalid login'})
        }

        req.session.user = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            age: req.user.age
        }

        res.status(200).send({payload: req.user})

    } catch(error) {
        res.status(500).send({loginError: `Error on login, ${error}`});
    }

})

sessionRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.status(200).send({ resultado: 'Login eliminado' })
})


export default sessionRouter


//Login sin passport
/*
 const {email, password} = req.body
    try {
        if(req.session.login){
            res.status(200).send({message: 'Login already exists'})
        }
        const user = await userModel.findOne({email: email})

        if(user){
            if (validatePassword(password, user.password)) {
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
*/