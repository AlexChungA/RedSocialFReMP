import React from "react";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import CloseIcon from '@material-ui/icons/Close';
import NearMeIcon from "@material-ui/icons/NearMe";
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Tooltip from 'react-responsive-ui/commonjs/Tooltip'
import ReactTimeAgo from 'react-time-ago'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import "./post.css";
import BadgeAvatar from "./badgeavatar";

const useStyles = makeStyles({
    close: {
      marginInlineStart:"auto",
      padding:0,
      marginBottom:"auto"
    },
    timestamp: {
        fontSize: "small",
        color: "gray"
    },
  });

const TooltipContainer = ({ verboseDate, children, ...rest }) => (
    <Tooltip {...rest} content={verboseDate} placement="bottom" >
      {children}
    </Tooltip>
  )
  
TooltipContainer.propTypes = {
    // `verboseDate` is not generated on server side
    // (because tooltips are only shown on mouse over),
    // so it's not declared a "required" property.
    verboseDate: PropTypes.string,
    children: PropTypes.node.isRequired
  }

export default function Post({id,userId,image, username, message,timestamp,handleRemovePost,feeling}) {
    const classes = useStyles();
    const sessionStr = localStorage.getItem("session")
    const sessionJson = JSON.parse(sessionStr)
    const userIdStorage = sessionJson.user._id
    const usernameStorage = sessionJson.user.username
    const [userImageUrl,setUserImageUrl] = React.useState('');
    const [like,setLike] = React.useState();
    const [countLikes,setCountLikes] = React.useState(0);
    timestamp = new Date(timestamp);
    const [open, setOpen] = React.useState(false);  
    React.useEffect(() => {
        fetch("https://red-social-fc.herokuapp.com/perfil/"+userId).then(res=>res.json()).then(data=>{setUserImageUrl(data.user.imageUrl)})
    }, [])
    
    const handleLike = () => {
       if (like) {setLike(false)
                  fetch(`https://red-social-fc.herokuapp.com/inicio/posts/${id}/likes/${userIdStorage}`,{method: "DELETE",withCredentials: "include"})
              .then(res=>res.json()).then(data=>{setCountLikes(data.countLikes) })
       }
      else{setLike(true)
            fetch(`https://red-social-fc.herokuapp.com/inicio/posts/${id}/likes`,{
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({"userId":userIdStorage,"username":usernameStorage}),
                      withCredentials: "include"}).then(res=>res.json()).then(data=>{setCountLikes(data.countLikes)})
                  }
    }

    React.useEffect(()=>{
      fetch(`https://red-social-fc.herokuapp.com/inicio/posts/${id}/likes`,{withCredentials: "include"}).then(res=>res.json())
        .then(data=>{setCountLikes(data.countLikes)
          if(data.peopleLiked.find(user=>user.userId===userIdStorage)){
            setLike(true)
          }else{setLike(false)}
        })
    },[like])
    
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    //TODO FUNCIONALIDAD DE COMENTAR Y COMPARTIR DE POST, MENSAJERÍA
    return (
    <div className="post">
        <div className="post__top">
            <BadgeAvatar feeling={feeling} userImageUrl={userImageUrl} className="post__avatar"/>
            <div className="post__topInfo">
                <a href={`/perfil/${userId}`}>{username}</a>
                <div className={classes.tooltip}>
                <ReactTimeAgo className={classes.timestamp} date={timestamp} locale="es-PE" wrapperComponent={TooltipContainer} tooltip={false}/>
                </div>
            </div>
            {userId===userIdStorage &&
            <>
            <IconButton aria-label="delete" className={classes.close} onClick={handleClickOpen}>
                <CloseIcon />
            </IconButton>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
            <DialogTitle>Eliminar publicación</DialogTitle>
            <DialogContent>
              ¿Está seguro(a) que desea eliminar esta publicación? Luego de eliminada, la publicación no podrá ser recuperada.
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                CANCELAR
              </Button>
              <Button onClick={()=>handleRemovePost(id)} color="primary">
                ELIMINAR
              </Button>
            </DialogActions>
          </Dialog></>
            }
        </div>
        {message &&<div className="post__bottom">
            <p>{message}</p>
        </div>}
        {image &&<div className="post__image">
            <img src={image} alt=""/>
        </div>}
        <div className="post__details">{countLikes>0 &&
        <div className="post__likeInfo">A {countLikes} personas les gusta esto.</div>}
        </div>
        <div className="post__options">
            <Button className="post__option" onClick={handleLike} color={like?"primary":""}>
              <ThumbUpIcon /> Me gusta
            </Button>
            
            <Button className="post__option">
              <ChatBubbleOutlineIcon/> Comentar
            </Button>
            <Button className="post__option">
              <NearMeIcon/> Compartir
            </Button>
        </div>
    </div>
    );
}