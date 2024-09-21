import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './index.css'

export default class Header extends Component {
  render() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light ">
        <div className="container">
         <Link className='link' to="/account">  <img src="/assets/images/logo.png" className="footer-img" /></Link>

         <Link className="link" to="/download-Iot-Data-By-userName"><button className='signup-button'>Download Data</button></Link>
         
          
        </div>
      </nav>
    )
  }
}
