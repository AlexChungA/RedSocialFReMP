import React, {useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import Navbar from "../elements/navbar";
import { makeStyles, Paper, Container } from '@material-ui/core';
import io from 'socket.io-client';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import FriendsList from '../elements/friendsList';
import ChatBox from '../elements/chatBox';
import Sender from '../elements/sender';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        margin: theme.spacing(2),
      },
    },
    Muicontainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '83%',
      padding: '1rem',
      marginTop: '55px',
      marginLeft: '229px',
      [theme.breakpoints.down('md')]: {
       margin:'15% 0',
       width:'100%'
      },
    },
    MuiGridGridXs9:{
      [theme.breakpoints.down('md')]: {
        maxWidth:'68%'
       },
    },
    chatSection: {
      width: '100%',
      height: '85vh',
    },
  }));

let socket;
const Chat = () => {
    const [messages, setMessages] = useState(null);
    const [friends, setFriends] = useState(null);
    const [message, setMessage] = useState('');
    const classes = useStyles();
    const history = useHistory();
    const ENDPOINT = 'https://red-social-fc.herokuapp.com';
    const sessionStr = localStorage.getItem("session")
    const sessionJson = JSON.parse(sessionStr)
    const userId = sessionJson.user._id
    const {roomId, friendId} = useParams();
    let loggedIn
        if(sessionStr == null)
            loggedIn = false
        else
            loggedIn = sessionJson.loggedIn

    const getMessages = async() => {
      fetch(`https://red-social-fc.herokuapp.com/messages/${roomId}/`,{method:'GET'}).then(res=>res.json())
      .then((data) => {
          setMessages(data.messages);
      })
    }

    const getFriends = async() => {
      console.log(userId);
      fetch(`https://red-social-fc.herokuapp.com/users/${userId}/friends/`,{method:'GET'}).then(res=>res.json())
      .then((data) => {
          //console.log(data);
          setFriends(data.users);
      })
    }

    useEffect(() => {
      if((roomId === undefined) && (friends !== null)){
        history.push(`/chat/${friends[0].room}/${friends[0]._id}`)
      }
    },[friends])

    useEffect(() => {
      getFriends();
      //console.log(friends);
    },[])

    useEffect(() => {
      getMessages();
      //console.log(messages);
    },[])

    useEffect(() => {
        socket = io.connect(ENDPOINT, {
          withCredentials: true,
        });
        setInterval(()=>{
          socket.volatile.emit('keep_alive');
          console.log('Keeping alive');
        },30000);
        socket.emit('join_room', { userId , roomId });
        console.log(socket);
        return () => {
            socket.emit('leave_room');
            socket.off();
        }
    }, [roomId])

    const sendMessage = (e) => {
        e.preventDefault();
        const data = {
            message: message,
            sender: userId,
            receiver: friendId,
            roomId: roomId,
            createdAt: new Date()
        }
        if(message){
            socket.emit('send_message', data);
        }
        setMessage("");
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
          if(messages !== null){
            setMessages([...messages, data]);
          }
        })
        console.log("entra al useffect");
    },[messages])

    useEffect(() => { 
      getMessages();
    }, [roomId])

    return (
      !loggedIn ? history.push("/") :
      <Container classes={{ root: classes.Muicontainer }}>
      <Navbar title="Chat"/>

        <Grid container component={ Paper } className={ classes.chatSection }>
            <FriendsList friends={ friends } friendId={ friendId }/>
            <Grid item xs={9} classes={{root: classes.MuiGridGridXs9}}>
            {messages && (
              <ChatBox messages={ messages }/>
              )}
            <Divider />
              <Sender message={ message } setMessage={ setMessage } sendMessage={ sendMessage }/>
            </Grid>
        </Grid>

      </Container>  
    );
}
export default Chat;