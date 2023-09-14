const socket = io()

const chatSubmit = document.getElementById('chatSubmit')
const divMsg = document.getElementById('divMsg')
const valInput = document.getElementById('chatBox')

Swal.fire({
    title: "Identificacion de usuario",
    text: "Por favor ingrese su nombre de usuario",
    input: "text",
    inputValidator: (valor) => {
        return !valor && 'Ingrese un nombre de usuario valido'
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value
    console.log(user)
})

chatSubmit.addEventListener('click', () => {
    let fechaActual = new Date().toLocaleString()
    if (valInput.value.trim().length > 0) { //Evitar que me envien un mensaje vacio
        socket.emit('mensaje', { fecha: fechaActual, user: user, mensaje: valInput.value })
        valInput.value = "" //Limpio el input
    }
})

socket.on('mensajes', arrayMensajes => {
    divMsg.innerHTML = "" //Limio el html
    arrayMensajes.forEach(mensaje => {
        divMsg.innerHTML += `<p>${mensaje.fecha} : ${mensaje.user} escribio ${mensaje.mensaje}</p>`
    })
})