import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../utils/apiConfig';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';

const DownloadIoTdata = () => {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [industry, setIndustry] = useState("");
    const [company, setCompany] = useState("");
    const [format, setFormat] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/getallusers`);
                const filteredUsers = response.data.users.filter(user => user.userType === "user");
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleDownload = async (e) => {
        e.preventDefault();
        const formattedDateFrom = moment(dateFrom).format('DD-MM-YYYY');
        const formattedDateTo = moment(dateTo).format('DD-MM-YYYY');

        // Trim leading and trailing spaces from parameters
        const trimmedIndustry = industry.trim();
        const trimmedCompany = company.trim();

        // Construct the query string
        const queryParams = {
            fromDate: formattedDateFrom,
            toDate: formattedDateTo,
            industryName: trimmedIndustry,
            companyName: trimmedCompany,
            format
        };

        const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const requestUrl = `${API_URL}/api/downloadIotData?${queryString}`;

        console.log('Request URL:', requestUrl); // Debug the URL

        try {
            const response = await axios.get(requestUrl, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `iot_data.${format}`);
            document.body.appendChild(link);
            link.click();
            toast.success(`IoT Data downloaded successfully in ${format} format`);
        } catch (error) {
            console.error("Error downloading data:", error);
            toast.error(`Error in downloading IoT data`);
        }
    };

    const industryType = [
        { category: "Sugar" },
        { category: "Cement" },
        { category: "Distillery" },
        { category: "Petrochemical" },
        { category: "Pulp & Paper" },
        { category: "Fertilizer" },
        { category: "Tannery" },
        { category: "Pesticides" },
        { category: "Thermal Power Station" },
        { category: "Caustic Soda" },
        { category: "Pharmaceuticals" },
        { category: "Chemical" },
        { category: "Dye and Dye Stuff" },
        { category: "Refinery" },
        { category: "Copper Smelter" },
        { category: "Iron and Steel" },
        { category: "Zinc Smelter" },
        { category: "Aluminium" },
        { category: "STP/ETP" },
        { category: "NWMS/SWMS" },
        { category: "Noise" },
        { category: "Zinc Smelter" },
        { category: "Other" },
    ];

    return (
        <div className="row">
            <div className="col-12 col-md-12 grid-margin">
                <div className="col-12">
                    <h1>Download IoT Data</h1>
                </div>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleDownload}>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 mb-3">
                                    <label>Select Industry</label>
                                    <select className="input-field" onChange={(e) => setIndustry(e.target.value)}>
                                        <option>select</option>
                                        {industryType.map((item) => (
                                            <option key={item.category} value={item.category}>
                                                {item.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-6 col-md-6 mb-3">
                                    <label>Select Company</label>
                                    <select className="input-field" onChange={(e) => setCompany(e.target.value)}>
                                        <option>select</option>
                                        {users.map((item) => (
                                            <option key={item.companyName} value={item.companyName}>
                                                {item.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-6 col-md-6 mb-3">
                                    <label>From Date</label>
                                    <input className="input-field" type="date" onChange={(e) => setDateFrom(e.target.value)} />
                                </div>
                                <div className="col-lg-6 col-md-6 mb-3">
                                    <label>To Date</label>
                                    <input className="input-field" type="date" onChange={(e) => setDateTo(e.target.value)} />
                                </div>
                                <div className="col-lg-6 col-md-6 mb-3">
                                    <label>Download Format</label>
                                    <select className="input-field" onChange={(e) => setFormat(e.target.value)}>
                                        <option>select</option>
                                        <option value="pdf">PDF</option>
                                        <option value="csv">CSV</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-outline-success">Download</button>
                        </form>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DownloadIoTdata;
