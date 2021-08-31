import React from 'react'

import "./homeHeader.scss";

import Header from '../../../header/Header'

export default function HomeHeader() {
  return (
    <div className="d-flex flex-row justify-content-space-between">
      <div className="home-header">
        <h4>Friday</h4>
        <h2>Good morning, Tyler</h2>
      </div>
      <Header />
    </div>
  )
}
