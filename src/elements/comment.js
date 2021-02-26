import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Tooltip from 'react-responsive-ui/commonjs/Tooltip'
import ReactTimeAgo from 'react-time-ago'
import BadgeAvatar from "./badgeavatar";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
    close: {
      marginInlineStart:"auto",
      padding:0,
      marginBottom:"auto"
    },
    timestamp: {
        fontSize: "small",
        color: "gray",
        marginLeft:"60px"
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

export default function Comment({id,userId,username,message,timestamp,userImageUrl,feeling,handleRemoveComment}){
    const classes = useStyles();
    const sessionStr = localStorage.getItem("session")
    const sessionJson = JSON.parse(sessionStr)
    const userIdStorage = sessionJson.user._id
    const [open, setOpen] = React.useState(false);  
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    return(
        <div className="comment">
            <div className="comment__content">
                <div><BadgeAvatar feeling={feeling} userImageUrl={userImageUrl} className="post__avatar"/></div>
                <div className="comment__info">
                <a href={`/perfil/${userId}`}>{username}</a>
                <p>{message}</p></div> 
                {userId===userIdStorage &&
                <>
                <IconButton aria-label="delete" className={classes.close} onClick={handleClickOpen}>
                    <CloseIcon />
                </IconButton>
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Eliminar comentario</DialogTitle>
                <DialogContent>
                ¿Está seguro(a) que desea eliminar este comentario? Luego de eliminado, no podrá ser recuperado.
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    CANCELAR
                </Button>
                <Button onClick={()=>handleRemoveComment(id)} color="secondary">
                    ELIMINAR
                </Button>
                </DialogActions>
            </Dialog></>
                }
            </div>
            <ReactTimeAgo className={classes.timestamp} date={timestamp} locale="es-PE" wrapperComponent={TooltipContainer} tooltip={false}/>
           
        </div>
    )
}