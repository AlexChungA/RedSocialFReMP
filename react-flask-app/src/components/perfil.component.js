import { Avatar } from '@material-ui/core'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Header from '../elements/header'
const ProfileAvatar = withStyles({
    root: {
      width: "140px",
      height: "140px",
      margin:"auto",
      marginTop:"20%",
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
            imageUrl:''
        }
    }

    componentDidMount(){
        const userId = this.props.match.params.userId
        fetch("/perfil/"+userId).then(res=>res.json())
        .then(data=>this.setState(
            {name:data.user.name,
             imageUrl:data.user.imageUrl}))
    }

    componentDidUpdate(prevProps){
        if (prevProps.match.params.userId !== this.props.match.params.userId){
            const userId = this.props.match.params.userId
            fetch("/perfil/"+userId).then(res=>res.json())
            .then(data=>this.setState(
                    {name:data.user.name,
                    imageUrl:data.user.imageUrl}))
        }
    }

    render(){
        if(!this.state.loggedIn){
            return <Redirect to = "/"/>
        }
        return(
            
            <div>
                <Header title="Perfil"/>
                <div className="inicio">
                    <div className="feed">
                        <div className="profile-info">
                            <ProfileAvatar src={this.state.imageUrl}/>
                            <h4>{this.state.name}</h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
