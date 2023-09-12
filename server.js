

const express=require("express")
const { v4: uuidv4 }=require("uuid");
const app=express();
const server = require("http").Server(app);
const a =  require("socket.io")(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true,
  // path:'/'
});
app.use('/peerjs' , peerServer)
app.set("view engine","ejs");
app.use(express.static("public"));
app.get("/",function(req,res)
{
  res.render('index');
});
app.get("/start",function(req,res)
{
  res.redirect(`/${uuidv4()}`);
});
app.get("/:room",function(req,res)
{
  // res.send(roomId:req.params.room);
  res.render("room",{roomId:req.params.room});
});
a.on('connection', socket => {
    socket.on('join-room', (RoomId , userId,username) => {
     console.log( userId);
    socket.join(RoomId)
    socket.broadcast.to(RoomId).emit('user-connected' , userId);
    socket.on('message', (RoomId, message , username) => {
      socket.broadcast.to(RoomId).emit("createMessage", message, username);
    })
    socket.on('disconnect', () => {
      socket.broadcast.to(RoomId).emit('user-disconnected', userId)
    })


    });


  }

    );




server.listen( process.env.PORT || 3000);
