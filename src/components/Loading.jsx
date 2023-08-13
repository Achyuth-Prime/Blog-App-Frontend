import React from 'react'
import "./Loading.css"
import loading from "./loading.gif"

function Loading() {
  return (
    <div className='loadingscreen'>
      <img src={loading} width="150" height="150"></img>
      <h2>...LOADING...</h2>
    </div>
  )
}

export default Loading