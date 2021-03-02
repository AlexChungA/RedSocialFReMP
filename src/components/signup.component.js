import React, { Component } from "react";
import bcrypt from 'bcryptjs';
const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
  };
export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: "",
          lastname: "",
          email:"",
          password:"",
          errors: {
            name: '',
            lastname:'',
            email: '',
            password: ''
          },
          message:"",
          classStyle:""
        };
      }

      handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let errors = this.state.errors;

        switch (name) {
        case 'name': 
            errors.name = 
            value.length < 1
                ? 'Porfavor ingrese sus nombres.'
                : '';
            break;
        case 'lastname': 
            errors.lastname = 
            value.length < 1
                ? 'Porfavor ingrese sus apellidos.'
                : '';
            break;
        case 'email': 
            errors.email = 
            validEmailRegex.test(value)
                ? ''
                : 'Por favor ingrese un correo electrónico válido.';
            break;
        case 'password': 
            errors.password = 
            value.length < 6
                ? 'La contraseña debe tener por lo menos 6 caracteres.'
                : '';
            break;
        default:
            break;
        }
        this.setState({
            errors,[name]: value
        });
    }

      handleSubmit = async event => {
        event.preventDefault();
        
        const hash = bcrypt.hashSync(this.state.password,12)
        const new_user = {name:this.state.name+" "+this.state.lastname, email:this.state.email, password:hash, labor:"", imageUrl:"",friends:[]};
        await fetch("https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/sign-up",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(new_user),
            withCredentials: "include"
        }).then(res => res.json())
        .then(data => {
            this.setState({
                name: "",
                lastname: "",
                email:"",
                password:"",
            })
            if(data){
                this.setState({ message:data.message,
                                classStyle:data.classStyle})
            }
        })
        if(validateForm(this.state.errors) && this.state.classStyle!=="alert alert-danger"){
            this.props.history.push("/")
        }
      }

    render() {
        const {errors} = this.state;
        return (
            <div className="auth-wrapper">
            <div className="auth-inner">
            <form onSubmit={this.handleSubmit}>
                <h3>Registrarte</h3>
                <div className="name">
                    <input type="text" name="name" value={this.state.name} onChange={this.handleInputChange} className="form-control" placeholder="Nombres" required/>
                    {errors.name.length > 0 && 
                    <span className='error'>{errors.name}</span>}
                </div>
                <div className="lastname">
                    <input type="text" name="lastname" value={this.state.lastname} onChange={this.handleInputChange} className="form-control" placeholder="Apellidos" required/>
                    {errors.lastname.length > 0 && 
                    <span className='error'>{errors.lastname}</span>}
                </div>
                <div className="email">
                    <input type="email" name="email" value={this.state.email} onChange={this.handleInputChange} className="form-control" placeholder="Correo electrónico" required/>
                    {errors.email.length > 0 && 
                    <span className='error'>{errors.email}</span>}
                </div>
                <div className="password">
                    <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} minLength="6" className="form-control" placeholder="Ingrese una contraseña" required/>
                    {errors.password.length > 0 && 
                    <span className='error'>{errors.password}</span>}
                </div>
                <button type="submit" className="btn btn-primary btn-block">Registrarte</button>
                <p className="forgot-password text-right">
                    Ya estoy registrado <a href="/">¿iniciar sesión?</a>
                </p>
                {validateForm(this.state.errors) && <div name="success" className={this.state.classStyle} role="alert">
                    {this.state.message}
                </div>}
            </form>
            </div>
            </div>
        );
    }
}