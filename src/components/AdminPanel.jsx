import React, { useState } from "react";
import axios from "axios";
import config from "../config/config";

import "../styles/AdminPanel.css"
function AdminPanel() {
    const [address, setAddress] = useState("");
    const [reservable, setReservable] = useState(false);
    const [subscribeable, setSubscribeable] = useState(false);
    const [temporary, setTemporary] = useState(false);
    const [capacity, setCapacity] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const parkingData = {
            address,
            reservable,
            subscribeable,
            temporary,
            capacity,
        };

        try {
            const response = await axios.post(`${config.apiBaseUrl}/parking`, parkingData);
            setSuccessMessage("Парковка успешно добавлена!");
            setAddress("");
            setReservable(false);
            setSubscribeable(false);
            setTemporary(false);
            setCapacity(0);
            console.log(response.data);
        } catch (error) {
            setErrorMessage(
                `Ошибка при добавлении парковки: ${
                    error.response?.data?.message || "Попробуйте снова"
                }`
            );
            console.error(error);
        }
    };

    return (
        <div className="admin-panel">
            <h1>Админ Панель: Добавить парковку</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                <div>
                    <label>Адрес парковки:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="Введите адрес"
                    />
                </div>
                <div>
                    <label>
                        Возможность брони:
                        <input
                            type="checkbox"
                            checked={reservable}
                            onChange={(e) => setReservable(e.target.checked)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Возможность абонемента:
                        <input
                            type="checkbox"
                            checked={subscribeable}
                            onChange={(e) => setSubscribeable(e.target.checked)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Возможность временной оплаты:
                        <input
                            type="checkbox"
                            checked={temporary}
                            onChange={(e) => setTemporary(e.target.checked)}
                        />
                    </label>
                </div>
                <div>
                    <label>Вместимость:</label>
                    <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        required
                        placeholder="Введите вместимость"
                        min="1"
                    />
                </div>
                <button type="submit">Добавить парковку</button>
            </form>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
}

export default AdminPanel;
