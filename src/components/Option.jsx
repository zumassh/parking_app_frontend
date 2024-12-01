import { useState } from "react";
import "../styles/Option.css";
import Payment from './Payment'

function Option({ selectedParking, userAuto, fetchMoney, fetchReservations }) {
    const [activeButtonId, setActiveButtonId] = useState(null);

    const changeState = (id) => {
        setActiveButtonId(id); // Устанавливаем ID активной кнопки
    };

    const getClassName = (id) => {
        return activeButtonId === id ? "option-button-active" : "option-button";
    };

    return (
        <div className="option-buttons-wrapper">
            <b>Выберите опцию</b>
            <div>
                {selectedParking.temporary && (
                    <button onClick={() => changeState(1)} className={getClassName(1)}>
                        временная парковка
                    </button>
                )}
                {selectedParking.subscribeable && (
                    <button onClick={() => changeState(2)} className={getClassName(2)}>
                        абонемент
                    </button>
                )}
                {selectedParking.reservable && (
                    <button onClick={() => changeState(3)} className={getClassName(3)}>
                        бронирование
                    </button>
                )}
            </div>
            <Payment optionType={activeButtonId} userAuto={userAuto} selectedParking={selectedParking} fetchMoney={fetchMoney} fetchReservations={fetchReservations}/>
            
        </div>
    );
}

export default Option;
