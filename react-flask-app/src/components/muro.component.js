import React, { Component } from "react";
import Navbar from '../elements/navbar';
export default class Muro extends Component{
    render(){
        return(
            <div>
                <Navbar title="Inicio"/>
                <h3>Entraste a tu Muro!</h3>
            </div>
        )
    }
}