import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Loading from "./Loading";
import {toast} from "react-toastify";

function Comments(props) {
  const [isLoading,setLoading]=useState(true);

  function genrandid(){
    return Math.floor(Math.random()*100000);
  }
  
  const [allComments,setAllComments]=useState([]);
  const [NewCommentPost,setNewCommentPost]=useState("");

  const [isCommentOpen, setisCommentOpen] = useState(false);
  const handleEditClick = () => {
    setisCommentOpen(!isCommentOpen);
  }; 
  const [commenttoedit,setcommenttoedit]=useState();

  useEffect(()=>{
    axios
    .get(props.url+"/blogs/"+props.blogid+"/comments")
    .then(res=>{
      setLoading(false);
      setAllComments(res.data)
    })
    .catch(err=>console.log(err))
  },[])


  async function addComment(e){
    e.preventDefault();
    if(NewCommentPost==="")
    {
      toast.error("Comment can't be empty.");
    }
    else
    {
      setLoading(true);
      const data = {
        user_id:genrandid(),
        blog_id:props.blogid,
        body:NewCommentPost
      };
      axios
	    .post(props.url+"/blogs/"+props.blogid+"/comments",data)
      .then(response => {
        toast.success("(:Commented Successful:)");
        setLoading(false);
        // console.log(response.data);
        const temp = [...allComments,response.data];
        setNewCommentPost('');
        setAllComments(temp);
      })
      .catch(function (error) {
          console.error(error);
      });
    }
  }
  
  async function deletecmntxt(comment_id){
    setLoading(true);
    axios
    .delete(props.url+"/blogs/"+props.blogid+"/comments/"+comment_id)
    .then(response => {
      toast.success("Comment Deleted");
      setLoading(false);
      const temp = allComments.filter((i)=> i.comment_id!==comment_id);
      setAllComments(temp);
    })
    .catch(error => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  }

  function editcmntxt(comment_id){
    setcommenttoedit(allComments.find(i=>{return i.comment_id===comment_id}));
    handleEditClick();
  }

  async function finaliseUpdate(){
    setLoading(true);
    axios
    .patch(props.url+`/blogs/${props.blogid}/comments/${commenttoedit.comment_id}`,commenttoedit)
    .then(response => {
      toast.success("Comment Edited");
      setLoading(false);
      handleEditClick();
      const temp=allComments.map( (ithcomment)=>
        {
          if(ithcomment.comment_id===commenttoedit.comment_id)
            return {...ithcomment,body:commenttoedit.body};
          return ithcomment;
        }
      ); 
    setAllComments(temp);
    })
    .catch(error => console.error(error)); 
  }

  return (
    <div className="Comments">
      <h2>Comment Section</h2>
      
      <form className="cmntform" onSubmit={addComment}>
        <textarea name="newcomment" id="newcomment" value={NewCommentPost} onChange={(e)=>{setNewCommentPost(e.target.value)}} ></textarea>
        <button type="submit">Add Comment</button>
      </form>

      <br />

      <li>
        <ul>
        {
          allComments.map( (i)=> 
            {
              return <div className="cmntxtdiv" key={i.comment_id}> 
                      <li>
                        {i.body} 
                        {/* ({i.user_id}) */}
                      </li> 
                      <button onClick={()=>editcmntxt(i.comment_id)}>Edit</button>
                      <button onClick={()=>deletecmntxt(i.comment_id)}>Delete</button>
                    </div>
            }
          )
        }
        {
          isCommentOpen && 
          (
            <div className="modal-wrapper">
              <div className="modal-comment">
                <div className="modal-content">
                  <p>
                    <textarea type="text" className="commentedit" value={commenttoedit.body} onChange={(e)=>{setcommenttoedit({...commenttoedit,body:e.target.value})}}/>
                  </p>
                  <div className='editbuttons'>
                    <button className="cancel" onClick={handleEditClick}>Cancel</button>
                    <button className="finalise" onClick={finaliseUpdate}>Update</button>
                  </div>
                </div>
              </div>
            </div>
          )
        } 
        </ul>      
      </li>

      {
        isLoading &&
        <Loading></Loading>
      }
    </div>
  );
}
export default Comments;