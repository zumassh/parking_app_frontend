import React, { useEffect, useState } from "react";
import axios from "axios";
import './styles/App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegForm from "./components/RegForm";
import MainPage from "./components/MainPage";

function App() {
    const [reg, setReg] = useState(false);
    const [phone, setPhone] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        const storedPhone = localStorage.getItem("phone");
        if (storedId) {
            setUserId(storedId);
            setPhone(storedPhone || "");
            setReg(true);
        }
    }, []); // Пустой массив зависимостей для запуска только при монтировании

    const handleRegistration = (id, phone) => {
        localStorage.setItem("userId", id);
        localStorage.setItem("phone", phone);
        setPhone(phone);
        setReg(true);
        setUserId(id);
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("phone");
        setReg(false);
        setUserId(null);
        setPhone("");
    };

    return (
        <div className="wrapper">
            <Header onLogout={handleLogout} />
            <main>
                {reg ? (
                    <MainPage userId={userId} phone={phone} />
                ) : (
                    <RegForm onRegister={handleRegistration} />
                )}
            </main>
            <Footer />
        </div>
    );
}

export default App;
