import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
const Notification = () => {
    const [userNotification,setUserNotification] = useState(null)
    const url ="http://localhost:4444"
    const deployed_url = 'https://aquabox-ebhoom-3.onrender.com'

    useEffect(()=>{
        const fetchNotification =async () =>{
            try {
                const response = await axios.get(`${deployed_url}/api/view-notification`);
                const userNotification = response.data.notification;
                console.log("user Notification :",userNotification);
                setUserNotification(userNotification)

            } catch (error) {
                console.error(`Error in Fetching User Notification`,error);
            }
        }
        fetchNotification()
    },[]);
    const handleDeleteNotification = async(notificationId) =>{
        try {
            const shouldDelete = window.confirm('Are you sure?')
            if(shouldDelete){
                const res = await axios.delete(`${deployed_url}/delete-notification/${notificationId}`)
                if(res.status === 200){
                    setUserNotification(prevNotification=>prevNotification.filter(notification=>notification._id !== notificationId))
                    toast.success("Notification deleted Successfully"
                    )
                }
            }
        } catch (error) {
            console.error(`Error deleting Notification:`,error);
            toast.error('Faild to delete Notification')
        }
    }
  return (
    <div className="main-panel">
    <div className="content-wrapper">
      {/* <!-- Page Title Header Starts--> */}
      <div className="row page-title-header">
        <div className="col-12">
          <div className="page-header">
            <h4 className="page-title">Notification  DASHBOARD</h4>
            <p></p>
            <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
             
             <ul className="quick-links ml-auto">
              {/* <h5>Data Interval:</h5> */}

             </ul>
             
           </div>
          </div>
        </div>
      </div>
  <div className="row mt-5">
    <div className="col-12 col-md-4 grid-margin">
          <Link to='/notification-new'>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h3 className="mb-3">Add New Notification</h3>
                  </div>
                </div>
              </div>
            </div>
            </Link>
          </div>
    <div className="col-md-12">
      <h2>Previous Notification Data</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
                <th>Date of Notication Added</th>
                <th>Time of Notification Added</th>
                <th>Admin ID</th>
                <th>Admin Name</th>
                <th>Message</th>
                <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {userNotification && userNotification.map((notification,index)=>(
                    <tr key={index}>
                    <th>{notification.dateOfCalibrationAdded}</th>
                    <th>{notification.timeOfCalibrationAdded}</th>
                    <th>{notification.adminID}</th>
                    <th>{notification.adminName}</th>
                    <th>{notification.message}</th>
                    
                    
                    <td><button type="button"  className="btn btn-danger mb-2" onClick={()=>handleDeleteNotification(notification._id)}> Delete </button></td>

                    </tr>
            ))}
        
           
          </tbody>
        </table>
        <ToastContainer/>
      </div>
    </div>
  </div>
  </div>
  </div>
  )
}

export default Notification
