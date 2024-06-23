import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIotDataByTimeInterval } from '../../redux/features/iotData/iotDataSlice';
import Modal from 'react-modal';
import { Line } from 'react-chartjs-2'; // Ensure this import is correct

const WaterGraphPopup = ({ isOpen, onRequestClose, parameter, userName }) => {
    const [timeInterval, setTimeInterval] = React.useState('today');
    const dispatch = useDispatch();
    const { timeIntervalData, loading, error } = useSelector((state) => state.iotData);

    useEffect(() => {
        if (userName && parameter) {
            dispatch(fetchIotDataByTimeInterval({ userName, interval: timeInterval }));
        }
    }, [timeInterval, userName, parameter, dispatch]);

    const chartData = {
        labels: Array.from({ length: Object.keys(timeIntervalData).length }, (_, i) => i + 1),
        datasets: [
            {
                label: parameter,
                data: timeIntervalData[parameter],
                fill: false,
                backgroundColor: 'blue',
                borderColor: 'blue',
            },
        ],
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Data Popup">
            <h2>{parameter} Data</h2>
            <div>
                <button onClick={() => setTimeInterval('today')}>Today</button>
                <button onClick={() => setTimeInterval('week')}>Week</button>
                <button onClick={() => setTimeInterval('month')}>Month</button>
                <button onClick={() => setTimeInterval('6months')}>6 Months</button>
                <button onClick={() => setTimeInterval('year')}>Year</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message}</p>
            ) : (
                <Line data={chartData} />
            )}
        </Modal>
    );
};

export default WaterGraphPopup;
