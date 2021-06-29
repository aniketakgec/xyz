import React, { useState, useEffect ,useRef} from 'react';
import io from 'socket.io-client';
import {TextField,TextareaAutosize} from '@material-ui/core/';
import './App.css';


function App() {
  const [state, setState] = useState({ message: '', name: '' });
  const [chat, setChat] = useState([]);


  const socketRef = useRef()

  useEffect(
    ()=>{

    socketRef.current=io.connect("http://localhost:4000")
     socketRef.current.on('message',({name,message})=>{
      setChat([...chat,{name,message}])
    })

    return ()=> socketRef.current.disconnect();
  },
  [chat]

  )

  const onTextChange=(e)=>{
    setState({...state,[e.target.name]:e.target.value})
  }

  const renderChat=()=>{
    
    return chat.map( ({name,message},index)  => (
      <div key={index}>
          <h3>
           
              {name}: <span>{message}</span>
          </h3>
      </div>
    ))
}

  

  const onMessageSubmit=(e)=>{
   
   const {name,message}=state;
   if(name.length==0)
   {
     alert("Enter Name first")
     e.preventDefault();
     return;
   }
   socketRef.current.emit('message',{name,message})
   e.preventDefault()
   setState({message:'',name})
  }






  return (
    <div className="card container">
      <form onSubmit={onMessageSubmit} >
        <h1>Messanger</h1>
        <div className="name-field">
          <TextField 
              name="name"
              onChange={e => onTextChange(e)} 
              value={state.name} 
              label="Name"
           />
        </div>

        <div>
          <TextareaAutosize
              name="message"
              
              onChange={e => onTextChange(e)} 
              value={state.message} 
              id="outlined-multiline-static"
              variant="outlined"
              label="Message"
           />
        </div>

        <button>Send Message</button>

      </form>

     <pre className="render-chat">
       <h1>Chat Log</h1>
       {renderChat()}

     </pre>
    </div>
  );
}

export default App;
