import React,{useState} from 'react'
import { Link } from 'react-router-dom'

function Post(props) {
  const taglist=props.blog.tagList;
  
  return (
    <div className='blog'>
      <Link to={`/details/${props.blog.blog_id}`} className='post-link'>
          <div className="expandpost">
              <div className='content'>
                  <h1>{props.blog.title}</h1>
                    <ul className='tagul'>
                    {taglist.map((tag,index)=>{
                      return <li className='tagss' key={index}>{tag}</li>
                      })}
                    </ul>
                  <h3>Author: {props.blog.author}</h3>
                  <p>{props.blog.body}</p>
              </div>
          </div>
      </Link>
      <button className='blogdeletebutton' onClick={()=>props.deletecallbackfunc(props.blogID)}>Delete</button>
      <button className='blogeditbutton' onClick={()=>props.editcallbackfunc(props.blogID)}>Edit</button>    
    </div>
  )
}

export default Post