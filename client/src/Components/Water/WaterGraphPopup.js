import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAverageDataByUserName } from '../../redux/features/iotData/iotDataSlice';
import Modal from 'react-modal';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const WaterGraphPopup = ({ isOpen, onRequestClose, parameter, userName }) => {
    const [timeInterval, setTimeInterval] = React.useState('hour');
    const dispatch = useDispatch();
    const { averageData, loading, error } = useSelector((state) => state.iotData);

    useEffect(() => {
        if (userName && parameter) {
            dispatch(fetchAverageDataByUserName({ userName, interval: timeInterval }));
        }
    }, [timeInterval, userName, parameter, dispatch]);

    const processData = (data, interval) => {
        if (!Array.isArray(data)) {
            return { labels: [], values: [] };
        }

        let labels;
        switch (interval) {
            case 'hour':
                labels = data.map(entry => moment(entry.timestamp).format('HH:mm'));
                break;
            case 'day':
                labels = data.map(entry => moment(entry.timestamp).format('HH:mm'));
                break;
            case 'week':
                labels = data.map(entry => moment(entry.timestamp).format('ddd'));
                break;
            case 'month':
                labels = data.map(entry => moment(entry.timestamp).format('DD MMM'));
                break;
            case 'sixmonths':
                labels = data.map(entry => moment(entry.timestamp).format('MMM YYYY'));
                break;
            case 'year':
                labels = data.map(entry => moment(entry.timestamp).format('MMM YYYY'));
                break;
            default:
                labels = data.map(entry => entry.interval);
        }

        const values = data.map(entry => entry[parameter]);

        return { labels, values };
    };

    const { labels, values } = processData(averageData, timeInterval);

    const chartData = {
        labels,
        datasets: [
            {
                label: parameter,
                data: values,
                fill: false,
                backgroundColor: '#82ca9d',
                borderColor: '#82ca9d',
            },
        ],
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            height: '50%',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Data Popup"
            style={customStyles}
        >
            <h2>{parameter}</h2>
            <h3>{userName}</h3>
            <div className="btn-group " role="group" aria-label="Date Range">
                <button  className="btn btn-primary" onClick={() => setTimeInterval('hour')}>Today</button>
                <button  className="btn btn-primary" onClick={() => setTimeInterval('day')}>Day</button>
                <button  className="btn btn-primary" onClick={() => setTimeInterval('week')}>Week</button>
                <button  className="btn btn-primary" onClick={() => setTimeInterval('month')}>Month</button>
                <button  className="btn btn-primary" onClick={() => setTimeInterval('sixmonths')}>6 Months</button>
                <button  className="btn btn-primary" onClick={() => setTimeInterval('year')}>Year</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message}</p>
            ) : (
                <div style={{ width: '100%', height: '100%' }}>
                    <Line data={chartData} />
                </div>
            )}
        </Modal>
    );
};

export default WaterGraphPopup;
