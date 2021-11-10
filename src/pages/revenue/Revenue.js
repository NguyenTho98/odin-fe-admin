import React from "react";
import { withRouter } from "react-router-dom";
import { PageHeader } from "../../components";
import "./Revenue.scss";
import RevenueList from "./RevenueList";
const Revenue = () => {
  return (
    <div className="revenue-page common-page">
      <div className="revenue-content">
        <PageHeader pageTitle="Doanh thu" />
        <RevenueList />
      </div>
    </div>
  );
};

export default withRouter(Revenue);
