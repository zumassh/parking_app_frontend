import React, { useEffect, useState } from "react";
import './styles/App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegForm from "./components/RegForm";
import MainPage from "./components/MainPage";
import AdminPanel from "./components/AdminPanel"; // Импорт компонента админки
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
    const [reg, setReg] = useState(false);
    const [phone, setPhone] = useState("");
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); // Индикатор загрузки

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        const storedPhone = localStorage.getItem("phone");
        if (storedId) {
            setUserId(storedId);
            setPhone(storedPhone || "");
            setReg(true);
        }
        setLoading(false); // Завершение загрузки
    }, []); // Выполняется только при монтировании

    const handleRegistration = (id, phone) => {
        localStorage.setItem("userId", id);
        localStorage.setItem("phone", phone);
        setPhone(phone);
        setReg(true);
        setUserId(id);
    };

    const handleLogout = () => {
        if (window.confirm("Вы уверены, что хотите выйти?")) {
            localStorage.removeItem("userId");
            localStorage.removeItem("phone");
            setReg(false);
            setUserId(null);
            setPhone("");
        }
    };

    if (loading) {
        return <div>Загрузка...</div>; // Пока данные загружаются, показываем индикатор
    }

    return (
        <Router>
            <div className="wrapper">
                <Header onLogout={handleLogout} />
                <main>
                    <Routes>
                        {reg ? (
                            <>
                                <Route
                                    path="/"
                                    element={<MainPage userId={userId} phone={phone} />}
                                />
                                {String(userId) === "1" && (
                                    <Route path="/admin" element={<AdminPanel />} />
                                )}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </>
                        ) : (
                            <>
                                <Route
                                    path="/"
                                    element={<RegForm onRegister={handleRegistration} />}
                                />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </>
                        )}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
