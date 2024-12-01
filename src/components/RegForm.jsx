import React, { useState } from "react";
import "../styles/RegForm.css";
import axios from "axios";

function RegForm({ onRegister }) {
    const [view, setView] = useState("login");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);

    const isValidPhoneNumber = (value) => /^[0-9]{11}$/.test(value);

    const handleRegistration = async (e) => {
        e.preventDefault();

        const data = {
            phoneNumber: phone,
            password: password,
        };

        try {
            const response = await axios.post("http://localhost:8080/users/registration", data);
            const id = response.data.id;
            localStorage.setItem("userId", id)
            setUserId(id);
            setMessage(`Успех: ${response.data.message || "Вход выполнен успешно"}`);
            onRegister(id, phone);
        } 
        catch (error) {
            if (error.response) {
                setMessage(`Ошибка: ${error.response.data.message || "Некорректные данные"}`);
            } else {
                setMessage(`Ошибка соединения: ${error.message}`);
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = {
            phoneNumber: phone,
            password: password,
        };

        try {
            const response = await axios.post("http://localhost:8080/users/login", data);
            const id = response.data.id;
            setUserId(id);
            setMessage(`${response.data.message || "Вход выполнен успешно"}`);
            localStorage.setItem("userId", id)
            console.log("Ответ сервера:", response.data);
            onRegister(id, phone);
        } 
        catch (error) {
            if (error.response) {
                setMessage(`Ошибка: ${error.response.data.message || "Некорректные данные"}`);
            } else {
                setMessage(`Ошибка соединения: ${error.message}`);
            }
        }
    };

    const renderForm = () => {
        if (view === "register") {
            return (
                <div className="form">
                    <b>Регистрация</b>
                    <form onSubmit={handleRegistration}>
                        <input 
                            type="tel" 
                            name="telephoneNumber" 
                            placeholder="71234567890" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={isValidPhoneNumber(phone) ? "valid" : "invalid"}
                        />
                        {!isValidPhoneNumber(phone) && phone && (
                <p style={{ color: "red", fontSize: "14px" }}>Введите корректный номер (11 цифр)</p>
            )}
                        <br />
                        <input
                            type="password"
                            placeholder="введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <br />
                        <input
                            type="password"
                            placeholder="повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <br />
                        {password !== confirmPassword && confirmPassword && (
                            <p style={{ color: "red", fontSize: "16px" }}>Пароли не совпадают!</p>
                        )}
                        {message && <p style={{ color: "red", fontSize: "14px" }}>{message}</p>}
                        <button type="submit" disabled={password !== confirmPassword || !password || !phone || !isValidPhoneNumber(phone)}>
                            Зарегистрироваться
                        </button>
                    </form>
                </div>
            );
        } else if (view === "login") {
            return (
                <div className="form">
                    <b>Вход</b>
                    <form onSubmit={handleLogin}>
                        <input 
                            type="tel" 
                            name="telephoneNumber" 
                            placeholder="71234567890" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={isValidPhoneNumber(phone) ? "valid" : "invalid"}
                        />
                        {!isValidPhoneNumber(phone) && phone && (
                <p style={{ color: "red", fontSize: "14px" }}>Введите корректный номер (11 цифр)</p>
            )}
                        <br />
                        <input 
                        type="password" 
                        placeholder="введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                        <br />
                        {message && <p style={{ color: "red", fontSize: "14px" }}>{message}</p>}
                        <button type="submit" disabled={!password || !phone || !isValidPhoneNumber(phone)} >Войти</button>
                    </form>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="regForm-wrapper">
            <p>Вы ещё не вошли в систему. Зарегистрируйтесь или войдите, чтобы продолжить.</p>
            <div className="regForm-innerWrapper">
                <button onClick={() => setView("login")}>Вход</button>
                <button onClick={() => setView("register")}>Регистрация</button>
            </div>
            {renderForm()}
        </div>
    );
}

export default RegForm;
