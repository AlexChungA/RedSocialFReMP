import React, { Component } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import Webcam from "react-webcam";
import * as IoIcons from 'react-icons/io5';

export default class Photo extends Component{
    constructor(props){
        super(props)
        const sessionStr = localStorage.getItem("session")
        const sessionJson = JSON.parse(sessionStr)
        let loggedIn
        if(sessionStr == null)
            loggedIn = false
        else
            loggedIn = sessionJson.loggedIn
        this.state={loggedIn}
        this.handleSubmit.bind()
    }
    setRef = webcam => {
        this.webcam = webcam;
      };
    handleSubmit=() =>{
        this.capture()
        this.props.history.push("inicio")
    }
    capture = async() => {
        const imageSrc = this.webcam.getScreenshot();
        const sessionStr = localStorage.getItem("session")
        const sessionJson = JSON.parse(sessionStr)
        const photo = {userId:sessionJson.user._id,photo:imageSrc}
        await fetch("https://cors-anywhere-redsocial.herokuapp.com/https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/photo",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(photo),
            withCredentials: "include"
        }).then(res=>res.json())
        .then(data=>{
            localStorage.setItem("session", JSON.stringify(data))
        })
      };

    render(){
        if(!this.state.loggedIn){
            return <Redirect to = "/"/>
        }
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
          };
        return(
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form className="cameraFrame" onSubmit={this.handleSubmit}>
                        <Webcam
                        audio={false}
                        height={"80%"}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        width={"100%"}
                        videoConstraints={videoConstraints}
                        />
                        <button type="submit" className="btn btn-light btn-circle btn-xl">
                        <IoIcons.IoCamera size="70px"/>
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}