import React from "react";
import { Divider } from "antd";
import "./PageHeader.scss";

const PageHeader = ({ pageTitle = "", isShowDivider = true }) => {
  return (
    <div className="page-header-container">
      <div className="page-title">{pageTitle}</div>
      {isShowDivider && <Divider className="divider-line"/>}
    </div>
  );
};

export default PageHeader;
