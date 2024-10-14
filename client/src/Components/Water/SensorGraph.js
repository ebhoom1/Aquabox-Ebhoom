import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../../utils/apiConfig';

const SensorGraph = ({ range }) => {
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/sensor-data?range=${range}`);
                if (response.data.success) {
                    setGraphData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };
        fetchData();
    }, [range]);

    const formatChartData = () => {
        const labels = graphData.map(item => item._id.date);
        const datasets = [];

        const sensorTypes = [...new Set(graphData.map(item => item._id.field))];
        sensorTypes.forEach(type => {
            const data = graphData
                .filter(item => item._id.field === type)
                .map(item => item.averageValue);

            datasets.push({
                label: type,
                data,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            });
        });

        return { labels, datasets };
    };

    return (
        <div>
            <h2>Sensor Data Graph ({range})</h2>
            {graphData.length > 0 ? (
                <Line data={formatChartData()} />
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default SensorGraph;
