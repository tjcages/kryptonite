import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import MesssageCheckbox from "./MessageCheckbox";

import NameSubjectFields from "./NameSubjectFields";
import AttachmentDateFields from "./AttachmentDateFields";
import {getNameEmail} from '../../../../utils';

import './messageRow.scss'

export class MessageItem extends PureComponent {
  constructor(props) {
    super(props);

    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.getImages = this.getImages.bind(this);
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

  getImages(html) {
    const imgRex = /<img.*?src="(.*?)"[^>]+>/;
    const images = [];
      let img;
      while ((img = imgRex.exec(html))) {
         images.push(img[0]);
         console.log(img)
      }
    return images;
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
    const images = this.getImages(body)
    console.log(images)

    return (
      <div className={`message-row d-flex table-row-wrapper${selected}`}>
        <MesssageCheckbox
          selected={this.props.data.selected}
          onChange={this.onSelectionChange}
        />
        <div className="d-flex flex-column">
          {
            images.map(image => (
              <>
                <h3>Here!</h3>
                <p>{image}</p>
                <div dangerouslySetInnerHTML={{__html: image}}></div>
              </>
            ))
          }
        </div>
        <div
          onClick={this.getMessage}
          className={`table-row px-2 py-3${unread}`}
        >
          <NameSubjectFields fromName={fromName} subject={subject} snippet={snippet}/>
          <AttachmentDateFields
            formattedDate={formattedDate}
            hasAttachment={
              this.props.data.payload.mimeType === "multipart/mixed"
            }
          />
        </div>
      </div>
    );
  }
}

export default withRouter(MessageItem);
