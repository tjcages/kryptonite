import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import { bindActionCreators, compose } from "redux";
import moment from "moment";
import {
  getEmailMessage,
  modifyMessages
} from "../actions/message-list.actions";

import {getNameEmail} from '../../../../utils';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faHeart } from "@fortawesome/free-solid-svg-icons";

import MessageToolbar from "../message-toolbar/MessageToolbar";

import "./messageContent.scss";

export class MessageContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: undefined
    };

    this.iframeRef = React.createRef();
    this.modifyMessage = this.modifyMessage.bind(this);
    this.getFormattedDate = this.getFormattedDate.bind(this);
    this.getFromName = this.getFromName.bind(this);
    this.registerScroll = this.registerScroll.bind(this);
  }

  componentDidMount(prevProps) {
    const messageId = this.props.match.params.id;
    this.props.getEmailMessage(messageId);
  }

  componentDidUpdate(prevProps) {
    const { emailMessageResult } = this.props;
    if (!emailMessageResult.loading) {
      if (!emailMessageResult.failed) {
        if (this.iframeRef.current) {
          const { body } = this.iframeRef.current.contentWindow.document;
          body.style.margin = "0px";
          body.style.fontFamily = "Arial, Helvetica, sans-serif";
          body.style.fontSize = "13px";
          body.innerHTML = this.props.emailMessageResult.body;

          body.onscroll = function(){
            console.log("scrolling!")
          };
        }
      } else {
        if (!this.state.errorMessage) {
          this.setState({
            errorMessage: emailMessageResult.error.result.error.message,
            modal: true
          });
        }
      }
    }
  }

  renderSpinner() {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center  ">
        <FontAwesomeIcon icon={faSpinner} spin size="5x" />
      </div>
    );
  }

  renderErrorModal() {
    return <Redirect to="/notfound" />;
  }

  modifyMessage(addLabelIds, removeLabelIds) {
    const id = this.props.emailMessageResult.result.id;
    const actionParams = {
      ...(addLabelIds && { addLabelIds }),
      ...(removeLabelIds && { removeLabelIds })
    };
    this.props.modifyMessages({ ids: [id], ...actionParams });
    this.props.history.goBack();
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

  getFromName(from) {
    const nameEmail = getNameEmail(from);
    return nameEmail.name;
  }

  registerScroll(e) {
    console.log("popp " + e)
  }

  render() {
    if (this.props.emailMessageResult.loading) {
      return this.renderSpinner();
    }

    console.log(this.props.emailMessageResult)
    const headers = this.props.emailMessageResult.result
    let formattedDate = ""
    let subject = ""
    let fromName = "Poop bear!"

    console.log(headers)
    if (headers) {
      const receivedHeader = headers.messageHeaders.find(el => el.name.toUpperCase() === "X-RECEIVED");
      const date = receivedHeader ? receivedHeader.value.split(";")[1].trim() : "";
      formattedDate = this.getFormattedDate(date, {date: headers.messageHeaders.internalDate, parserFn: parseInt});
      // const unread = this.props.data.labelIds.indexOf("UNREAD") > -1 ? " font-weight-bold" : "";
      // const selected = this.props.data.selected ? " selected" : "";
      const subjectHeader = headers.messageHeaders.find(el => el.name.toUpperCase() === "SUBJECT");
      subject = subjectHeader ? subjectHeader.value : "";
      const fromHeader = headers.messageHeaders.find(el => el.name.toUpperCase() === "FROM");
      fromName = fromHeader ? this.getFromName(fromHeader.value) : "undefined";
    }

    return (
      <React.Fragment>
        <MessageToolbar 
          onClick={this.modifyMessage} 
          messageResult={this.props.emailMessageResult}
        />
        <div className="message-header">
          <div className="message-profile">
            <div className="profile-avatar medium" />
            <div>
              <h2 className="from-name" >{subject}</h2>
              <div className="inline">
                <h3>{fromName}</h3>
                <h3>•</h3>
                <h3>{formattedDate}</h3>
              </div>
            </div>
          </div>
          <div className="content-actions">
            <div className="mr-2">
              <button className="action-btn">
                <h5 className="action-text">Save</h5>
              </button>
            </div>
            <div className="mr-2">
              <button className="action-btn">
                <FontAwesomeIcon
                  style={{margin: 'auto'}}
                  title="Reply"
                  icon={faHeart}
                  size="lg"
                />
                <h5 className="action-text">Like</h5>
              </button>
            </div>
          </div>

        </div>
        <div className="d-flex justify-content-center align-items-center message-content">
          {this.props.emailMessageResult.loading ? this.renderSpinner() : null}
          {this.state.errorMessage ? (
            this.renderErrorModal()
          ) : (
            <iframe
              ref={this.iframeRef}
              title="Message contents"
              id="message-iframe"
              onScroll={this.registerScroll}
              style={{
                display: this.props.emailMessageResult.loading
                  ? "none"
                  : "block"
              }}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  emailMessageResult: state.emailMessageResult
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getEmailMessage,
      modifyMessages
    },
    dispatch
  );

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MessageContent);
