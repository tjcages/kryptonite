import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import DOMPurify from 'dompurify'
import MesssageCheckbox from "./MessageCheckbox";

import NameSubjectFields from "./NameSubjectFields";
import {getNameEmail} from '../../../../utils';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faFolderPlus } from "@fortawesome/free-solid-svg-icons";

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
    this.props.history.push(`${path}/${this.props.data.id}`);
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
    const body = this.props.data.body

    return (
      <div className={`message-row d-flex table-row-wrapper${selected}`}>
        {/* <MesssageCheckbox
          selected={this.props.data.selected}
          onChange={this.onSelectionChange}
        /> */}
        <div
          onClick={this.getMessage}
          className={`table-row px-2 py-3${unread}`}
        >
          <NameSubjectFields 
            fromName={fromName} 
            subject={subject} 
            snippet={snippet} 
            formattedDate={formattedDate} 
            mimeType={this.props.data.payload.mimeType}
          />
        </div>
        <div style={{overflow: 'hidden', minWidth: '200px', maxWidth: '400px', maxHeight: '200px'}}>
          <div 
            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(body, { ADD_ATTR: ['target', 'style'] })}} 
            style={{transform: 'scale(0.6)', background: 'red', width: '600px', height: '200px'}}
          />
        </div>
        {/* <div className="content-actions">
            <div className="mr-2">
              <button className="action-btn">
                <FontAwesomeIcon
                  style={{margin: 'auto'}}
                  title="Save to collection"
                  icon={faFolderPlus}
                  size="lg"
                />
                <h5 className="action-text">Save</h5>
              </button>
            </div>
            <div className="mr-2">
              <button className="action-btn">
                <FontAwesomeIcon
                  style={{margin: 'auto'}}
                  title="Add to liked"
                  icon={faHeart}
                  size="lg"
                />
                <h5 className="action-text">Like</h5>
              </button>
            </div>
          </div> */}
      </div>
    );
  }
}

export default withRouter(MessageItem);
