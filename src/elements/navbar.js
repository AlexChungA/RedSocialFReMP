import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { IconContext } from 'react-icons';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import { SidebarData } from './sidebardata';
import { Link } from 'react-router-dom';
import './navbar.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      fontSize: "22px"
    },
    backgroundColor:"#73C0B0",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor:"#73C0B0"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title:{
    textDecoration: "none",
    color: "#000000",
    fontSize: "22px",
    height: "100%",
    padding: "0px 6px",
    marginTop: "6px",
  },
  navText: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding:"8px 0px 8px 16px",
    listStyle: "none",
    height: "60px",
  }
}));

const ProfileAvatar = withStyles({
    root: {
      width: "125px",
      height: "125px",
      margin:"auto",
      marginTop:"20%",
      marginBottom:"2%"
    },
  })(Avatar);

function Navbar(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const sessionStr = localStorage.getItem("session")
  const sessionJson = JSON.parse(sessionStr)
  const user = sessionJson.user

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <ProfileAvatar src={user.imageUrl}/>
      {user.labor && <h4>{user.labor}</h4>}
      <Divider />
      <List>
      {SidebarData.map((item,index) => {
                    return(
                        <li key={index} className={item.cName}>
                            <Link to={item.path} onClick={item.onClick}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )
                    })}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
        <IconContext.Provider value={{ color: '#000' }}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          </IconContext.Provider>
          <Typography noWrap>
          <span className={classes.title}>{props.title}</span>
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default Navbar;