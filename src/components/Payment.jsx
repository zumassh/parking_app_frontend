import React, { useState, useEffect } from "react";
import axios from "axios";
import { LocalizationProvider, TimePicker, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress, Alert } from "@mui/material";
import "../styles/Payment.css";

function Payment({ optionType, userAuto, selectedParking, fetchMoney, fetchReservations }) {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [cost, setCost] = useState(0);
    const [selectedCar, setSelectedCar] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Обнуляем стоимость при изменении типа бронирования
        setCost(0);
    }, [optionType]);

    // Рассчитываем стоимость при изменении времени
    useEffect(() => {
        if (startTime && endTime) {
            const diffInMinutes = Math.round((endTime - startTime) / 60000); // Разница в миллисекундах делится на 60000 для получения минут
            setCost(diffInMinutes > 0 ? diffInMinutes : 0); // Устанавливаем только положительное значение
        }
    }, [startTime, endTime]);

    useEffect(() => {
        if (startDate && endDate) {
            const diffInTime = endDate - startDate;
            const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24)); // Разница в днях
            setCost(diffInDays > 0 ? diffInDays * 500 : 0); // 1 день = 500 рублей
        }
    }, [startDate, endDate]);

    const handleCarChange = (event) => {
        setSelectedCar(event.target.value);
    };

    const temporaryParking = () => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
        const selectedCarObject = userAuto.find(car => car.number === selectedCar);
        const requestBody = {
            carDTO: selectedCarObject,
            parkingDTO: selectedParking,
            startTime: startTime,
            endTime: endTime,
            price: cost
        };
        console.log(requestBody);
        axios.post(`http://localhost:8080/parking-spots/assign/temporary`, requestBody)
            .then(response => {
                fetchMoney()
                fetchReservations()
                setLoading(false);
                setSuccessMessage("Бронирование успешно завершено!");
            })
            .catch(error => {
                setLoading(false);
                setErrorMessage("Ошибка бронирования: " + (error.response?.data?.message || "Попробуйте снова"));
            });
    };

    const subscriptionParking = () => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
        const selectedCarObject = userAuto.find(car => car.number === selectedCar);
        const requestBody = {
            carDTO: selectedCarObject,
            parkingDTO: selectedParking,
            startTime: startTime,
            endTime: endTime,
            price: 5000
        };
        axios.post(`http://localhost:8080/parking-spots/assign/subscribe`, requestBody)
            .then(response => {
                fetchMoney()
                fetchReservations()
                setLoading(false);
                setSuccessMessage("Бронирование успешно завершено!");
            })
            .catch(error => {
                setLoading(false);
                setErrorMessage("Ошибка бронирования: " + (error.response?.data?.message || "Попробуйте снова"));
            });
    }

    const reserveParking = () => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
        const selectedCarObject = userAuto.find(car => car.number === selectedCar);
        const requestBody = {
            carDTO: selectedCarObject,
            parkingDTO: selectedParking,
            startTime: startDate,
            endTime: endDate,
            price: cost
        };
        console.log(requestBody);
        axios.post(`http://localhost:8080/parking-spots/assign/reserve`, requestBody)
            .then(response => {
                fetchMoney()
                fetchReservations()
                setLoading(false);
                setSuccessMessage("Бронирование успешно завершено!");
            })
            .catch(error => {
                setLoading(false);
                setErrorMessage("Ошибка бронирования: " + (error.response?.data?.message || "Попробуйте снова"));
            });
    };

    if (optionType === 1) {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={{ display: "flex", gap: "20px", flexDirection: "column", maxWidth: "300px" }}>
                    <FormControl fullWidth>
                        <InputLabel id="car-select-label">Выберите машину</InputLabel>
                        <Select
                            labelId="car-select-label"
                            id="car-select"
                            value={selectedCar}
                            onChange={handleCarChange}
                            label="Выберите машину"
                        >
                            {userAuto.map((car) => (
                                <MenuItem key={car.id} value={car.number}>
                                    {car.name} ({car.number})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedCar && (
                        <div className="car-details">
                            <p>Вы выбрали машину: {selectedCar}</p>
                        </div>
                    )}
                    <TimePicker
                        label="Время начала"
                        value={startTime}
                        onChange={(newValue) => setStartTime(newValue)}
                        ampm={false} // 24-часовой формат
                        inputFormat="HH:mm" // Задаем формат времени
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Введите время начала" // Плейсхолдер
                            />
                        )}
                    />
                    <TimePicker
                        label="Время окончания"
                        value={endTime}
                        onChange={(newValue) => setEndTime(newValue)}
                        ampm={false} // 24-часовой формат
                        inputFormat="HH:mm" // Задаем формат времени
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Введите время окончания" // Плейсхолдер
                            />
                        )}
                    />
                    <div className="pay">
                        <p>Сумма: {cost}₽</p>
                        <button onClick={() => temporaryParking()} disabled={cost <= 0 || loading}>
                            {loading ? <CircularProgress size={20} /> : "Оплатить"}
                        </button>
                    </div>
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                </div>
            </LocalizationProvider>
        );
    }

    // Остальные блоки остаются без изменений
    if (optionType === 2 || optionType === 3) {
        // Код для других вариантов оплаты
    }
    if (optionType === 2) {
        return (
            <div style={{ display: "flex", gap: "20px", flexDirection: "column", maxWidth: "300px" }}>
                {/* Выпадающий список с выбором автомобиля */}
                <FormControl fullWidth>
                    <InputLabel id="car-select-label">Выберите машину</InputLabel>
                    <Select
                        labelId="car-select-label"
                        id="car-select"
                        value={selectedCar}
                        onChange={handleCarChange}
                        label="Выберите машину"
                    >
                        {userAuto.map((car) => (
                            <MenuItem key={car.id} value={car.number}>
                                {car.name} ({car.number})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedCar && (
                    <div className="car-details">
                        <p>Вы выбрали машину: {selectedCar}</p>
                        <div className="pay">
                            <p>Сумма: 5000₽</p>
                            <button onClick={() => subscriptionParking()} disabled={loading}>
                                {loading ? <CircularProgress size={20} /> : "Оплатить"}
                            </button>
                        </div>
                        {successMessage && <Alert severity="success">{successMessage}</Alert>}
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                        </div>
                )}
            </div>
        );
    }

    if (optionType === 3) {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FormControl fullWidth>
                        <InputLabel id="car-select-label">Выберите машину</InputLabel>
                        <Select
                            labelId="car-select-label"
                            id="car-select"
                            value={selectedCar}
                            onChange={handleCarChange}
                            label="Выберите машину"
                        >
                            {userAuto.map((car) => (
                                <MenuItem key={car.id} value={car.number}>
                                    {car.name} ({car.number})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedCar && (
                        <div className="car-details">
                            <p>Вы выбрали машину: {selectedCar}</p>
                        </div>
                    )}
                <div style={{ display: "flex", gap: "20px", flexDirection: "column", maxWidth: "300px" }}>
                    <DatePicker
                        label="Дата начала"
                        inputFormat="dd-MM-yy"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Выберите дату начала"
                            />
                        )}
                    />
                    <DatePicker
                        label="Дата окончания"
                        inputFormat="dd-MM-yy"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Выберите дату окончания"
                            />
                        )}
                    />
                    <div className="pay">
                        <p>Сумма: {cost}₽</p>
                        <button onClick={() => reserveParking()} disabled={cost <= 0 || loading}>
                            {loading ? <CircularProgress size={20} /> : "Оплатить"}
                        </button>
                    </div>
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                </div>
            </LocalizationProvider>
        );
    }

    return null;
}

export default Payment;