import React from "react";

export default props => {
  return (
    <div className="wrapper text-4">
      <div className="name-subject-fields text-2">
        <h4 className="name-field">{props.fromName}</h4>
        <h3>{props.subject}</h3>
        <option>{props.snippet}</option>
      </div>
    </div>
  );
};
