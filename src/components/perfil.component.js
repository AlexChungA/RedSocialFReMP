import { Avatar, Button } from '@material-ui/core'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import ProfileTable from '../elements/profiletable';
import Navbar from '../elements/navbar';
import EditProfileButton from '../elements/editprofile';
import DeleteFriendButton from '../elements/deletefriend';
import io from "socket.io-client";
const ProfileAvatar = withStyles({
    root: {
      width: "140px",
      height: "140px",
      margin:"auto",
      marginTop:"5%",
      marginBottom:"2%"
    },
  })(Avatar);
export default class Perfil extends Component {
    constructor(props){
        super(props)
        const sessionStr = localStorage.getItem("session")
        const sessionJson = JSON.parse(sessionStr)
        let loggedIn
            if(sessionStr == null)
                loggedIn = false
            else
                loggedIn = sessionJson.loggedIn

        this.state = {
            loggedIn,
            name:'',
            labor:'',
            user:sessionJson.user,
            imageUrl:'',
            dates:[]
        }
        this.update_profile.bind()
        this.add_friend.bind()
        this.remove_friend.bind()
        this.routeChange.bind()
    }

    componentDidMount(){
        let userId = this.props.match.params.userId
        if(userId==="me")userId=this.state.user._id
        fetch("https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/perfil/"+userId).then(res=>res.json())
        .then(data=>{
        if(userId !==this.state.user._id){
        this.setState(
            {name:data.user.name,
             labor:data.user.labor,
             imageUrl:data.user.imageUrl})}
        else{
            this.setState({
                name:data.user.name,
                labor:data.user.labor,
                imageUrl:data.user.imageUrl,
                dates:data.dates
            })
        }
        })
    }

    componentDidUpdate(prevProps){
        if (prevProps.match.params.userId !== this.props.match.params.userId){
            let userId = this.props.match.params.userId
            if(userId==="me")userId=this.state.user._id
            fetch("https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/perfil/"+userId).then(res=>res.json())
            .then(data=>{
                if(userId !==this.state.user._id){
                this.setState(
                    {name:data.user.name,
                     labor:data.user.labor,
                     imageUrl:data.user.imageUrl})}
                else{
                    this.setState({
                        name:data.user.name,
                        labor:data.user.labor,
                        imageUrl:data.user.imageUrl,
                        dates:data.dates
                    })
                }
                })
        }
    }

    update_profile = (labor,imageUrl) => {
        fetch(`https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/perfil/${this.state.user._id}`,
            {method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"labor":labor,"imageUrl":imageUrl}),
            withCredentials: "include"
            }).then(res=>res.json())
            .then(data=>{
                localStorage.setItem("session", JSON.stringify(data))
                this.setState({user:data.user,labor:data.user.labor,imageUrl:data.user.imageUrl})
            })
    }

    add_friend = async(friend)=>{
        const sessionStr = localStorage.getItem("session")
        const sessionJson = JSON.parse(sessionStr)
        const userId = sessionJson.user._id
        let socket = io.connect("https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com", {
            withCredentials: true,
          });
        await fetch(`https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/users/${userId}/friends/`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(friend),
            withCredentials: "include"
        }).then(res=>res.json())
        .then(data => {
            localStorage.setItem("session", JSON.stringify(data))
            this.setState({user:data.user})
        })
        fetch("https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/personas",{method:'GET'}).then(res=>res.json())
        .then(data => socket.volatile.emit('users',data.users))
      }

    remove_friend =async (friendId) =>{
        const sessionStr = localStorage.getItem("session")
        const sessionJson = JSON.parse(sessionStr)
        const userId = sessionJson.user._id
        let socket = io.connect("https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com", {
            withCredentials: true,
          });
        await fetch(`https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/users/${userId}/friends/${friendId}/`,{method: "DELETE"}).then(res=>res.json())
        .then(data => {
            localStorage.setItem("session", JSON.stringify(data))
            this.setState({user:data.user})
        })
        fetch("https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/personas",{method:'GET'}).then(res=>res.json())
        .then(data =>  socket.volatile.emit('users',data.users))
    }

    routeChange = (item) =>{ 
        let path = `/chat/${item.room}/${item.id}`;
        this.props.history.push(path); 
    }

    render(){
        if(!this.state.loggedIn){
            return <Redirect to = "/"/>
        }
        let socket = io.connect("https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com", {
            withCredentials: true,
          });
        setInterval(()=>{
            socket.volatile.emit('keep_alive');
            console.log('Keeping alive');
          },30000);
        return(
            
            <div>
                <Navbar title="Perfil"/>
                <div className="inicio">
                    <div className="feed">
                        <ProfileAvatar src={this.state.imageUrl}/>
                        <h4>{this.state.name}</h4>
                        {this.state.user.labor &&<h6>{this.state.labor}</h6>}
                        {(this.props.match.params.userId===JSON.parse(localStorage.getItem("session")).user._id || this.props.match.params.userId==="me") ? 
                        <>
                        <EditProfileButton update_profile={this.update_profile} user={this.state.user}/>
                        <h6 id="h6">Tu actividad:</h6>
                        <ProfileTable dates={this.state.dates}/>
                        </>
                        : JSON.parse(localStorage.getItem("session")).user.friends.find(friend=>friend.id===this.props.match.params.userId) ?
                        JSON.parse(localStorage.getItem("session")).user.friends.find(friend=>friend.id===this.props.match.params.userId).status==="amigos" ?
                        <div className="options">
                        <Button onClick={() => this.routeChange(JSON.parse(localStorage.getItem("session")).user.friends.find(friend=>friend.id===this.props.match.params.userId))}>Mensaje</Button>
                        <DeleteFriendButton remove_friend={this.remove_friend} friendId={this.props.match.params.userId}/>
                        </div>
                        :JSON.parse(localStorage.getItem("session")).user.friends.find(friend=>friend.id===this.props.match.params.userId).status==="pendiente"?
                        <Button onClick={()=>this.remove_friend(this.props.match.params.userId)} color="secondary">Cancelar solicitud</Button>
                        :JSON.parse(localStorage.getItem("session")).user.friends.find(friend=>friend.id===this.props.match.params.userId).status==="por confirmar"?
                        <div className="options">
                        <Button onClick={()=>this.add_friend({id:this.props.match.params.userId,status:"amigos"})}>Confirmar solicitud de amistad</Button>
                        <Button onClick={()=>this.remove_friend(this.props.match.params.userId)} color="secondary">Eliminar solicitud de amistad</Button>
                        </div>
                        :
                        null
                        :<Button onClick={()=>this.add_friend({id:this.props.match.params.userId,status:"pendiente"})}>Enviar solicitud de amistad</Button>
                        }                      
                    </div>
                </div>
            </div>
        )
    }
}
