const chatForm = document.getElementById("chat-form")
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Obtem o usuario e sala da URL
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const socket = io();

// Entra na sala
socket.emit('joinRoom', { username, room })

//Ouve o evento roomUsers
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

// Ouve o evento 'message' e recebe o conteudo message por parametro
socket.on('message', message => {

    outputMessage(message)

    //Ajusta o Scroll para cima
    chatMessage.scrollTop = chatMessage.scrollHeight

})

// Ouve o evento 'previousMessages' e recebe o conteudo message por parametro
socket.on('previousMessages', messages => {

    console.log(messages);
    for (message of messages.mensagens) {
        if (message.sala === messages.sala) {
            console.log(message);

            outputMessage(message)
        }
    }


    //Ajusta o Scroll para cima
    chatMessage.scrollTop = chatMessage.scrollHeight

})

// Mensagem de submit do formulario do chat
chatForm.addEventListener('submit', (e) => {

    // Desabilitando o reload do submit
    e.preventDefault();

    //Obtendo o conteudo do formulario da mensagem
    const msg = e.target.elements.msg.value

    // Iniciando um evento chamado 'chatMessage' com o conteudo do formulario
    socket.emit('chatMessage', msg)

    //Lima formulario
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

//Mostrando a mensagem no HTML
function outputMessage(message) {

    const div = document.createElement('div')

    div.classList.add('message')
    div.innerHTML = `<p class="meta"><b>${message.username}</b> <span>${message.time}</span></p>
                     <p class="text">${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div)
}

//Mostrando a mensagem no HTML
function outputRoomName(room) {
    roomName.innerText = room;
}
//Mostrando a mensagem no HTML
function outputUsers(users) {
    userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}