import React,{useState,useEffect} from 'react';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FELIZ from "../static/FELIZ.png";
import ASUSTADO from "../static/ASUSTADO.png";
import DESPRECIO from "../static/DESPRECIO.png";
import DISGUSTADO from "../static/DISGUSTADO.png";
import MOLESTO from "../static/MOLESTO.png";
import NEUTRAL from "../static/NEUTRAL.png";
import SORPRENDIDO from "../static/SORPRENDIDO.png";
import TRISTE from "../static/TRISTE.png";

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function BadgeAvatar({feeling,userImageUrl}) {
  const classes = useStyles();
  const [src, setSrc] = useState("")

  useEffect(() => {  
  switch(feeling){
    case 'feliz':
      setSrc(FELIZ)
      break;
    case 'triste':
      setSrc(TRISTE)
      break;
    case 'disgustado':
      setSrc(DISGUSTADO)
      break;
    case 'molesto':
      setSrc(MOLESTO)
      break;
    case 'desprecio':
      setSrc(DESPRECIO)
      break;
    case 'asustado':
      setSrc(ASUSTADO)
      break;
    case 'neutral':
      setSrc(NEUTRAL)
      break;
    case 'sorprendido':
      setSrc(SORPRENDIDO)
      break;
    default:
      break;
  }},[feeling]);

  return (
    <div className={classes.root}>
      <Badge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={<SmallAvatar src={src} />}
      >
        <Avatar src={userImageUrl} />
      </Badge>
    </div>
  );
}