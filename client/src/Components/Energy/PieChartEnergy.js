import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './PieChartEnergy.css'; // Make sure the CSS is correctly imported
import { API_URL } from '../../utils/apiConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartEnergy = ({ primaryStation, userName }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [energyStacks, setEnergyStacks] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null); // Define activeIndex here

    useEffect(() => {
        fetchEnergyStacks(userName);
    }, [userName]);

    useEffect(() => {
        if (energyStacks.length > 0) {
            fetchData();
        }
    }, [energyStacks, userName, primaryStation]);

    const fetchEnergyStacks = async (userName) => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
            const data = response.data;
            const filteredStacks = data.stackNames.filter(stack => stack.stationType === 'energy').map(stack => stack.name);
            setEnergyStacks(filteredStacks);
        } catch (error) {
            setError(`Error fetching energy stacks: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`${API_URL}/api/consumptionDataByUserName?userName=${userName}`);
            const data = response.data;
            if (data && data.stacks && data.stacks.length > 0) {
                setChartData(processData(data.stacks, primaryStation));
            } else {
                setChartData(null);
                setError("No data found for this user.");
            }
        } catch (err) {
            setChartData(null);
            setError(`Failed to fetch data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const processData = (stacks, primaryStation) => {
        const total = stacks.reduce((acc, curr) => acc + curr.energyMonthlyConsumption, 0);
        const data = stacks.filter(stack => energyStacks.includes(stack.stackName)).map(stack => ({
            stackName: stack.stackName,
            percentage: (stack.energyMonthlyConsumption / total * 100).toFixed(2),
            value: stack.energyMonthlyConsumption
        }));

        return {
            labels: data.map(item => item.stackName),
            datasets: [{
                data: data.map(item => item.value),
                backgroundColor: data.map((item, index) => item.stackName === primaryStation ? 'rgba(215, 222, 24, 0.6)' : `hsla(${360 / data.length * index}, 70%, 50%, 0.6)`),
                hoverBackgroundColor: data.map((item, index) => item.stackName === primaryStation ? 'rgba(62, 19, 108, 0.8)' : `hsla(${360 / data.length * index}, 70%, 50%, 0.8)`),
                borderWidth: 0,
                hoverOffset: 10,
            }],
        };
    };

    const options = {
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(tooltipItem) {
                        let label = chartData.labels[tooltipItem.dataIndex] || '';
                        if (label) {
                            label += ': ';
                        }
                        label += `${tooltipItem.raw.toFixed(2)} kWh `;
                        return label;
                    }
                }
            },
        },
        maintainAspectRatio: false,
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                setActiveIndex(activeIndex === index ? null : index);
            }
        },
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger" role="alert">{error}</div>;
    }

    if (!chartData) {
        return <div className="alert alert-info" role="alert">No data available or still loading...</div>;
    }

    return (
        <div className="card pie-chart-card">
            <div className="pie-chart-header">
                Energy Consumption Chart
            </div>
            <div className="card-body">
                <div className="pie-chart-container">
                    <Pie data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default PieChartEnergy;
