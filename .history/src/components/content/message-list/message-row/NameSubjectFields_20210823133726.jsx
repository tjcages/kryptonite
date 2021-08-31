import React from "react";

export default props => {
  return (
    <div className="wrapper text-4">
      <div className="name-subject-fields text-2">
        <h4 className="name-field">{props.fromName}</h4>
        <h3>{props.subject}</h3>
        <h4>{props.snippet.replace('&#39;', "'")}</h4>
        <h4 className="more">Read more</h4>
      </div>
    </div>
  );
};
