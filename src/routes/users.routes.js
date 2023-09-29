import { Router } from "express";
import { userModel } from "../models/users.model.js";

const userRouter = Router()

userRouter.post('/', async(req, res) => {
    const { firstName, lastName, age, email, password, rol } = req.body
    try {
        const newUser = await userModel.create({ firstName, lastName, age, email, password, rol })
        res.status(200).send({ mensaje: 'User created succesfully', respuesta: newUser })
    } catch (error) {
        res.status(400).send({ error: `Error in create user: ${error}` })
    }

})

export default userRouter