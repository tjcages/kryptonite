import React from "react";

import AttachmentDateFields from "./AttachmentDateFields";

export default props => {
  return (
    <div className="wrapper text-4">
      <div className="name-subject-fields text-2">
        <div className="d-flex flex-row">
          <h4 className="name-field">{props.fromName}</h4>
          <h4 className="name-field"> • </h4>
          <h4 className="name-field">{props.formattedDate}</h4>
        </div>
        <h3>{props.subject}</h3>
        {/* <h4>{props.snippet.replaceAll('&#39;', "'").replaceAll('&amp;', "&").replaceAll('&quot;', `"`).replaceAll('&lt;', `@`)}</h4> */}
        {/* <h4 className="more">Read more</h4> */}
      </div>
    </div>
  );
};
