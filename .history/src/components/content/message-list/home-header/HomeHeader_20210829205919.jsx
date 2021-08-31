import React from 'react'

import "./homeHeader.scss";

export default function HomeHeader( props ) {
  console.log(props.category)
  return (
    <div className="home-header">
      <div className="header-intro">
        {/* <h4>{JSON.stringify(props.category)}</h4> */}
        <h2>Good morning, Tyler</h2>
      </div>
    </div>
  )
}
