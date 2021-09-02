import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import DOMPurify from 'dompurify'
import MesssageCheckbox from "./MessageCheckbox";

import NameSubjectFields from "./NameSubjectFields";
import {getNameEmail} from '../../../../utils';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faBookmark } from "@fortawesome/free-regular-svg-icons";
import ArrowUp from '../../../../assets/images/arrow-circle-up.svg'
import ArrowDown from '../../../../assets/images/arrow-circle-down.svg'

import './messageRow.scss'

export class MessageItem extends PureComponent {
  constructor(props) {
    super(props);

    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.getMessage = this.getMessage.bind(this);
  }

  onSelectionChange(evt) {
    this.props.onSelectionChange(evt.target.checked, this.props.data.id);
  }

  getMessage(evt) {
    const path = this.props.location.pathname
    this.props.history.push(`inbox/${this.props.data.id}`);
  }

  getFromName(from) {
    const nameEmail = getNameEmail(from);
    return nameEmail.name;
  }

  getFormattedDate(date, fallbackDateObj) {
    let messageDate = moment(date);
    if (!messageDate.isValid()) {
      messageDate = moment(fallbackDateObj.parserFn(fallbackDateObj.date));
    }
    const nowDate = moment(new Date());
    const isMessageFromToday = messageDate.format("YYYYMMDD") === nowDate.format("YYYYMMDD");
    let formattedDate;
    if (isMessageFromToday) {
      formattedDate = messageDate.format("h:mm A");
    }
    else {
      if (messageDate.year() !== nowDate.year()) {
        formattedDate = messageDate.format("YYYY/MM/DD");
      }
      else {
        formattedDate = messageDate.format("MMM D");
      }
    }
    return formattedDate;
  }

  render() {
    const receivedHeader = this.props.data.payload.headers.find(el => el.name.toUpperCase() === "X-RECEIVED");
    const date = receivedHeader ? receivedHeader.value.split(";")[1].trim() : "";
    let formattedDate = this.getFormattedDate(date, {date: this.props.data.internalDate, parserFn: parseInt});
    const unread = this.props.data.labelIds.indexOf("UNREAD") > -1 ? " font-weight-bold" : "";
    const selected = this.props.data.selected ? " selected" : "";
    const subjectHeader = this.props.data.payload.headers.find(el => el.name.toUpperCase() === "SUBJECT");
    const subject = subjectHeader ? subjectHeader.value : "";
    const fromHeader = this.props.data.payload.headers.find(el => el.name.toUpperCase() === "FROM");
    let fromName = fromHeader ? this.getFromName(fromHeader.value) : "undefined";
    const snippet = this.props.data.snippet

    const thread = this.props.thread ? "" : "thread"

    return (
      <div className={`message-row d-flex table-row-wrapper${selected} ${thread}`}>
        <div className="message-horizontal-row">
          <div className="message-image" />
          <div
            onClick={this.getMessage}
            className={`table-row ${unread}`}
          >
            <NameSubjectFields 
              fromName={fromName} 
              subject={subject} 
              snippet={snippet} 
              formattedDate={formattedDate} 
              mimeType={this.props.data.payload.mimeType}
              thread={this.props.thread}
            />
          </div>
        </div>
        <div className="message-actions">
          <div className="first-actions">
            <div className="action-item">
              <FontAwesomeIcon className="action-icon" icon={faComment} size="sm" />
              <h4>Post</h4>
            </div>
            <div className="action-item">
              <FontAwesomeIcon className="action-icon" icon={faBookmark} size="sm" />
              <h4>Save</h4>
            </div>
          </div>
          <div className="second-actions">
            <div className="action-item">
              <img src={ArrowUp} alt="Like" className="action-icon" />
              <h4>160</h4>
            </div>
            <div className="action-item">
              <img src={ArrowDown} alt="Remove" className="action-icon" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MessageItem);
