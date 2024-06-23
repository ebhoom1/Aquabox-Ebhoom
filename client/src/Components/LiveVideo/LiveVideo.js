import React, { useEffect,useState } from 'react'
import axios from 'axios';
import MutipleCamera from './MutipleCamera';

const LiveVideo = () => {
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        const fetchVideoUrl = async () => {
          try {
            const response = await axios.get('/api/get-video-url');
            setVideoUrl(response.data.videoUrl);
          } catch (error) {
            console.error('Failed to fetch video URL:', error);
          }
        };
    
        fetchVideoUrl();
      }, []);
    
  return (
    <div className="main-panel">
    <div className="content-wrapper">
      {/* Page Title Header Starts */}
      <div className="row page-title-header">
        <div className="col-12">
          <div className="page-header">
            <h4 className="page-title">Live Emission Dashboard</h4>
            <div className="quick-link-wrapper w-100 d-md-flex flex-md-wrap">
              <ul className="quick-links ml-auto">
                <li><a href="#">Settings</a></li>
                <li><a href="#">Option 1</a></li>
                <li><a href="#">Option 2</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
     
        
           
      <div className="card">
        <div className="card-body">
          <div className="row mt-5">
            <div className="col-md-12">
              <h2>Live Emission Video</h2>
              <video controls autoPlay style={{ width: '100%', height: 'auto' }}>
                  {videoUrl && <source src={videoUrl} type="video/mp4" />}
                  Your browser does not support the video tag.
                </video>
            </div>
          </div>
        </div>
      </div>

        <MutipleCamera/>

    
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
  </div>
  )
}

export default LiveVideo
