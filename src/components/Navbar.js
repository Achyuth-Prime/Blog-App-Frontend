import React from 'react'
import './styles.css'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className="nav">
        <h1>AV BLOGS</h1>
        <ul className="menu">
            <li><Link to="/" className='menu-btn'>Home</Link></li>
            <li><Link to="/newblog" className='menu-btn'>New Blog</Link></li>
        </ul>
    </div>
  )
}

export default Navbar