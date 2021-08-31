import React, { Component } from "react";


export class Signout extends Component {
  render() {
    return <div title="Sign out of Gmail" onClick={this.props.onSignout} className='sign-out'>Sign Out</div>;
  }
}

export default Signout;
