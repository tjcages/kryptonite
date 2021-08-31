import React from "react";

export default props => {
  return (
    <div className="wrapper text-4">
      <div className="name-subject-fields text-2">
        <h2>{props.subject}</h2>
        <h4>{props.fromName}</h4>
      </div>
    </div>
  );
};
