import React from "react";
import { connect } from "react-redux";
import "./Loading.scss";

const Loading = (props) => {
  return (
    <div className={`loading-wrapper ${props.isLoading ? "is-show" : ""}`}>
      <div className="loader-container">
        <div className="loader-icon">
          <img src="assets/images/plusplus_logo.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default connect(
  (state) => ({ isLoading: state.system.isLoading }),
  {}
)(Loading);
