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

    const headers = this.props.emailMessageResult.result
    let formattedDate = ""
    let subject = ""
    let fromName = "Poop bear!"

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
      <div className="content">
        {/* <MessageToolbar 
          onClick={this.modifyMessage} 
          messageResult={this.props.emailMessageResult}
          scroll={this.state.scroll}
        /> */}
        <div className="message-header">
          <div className="message-profile">
            <div className="profile-avatar medium" />
            <div>
              <h2 className="from-name" >{subject}</h2>
              <div className="inline">
                <h3>{fromName}</h3>
                <h3>???</h3>
                <h3>{formattedDate}</h3>
              </div>
            </div>
          </div>
          <div className="content-actions">
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
          </div>

        </div>
        <div className="d-flex justify-content-center message-content">
          {this.props.emailMessageResult.loading ? this.renderSpinner() : null}
          {this.state.errorMessage ? (
            this.renderErrorModal()
          ) : (
            <div 
              className="iframe"
              dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.props.emailMessageResult.body, { ADD_ATTR: ['target', 'style'] })}}
            />
          )}
          <base target="_blank"/>
        </div>

        {/* <div className="next">
          <h4 style={{opacity: 0.4}}>Up next</h4>
          <div className="next-message">
              <div className="next-image">
                <img src="https://media.sailthru.com/composer/images/sailthru-prod-6ks/moonlighting.png" alt="" />
              </div>
              <div className="next-titles">
                <h3 className="from-name" >{subject}</h3>
                <h4>{fromName}</h4>
              </div>
          </div>
          <div className="next-message">
              <div className="next-titles">
                <h3 className="from-name" >{subject}</h3>
                <h4>{fromName}</h4>
              </div>
          </div>
        </div> */}
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
