import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const WaterGraphPopup = ({ isOpen, onRequestClose, parameter, userName, stackName }) => {
    const [timeInterval, setTimeInterval] = useState('hour');
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userName && stackName && parameter) {
            fetchData();
        }
    }, [timeInterval, userName, stackName, parameter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5555/api/average/user/${userName}/stack/${stackName}/interval/${timeInterval}`
            );
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setGraphData(data);
            } else {
                toast.error(`No data found for ${parameter} (${timeInterval})`);
            }
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error('Error fetching graph data:', error);
        } finally {
            setLoading(false);
        }
    };

    const processData = () => {
        if (!Array.isArray(graphData) || graphData.length === 0) {
            return { labels: [], values: [] };
        }

        // Extract intervals for the X-axis and parameter values for the Y-axis
        const labels = graphData.map((entry) =>
            moment(entry.interval).format('DD/MM/YYYY HH:mm')
        );

        const values = graphData.map((entry) => {
            const stack = entry.stackData.find(
                (stack) => stack.stackName === stackName
            );
            return stack ? stack.parameters[parameter] : 0;
        });

        return { labels, values };
    };

    const { labels, values } = processData();

    const chartData = {
        labels,
        datasets: [
            {
                label: `${parameter} - ${stackName}`,
                data: values,
                fill: false,
                backgroundColor: '#82ca9d',
                borderColor: '#82ca9d',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: `${parameter} Values Over Time`,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Interval',
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                },
            },
            y: {
                title: {
                    display: true,
                    text: `${parameter} Value`,
                },
                beginAtZero: true,
                suggestedMax: Math.max(...values) + 5, // Adjust Y-axis max based on data
            },
        },
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '60%',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Graph Popup"
            style={customStyles}
        >
            <h4>{parameter} - {stackName}</h4>

            <div className="btn-group" role="group" aria-label="Time Intervals">
                {['hour', 'day', 'week', 'month', 'sixmonths', 'year'].map((interval) => (
                    <button
                        key={interval}
                        className={`btn ${timeInterval === interval ? 'active' : ''}`}
                        onClick={() => setTimeInterval(interval)}
                    >
                        {interval}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ width: '100%', height: '100%' }}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}
        </Modal>
    );
};

export default WaterGraphPopup;
