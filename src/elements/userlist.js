import React,{useState,useEffect} from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Avatar, IconButton, Tooltip } from '@material-ui/core';
import { HiUserAdd, HiUserRemove } from "react-icons/hi";
import { RiMessageFill } from "react-icons/ri";
import io from "socket.io-client";

const UserListAvatar = withStyles({
    root: {
      height:"40px",
      marginRight:"0",
      marginTop:"1%"
    },
  })(Avatar);

const useStyles = makeStyles({
    ul: {
        width:"100%",
        marginTop:"2%",
        listStyleType: "none",
        padding:'0% 2%',
        backgroundColor: "white",
        boxShadow: "0px 5px 7px -7px rgba(0, 0, 0, 0.75)",
        borderRadius:"10px",
    },
    li: {
        width: "100%",
        textAlign:"left",
        backgroundColor: "white",
        position:"relative",
        display:"flex",
        padding:"3%",
        borderBottom:"1px solid lightgray",
        alignItems:"center"
    },
    a:{
        fontWeight: "500",
        fontFamily: "'Fira Sans', 'sans-serif'",
        fontSize: "medium",
        marginBottom: "0",
        color: "black",
        marginLeft:"1%",
        height:"50%",
        "&:hover, &:focus": {color:"black"}
    },
    messageSender: {
        display:"flex",
        marginTop: "30px",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0px 5px 7px -7px rgba(0, 0, 0, 0.75)",
        width: "100%",
    },
    messageSender__top: {
        borderBottom: "1px solid #eff2f5",
        paddingBottom: "15px",
        padding: "15px",
        display:"flex",
    },
    form:{
        width:"100%"
    },
    input: {
        outlineWidth: "0",
        border: "none",
        padding: "5px 20px",
        margin: "2% 10px",
        borderRadius: "999px",
        backgroundColor: "#eff2f5",
        width:"90%"
    },
    addFriend:{
        marginInlineStart:"auto",
        padding:"5px",
        margin:"auto 0%",
        color:"black",
        backgroundColor: "#eff2f5",
        "&:hover, &:focus": {backgroundColor:"lightgray"}
      },
    acceptFriend:{
        marginInlineStart:"auto",
        padding:"5px",
        color:"#68ac9e",
        margin:"auto 0%",
        backgroundColor: "#eff2f5",
        "&:hover, &:focus": {backgroundColor:"lightgray"}
      },
    pending:{
        marginInlineStart:"auto",
        padding:"5px",
        margin:"auto 0%",
        backgroundColor: "#eff2f5",
        borderRadius: "10px"
    },
    labor:{
        fontSize: "small",
        color: "gray",
        height:"50%",
        marginLeft:"1%"
    },
    userInfo:{
        textAlign: "left",
        width:"inherit"
    }
  });
let socket = io.connect("https://red-social-fc.herokuapp.com", {
  withCredentials: true,
  transports: ['websocket']
});
export default function UserList(props) {
 const [searchTerm, setSearchTerm] = useState("");
 const [searchResults, setSearchResults] = useState([]);
 const styles = useStyles();
 const sessionStr = localStorage.getItem("session")
 const sessionJson = JSON.parse(sessionStr)
 const userId = sessionJson.user._id
 let history = useHistory();
 const handleChange = event => {
    setSearchTerm(event.target.value);
  };

 const handleSubmit = (e) => {
    e.preventDefault();
    const results = props.users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
  }

const routeChange = (item) =>{ 
    let user = item.friends.filter(friend => friend.id === userId);
    if(user !== null){
      const roomId = user[0].room;
      //console.log("myroom"+roomId)
      let path = `/chat/${roomId}/${item._id}`;
      history.push(path); 
    }
  }
  
 useEffect(() => {
    const results = props.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    socket.on("usersResponse",users => {
      console.log(users)
      const results = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    })
  }, [props.users]);

  return (
    <>
        <div className={styles.messageSender}>
            <div className={styles.messageSender__top}>
                <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Buscar amigos"
                    value={searchTerm}
                    onChange={handleChange}
                /></form>
            </div>
        </div>
      <ul className={styles.ul}>
         {searchResults.map(item => (
          <li key={item._id} className={styles.li}>
              <UserListAvatar src={item.imageUrl}/>
              <div className={styles.userInfo}>
                <a className={styles.a} href={`/perfil/${item._id}`}>{item.name}</a>
                <div className={styles.labor}>{item.labor}</div>
              </div>
              {item._id!==userId ? !item.friends.find(friend=>friend.id===userId) ? 
              <Tooltip title="Agregar amigo" placement="bottom">
                <IconButton aria-label="add_friend" className={styles.addFriend} onClick={()=>props.add_friend({id:item._id,status:"pendiente"})}>
                  <HiUserAdd />
                </IconButton>
              </Tooltip>
            : item.friends.find(friend => friend.id===userId).status==="por confirmar" ?
            <Tooltip title="Cancelar solicitud de amistad" placement="bottom">
              <IconButton aria-label="accept_friend" className={styles.acceptFriend} onClick={()=>props.remove_friend(item._id)}>
                <HiUserRemove />
              </IconButton>
            </Tooltip>
            : item.friends.find(friend => friend.id===userId).status === "pendiente" ?
              <Tooltip title="Confirmar solicitud de amistad" placement="bottom">
                <IconButton aria-label="accept_friend" className={styles.acceptFriend} onClick={()=>props.add_friend({id:item._id,status:"amigos"})}>
                  <HiUserAdd />
                </IconButton>
              </Tooltip>
            : item.friends.find(friend=>friend.id===userId).status==="amigos" ? 
              <Tooltip title="Mensaje" placement="bottom">
                <IconButton aria-label="message_friend" className={styles.addFriend} onClick={() => routeChange(item)}>
                  <RiMessageFill />
                </IconButton>
              </Tooltip>
            : null:null}
          </li>
        ))}
      </ul>
    </>
  );
}