const users = []

// Join usuario ao chat
function userJoin(id, username, room) {

    const user = { id, username, room }
    users.push(user)
    return user;
}

// obtem usuario atual
function getCurrentUser(id) {
    return users.find(x => x.id === id)
}

// User leaves chat
function userLeavel(id) {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1)
        return users.splice(index, 1)[0]
}

//Get usuarios da sala
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeavel
}