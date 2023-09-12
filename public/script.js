
const socket = io('/');
const user = prompt("Enter your name");
 const videoGrid = document.getElementById("video-container");
     const myVideo = document.createElement('video');
const peers = {}
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
  })

  const myscreen = document.createElement('video')
  myscreen.setAttribute("id", "screenshare");

myVideo.muted = true;

let myVideoFeed;
navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then((videoAudio) => {
          myVideoFeed= videoAudio;
          addVideoStream(myVideo, videoAudio);

              myPeer.on('call', call => {
              call.answer(videoAudio)
              const video = document.createElement('video')

              call.on('stream', function(remoteStream) {
                addVideoStream(video , remoteStream);

              });

            })

          socket.on('user-connected' , (userId)=>{
            console.log( "connected user's id - " + userId);
            connectToUser(userId , videoAudio);
          })
          // socket.off('user-connected' , (userId)=>{
          //   console.log( "connected user's id - " + userId);
          //   connectToUser(userId , videoAudio);
          // })

      });
      socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
      })

myPeer.on('open' , userId=>{
      console.log("my user id - " + userId);
      socket.emit('join-room', RoomId , userId ,user);
});

const connectToUser=(userId , stream)=>{
        var call = myPeer.call(userId, stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
        addVideoStream(video , userVideoStream);
        })

        call.on('close', () => {
      video.remove()
    })

    peers[userId] = call
       }



       function addVideoStream(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
          video.play()
        })
        videoGrid.append(video);
      }
      const messages = document.getElementById("messagebox");
      const msgcontent = document.querySelector(".main__right")
      const chat = document.getElementById("chat");
      var toggle = false;
      chat.addEventListener('click' , ()=>{
          if(toggle){
            messages.classList.add("active");
            msgcontent.classList.remove("hide");
          }else{
            messages.classList.remove("active");
            msgcontent.classList.add("hide");
          }

        toggle= !toggle;
      })
const inviteButton = document.getElementById("invite");
      inviteButton.addEventListener("click", (e) => {
        prompt(
          "Copy! and send it to your friends!",
          window.location.href
        );
      });

      const stopVideo = document.querySelector("#stopVideo");
      const muteButton = document.querySelector("#muteButton");

      stopVideo.addEventListener("click", () => {
        const enabled = myVideoFeed.getVideoTracks()[0].enabled;
        if (enabled) {
          myVideoFeed.getVideoTracks()[0].enabled = false;
          html = `<i class="fas fa-video-slash"></i>`;
          stopVideo.classList.toggle("background__red");
          stopVideo.innerHTML = html;
        } else {
          myVideoFeed.getVideoTracks()[0].enabled = true;
          html = `<i class="fas fa-video"></i>`;
          stopVideo.classList.toggle("background__red");
          stopVideo.innerHTML = html;
        }
      });
      muteButton.addEventListener("click", () => {
        const enabled = myVideoFeed.getAudioTracks()[0].enabled;
        if (enabled) {
          myVideoFeed.getAudioTracks()[0].enabled = false;
          html = `<i class="fas fa-microphone-slash"></i>`;
          muteButton.classList.toggle("background__red");
          muteButton.innerHTML = html;
        } else {
          myVideoFeed.getAudioTracks()[0].enabled = true;
          html = `<i class="fas fa-microphone"></i>`;
          muteButton.classList.toggle("background__red");
          muteButton.innerHTML = html;
        }
      });

      // const end = document.querySelector("#end");
      // end.addEventListener("click" , ()=>{

      //     if (confirm("Close Window?")) {
      //       close();
      //     }

      // })
      const stopButton = document.querySelector("#end").addEventListener("click", function() {
  var ans = confirm("Are you sure you want to quit?");
  if (ans === true) {
    window.close();
  }
});
      const text = document.querySelector("#chat_message");
      const send = document.querySelector("#send");
      const messages_m = document.querySelector(".messages_area");

      send.addEventListener("click", ()=>{
        if (text.value.length !== 0) {
          socket.emit("message", text.value);

          messages_m.innerHTML =
          messages_m.innerHTML +
          `<div class="message_card">
              <p class="bold">Me:</p>
              <p class="textmsg">${text.value}</p>

          </div>`;
          text.value = "";


        }
      })

      text.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && text.value.length !== 0) {
          socket.emit('message', RoomId, text.value , user);

          messages_m.innerHTML =
          messages_m.innerHTML +
          `<div class="message_card">
              <p class="bold">Me:</p>
              <p class="textmsg">${text.value}</p>

          </div>`;
          text.value = "";
        }
      });
      socket.on("createMessage" , (message , username)=>{

        messages_m.innerHTML =
        messages_m.innerHTML +
        `<div class="message_card">
              <p class="bold"> ${username}:</p>
              <p class="textmsg">${message}</p>

          </div>` ;
      })
      let scrs = document.querySelector("#screensharebtn");
let togg = false;
scrs.addEventListener("click", () => {
  if (togg) {
    togg = !togg
    navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always"
      }
    }).then(stream => {
      myVideoStream = stream;
      addVideoStream(myscreen, stream)
      myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })
      socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
      })
    })
  } else {
    togg=!togg
     let p=document.querySelector("#screenshare")
     p.parentNode.removeChild(p);

  }
})
