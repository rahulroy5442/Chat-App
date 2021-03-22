const express=require('express');
const app=express();
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const {userAdd,remove,getUser,getUsersInRoom}=require('./utils/user.js')
const server=http.createServer(app)
const io=socketio(server)
const port =process.env.PORT || 3000
app.use(express.static(path.join(__dirname,'../public')))
const {messageHolder,LocationSender}=require('./utils/messageCreate')

io.on('connection',(socket)=>
{
   
    socket.on('join',(allField,callback)=>{
   //     console.log(allField)
        const {error,users}=userAdd({id:socket.id,...allField})
      //  console.log(users)
        if(error)
        {
            return callback(error)
        }
        socket.join(users.room)
        socket.emit('message',messageHolder("Admin","Welcome"))
        socket.broadcast.to(users.room).emit('message',messageHolder("Admin",`${users.user} has join`))
       // console.log(getUsersInRoom(users.room))
       socket.emit('display-name',{userroom:users.room,name:users.user})
        io.to(users.room).emit("roomData",{
            userList:getUsersInRoom(users.room)
        })
    })
    socket.on('newmessage',(message,callback)=>
    {
        const user=getUser(socket.id)
      //  console.log(message)
      io.to(user.room).emit('message',messageHolder(user.user,message))
      callback(message)
    })

    socket.on('Location',(corrdinate,callback)=>{
       // console.log(corrdinate)
       const user=getUser(socket.id)
        io.to(user.room).emit('SendLocation',LocationSender(user.user,`https://google.com/maps?q=${corrdinate.latitude},${corrdinate.longitude}`))
        callback()
    })
    socket.on('disconnect',()=>{
        const user=remove(socket.id)
        if(user)
        {
            io.to(user.room).emit('message',messageHolder("Admin",`A user ${user.user} has left the chat`))
            io.to(user.room).emit("roomData",{
                userList:getUsersInRoom(user.room)
            })
        }
    })

    
})


server.listen(port,()=>
{
    console.log(port)
})

