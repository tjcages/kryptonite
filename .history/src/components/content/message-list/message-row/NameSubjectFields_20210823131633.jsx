import React from "react";

export default props => {
  return (
    <div className="wrapper text-4">
      <div className="name-subject-fields text-2">
        <h3 className="bold">{props.subject}</h3>
        <h4>{props.fromName}</h4>
      </div>
    </div>
  );
};
