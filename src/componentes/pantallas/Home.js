import React, {useState, useEffect, useContext, Fragment} from "react";
import {UserContext} from '../../App'
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

const Home = () => {
  const [data, setData] = useState([])
  const {state, dispatch}= useContext(UserContext)

  let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("jwt")}`)
    myHeaders.set('Content-Type', 'application/json');
  //

  useEffect(() => {


    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow' 
    };

    //dev endpoint: "https://instaclon-server.herokuapp.com/todoslosposts"
    //produccion endpoint:"https://instaclon-server.herokuapp.com/todoslosposts"  
    fetch("https://instaclon-server.herokuapp.com/todoslosposts", requestOptions)
      .then(res=>res.json())
      .then(result => {
        console.info({'todos los posts>': result})
        setData(result)
      })
      .catch(error => console.log('error', error));
  },[])

  //
  const likePost = (id) => {
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify({postId: id}),
      headers: myHeaders,
      redirect: 'follow' 
    };

    //dev endpoint: "https://instaclon-server.herokuapp.com/like"
    //produccion endpoint:"https://instaclon-server.herokuapp.com/like" 
    fetch("https://instaclon-server.herokuapp.com/like",requestOptions)
    .then(res=>res.json())
    .then(result => {
      //console.log(result)
        const newData = data.map(item=>{
          // eslint-disable-next-line
          if(item._id==result._id){
              return result
          }else{
              return item
          }
      })
      setData(newData)
      })
      .catch(error => console.log('error', error));
  }
  
  const disLikePost = (id) => {
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify({postId: id}),
      headers: myHeaders,
      redirect: 'follow' 
    };
    fetch("https://instaclon-server.herokuapp.com/dislike",requestOptions)
    .then(res=>res.json())
    .then(result => {
      //console.log(result)
        const newData = data.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
      })
      setData(newData)
    })
    .catch(error => console.log('error', error));
  }

  const comentar = (text, postId) => {
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify({text, postId}),
      headers: myHeaders
    }
    fetch("https://instaclon-server.herokuapp.com/comentar", requestOptions)
    .then(res=>res.json())
    .then(result=>{
      //console.log(result)
      const newData = data.map(item=>{
        if(item._id==result._id){
            return result
        }else{
            return item
        }
      })
      setData(newData)
    })
    .catch(err=>console.log('error', err))
  }

  const desComentar = (text, postId) => {
    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify({text, postId}),
      headers: myHeaders
    }
    fetch("https://instaclon-server.herokuapp.com/descomentar", requestOptions)
    .then(res=>res.json())
    .then(result=>{
      console.log(result)
      const newData = data.map(item=>{
        if(item._id==result._id){
            return result
        }else{
            return item
        }
      })
      setData(newData)
    })
    .catch(err=>console.log('error', err))
  }

  const deletePost = (postId) => {
    const requestOptions = {
      method: "delete",
      body: JSON.stringify({postId}),
      headers: myHeaders
    }
    fetch(`https://instaclon-server.herokuapp.com/delete/${postId}`, requestOptions)
    .then(res=>res.json())
    .then(result=>{
      console.log(result);
      const newData = data.filter(item=>item._id !== result._id)
      setData(newData)
    })
    .catch(error=>console.log('error',error))
  }

    ///////
  return (
    <div className="home">
      {
        data ? data.map(item=>{
          return(
            
            <div key={item._id} className="card home-card">
            {/* console.log(item) */}
                {/* <div className="row" style={{display: "flex", flexwrap: "wrap", justifycontent: "space-around"}}        >
                
                </div> */}
                { /* QUIEN POSTEA Y BTN DELETE */}
                <h6 className="my-10">

                  <small>Creado por: </small> 

                  <Link 
                    style={{fontWeight:"bold"}}
                    to={item.posteadoPor._id !== state._id ?  "/perfil/"+item.posteadoPor._id : "/perfil"}>
                    {item.posteadoPor.name}
                  </Link>

                  {item.posteadoPor._id != state._id ? 
                    <Fragment>                    
                      <a style={{ color: "green",float:"right" }} 
                      className="btn-floating btn-small"
                      data-for="agregar" 
                      data-tip
                      >
                      <i className="material-icons">add</i>
                      </a>
                      <ReactTooltip id="agregar" place="right" effect="float" type="info">
                        Agregar el post a MI lista
                      </ReactTooltip>
                      {/* <small style={{float: "right"}}>eliminar post</small> */}
                    </Fragment> : null }

                  {item.posteadoPor._id == state._id ? 
                    <Fragment>                    
                      <i onClick={()=>{deletePost(item._id)}} style={{ color: "red",float:"right" }} className="material-icons pointer">
                        delete
                      </i>
                      <small style={{float: "right"}}>eliminar post</small>
                    </Fragment> : null }
                </h6>
                {/* card */}
                <div className="card-image">
                  { 
                    item.extension === 'jpg' || item.extension === 'png' ? <img
                    src={item.foto}
                    alt={item.titulo}
                    
                  /> : <p>El archivo no es una imagen</p>}
                </div>
              <div className="card-content">
                <i style={{ color: "red" }} className="material-icons pointer">
                  favorite
                </i>
                <i style={{ color: "green" }} className="material-icons pointer">
                  save
                </i>     
                {item.likes.includes(state._id) ? <i onClick={()=>{disLikePost(item._id)}}className="material-icons pointer">thumb_down</i> : <i onClick={()=>{likePost(item._id)}}className="material-icons pointer">thumb_up</i> }
                
                <h6>{item.likes ? item.likes.length : 0} Likes </h6>
                <h5>{item.titulo}</h5>
                <h6>{item.cuerpo}</h6>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  //console.log(e.target[0].value)
                  comentar(e.target[0].value,item._id)
                }}>
                  <input type="text" placeholder="agrega un comentario" />
                </form>

                {
                  item.comentarios ? item.comentarios.map(comentario => {
                    return (
                      <h6 key={comentario._id}>
                      <span style={{fontWeight:"bold"}}>
                        {comentario.posteadoPor.name}  
                      </span>
                      _dijo: {comentario.text}
                      {comentario.posteadoPor._id == state._id || item.posteadoPor._id == state._id ? 
                        <Fragment>
                          <i onClick={()=>{desComentar(comentario.text,item._id)}} 
                             style={{ color: "red",float:"right" }} 
                             className="material-icons pointer"
                          >
                            delete
                          </i>
                          {/* <small style={{float: "right"}}>borrar comentario</small> */}
                        </Fragment> : null }
                      </h6>
                    )
                  }) : null
                }
                
              </div>
            </div>
          )
        }) : <h3>...Aun no se ha creado contenido</h3>
      }
    </div>
  );
};

export default Home;
