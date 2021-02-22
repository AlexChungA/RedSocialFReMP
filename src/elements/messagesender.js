import React, {useState} from 'react';
import "./messagesender.css";
import { Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const MessageSenderAvatar = withStyles({
    root: {
      height:"40px",
      marginRight:"0",
      marginTop:"1%"
    },
  })(Avatar);
export default function MessageSender({handleAddPost}){
    const [input,setInput] = useState('')
    const [imageUrl,setImageUrl] = useState('')
    const sessionStr = localStorage.getItem("session")
    const sessionJson = JSON.parse(sessionStr)
    const user = sessionJson.user

    const handleSubmit = (e) =>{
        e.preventDefault();
        handleAddPost({
            userId:user._id,
            username:user.name,
            message:input,
            imageUrl:imageUrl,
            timestamp:new Date(),
            feeling:user.feeling
        })
        setInput("")
        setImageUrl("")
    }

    return <div className="messageSender">
        <div className="messageSender__top">
            <MessageSenderAvatar src={user.imageUrl}/>
            <form>
                <input 
                value={input} 
                onChange={ (e) => setInput(e.target.value)} 
                className="messageSender__input" 
                placeholder={"Comparte algo..."}/>
                <input 
                value={imageUrl}
                onChange={ (e) => setImageUrl(e.target.value)}
                placeholder="URL de la imagen (Opcional)"/>
                <button className="btn float-right" onClick={handleSubmit} type="submit" disabled={input ? "" : "disabled"}>Publicar</button>
            </form>
        </div>

        <div className="messageSender__bottom">

        </div>
    </div>
}