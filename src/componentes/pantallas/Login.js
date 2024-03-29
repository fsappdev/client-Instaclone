import React, { useState, useContext } from "react";

import { useHistory } from "react-router-dom";
import M from "materialize-css";
import {UserContext} from '../../App'

const Login = () => {
  //
  const {state,dispatch} = useContext(UserContext)
  //
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();
  //
  const clear = () => {
    setEmail("");
    setPassword("");
  };
  //
  const PostearDatos = () => {
    if (// eslint-disable-next-line
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({
        html: "El email no es correcto",
        classes: "#d500f9 purple accent-3",
      });
      clear();
      return;
    }
    //dev endpoint: "https://instaclon-server.herokuapp.com/loguearse"
    //produccion endpoint:"https://instaclon-server.herokuapp.com/loguearse"  
    fetch("https://instaclon-server.herokuapp.com/loguearse", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), //por ES6 se "resumen" las claves/valor
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#d500f9 purple accent-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({type:"USER",payload:data.user})
          M.toast({ html: "Bienvenido/a!!", classes: "#2196f3 blue" });
          clear();
          history.push("/");
        }
      });
  };
  //

  return (
    <div className="container my-card">
      <div className="card auth-card input-field">
        <h2>QuiloGram</h2>
        <input
          placeholder="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button
          className="btn waves-effect waves-light blue darken-1"
          type="submit"
          onClick={() => PostearDatos()}
        >
          _Entrar!
        </button>
        <br />
      </div>
    </div>
  );
};

export default Login;
