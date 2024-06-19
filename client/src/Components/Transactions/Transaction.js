import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchUser } from './../../redux/features/user/userSlice';
import { fetchAllTransactions,fetchTransactionsByUserName } from '../../redux/features/transactions/transactionSlice';

const Transaction = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const transactions = useSelector((state) => state.transactions.transactions);
    const {userData,userType} =useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateUser = async () => {
        const response = await dispatch(fetchUser()).unwrap(); 
      };
      
      if (!userData) {
      validateUser();
      }

      useEffect(()=>{
        if(userData){
            if(userType === 'user'){
                dispatch(fetchTransactionsByUserName(userData.validUserOne.userName))
            }else if (userType === 'admin') {
                dispatch(fetchAllTransactions());
              }
        }
      }, [userData, userType, dispatch])
       
      const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery) {
          dispatch(fetchTransactionsByUserName(searchQuery));
        } else {
          dispatch(fetchAllTransactions());
        }
      };
  return (
   
     
  <div className="main-panel">
  <div className="content-wrapper">
    {/* <!-- Page Title Header Starts--> */}
    <div className="row page-title-header">
      <div className="col-12">
        <div className="page-header">
          <h4 className="page-title">Transaction Dashboard</h4>
          <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
          </div>
        </div>
      </div>
    </div>
    <div className="card">
          <div className="card-body">
            <div className="row mt-5">
              <div className="col-md-12">
                <h2>Payment details Of users</h2>

                {userType === 'admin' && (
                <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
                  <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">
                    Search
                  </button>
                </form>
              )}

                <div className="table-responsive mt-3">
                  
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sl.No</th>
                          <th>User ID</th>
                          <th>Model Name</th>
                          <th>Amount </th>
                          <th>Date</th>         
                        </tr>
                      </thead>
                      <tbody>
                      {transactions.map((transaction, index) => (
                      <tr key={transaction.id}>
                        <td>{index + 1}</td>
                        <td>{transaction.userName}</td>
                        <td>{transaction.modelName}</td>
                        <td>{transaction.amountPaid}</td>
                        <td>{transaction.paymentDate}</td>
                      </tr>
                    ))}
                      </tbody>
                    </table>
                
                </div>

                
              </div>
            </div>
          </div>
        </div>

   
  </div>

  <footer className="footer">
    <div className="container-fluid clearfix">
      <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
        AquaBox Control and Monitor System
      </span>
      <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
        {" "}
        ©{" "}
        <a href="" target="_blank">
          Ebhoom Solutions LLP
        </a>{" "}
        2022
      </span>
    </div>
  </footer>
</div>
    

    
 
  )
}

export default Transaction
