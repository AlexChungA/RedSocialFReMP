import React, { Component } from "react";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

export default class RecoverPassword extends Component {
    constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors:{email:""}
    };

  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let errors = this.state.errors;

    switch (name) {
      case 'email': 
        errors.email = 
          validEmailRegex.test(value)
            ? ''
            : 'Debe ingresar un correo electrónico válido.';
        break;
      default:
        break;
    }
    this.setState({
      errors,
      [name]: value
    });
  }
  
  handleSubmit = async event => {
    event.preventDefault();
    const user = {email:this.state.email, password:this.state.password};
    await fetch("https://cors-anywhere-redsocial.herokuapp.com/https://red-social-fc.herokuapp.com/recoverpassword",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
  }

  render() {
    const {errors} = this.state;
        return (
          <div className="auth-wrapper">
            <div className="auth-inner">
          <form onSubmit={this.handleSubmit}>
                <h3>Ingrese su correo electrónico para recuperar su contraseña</h3>
              
                <input type="email" name="email" value={this.state.email} onChange={this.handleInputChange} className="form-control" placeholder="Correo electrónico" required/>
                {errors.email.length > 0 && 
                <span className='error'>{errors.email}</span>}
                <button type="submit" className="btn btn-primary btn-block">Enviar</button>
                <a type="button" className="btn btn-light btn-block" href="/">Volver</a>
            </form>
            </div>
            </div>
        );
    }
}