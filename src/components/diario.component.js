import React, { Component } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import Navbar from "../elements/navbar";
import FormToDo from "../elements/formtodo";
import TaskList from "../elements/tasklist";
import styles from './diario.module.css'

export default class Diario extends Component{
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
      task:{},
      date: new Date().toLocaleDateString('ja', {
        year:  'numeric',
        month: '2-digit',
        day:   '2-digit'
    }).replace(/\//g, '-')
    }
    this.handleAddItem.bind()
    this.handleRemoveItem.bind()
    this.handleUpdateItem.bind()
  }

  handleAddItem = addItem => {
    fetch("https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/diario/tareas/",{
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(addItem),
      withCredentials: "include"
  }).then(res=>res.json()).then(data=>this.setState({
    task: data.task
  }))
  
};

handleRemoveItem= id =>{
  const sessionStr = localStorage.getItem("session")
  const sessionJson = JSON.parse(sessionStr)
  const userId = sessionJson.user._id
  fetch('https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/diario/tareas/'+userId+'/'+id,{method:'DELETE'})
  .then(res=>res.json()).then(data=>this.setState({
    task: data.task
  }))
}

handleUpdateItem=id=>{
  const sessionStr = localStorage.getItem("session")
  const sessionJson = JSON.parse(sessionStr)
  const userId = sessionJson.user._id
  fetch('https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/diario/tareas/'+userId+'/'+id,{method:'PUT'})
  .then(res=>res.json()).then(data=>this.setState({
    task: data.task
  }))
}

    render(){
      if(!this.state.loggedIn){
        return <Redirect to = "/"/>
    }
    let title,placeholder,done
      if(new Date().getHours()<12){
        title="¿Qué puedo hacer hoy?"
        placeholder="Añade una tarea..."
        done=false
      }else if(new Date().getHours()<19){
        title="¿Qué logré hacer hoy?"
        placeholder="Agregue una tarea completada..."
        done=true
      }else{
        title="¿Qué podría hacer mañana?"
        placeholder="Agregue tareas para mañana..."
        done=false
      }

        return(
          <>
            <Navbar title="Diario"/>
            <div className="inicio">
              <div className={styles.journal}>
                <div className = {styles.todayLabel}>Hoy</div>
                
                <div className={styles.question}>{title}</div>
                <FormToDo handleAddItem={this.handleAddItem} placeholder={placeholder} styles={styles} done={done} date={this.state.date}/>
                <TaskList handleUpdateItem={this.handleUpdateItem} handleRemoveItem={this.handleRemoveItem} task={this.state.task} date={this.state.date} styles={styles}/>
              </div>
            </div>
          </>
        )
    }
}
