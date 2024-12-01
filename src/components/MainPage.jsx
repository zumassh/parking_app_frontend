import React, { useEffect, useState, useNavigate } from "react";
import axios from "axios";
import '../styles/MainPage.css';
import Select from 'react-select';
import Option from './Option';
import config from '../config/config'
function MainPage({ userId, phone }) {
    const [userAuto, setUserAuto] = useState([]);
    const [error, setError] = useState("");
    const [addCar, setAddCar] = useState(false);
    const [carName, setCarName] = useState("");
    const [carNumber, setCarNumber] = useState("");
    const [wallet, setWallet] = useState(0);
    const [money, setMoney] = useState(0);
    const [reservable, setReservable] = useState(false);
    const [subscribeable, setSubscribeable] = useState(false);
    const [temporary, setTemporary] = useState(false);
    const [parkings, setParkings] = useState([]);
    const [filteredParkings, setFilteredParkings] = useState([]);
    const [selectedParking, setSelectedParking] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [timers, setTimers] = useState({});
    useEffect(() => {
        console.log("Компонент монтируется...");
        userId = localStorage.getItem("userId")
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            updateTimers();
        }, 1000); // Обновление таймеров каждую секунду

        return () => clearInterval(interval); // Очистка интервала при размонтировании
    }, [reservations]);

    useEffect(() => {
        axios
            .get(`${config.apiBaseUrl}/users/${userId}/cars`)
            .then((response) => {
                console.log(response.data);
                setUserAuto(response.data);
            })
            .catch((error) => {
                console.error(error);
                setError("Ошибка при загрузке данных");
            });
        fetchMoney();
        fetchParkings();
        fetchReservations();
    }, [userId]);

    
    const fetchReservations = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/reserves/user/${userId}`);
            setReservations(response.data);
            initializeTimers(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке бронирований:", error);
            setError("Не удалось загрузить бронирования.");
        }
    };

    const deleteCar = async (carNumber) => {
        try {
            const response = await axios.delete(`http://${config.apiBaseUrl}/cars`, {
                params: { number: carNumber },
            });
            setUserAuto((prevCars) =>
                prevCars.filter((car) => car.number !== carNumber)
            );
            console.log(`Машина с номером ${carNumber} удалена:`, response.data);
        } catch (error) {
            console.error("Ошибка при удалении машины:", error.response?.data || error.message);
        }
    };

    const handleCarAdding = async (e) => {
        e.preventDefault();

        const data = {
            name: carName,
            number: carNumber,
        };

        try {
            const response = await axios.post(`${config.apiBaseUrl}/cars`, data, {
                params: { userId },
            });
            setUserAuto((prevCars) => [...prevCars, response.data]);
            setCarName("");
            setCarNumber("");
            setAddCar(false);
        } catch (error) {
            setError(
                `Ошибка: ${error.response?.data.message || "Некорректные данные"}`
            );
        }
    };

    const addMoney = async (e) => {
        e.preventDefault();
        const phoneNumber = phone;
        const amount = parseInt(money, 10);
        try {
            const response = await axios.post(
                `${config.apiBaseUrl}/users/${userId}/wallet`,
                null,
                {
                    params: {
                        phoneNumber: phoneNumber,
                        money: amount,
                    },
                }
            );
            fetchMoney();
            console.log("Ответ от сервера:", response.data);
        } catch (error) {
            setError(
                `Ошибка: ${error.response?.data.message || "Некорректные данные"}`
            );
        }
    };

    const fetchMoney = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/users/${userId}/wallet`, {
                params: { phoneNumber: phone },
            });
            setWallet(response.data);
        } catch (error) {
            setError(
                `Ошибка: ${error.response?.data.message || "Не удалось получить баланс"}`
            );
        }
    };

    const fetchParkings = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/parking/free`);
            console.log(response.data);
            setParkings(response.data);
            setFilteredParkings(response.data);
        } catch (error) {
            setError("Не удалось загрузить парковки.");
            console.error(error);
        }
    };

    const filterParkings = () => {
        const filtered = parkings.filter((parking) => {
            const matchesReservable = reservable ? parking.reservable === true : true;
            const matchesSubscribeable = subscribeable ? parking.subscribeable === true : true;
            const matchesTemporary = temporary ? parking.temporary === true : true;

            return matchesReservable && matchesSubscribeable && matchesTemporary;
        });
        setFilteredParkings(filtered);
    };

    useEffect(() => {
        filterParkings();
    }, [reservable, subscribeable, temporary]);

    const isValidCarNumber = (carNumber) => {
        const carNumberPattern = /^[АВЕКМНОРСТУХ]{1}\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/;
        return carNumberPattern.test(carNumber);
    };

    const parkingOptions = filteredParkings.map((parking) => ({
        value: parking,
        label: parking.address,
    }));

    const handleParkingChange = (selectedOption) => {
        setSelectedParking(selectedOption.value);
        console.log("Выбранная парковка:", selectedOption.value);
    };

    const initializeTimers = (reservations) => {
        const newTimers = {};
        reservations.forEach((reservation) => {
            const now = Date.now();
            const startTime = parseServerTimeToUTC(reservation.startTime);
            const endTime = parseServerTimeToUTC(reservation.endTime);
            console.log('now: ' +  now)
            console.log('start: ' +  startTime)
            if (now >= startTime && now < endTime) {
                // Только для активных бронирований
                const timeLeft = Math.max(0, endTime - now);
                newTimers[reservation.id] = timeLeft;
            }
        });
        setTimers(newTimers);
    };

    const updateTimers = () => {
        setTimers((prevTimers) => {
            const updatedTimers = { ...prevTimers };
            Object.keys(updatedTimers).forEach((id) => {
                updatedTimers[id] = Math.max(0, updatedTimers[id] - 1000);
            });
            return updatedTimers;
        });
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const parseServerTimeToUTC = (timeString) => {
        const [date, time] = timeString.split("T");
        const [year, month, day] = date.split("-").map(Number);
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return Date.UTC(year, month - 1, day, hours, minutes, seconds);
    };

    return (
        <div className="main-page-wrapper">
            <div className="client-reservations">
                <h3>Ваши бронирования</h3>
                {reservations.map((reservation) => {
                    const now = Date.now();
                    const startTime = parseServerTimeToUTC(reservation.startTime);
                    const endTime = parseServerTimeToUTC(reservation.endTime);
                    return (
                        <li key={reservation.id}>
                            <p>
                                Машина: {reservation.car.name} ({reservation.car.number})
                            </p>
                            <p>
                                Парковка: {reservation.parkingSpot.spotNumber} (ID: {reservation.parkingSpot.parkingId})
                            </p>
                            <p>Тип брони: {reservation.reserveType}</p>
                            {now < startTime ? (
                                <p>Ожидает начала: {new Date(startTime).toLocaleString()}</p>
                                ) : now > endTime ? (
                                    <p>Бронь истекла</p>
                                ) : (
                                    <p>
                                        Осталось времени:{" "}
                                        {timers[reservation.id] !== undefined
                                            ? formatTime(timers[reservation.id])
                                            : "Загрузка..."}
                                    </p>
                            )}
                            
                           
                            
                            <hr />
                        </li>
                    );
            })}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            <div className="client-cars">
                <h3>Ваши автомобили</h3>
                {userAuto.length > 0 ? (
                    <ul>
                        {userAuto.map((car) => (
                            <li key={car.id}>
                                <p>Название: {car.name}</p>
                                <p>Номер: {car.number}</p>
                                <button onClick={() => deleteCar(car.number)}>удалить</button>
                                <hr />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Пусто</p>
                )}
            </div>

            <div className="addCars">
                <h3>Добавить автомобиль</h3>
                <form onSubmit={handleCarAdding}>
                    <input
                        type="text"
                        placeholder="Название автомобиля"
                        value={carName}
                        onChange={(e) => setCarName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="А000АА00"
                        value={carNumber}
                        onChange={(e) => setCarNumber(e.target.value)}
                    />
                    {!isValidCarNumber(carNumber) && carNumber && (
                        <p style={{ color: "red" }}>Некорректный номер автомобиля</p>
                    )}
                    <button type="submit" disabled={!carName || !carNumber || !isValidCarNumber(carNumber)}>
                        добавить
                    </button>
                </form>
            </div>

            <div className="client-wallet">
                <h3>Кошелек</h3>
                <div className="current-money">
                    <b>Текущий парковочный счет: </b>{wallet}<span> ₽</span>
                </div>
                <form className="wallet-form" onSubmit={addMoney}>
                    <label>Введите сумму для пополнения: </label>
                    <input 
                        type="number" 
                        name="money" 
                        pattern="\d*"
                        placeholder="100₽" 
                        value={money} 
                        onChange={(e) => setMoney(Number(e.target.value))} 
                    />
                    <button type="submit">
                        пополнить
                    </button>
                </form>
            </div>

            <div className="parking">
                <h3>Оплата парковки</h3>
                <div className="parking-filter">
                    <label>
                        <input
                            type="checkbox"
                            name="reservable"
                            checked={reservable}
                            onChange={(e) => setReservable(e.target.checked)}
                        />
                        Бронь
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="subscribeable"
                            checked={subscribeable}
                            onChange={(e) => setSubscribeable(e.target.checked)}
                        />
                        Абонемент
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="temporary"
                            checked={temporary}
                            onChange={(e) => setTemporary(e.target.checked)}
                        />
                        Временная парковка
                    </label>
                </div>
                <div className="parking-select">
                    <Select
                        options={parkingOptions}
                        value={selectedParking ? { value: selectedParking, label: selectedParking.address } : null}
                        onChange={handleParkingChange}
                        placeholder="Выберите парковку"
                        isSearchable={true}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {selectedParking && <Option selectedParking={selectedParking} userAuto={userAuto} fetchMoney={fetchMoney} fetchReservations={fetchReservations}/>}
            </div>
        </div>
    );
}

export default MainPage;
