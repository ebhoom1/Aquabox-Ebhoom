import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../utils/apiConfig';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import { ColorRing } from 'react-loader-spinner';

const DownloadIoTdataByUserName = () => {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [userName, setUserName] = useState("");
    const [format, setFormat] = useState("csv"); // Default format
    const [users, setUsers] = useState([]);
    const [subscriptionDate, setSubscriptionDate] = useState(""); // New state for subscription date

    // Fetch all users to select userName
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/getallusers`);
                const filteredUsers = response.data.users.filter(user => user.userType === "user");
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Error fetching users");
            }
        };

        fetchUsers();
    }, []);

    // Update the subscriptionDate when a user is selected
    const handleUserChange = (e) => {
        const selectedUserName = e.target.value;
        setUserName(selectedUserName);

        // Find the selected user's subscription date
        const selectedUser = users.find(user => user.userName === selectedUserName);
        if (selectedUser && selectedUser.subscriptionDate) {
            // Set the subscription date
            setSubscriptionDate(moment(selectedUser.subscriptionDate).format('YYYY-MM-DD'));
        } else {
            setSubscriptionDate(""); // Clear if no subscription date found
        }
    };

    const handleDownload = async (e) => {
        e.preventDefault();

        if (!userName || !dateFrom || !dateTo) {
            toast.error("Please fill in all fields.");
            return;
        }

        const formattedDateFrom = moment(dateFrom).format('DD-MM-YYYY');
        const formattedDateTo = moment(dateTo).format('DD-MM-YYYY');

        // Construct the query string
        const queryParams = {
            fromDate: formattedDateFrom,
            toDate: formattedDateTo,
            userName: userName.trim(),
            format: format
        };

        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const requestUrl = `${API_URL}/api/downloadIotDataByUserName?${queryString}`;

        console.log('Request URL:', requestUrl); // Debug the URL

        try {
            const response = await axios.get(requestUrl, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `iot_data.${format}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up the link element
            toast.success(`IoT Data downloaded successfully in ${format} format`);
        } catch (error) {
            console.error("Error downloading data:", error);
            toast.error(`Error in downloading IoT data`);
        }
    };

    return (
        <div className="row">
            <div className="col-12 col-md-12 grid-margin">
                <div className="col-12">
                    <h1>Download IoT Data by User Name</h1>
                </div>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleDownload}>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 mb-3">
                                    <label>Select Company</label>
                                    <select className="input-field" onChange={handleUserChange}>
                                        <option value="">Select</option>
                                        {users.map((item) => (
                                            <option key={item.userName} value={item.userName}>
                                                {item.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-6 col-md-6 mb-3">
                                    <label>Date From</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        required
                                        min={subscriptionDate} // Set the minimum date as the subscription date
                                        disabled={!subscriptionDate} // Disable if no subscription date available
                                    />
                                    {subscriptionDate && (
                                        <small style={{color:'red'}}>Available from: {moment(subscriptionDate).format('DD-MM-YYYY')}</small>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 mb-3">
                                    <label>Date To</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 mb-3">
                                    <label>Format</label>
                                    <select className="input-field" value={format} onChange={(e) => setFormat(e.target.value)}>
                                        <option value="csv">CSV</option>
                                        <option value="json">JSON</option>
                                    </select>
                                </div>
                                <div className="col-lg-12 col-md-12 mb-3">
                                    <button type="submit" className="btn btn-primary">Download</button>
                                </div>
                            </div>
                        </form>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadIoTdataByUserName;
