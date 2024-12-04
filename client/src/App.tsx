import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginComponent from "./components/LoginComponent";
import { useEffect } from "react";
import { socket } from "./socket";

function App(): JSX.Element {


  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Server')
    })
  },[])

  return (

    <Routes>
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/" element={<HomePage />} />
    </Routes>

  );
}

export default App;
