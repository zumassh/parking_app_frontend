import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/MainPage.css';

function MainPage({userId}) {
    const [userAuto, setUserAuto] = useState([])
    const [error, setError] = useState("");
    const [addCar, setAddCar] = useState(false);
    const [carName, setCarName] = useState("");
    const [carNumber, setCarNumber] = useState("");

    useEffect(() => {
        axios
        .get(`http://localhost:8080/users/${userId}/cars`)
        .then((response) => setUserAuto(response.data))
        .catch((error) => {
            console.error(error);
            setError("Ошибка при загрузке данных");
    })}, [userId]);

    const deleteCar = async (carNumber) => {
        try {
            const response = await axios.delete(`http://localhost:8080/cars`, {
                params: { number: carNumber },
            });
            setUserAuto((prevCars) =>
                prevCars.filter((car) => car.number !== carNumber)
            );
            console.log(`Машина с номером ${carNumber} удалена:`, response.data);
        } catch (error) {
            console.error("Ошибка при удалении машины:", error.response?.data || error.message);
        }
    }

    const handleCarAdding = async (e) => {
        e.preventDefault();

        const data = {
            name: carName,
            number: carNumber,
        };

        try {
            const response = await axios.post("http://localhost:8080/cars", data,
                { params: { userId }, }
            );
            setUserAuto((prevCars) => [...prevCars, response.data]);
            setCarName("");
            setCarNumber("");
            setAddCar(false);
        } 
        catch (error) {
            if (error.response) {
                setError(`Ошибка: ${error.response.data.message || "Некорректные данные"}`);
            } else {
                setError(`Ошибка соединения: ${error.message}`);
            }
        }
    }

    const isValidCarNumber = (carNumber) => {
        const carNumberPattern = /^[АВЕКМНОРСТУХ]{1}\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/;
        return carNumberPattern.test(carNumber);
    };

    return (
        <div className="main-page-wrapper">
            <div className="client-cars">
                <h3>Ваши автомобили</h3>
                {userAuto.length > 0 ? (
                    <ul>
                    {userAuto.map((car) => (
                        <li key={car.id}>
                            <p>ID: {car.id}</p>
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
                <button onClick={() => setAddCar(true)}>Добавить автомобиль</button>
            </div>
            {addCar && <div className="addCars">
                <h3>Добавить автомобиль</h3>
                <form onSubmit={handleCarAdding}>
                    <input
                        type="text"
                        placeholder="Название авто (произвольно)"
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
            </div>}
        </div>
    );
}

export default MainPage;


// const [data, setData] = useState([]);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     axios
    //         .get("http://localhost:8080/parking/free")
    //         .then((response) => setData(response.data))
    //         .catch((error) => {
    //             console.error(error);
    //             setError("Ошибка при загрузке данных");
    //         });
    // }, []);


    // <div>
        //     <h1>Данные с сервера:</h1>
        //     {error ? (
        //         <p style={{ color: "red" }}>{error}</p>
        //     ) : data.length > 0 ? (
        //         <ul>
        //             {data.map((parking) => (
        //                 <li key={parking.id}>
        //                     <p>ID: {parking.id}</p>
        //                     <p>Адрес: {parking.address}</p>
        //                     <p>Вместимость: {parking.capacity}</p>
        //                     <p>Резервируемое: {parking.reservable ? "Да" : "Нет"}</p>
        //                     <p>Подписка: {parking.subscribeable ? "Да" : "Нет"}</p>
        //                     <hr />
        //                 </li>
        //             ))}
        //         </ul>
        //     ) : (
        //         <p>Загрузка данных...</p>
        //     )}
        // </div>