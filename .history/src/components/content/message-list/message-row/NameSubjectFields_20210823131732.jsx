import React from "react";

export default props => {
  return (
    <div className="wrapper text-4">
      <div className="name-subject-fields text-2">
        <h3>{props.subject}</h3>
        <h4>{props.fromName}</h4>
        <h4>{props.tags}</h4>
      </div>
    </div>
  );
};
