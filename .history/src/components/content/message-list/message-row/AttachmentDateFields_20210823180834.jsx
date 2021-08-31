import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

export default (props) => {
  return (
    <div className="wrapper num-4 bg-light">
      <div className="wrapper num-2 bg-dark">
        <div className="num pr-4">
          {props.hasAttachment ? (
            <FontAwesomeIcon icon={faPaperclip} />
          ) : (
            ""
          )}
        </div>
        <div className="num">{props.formattedDate}</div>
      </div>
    </div>
  );
};
