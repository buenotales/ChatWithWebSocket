// Importando dependencias
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, getRoomUsers, userLeavel } = require('./utils/user.js')


const app = express()
const server = http.createServer(app);
const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botname = 'Unifaj Chat'
const mensagensTotal = []

// Executa quando algum cliente conectar
io.on('connection', socket => {

    // Escuta evento joinRoom
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        socket.emit('previousMessages', { mensagens: mensagensTotal, sala: user.room });

        // // Emite um evento chamado 'message' com o conteudo '......'
        // socket.emit('message', formatMessage(botname, 'Bem-Vindo Unifaj Chat!'))
        // mensagensTotal.push(formatMessage(botname, 'Bem-Vindo Unifaj Chat!', user.room))

        // Emite o Broadcast quando um usuario se conectar
        socket.broadcast.to(user.room).emit('message', formatMessage(botname, `${user.username} entrou na sala`));
        mensagensTotal.push(formatMessage(botname, `${user.username} entrou na sala`, user.room))

        //Cria evento com os usuarios da sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    // Ouve o evento chatMessage
    socket.on('chatMessage', message => {

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, message))
        mensagensTotal.push(formatMessage(user.username, message, user.room))
    })

    // Executado quando algum usuário se desconectar
    socket.on('disconnect', () => {

        const user = userLeavel(socket.id)

        if (user) {
            //Cria evento com os usuarios da sala
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
            io.emit('message', formatMessage(botname, `${user.username} se desconectou do chat`))
            mensagensTotal.push(formatMessage(botname, `${user.username} se desconectou do chat`, user.room))
        }
    })
})


//Obtendo numero da porta atravéz da atribuição ou variavel de ambiente
const PORT = 3000 || process.env.PORT;

//Iniciando o servidor
server.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`))