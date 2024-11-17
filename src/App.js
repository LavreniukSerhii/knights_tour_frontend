import React, { useState } from "react";
import "./css/App.css";
import InputForm from "./components/InputForm";
import InfoBoard from "./components/InfoBoard";
import './css/board.scss';
import Board from "./components/Board";
import ErrorBoard from "./components/ErrorBoard";
import { fetchSolution } from './utils/fetchSolution';  // Импортируем функцию

function App() {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [posX, setPosX] = useState(1);
    const [posY, setPosY] = useState(1);
    const [solutionW, setSolutionW] = useState([]);
    const [solutionGA, setSolutionGA] = useState({solution: [], generation: null, population: null});
    const [error, setError] = useState(null);
    const [selectedMethods, setSelectedMethods] = useState({ warnsdorf: false, genetic: false });

    const handleMethodUpdate = (newSelection) => {
        setSelectedMethods(newSelection);
    };

    const handleInputChange = (name, value) => {
        setSolutionW([]);
        setSolutionGA({solution:[],generation:null,population:null});
        setError(null);
        switch (name) {
            case "rows":
                setRows(value);
                break;
            case "cols":
                setCols(value);
                break;
            case "posX":
                setPosX(value);
                break;
            case "posY":
                setPosY(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async () => {
        // Проверяем, находится ли конь на допустимой позиции
        if (posX < 1 || posX > cols || posY < 1 || posY > rows) {
            setError('The knight is in an invalid position');
            setSolutionW([]);
            return;
        }

        // Вызываем функцию для получения решения
        await fetchSolution(cols, rows, posX, posY, selectedMethods, setSolutionW, setSolutionGA, setError);
    };

    const selectedMethod = () => {
        if (selectedMethods.warnsdorf && !selectedMethods.genetic) {
            return solutionW;
        } else if (!selectedMethods.warnsdorf && selectedMethods.genetic) {
            return solutionGA.solution;
        } else {
            return [];
        }
    };

    return (
        <div className={'container'}>
            <div className={'item left-board'}>
                <div className={'input-board'}>
                    <InputForm
                        cols1={cols}
                        rows1={rows}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}  // Передаем handleSubmit сюда
                    />
                </div>
                <div className={'error-board'}>
                    <ErrorBoard message={error} />
                </div>
            </div>
            <div className={'item board justify-content-center d-flex'}>
                <Board rows={rows} cols={cols} posX={posX} posY={posY} solution={selectedMethod()} />
            </div>
            <div className={'item right-board'}>
                <InfoBoard handleMethodUpdate={handleMethodUpdate} />
            </div>
        </div>
    );
}

export default App;