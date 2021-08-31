import React from "react";

export default props => {
  return (
    <div className="wrapper text-4">
      <div className="name-subject-fields wrapper text-2">
        <div className="text from-name">{props.fromName}</div>
        <div className="text">{props.subject}</div>
      </div>
    </div>
  );
};
