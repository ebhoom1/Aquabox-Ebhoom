import React from 'react'
import { ToastContainer } from 'react-toastify'

const Subscribe = () => {
  return (
    <div className="main-panel">
    <div className="content-wrapper">
      {/* <!-- Page Title Header Starts--> */}
      <div className="row page-title-header">
        <div className="col-12">
          <div className="page-header">
            <h4 className="page-title">Subscribtion Data</h4>
            <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
             
              
            </div>
          </div>
        </div>
      </div>
      <div className="card">
    <div className="card-body">
    <div className="row mt-5">
<div className="col-md-12">
<form className="form-inline  my-2 my-lg-0">
                    <input
                      className="form-control mr-sm-2"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">
                      Search
                    </button>
                  </form>
<h2>Report</h2>

<div className="table-responsive mt-3">
<table className="table table-bordered">
<thead>
  <tr>
    <th>Sl.No</th>
    <th>User ID</th>
    <th>Name</th>
    <th>Email</th>
    <th>Mobile Number</th>
    <th>Model Name</th>
    <th>Date</th>
    <th>Subscribtion End In</th>
    <th>Subscribtion End Date</th>
    <th>Verified/Decliend</th>
    <th>Pay</th>
 
    
  </tr>
</thead>
<tbody>
  <td>1</td>
  <td>User ID</td>
    <td>Name</td>
    <td>Email</td>
    <td>Mobile Number</td>
    <td>Model Name</td>
    <td>Date</td>
    <td>Subscribtion End In</td>
    <td>Subscribtion End Date</td>
    <td>Verified/Decliend</td>
    <td><button type="button" class="btn btn-primary">Pay</button></td> 
  
    
  
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

export default Subscribe
