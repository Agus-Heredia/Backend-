import bcrypt from 'bcrypt';

//Function para encriptar contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))


//Function para validar contraseña encriptada
export const validatePassword = (passwordSent, paswordBDD) => bcrypt.compareSync(passwordSent, paswordBDD)