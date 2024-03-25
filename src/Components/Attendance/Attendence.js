import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import LeftSideBar from "../LeftSideBar/LeftSideBar";

export default class Attendence extends Component {
  render() {
    return (
      <div className="main-panel">
        <div className="content-wrapper">
          {/* <!-- Page Title Header Starts--> */}
          <div className="row page-title-header">
            <div className="col-12">
              <div className="page-header">
                <h4 className="page-title">Attendance Register</h4>

              </div>
            </div>

          </div>
          {/* <!-- Page Title Header Ends--> */}
          <div className="row">
            <div className="col-12  grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title"></h4>

                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>

                      <tr>
                        <td>Staff 1</td>
                        <td>Messsy</td>
                        <td>7675867586</td>
                        <td>
                          <label className="badge badge-warning">In</label>
                        </td>
                      </tr>

                      <tr>
                        <td>Staff 2</td>
                        <td>Peter</td>
                        <td>8676857685</td>
                        <td>
                          <label className="badge badge-success">Out</label>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>






        </div>
        {/* <!-- content-wrapper ends -->
      <!-- partial:partials/_footer.html --> */}
        <footer className="footer">
          <div className="container-fluid clearfix">
            <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">AquaBox Control and Monitor System</span>
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"> ©  <a href="" target="_blank">Ebhoom Solutions LLP</a> 2022</span>
          </div>
        </footer>
        {/* <!-- partial --> */}
      </div>
    )
  }
}
