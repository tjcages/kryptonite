import React, { setState, Component } from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import DOMPurify from "dompurify"
import { bindActionCreators, compose } from "redux";
import moment from "moment";
import {
  getEmailMessage,
  modifyMessages
} from "../actions/message-list.actions";

import {getNameEmail} from '../../../../utils';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faHeart, faFolderPlus } from "@fortawesome/free-solid-svg-icons";

import MessageToolbar from "../message-toolbar/MessageToolbar";

import "./messageContent.scss";

export class MessageContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: undefined,
      scroll: {}
    };

    this.iframeRef = React.createRef();
    this.listenToScroll = this.listenToScroll.bind(this);
    this.modifyMessage = this.modifyMessage.bind(this);
    this.getFormattedDate = this.getFormattedDate.bind(this);
    this.getFromName = this.getFromName.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
  }

  componentDidMount(prevProps) {
    const messageId = this.props.match.params.id;
    this.props.getEmailMessage(messageId);

    console.log(messageId)

    // Add an event listener for scroll amount in page
    window.addEventListener('scroll', this.listenToScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll)
  }
  
  listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop
  
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
  
    const scrolled = winScroll / height
  
    this.setState({
      scroll: {
        scrollHeight: winScroll,
        scrollPercent: scrolled,
      }
    })
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

  renderMessage(message) {
    console.log(this.props)
    console.log(message)

    let formattedDate = ""
    let subject = ""
    let fromName = "Subject goes here"

    if (message.payload.headers) {
      const receivedHeader = message.payload.headers.find(el => el.name.toUpperCase() === "X-RECEIVED");
      const date = receivedHeader ? receivedHeader.value.split(";")[1].trim() : "";
      formattedDate = this.getFormattedDate(date, {date: message.payload.headers.internalDate, parserFn: parseInt});
      // const unread = this.props.data.labelIds.indexOf("UNREAD") > -1 ? " font-weight-bold" : "";
      // const selected = this.props.data.selected ? " selected" : "";
      const subjectHeader = message.payload.headers.find(el => el.name.toUpperCase() === "SUBJECT");
      subject = subjectHeader ? subjectHeader.value : "";
      const fromHeader = message.payload.headers.find(el => el.name.toUpperCase() === "FROM");
      fromName = fromHeader ? this.getFromName(fromHeader.value) : "undefined";
    }

    return (
      <div className="content">
        {/* <MessageToolbar 
          onClick={this.modifyMessage} 
          messageResult={this.props.emailMessageResult}
          scroll={this.state.scroll}
        /> */}
        <div className="message-header">
          <div className="message-profile">
            <div className="profile-avatar small" />
            <div>
              <div className="inline">
                <h4 className="h4">{fromName}</h4>
                <h4 className="h4">•</h4>
                <h4 className="h4">{formattedDate}</h4>
              </div>
              <h2 className="from-name" >{subject}</h2>
            </div>
          </div>

        </div>
        <div className="d-flex justify-content-center message-content">
          {message.loading ? this.renderSpinner() : null}
          {this.state.errorMessage ? (
            this.renderErrorModal()
          ) : (
            <div 
              className="iframe"
              dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(message.body, { ADD_ATTR: ['target', 'style'] })}}
            />
          )}
          <base target="_blank"/>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.emailMessageResult.loading) {
      return this.renderSpinner();
    }

    const currentMessageId = this.props.match.params.id
    const message = this.props.messagesResult.messages.find(el => el.id === currentMessageId)
    
    if (message) {
      return this.renderMessage(message)
    } else {
      return this.renderSpinner();
    }
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
