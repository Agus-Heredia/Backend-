import http from 'http'

//Creamos el servidor
const server = http.createServer((req, res) => {
    res.end('Welcome to your new server, Agus!')
})

//Iniciamos
const PORT = 4000
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}!`);
})