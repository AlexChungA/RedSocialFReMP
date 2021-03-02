import React from "react";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import CloseIcon from '@material-ui/icons/Close';
import NearMeIcon from "@material-ui/icons/NearMe";
import IconButton from '@material-ui/core/IconButton';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Tooltip from 'react-responsive-ui/commonjs/Tooltip'
import ReactTimeAgo from 'react-time-ago'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Avatar } from '@material-ui/core';
import "./post.css";
import BadgeAvatar from "./badgeavatar";
import Comment from "./comment";

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

const CommentAvatar = withStyles({
    root: {
      height:"35px",
      width:"35px",
      marginRight:"0",
      marginTop:"1%"
    },
  })(Avatar);

export default function Post({id,userId,image, username, message,timestamp,handleRemovePost,feeling,disabled}) {
    const classes = useStyles();
    const sessionStr = localStorage.getItem("session")
    const sessionJson = JSON.parse(sessionStr)
    const userIdStorage = sessionJson.user._id
    const usernameStorage = sessionJson.user.name
    const [userImageUrl,setUserImageUrl] = React.useState('');
    const [like,setLike] = React.useState();
    const [comment,setComment] = React.useState('')
    const [showcomments,setShowComments] = React.useState(false)
    const [comments, setComments] = React.useState([])
    const [countLikes,setCountLikes] = React.useState(0);
    const [countComments,setCountComments] = React.useState(0);
    timestamp = new Date(timestamp);
    const [open, setOpen] = React.useState(false);  
    React.useEffect(() => {
        fetch("https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/perfil/"+userId).then(res=>res.json()).then(data=>{setUserImageUrl(data.user.imageUrl)})
        fetch(`https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/inicio/posts/${id}/comments`).then(res=>res.json()).then(data=>{if(data.comments){setComments(data.comments)
                                                                                                                       setCountComments(data.countComments)}})
    }, [])
    
    const handleLike = () => {
       if (like) {setLike(false)
                  fetch(`https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/inicio/posts/${id}/likes/${userIdStorage}`,{method: "DELETE",withCredentials: "include"})
              .then(res=>res.json()).then(data=>{setCountLikes(data.countLikes) })
       }
      else{setLike(true)
            fetch(`https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/inicio/posts/${id}/likes`,{
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({"userId":userIdStorage,"username":usernameStorage}),
                      withCredentials: "include"}).then(res=>res.json()).then(data=>{setCountLikes(data.countLikes)})
                  }
    }

    React.useEffect(()=>{
      fetch(`https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/inicio/posts/${id}/likes`,{withCredentials: "include"}).then(res=>res.json())
        .then(data=>{setCountLikes(data.countLikes)
          if(data.peopleLiked.find(user=>user.userId===userIdStorage)){
            setLike(true)
          }else{setLike(false)}
        })
    },[like])

    const handleCommentSubmit = (e) => {
      e.preventDefault();
      fetch(`https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/inicio/posts/${id}/comments`,{
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify({"userId":userId,"username":usernameStorage,"message":comment,"timestamp":new Date(),"userImageUrl":userImageUrl,"feeling":feeling}),
                      withCredentials: "include"}).then(res=>res.json()).then(data=>{setComments([...comments,data.comment])
                                                                                     setCountComments(data.countComments)})
      setComment("")            
    }

    const handleRemoveComment = commentId =>{
      fetch(`https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/inicio/posts/${id}/comments/${commentId}`,{method: "DELETE",withCredentials: "include"})
              .then(res=>res.json()).then(data=>{setCountComments(data.countComments) 
                                                  setComments(comments.filter(comment => comment._id !== commentId))})
    }
    
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    const commentList = comments.map(comment => <Comment key={comment._id}
                                                         id = {comment._id}
                                                         userId = {comment.userId}
                                                         username={comment.username}
                                                         message={comment.message}
                                                         timestamp={comment.timestamp}
                                                         userImageUrl={comment.userImageUrl}
                                                         feeling={comment.feeling}
                                                         handleRemoveComment={handleRemoveComment}/>)
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
              <Button onClick={()=>handleRemovePost(id)} color="secondary">
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
        {countComments>0 &&
        <div className="post__commentInfo">{countComments} comentarios</div>}
        </div>
        <div className="post__options">
            <Button className="post__option" onClick={handleLike} color={like?"primary":""}>
              <ThumbUpIcon /> Me gusta
            </Button>
            
            <Button className="post__option" onClick={()=>setShowComments(!showcomments)} disabled={disabled}>
              <ChatBubbleOutlineIcon/> Comentar
            </Button>
            {/*userId!==userIdStorage &&
            <Button className="post__option">
              <NearMeIcon/> Compartir
            </Button>*/} 
        </div>
        {showcomments &&
        <div className="comments">
          {commentList}
        <div className="commentSender">
            <CommentAvatar src={userImageUrl} className="post__avatar"/>
            <form onSubmit={handleCommentSubmit}>
                <input 
                value={comment} 
                onChange={ (e) => setComment(e.target.value)} 
                className="commentSender" 
                placeholder={"Escribe un comentario..."}
                />
            </form>
          </div>
          </div>
            }
    </div>
    );
}