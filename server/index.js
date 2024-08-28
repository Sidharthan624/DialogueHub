const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const socket = require('socket.io')
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')

const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use('/api/auth', userRoutes)
app.use('/api/messages', messageRoutes)

mongoose.connect(process.env.MONGO_URL).then(()=> {
    console.log('MongoDB connected');
    
}).catch((error) => {
    console.log(error.message)
}) 

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true

    }
})
const globalUsers = new Map()
io.on('connection', (socket) => {
    globalUsers.chatSocket = socket
      socket.on('add-user', (userId) => {
       globalUsers.set(userId, socket.id)
      })
      socket.on('send-msg', (data) => {
        const sendUserSocket = globalUsers.get(data.to)
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive',data.message)
        }
      })
})
