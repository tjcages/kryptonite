import React from "react";

export default props => {
  return (
    <div className="wrapper text-4">
      <div className="wrapper d-flex column text-2">
        <div className="text from-name">{props.fromName}</div>
        <div className="text">{props.subject}</div>
      </div>
    </div>
  );
};
