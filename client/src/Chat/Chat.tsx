import './Chat.css';
import io from 'socket.io-client'
import { useEffect, useState } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import { Paper } from '@mui/material';
import { TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { createStyles, makeStyles } from '@mui/styles';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import Button from '@mui/material/Button';

const socket = io('http://localhost:3001', { transports : ['websocket'], secure: true });

const useStyles = makeStyles((theme: any) =>
  createStyles({
    // PAPIER DE GAUCHE
    paper: {
      width: "100%",
      height: "100vh",
      position: "relative",
      backgroundColor: "rgb(220,220,220)",
      overflowY: "scroll",
      padding: "0",
    },
    settings: {
      alignSelf: "flex-end",
      display: "inline-block",
      position: 'absolute',
      top: "0px",
      right: "20px",
    },
    buttonSettings: {
      alignSelf: "flex-end",
      display: "inline-block",
      position: 'absolute',
      top: "0px",
      right: "20px",
      padding: "16px",
      backgroundColor: "transparent",
      border: "0"
    },
    // PAPIER DE DROITE
    paper2: {
      width: "100%",
      height: "100vh",
      position: "relative",
      backgroundColor: "rgb(220,220,220)",
      padding: "0",
    },
    // BOUTON CREATE ROOM
    createRoom: {
      width: "100%",
      height: "5vh",
      backgroundColor: "rgb(220,220,220)"
    },
    container: {
      width: "100vw",
      height: "100vh",
      alignItems: "center",
      justifyContent: "center",
      margin: "0",
      padding: "0"
    },
    // HISTORIQUE DE MESSAGES
    messagesBody: {
      width: "100%",
      margin: 0,
      height: "calc( 100% - 80px )",
      backgroundColor: "rgb(220,220,220)",
      display: "flex",
      flexDirection: "column-reverse",
    },
    // FORM D ENVOI DE MESSAGES
    wrapForm : {
        display: "flex",
        minWidth: "0",
        justifyContent: "center",
        width: "100%",
        paddingTop: "3vh",
        margin: `0`,
    },
    wrapText  : {
        width: "100%"
    },
    // BOUTON D ENVOI DE TEXTE
    button: {
      backgroundColor: "#fff",
      borderColor: "#1D2129",
      borderStyle: "solid",
      borderRadius: 20,
      borderWidth: 2,
      color: "#1D2129",
      fontSize: 18,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      outline: "none"
    },
    selected: {
      color: "#fff",
      backgroundColor: "#0084FF",
      borderColor: "#0084FF"
    }
  })
);

function chatSettings() {

  console.log("hy");
  return (
    <h1> coucou </h1>
  );
}

// BULLES DE MESSAGES
const customBubble = (props: any) => (
    <div className="imessage">
    <p className={`${props.message.id ? "from-them" : "from-me"}`}>{props.message.message}</p>
    </div>
);

export function Chat() {
  const classes = useStyles();
  const [room, setRoom] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [rooms, setRooms] = useState<Array<number>>([]);

  // SEND MESSAGE
  const sendMessage = () => {
    socket.emit('send_message', { message, room });
    setMessages([...messages,
      new Message({
        id: 0,
        message: message,
        senderName: "adidion"
      }),
    ])
    socket.emit("connection");
  };
  
  // JOIN A ROOM
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  // JOIN A CHANNEL VIA LE BOUTON
  const joinChannel = (room_number: number) => {
    setRoom(room_number.toString());
    socket.emit("join_room", room_number.toString());
  };
  

  // SEND THE MESSAGE AND RESET (due to the onClick accepting only one function)
  function send_and_reset()
  {
    if (message !== "")
      sendMessage();
    reset();
  }

  
  // DEAL WITH EVENTS
  useEffect(() => {
    socket.on("disconnected", () => {
      socket.close();
    })

    // RECEPTION DE MESSAGES
    socket.on("receive_message", (data) => {
      setMessages([...messages,
        new Message({
          id: 1,
          message: data.body,
          senderName: "talker"
        }),
      ])
    });
    // JOIN ROOM
    socket.on("joined_room", (data) => {
      messages.splice(0, messages.length);
      setMessages([]);
      data.forEach(function(value: any, key: any) {
        messages.push(new Message({
            id: 1,
            message: data[key].body,
            senderName: "talker"
          }),
        );
        setMessages([...messages]);
      });
    });
    // CONNECTION DU CLIENT
    socket.on("connected", (data) => {
      if (room === "")
        socket.emit("join_room", "0");
      rooms.splice(0, rooms.length);
      setRooms([]);
      data.forEach(function(value: any, key: any) {
        rooms.push(data[key].room_number);
        setRooms([...rooms]);
      });
    });

    socket.on("set_rooms", (data) => {
      rooms.splice(0, rooms.length);
      setRooms([]);
      data.forEach(function(value: any, key: any) {
        rooms.push(data[key].room_number);
        setRooms([...rooms]);
      });
      //console.log("here");
    })

    // setInterval(() => {
			socket.emit("get_room");
    //   //console.log("test");
		// }, 100000);
  }, [messages, rooms, room])
  
  // RESET THE FORM
  function reset() {
    (document.getElementById("textareaInput") as HTMLFormElement).reset();
  }
  
  const loadChannels = rooms.map(room_number => {
    return (
      <button className="channels" key={room_number} onClick={() =>joinChannel(room_number)}>
          {room_number}
        </button>
          )
  })

  // RETURN TO RENDER
  return (
  <>
    {/* colonnes */}
    <div className="columns">
      {/* colonne de gauche */}
      <div className="col1">
        <Paper className={classes.paper}>
          {/* affichage des channels dispo et creation d un bouton / room */}
          <>
          { loadChannels }
          </>
          {/* form de creation de room */}
          <input
            placeholder="Room Number..."
            onChange={(event: any) => {
              setRoom(event.target.value);
            }}
          />
          {/* bouton pour creer la room */}
          <button className={classes.createRoom} onClick={joinRoom}> Create Room</button>
        </Paper>
      </div>
      {/* colonne de droite */}
      <div className="col2">
        <Paper className={classes.paper2}>
          {/* papier pour l historique des messages */}
          <Paper id="style-1" className={classes.messagesBody}>
            {/* gestion de l'historique des messages */}
            <ChatFeed
              messages={messages} // Boolean: list of message objects
              isTyping={false} // Boolean: is the recipient typing
              hasInputField={false} // Boolean: use our input, or use your own
              showSenderName={true} // show the name of the user who sent the message
              bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
              chatBubble={true && customBubble} // JSON: Custom bubble styles
            />
            <SettingsApplicationsIcon fontSize="large" className={classes.settings}/>
            <button className={classes.buttonSettings} onClick={chatSettings}/>
          </Paper>
          <>
            {/* formulaire pour envoyer un message */}
            <form className={classes.wrapForm}  noValidate autoComplete="off" id="textareaInput">
              <TextField
                placeholder='type your message'
                onChange={(event: any) => {
                  setMessage(event.target.value);
                }}
                // si on presse enter, le message s'envoit et le formulaire se vide
                onKeyDown={(event: any) => {
                  if (event.key === 'Enter')
                  {
                    if (message !== "")
                    sendMessage();
                    event.preventDefault();//avoid refreshing at each enter
                    reset();//clear the form
                    setMessage('');
                  }
                }}
              />
              {/* bouton d'envoi de messages */}
              <Button
                onClick={send_and_reset}>
                <SendIcon />
              </Button>
            </form>
          </>
        </Paper>
      </div>  
    </div>
  </>
  );
}
// export Chat;