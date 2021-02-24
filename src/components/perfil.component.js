import { Avatar } from '@material-ui/core'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import ProfileTable from '../elements/profiletable';
import Navbar from '../elements/navbar';
import EditProfileButton from '../elements/editprofile';
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
            user:sessionJson.user,
            imageUrl:'',
            dates:[]
        }
        this.updateProfile.bind()
    }

    componentDidMount(){
        let userId = this.props.match.params.userId
        if(userId==="me")userId=this.state.user._id
        fetch("https://red-social-fc.herokuapp.com/perfil/"+userId).then(res=>res.json())
        .then(data=>{
        if(userId !==this.state.user._id){
        this.setState(
            {name:data.user.name,
             imageUrl:data.user.imageUrl})}
        else{
            this.setState({
                name:data.user.name,
                imageUrl:data.user.imageUrl,
                dates:data.dates
            })
        }
        })
    }

    componentDidUpdate(prevProps){
        if (prevProps.match.params.userId !== this.props.match.params.userId){
            const userId = this.props.match.params.userId
            fetch("https://red-social-fc.herokuapp.com/perfil/"+userId).then(res=>res.json())
            .then(data=>{
                if(userId !==this.state.user._id){
                this.setState(
                    {name:data.user.name,
                     imageUrl:data.user.imageUrl})}
                else{
                    this.setState({
                        name:data.user.name,
                        imageUrl:data.user.imageUrl,
                        dates:data.dates
                    })
                }
                })
        }
    }

    updateProfile = (labor,imageUrl) => {
        fetch(`https://red-social-fc.herokuapp.com/perfil/${this.state.user._id}`,
            {method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"labor":labor,"imageUrl":imageUrl}),
            withCredentials: "include"
            }).then(res=>res.json())
            .then(data=>{
                localStorage.setItem("session", JSON.stringify(data))
                this.setState({user:data.user,imageUrl:data.user.imageUrl})
            })
    }
    render(){
        if(!this.state.loggedIn){
            return <Redirect to = "/"/>
        }
        return(
            
            <div>
                <Navbar title="Perfil"/>
                <div className="inicio">
                    <div className="feed">
                        <ProfileAvatar src={this.state.imageUrl}/>
                        <h4>{this.state.name}</h4>
                        {this.props.match.params.userId===JSON.parse(localStorage.getItem("session")).user._id && 
                        <>
                        <EditProfileButton updateProfile={this.updateProfile} user={this.state.user}/>
                        <h6 id="h6">Tu actividad:</h6>
                        <ProfileTable dates={this.state.dates}/>
                        </>}                    
                    </div>
                </div>
            </div>
        )
    }
}
