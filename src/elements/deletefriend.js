import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import io from "socket.io-client";

//let socket = io.connect("https://redsocial-305406.web.app");
export default function DeleteFriendButton({remove_friend,friendId}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemove = () => {
    remove_friend(friendId)
    //fetch("https://red-social-fc.herokuapp.com/personas",{method:'GET'}).then(res=>res.json())
       // .then(data=>socket.volatile.emit('users',data.users))
    setOpen(false)
  }

  return (
    <div>
      <Button onClick={handleClickOpen} color="secondary">Eliminar de mis amigos</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Eliminar amigo.</DialogTitle>
        <DialogContent>
          ¿Está seguro(a) que desea eliminar de sus amigos?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CANCELAR
          </Button>
          <Button onClick={handleRemove} color="primary">
            CONFIRMAR
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}