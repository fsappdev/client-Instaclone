import React,{useEffect, useState, useContext} from "react";
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom';

const UserProfile = () => {

   //////////////////////
  //
  const [userPerfil, setPerfil] = useState(null)
  const [mostrarSeguir,setMostrarSeguir] = useState(true)
  const {state, dispatch} = useContext(UserContext) 
  const {userid} = useParams()
  //
  useEffect(() => {
    fetch(`https://instaclon-server.herokuapp.com/user/${userid}`,{
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
    }
  })
  .then(res=>res.json())
  .then(result=>{
    console.log(result)
    setPerfil(result)
    //vamos a comprobar si el perfil visible en ESTE momento ya forma parte de nuestra lista de "seguidos"
   //const misDatosUser = JSON.parse(localStorage.getItem("user")) //info del user loggeado en ESTE Momento.
   //console.log({misDatosUser});
   //console.log({state});
   const {user}= result //info del user a quien se pretende seguir o no seguir.
   if(state && state.siguiendoa.includes(user._id)){
      setMostrarSeguir(false)
      //console.log('ya sigues a esta persona');
   }
   //else{console.log('todavia no sigues a esta persona')}
  })
  },[])
  
  //
  const seguirUser = () => {
     fetch(`https://instaclon-server.herokuapp.com/seguir`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({seguirId:userid})
    })
    .then(res=>res.json())
    .then(data=>{
      dispatch({
         type: "UPDATE",
         payload: {siguiendoa: data.siguiendoa, misseguidores:data.misseguidores},
        })
      localStorage.setItem("user",JSON.stringify(data)) 
      console.log(data)
      setPerfil((prevState) => {
         return{
            ...prevState,
            user: {
               ...prevState.user,
               misseguidores:[...prevState.user.misseguidores,data._id]
            } 
         }
      })
      setMostrarSeguir(false)
    })
  }
  //
  const noseguirUser = () => {
   fetch(`https://instaclon-server.herokuapp.com/noseguir`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify({noseguirId:userid})
  })
  .then(res=>res.json())
  .then(data=>{
    dispatch({
       type: "UPDATE",
       payload: {siguiendoa: data.siguiendoa, misseguidores:data.misseguidores},
      })
    localStorage.setItem("user",JSON.stringify(data)) 
    console.log(data)
    setPerfil((prevState) => {
       return{
          ...prevState,
          user: {
             ...prevState.user,
             misseguidores:[...prevState.user.misseguidores,data._id]
          } 
       }
    })
    setMostrarSeguir(true)
  })
}

  ///////////////////////

  return (
    <div className="center-align" style={{margin: "0px, auto"}}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "18px 0px",
          borderBottom: "1px Solid grey",
          
        }}
      >
        <div className="">
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            /* src="https://images.unsplash.com/photo-1602622021975-dacdcf516c43?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=769&q=80" */
            src={userPerfil ? userPerfil.user.fotolink : "cargando..."}
            alt=""
          />
        </div>
        <div >
         {/* { <h4>{state ? state.name : 'Cargando...'}</h4>} */}
         <h4>{userPerfil ? userPerfil.user.name : 'Cargando...'}</h4>
         <h6>{userPerfil ? userPerfil.user.email : 'Cargando...'}</h6>
            <div
               style={{
               display: "flex",
               justifyContent: "space-between",
               width: "110%",
               }}
            >
               <h6>{userPerfil ? " Publicaciones " + userPerfil.posts.length : "Cargando..."}</h6>
               <h6>{userPerfil ? `seguidor/es ${userPerfil.user.misseguidores.length}` : 'Cargando...'}</h6>
               <h6>{userPerfil ? `siguiendo a ${userPerfil.user.siguiendoa.length} ` : 'Cargando...'}</h6>
            </div>
            {
               mostrarSeguir ? 
               <button
                  style={{margin:"10px"}}
                  className="btn waves-effect waves-light blue darken-1"
                  type="submit"
                  onClick={() => seguirUser()}
               >
                  _Seguir!
               </button>
               :
               <button
                  style={{margin:"10px"}}
                  className="btn waves-effect waves-light #ff00d4 darken-1"
                  type="submit"
                  onClick={() => noseguirUser()}
               >
                  _Dejar de Seguir
               </button>
            }
            
            
        </div>
      </div>
      <div className="galeria">
      {
         userPerfil ? userPerfil.posts.map((item) => {
           return (
             <img
               className="item"
               key={item._id}
               src={item.foto}
               alt={item.titulo}
            />
           )
         }
         ) : <p>Aún no ha posteado...</p>
       }
        
        
      </div>
    </div>
  );
};

export default UserProfile;
