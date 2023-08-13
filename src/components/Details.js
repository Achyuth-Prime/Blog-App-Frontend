import axios from 'axios';
import React,{useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import Comments from './Comments';
import './styles.css'
import url from "./url";
import Loading from "./Loading";
import {toast} from "react-toastify";
// import RandomImage from './RandomImage';
// import SingleImage from './trash/SingleImage';

function Details() {
    const [isLoading,setLoading]=useState(true);
    const {id}=useParams();
    const [deets,setDeets]=useState([]);

    useEffect(()=>{
        axios
        .get(url+"/blogs?blog_id="+id)
        .then(res=>{
            // console.log(res.data[0].tagList);
            setLoading(false);
            setDeets(res.data[0])})
        .catch(err=>console.log(err))
    },[])

    return (
        <div className='deets-container'>
            {/* <img src={deets.thumbnail} className="deets-image" alt="" /> */}
            {/* <SingleImage keyword={deets.tagList}></SingleImage> */}
            <div className='deets-content'>
                <h1>{deets.title}</h1>
                <h3>Authored By: {deets.author}</h3>
                <p>{deets.body}</p>
            </div>
            <Comments blogid={id} url={url}/>
            {/* {
                isLoading &&
                <Loading></Loading>
            } */}
        </div>
    )
}

export default Details;
