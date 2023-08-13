import React,{useState,useEffect} from 'react'
import Select from 'react-select';
import axios from 'axios';
import './styles.css'
import url from "./url";
// axios.defaults.headers.common['ngrok-skip-browser-warning'] = "any value";
import Loading from "./Loading";
import {toast} from "react-toastify";

function Create() {

    const [title,setTitle]=useState('');
    const [author,setAuthor]=useState('');
    const [content,setContent]=useState('');
    const [isLoading,setLoading]=useState(false);

    const [allTags,setAllTags]=useState([]);
    const[availableTags,setAvailableTags]=useState([]);
    useEffect(()=>{
        axios
        .get(url+'/blogs/tags')
        .then((res) => {
            const mappedTags = res.data.map((tag) => ({
              value: tag,
              label: tag,
            }));
            setAllTags(mappedTags);
            setAvailableTags(mappedTags);
        })
        .catch(err=>console.log(err))
      },[])

    const[selectedTags,setSelectedTags]=useState([]);
    function handleSelectedTags(selectedOptions) {
        setSelectedTags(selectedOptions);
        const remainingTags = allTags.filter(
          (tag) => !selectedOptions.some((selected) => selected.value === tag.value)
        );
        setAvailableTags(remainingTags);
    }

    function genrandid(){
        return Math.floor(Math.random()*100000);
    }

    async function handleSubmit(e){
        e.preventDefault();
        const data = {
            user_id: genrandid(),
            title: title,
            author: author,
            body: content,
            tagList: selectedTags.map(keyvalpairs=>{return keyvalpairs.value})
        };
        if(data.body===''||data.title===''||data.author===''||data.tagList===[])
        {
            toast.error("Please fill all the fields.");
        }
        else
        {
            setLoading(true);
            axios
            .post(url+"/blogs",data)
            .then(response => {
                toast.success("(:Published Successfully:)");
                setLoading(false);
                setTitle('');
                setAuthor('');
                setContent('');
                setSelectedTags([]);
                setAvailableTags(allTags);
            })
            .catch(function (error) {
                alert("Blog with same title exists already.");
                setLoading(false);
                setTitle('');
                setAuthor('');
                setContent('');
                setSelectedTags([]);
                setAvailableTags(allTags);
            });
        }        
    }

    return (
        <div className='newpost'>
            <form onSubmit={handleSubmit}>
                <h2>New Post</h2>
                <span>Title:</span><input type="text" name="title" value={title} onChange={e=>{return setTitle(e.target.value)}}></input><br />
                <span>Author:</span><input type="text" name="author" value={author} onChange={e=>{return setAuthor(e.target.value)}}></input><br />
                <span>Tags:</span><center>
                            <Select
                                className='add-tag'
                                isMulti
                                options={availableTags}
                                value={selectedTags}
                                onChange={handleSelectedTags}
                                placeholder="Select Tags"
                            />
                        </center>
                    <br />
                <span>Content:</span><textarea name="description" id="description" value={content} onChange={e=>{return setContent(e.target.value)}} cols="50" rows="15"></textarea>
                <br /> <button type="submit" className='newpostbtn'>Publish</button>
            </form>

            {
                isLoading &&
                <Loading></Loading>
            }
        </div>
    )
}

export default Create


