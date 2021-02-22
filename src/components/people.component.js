import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Navbar from '../elements/navbar'
import UserList from '../elements/userlist'
import io from "socket.io-client";

export default class People extends Component {
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
            user:{},
            users:[]
        }
        this.add_friend.bind()
        this.remove_friend.bind()
    }

    componentDidMount(){
        fetch("https://red-social-fc.herokuapp.com/personas",{method:'GET'}).then(res=>res.json())
        .then(data=>this.setState({users:data.users}))
    }

    add_friend = async(friend)=>{
        const sessionStr = localStorage.getItem("session")
        const sessionJson = JSON.parse(sessionStr)
        const userId = sessionJson.user._id
        /*let socket = io.connect("https://redsocial-305406.web.app", {
            withCredentials: true,
          });*/
        await fetch(`https://red-social-fc.herokuapp.com/users/${userId}/friends/`,{
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
        fetch("https://red-social-fc.herokuapp.com/personas",{method:'GET'}).then(res=>res.json())
        .then(data => {this.setState({users:data.users})
                       /*socket.volatile.emit('users',data.users)*/})
      }
    
    remove_friend =async (friendId) =>{
        const sessionStr = localStorage.getItem("session")
        const sessionJson = JSON.parse(sessionStr)
        const userId = sessionJson.user._id
        /*let socket = io.connect("https://redsocial-305406.web.app", {
            withCredentials: true,
          });*/
        await fetch(`https://red-social-fc.herokuapp.com/users/${userId}/friends/${friendId}/`,{method: "DELETE"}).then(res=>res.json())
        .then(data => {
            localStorage.setItem("session", JSON.stringify(data))
            this.setState({user:{}})
        })
        fetch("https://red-social-fc.herokuapp.com/personas",{method:'GET'}).then(res=>res.json())
        .then(data => {this.setState({users:data.users})
                      /* socket.volatile.emit('users',data.users)*/})
    }

    render() {
        if(!this.state.loggedIn){
            return <Redirect to = "/"/>
        }
        return (
            <div>
                <Navbar title="Personas"/>
                <div className="inicio">
                    <div className="feed">
                        <UserList user={this.state.user} users={this.state.users} add_friend={this.add_friend} remove_friend={this.remove_friend}/>
                    </div>
                </div>
            </div>
        )
    }
}
