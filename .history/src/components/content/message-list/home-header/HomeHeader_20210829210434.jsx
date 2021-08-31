import React from 'react'

import "./homeHeader.scss";

export default function HomeHeader( props ) {
  console.log(props.category)
  return (
    <div className="home-header">
      <div className="header-intro">
        <h2>{props.category}</h2>
      </div>
    </div>
  )
}
