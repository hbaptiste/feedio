import React from "react";
import "./ContentWall.css";
import { ContentWrapper } from "./ContentWrapper";

const ContentWall = () => {
  return (
    <div className="cw-main-wrapper">
      <div className="side">My side</div>
      <div className="main">
        <ContentWrapper type={""} mode={""} data={null} />
      </div>
    </div>
  );
};

export default ContentWall;
