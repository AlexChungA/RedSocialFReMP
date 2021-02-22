import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import { TextField } from '@material-ui/core';
import io from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));
//let socket = io.connect("https://redsocial-305406.web.app");
export default function EditProfileButton({updateProfile,user}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [labor, setLabor] = React.useState(user.labor);
  const [imageUrl, setImageUrl] = React.useState(user.imageUrl);

  const handleChangeLabor = (event) => {
    setLabor(event.target.value);
  };

  const handleChangeImageUrl = (event) => {
    setImageUrl(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    updateProfile(labor,imageUrl)
    fetch("/personas",{method:'GET'}).then(res=>res.json())
       // .then(data=>socket.volatile.emit('users',data.users))
    setOpen(false)
  }

  return (
    <div>
      <Button onClick={handleClickOpen}>Editar perfil</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Edita tu perfil:</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <TextField label="Url foto de perfil" variant="outlined" value={imageUrl} onChange={handleChangeImageUrl}/>
            </FormControl>
            <FormControl className={classes.formControl}>
                <TextField label="Ocupación" variant="outlined" value={labor} onChange={handleChangeLabor}/>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CANCELAR
          </Button>
          <Button onClick={handleUpdate} color="primary" disabled={(labor || imageUrl) ? "":true}>
            ACTUALIZAR
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}