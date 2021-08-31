import React from 'react'

import "./homeHeader.scss";

export default function HomeHeader( props ) {
  return (
    <div className="home-header">
      <div className="header-intro">
        <h4>{props.category}</h4>
        <h2>Good morning, Tyler</h2>
      </div>
    </div>
  )
}
