import React from 'react';
import { NavLink } from 'react-router-dom';

const Error = () => {
    return (
        <div className="container">
            <div style={{ minHeight: "85vh", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                {/* Inline SVG for loading animation */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style={{ width: "150px", marginBottom: 20 }}>
                    <path fill="none" d="M0 0h200v200H0z" />
                    <path fill="none" strokeLinecap="round" stroke="#236A80" strokeWidth="11" transform-origin="center" d="M70 95.5V112m0-84v16.5m0 0a25.5 25.5 0 1 0 0 51 25.5 25.5 0 0 0 0-51Zm36.4 4.5L92 57.3M33.6 91 48 82.7m0-25.5L33.6 49m58.5 33.8 14.3 8.2">
                        <animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="1s" values="0;-120" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite" />
                    </path>
                    <path fill="none" strokeLinecap="round" stroke="#236A80" strokeWidth="11" transform-origin="center" d="M130 155.5V172m0-84v16.5m0 0a25.5 25.5 0 1 0 0 51 25.5 25.5 0 0 0 0-51Zm36.4 4.5-14.3 8.3M93.6 151l14.3-8.3m0-25.4L93.6 109m58.5 33.8 14.3 8.2">
                        <animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="1s" values="0;120" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite" />
                    </path>
                </svg>
                
                <h2 className="mb-3">PAGE IS LOADING</h2>
                <NavLink to="/" className="btn btn-primary" style={{ fontSize: 18 }}> Back To Login Page </NavLink>
            </div>
        </div>
    );
}

export default Error;