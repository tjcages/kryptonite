import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

export default (props) => {
  return (
    <div className="wrapper num-4">
      <div className="wrapper num-2">
        {props.hasAttachment ? (
          <div className="num mx-0">
            <FontAwesomeIcon icon={faPaperclip} />
          </div>
        ) : (
          ""
        )}
        <div className="num my-auto">{props.formattedDate}</div>
      </div>
    </div>
  );
};
