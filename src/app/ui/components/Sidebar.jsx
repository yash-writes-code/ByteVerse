import React from 'react';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>FitForm</h1>
        {/* <span className="tagline">AI Pose Analyzer</span> */}
      </div>
      
      <div className="exercise-selector">
        <div className="exercise active">
          <div className="exercise-icon">🏋️</div>
          <div className="exercise-name">Bulgarian Split Squat</div>
        </div>
      </div>
{/*       
      <div className="server-status">
        <div className={`status-indicator ${error ? 'error' : webcamInitializing || modelLoading ? 'connecting' : 'connected'}`}></div>
        <span className="status-text">
          {error ? 'Error: ' + error : 
           webcamInitializing ? 'Initializing webcam...' :
           modelLoading ? 'Loading Model...' : 
           'Ready'}
        </span>
      </div> */}
    </div>
  );
}

export default Sidebar;