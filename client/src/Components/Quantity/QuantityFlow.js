import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchIotDataByUserName } from "../../redux/features/iotData/iotDataSlice";
import { useOutletContext } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import DailyHistoryModal from '../Water/DailyHistoryModal';
import { API_URL } from "../../utils/apiConfig";

const QuantityFlow = () => {
    const dispatch = useDispatch();
    const { userData, userType } = useSelector((state) => state.user);
    const [searchResult, setSearchResult] = useState(null);
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedStack, setSelectedStack] = useState("all");
    const [quantityStacks, setQuantityStacks] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const { searchTerm } = useOutletContext();
    const [currentUserName, setCurrentUserName] = useState(
        userType === 'admin' ? "KSPCB001" : userData?.validUserOne?.userName
    );

    const quantityParameters = [
        { parameter: "inflow", name: 'inflow' },
        { parameter: "finalFlow", name: 'finalflow' }
    ];

    const fetchEffluentStacks = async (userName) => {
        try {
            const response = await fetch(`${API_URL}/api/get-stacknames-by-userName/${userName}`);
            const data = await response.json();
            const effluentStacks = data.stackNames
                .filter(stack => stack.stationType === 'effluent_flow')
                .map(stack => stack.name);
            setQuantityStacks(effluentStacks);
        } catch (error) {
            console.error("Error fetching effluent stacks:", error);
        }
    };

    const fetchData = async (userName) => {
        setLoading(true);
        try {
            const result = await dispatch(fetchIotDataByUserName(userName)).unwrap();
            setSearchResult(result);
            setCompanyName(result?.companyName || "Unknown Company");
        } catch (err) {
            setSearchResult(null);
            setCompanyName("Unknown Company");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userName = searchTerm || currentUserName;
        fetchData(userName);
        fetchEffluentStacks(userName);
    }, [searchTerm, currentUserName, dispatch]);

    const handleNextUser = () => {
        const userIdNumber = parseInt(currentUserName.replace(/[^\d]/g, ''), 10);
        if (!isNaN(userIdNumber)) {
            const newUserId = `KSPCB${String(userIdNumber + 1).padStart(3, '0')}`;
            setCurrentUserName(newUserId);
        }
    };

    const handlePrevUser = () => {
        const userIdNumber = parseInt(currentUserName.replace(/[^\d]/g, ''), 10);
        if (!isNaN(userIdNumber) && userIdNumber > 1) {
            const newUserId = `KSPCB${String(userIdNumber - 1).padStart(3, '0')}`;
            setCurrentUserName(newUserId);
        }
    };

    const handleStackChange = (event) => {
        setSelectedStack(event.target.value);
    };

    return (
        <div className="content-wrapper">
            <div className="row page-title-header">
                <div className="col-12">
                    <div className="page-header d-flex justify-content-between">
                        {userType === 'admin' ? (
                            <>
                                <button className="btn btn-primary" onClick={handlePrevUser} disabled={loading}>
                                    Prev
                                </button>
                                <h4 className="page-title">Quantity Flow Dashboard</h4>
                                <button className="btn btn-primary" onClick={handleNextUser} disabled={loading}>
                                    Next
                                </button>
                            </>
                        ) : (
                            <div className="mx-auto">
                                <h4 className="page-title">Quantity Flow Dashboard</h4>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row align-items-center">
                <div className="col-md-4">
                    <select
                        id="stackSelect"
                        className="form-select styled-select"
                        value={selectedStack}
                        onChange={handleStackChange}
                    >
                        <option value="all">All Stacks</option>
                        {quantityStacks.map((stack, index) => (
                            <option key={index} value={stack}>
                                {stack}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <h3 className="text-center">{companyName}</h3>
                </div>
                <div className="col-md-4 d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={() => setShowHistoryModal(true)}>
                        Daily History
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="spinner-container">
                    <Oval height={60} width={60} color="#236A80" ariaLabel="Loading" />
                </div>
            ) : (
                searchResult?.stackData &&
                searchResult.stackData
                    .filter(stack => quantityStacks.includes(stack.stackName))
                    .map((stack, index) => (
                        (selectedStack === "all" || selectedStack === stack.stackName) && (
                            <div key={index} className="stack-box">
                                <h4 className="text-center">{stack.stackName}</h4>
                                <div className="row">
                                    {quantityParameters.map((param, i) => {
                                        const value = stack[param.name];
                                        return value ? (
                                            <div className="col-md-4 grid-margin" key={i}>
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h3>{param.parameter}</h3>
                                                        <h6>{value}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )
                    ))
            )}

            <DailyHistoryModal
                isOpen={showHistoryModal}
                onRequestClose={() => setShowHistoryModal(false)}
            />
        </div>
    );
};

export default QuantityFlow;
