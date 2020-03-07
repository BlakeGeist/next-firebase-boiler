import React from "react";
import { connect } from "react-redux";

const LoadingSpinner = ({ isLoading }) => {
    return (
        isLoading &&
      <div className="loader-wrapper">
          <div className="loader"></div>
          <style jsx>{`
          .loader {
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
          }
          .loader-wrapper{
            position: fixed;
            margin: auto;
            height: 100%;
            width: 100%;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(241, 241, 241, 0.7);
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
};

export default connect(state => state)(LoadingSpinner);
