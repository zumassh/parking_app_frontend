import React, { useEffect, useState } from "react";
import axios from "axios";
import './styles/App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegForm from "./components/RegForm";
import MainPage from "./components/MainPage";

function App(props) {
    const [reg, setReg] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleRegistration = (id) => {
      setReg(true);
      setUserId(id);
    };

    const handleLogout = (id) => {
      setReg(false);
      setUserId(id);
  };

    return (
      <div>
        <Header onLogout={handleLogout}/>
        <main>
          {reg ? (
            <MainPage userId={userId} />
          ):(
            <RegForm onRegister={handleRegistration}/> 
          )}
        </main>
        <Footer />
      </div>
    );
};

export default App;