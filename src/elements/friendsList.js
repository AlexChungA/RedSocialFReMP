import React from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BadgeAvatar from './badgeavatar';
import Hidden from '@material-ui/core/Hidden';
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        margin: theme.spacing(2),
      },
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    blackColor:{
        color:'black',
    }
  }));

const FriendsList = (props) => {
    const classes = useStyles();
    return(
        <Grid item xs={3} className={classes.borderRight500}>
            {props.friends && (
            <List>
                {props.friends.map((friend) => 
                <Link to={`/chat/${friend.room}/${friend._id}`}>
                    {(props.friendId === friend._id) ? 
                    <ListItem button="true" key={friend._id} selected={true}> 
                        <ListItemIcon>
                            {friend.imageUrl ?  <BadgeAvatar feeling={friend.feeling} userImageUrl={friend.imageUrl} className="post__avatar"/>
                            : <BadgeAvatar feeling={friend.feeling} userImageUrl={friend.imageUrl} className="post__avatar"/>
                            }
                        </ListItemIcon>
                        <Hidden mdDown implementation="css">       
                        <ListItemText classes={{ primary:classes.blackColor }} primary={friend.name}>{friend.name}</ListItemText>
                        <ListItemText secondary="" align="right"></ListItemText>
                        </Hidden>
                    </ListItem>
                    : <ListItem button="true" key={friend._id} selected={false}>
                        <ListItemIcon>
                            {friend.imageUrl ? <BadgeAvatar feeling={friend.feeling} userImageUrl={friend.imageUrl} className="post__avatar"/>
                            : <BadgeAvatar feeling={friend.feeling} userImageUrl={friend.imageUrl} className="post__avatar"/>
                            }
                        </ListItemIcon>
                        <Hidden mdDown implementation="css">
                        <ListItemText classes={{ primary:classes.blackColor }} primary={friend.name}>{friend.name}</ListItemText>
                        <ListItemText secondary="" align="right"></ListItemText>
                        </Hidden>
                    </ListItem>
                    }
                </Link>
                )}
            </List>
            )}
        </Grid>
    )
}
export default FriendsList;