const http =require('http')
const express = require('express');
const path=require('path');

const {Server}= require("socket.io")

const app = express();

//we need to attach socket.io to express 
//so you can not directly do app.listen

const server = http.createServer(app);

let socketsConnected = new Set()

//make instance of io like input output

const io= new Server(server);

io.on("connection",onConnected)

function onConnected(socket){
    //console.log(socket.id)
    socketsConnected.add(socket.id);


    io.emit('clients-total',socketsConnected.size)


    socket.on('disconnect',()=>{
        console.log(socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total',socketsConnected.size)
    })


    socket.on('message',(data)=>{
       // console.log(data)
        socket.broadcast.emit('chat-message',data)
        
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })
}








//here server is server created with help of http


//Socket.io
//connection means when socket is connected
// io.on('connection', (socket) => {


    //here socket is basically a user or client 
    // console.log('a new user has connected',socket.id);

    //to broadcast 
    // io.on('connection', (socket) => {
    //     socket.broadcast.emit('hi');
    //   });

//server is getting message
    // io.on('connection', (socket) => {
    //     socket.on('chat message', (msg) => {
    //     io.emit('chat message', msg);
    //     });
    // });

//   });






app.use(express.static(path.resolve("./public")));


app.get("/",(req,res)=>{
    return res.sendFile("/public/index.html")
})

server.listen(9000,()=>{
    console.log("server started at port 9000")
})
