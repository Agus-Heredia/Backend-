import { Router } from "express";
import { userModel } from "../models/users.model.js";
import { createHash } from "../utils/bcrypt.js";

const userRouter = Router()

userRouter.post('/', async(req, res) => {
    const { firstName, lastName, age, email, password } = req.body
    try {
        const hashPassword = createHash(password)
        const newUser = await userModel.create({ 
            firstName: firstName, 
            lastName: lastName,
            age: age,
            email: email,
            password: hashPassword
        })
        res.status(200).send({ mensaje: 'User created succesfully', respuesta: newUser })
    } catch (error) {
        res.status(400).send({ error: `Error in create user: ${error}` })
    }

})

export default userRouter