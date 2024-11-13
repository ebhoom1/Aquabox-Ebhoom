import React, { Component } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./index.css";
import { Outlet } from "react-router-dom";

export default class PublicLayout extends Component {
  render() {
    return (
      <>
        <Header/>
          <Outlet/>
        <Footer/>
      </>
    );
  }
}
