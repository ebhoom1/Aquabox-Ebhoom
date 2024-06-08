import React from 'react'
import { ToastContainer } from 'react-toastify'

const ListOfSupportAnalyserMakeAndModel = () => {
    return (
        <div className="main-panel">
        <div className="content-wrapper">
          {/* <!-- Page Title Header Starts--> */}
          <div className="row page-title-header">
            <div className="col-12">
              <div className="page-header">
                <h4 className="page-title">Control and Monitor Dashboard</h4>
                <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
                 
                  <ul className="quick-links ml-auto">
                    <li>
                      <a href="#">Settings</a>
                    </li>
                    <li>
                      <a href="#">Option 1</a>
                    </li>
                    <li>
                      <a href="#">option 2</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
        <div className="card-body">
        <div className="row mt-5">
    <div className="col-md-12">

    <h2>List Of Support Analyser Make and Model</h2>
    
    <div className="table-responsive mt-3">
    <table className="table table-bordered">
    <thead>
      <tr>
        <th>SI.No</th>
        <th>Date</th>
        <th>User Remark Comment</th>
        <th>Admin Remark Comment</th>
        <th>Verified/Decliend</th>
        
        
      </tr>
    </thead>
    <tbody>
      <td>1</td>
      <td>31/03/2024</td>
      <td>Comment from user</td>
      <td>Comment from admin</td>
      <td>Verified</td>
    
        
      
    </tbody>
    </table>
    </div>
    
              <ToastContainer/>
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

export default ListOfSupportAnalyserMakeAndModel
