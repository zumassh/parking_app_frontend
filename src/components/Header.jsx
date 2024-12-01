import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ onLogout }) {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId"); // Получаем userId из localStorage

    const scrollToFooter = () => {
        const footerElement = document.getElementById("footer");
        if (footerElement) {
            footerElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    const goToAdminPanel = () => {
        navigate("/admin"); // Переход на страницу админки
    };

    return (
        <div className="header">
            <h1>Твоя парковка</h1>
            <nav>
                <button onClick={onLogout}>Выйти</button>
                {userId === "1" && ( // Проверяем, является ли пользователь администратором
                    
                    <button onClick={goToAdminPanel}>Админ-панель</button>
                    
                )}
                <button onClick={scrollToFooter}>Контакты</button>
            </nav>
        </div>
    );
}

export default Header;
