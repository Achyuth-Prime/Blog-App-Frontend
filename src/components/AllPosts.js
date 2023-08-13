import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import Select from "react-select";
import "./styles.css";
import url from "./url";
import Loading from "./Loading";
import {toast} from "react-toastify";

function AllPosts() {

  const [blogs, setBlogs] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [isLoading,setLoading]=useState(true);

  useEffect(() => {
    axios
      .get(url + `/blogs`)
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
    
    axios
      .get(url + "/blogs/tags")
      .then((res) => {
        const mappedTags = res.data.map((tag)=>(
          {
            value: tag,
            label: tag
          }
        ));
        setAllTags(mappedTags);
        setAvailableTags(mappedTags);
      })
      .catch((err) => console.log(err));
      
  }, []);

  //Tag filter is handled completely on the front end side
  const [isFilterOn, setIsFilterOn] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  // for search using tag 
  async function tagFilterFunction(selectedOptions){
    if (selectedOptions === []) {
      setIsFilterOn(false);
    } 
    else setIsFilterOn(true);

    setSelectedTags(selectedOptions);
    
    const remainingTags = allTags.filter(
      (tag) => !selectedOptions.some((pickedTags) => pickedTags.value === tag.value)
    );
    setAvailableTags(remainingTags);
    
    const temp = blogs.filter((blog) =>
      selectedOptions.every((tag) => blog.tagList.includes(tag.value))
    );
    console.log(temp);
    setFilteredBlogs(temp);
    if(temp.length===0)
      toast.warning("No Data Found");
  }


  //Edit modal open or not
  const [isOpen, setIsOpen] = useState(false);
  //Toggling edit modal on and off --> conditional rendering
  const handleEditClick = () => {
    setIsOpen(!isOpen);
  };

  const [blogtoedit, setblogtoedit] = useState({});
  //Tag manipulation during edit
  const [tagstobeedited, setTagsToBeEdited] = useState([]);
  const [editavailabletags, setEditAvailableTags] = useState([]);

  //Getting the Modal ready---loading required data
  function editPost(blogID){
    const tempEditBlog = blogs.find((i) => {
      return i.blog_id === blogID;
    });
    setblogtoedit(tempEditBlog);
    
    // 1.realize that setState functions are async 
    // 2.we are creating an array of objects/key-value pairs of tags since 3rd party <Select> accepts only that
    const pre_existing_tags = tempEditBlog.tagList.map((tag) => ({ value: tag, label: tag }));
    setTagsToBeEdited(pre_existing_tags);
    
    // The purpose of the code is to filter out the tags from allTags that already exist in pre_existing_tags. 
    // All HO functions use boolean condidtions
    const remainingTags = allTags.filter(
      (tag) => !pre_existing_tags.some((pickedTags) => pickedTags.value === tag.value)
    );
    setEditAvailableTags(remainingTags);
    
    //Openiong the Modal
    handleEditClick();
  }

  //Live edit tag manipulation
  function handleEditSelectedTags(selectedOptions){
    setTagsToBeEdited(selectedOptions);
    const remainingTags = allTags.filter(
      (tag) => !selectedOptions.some((selected) => selected.value === tag.value)
    );
    console.log(selectedOptions);
    setEditAvailableTags(remainingTags);
    setblogtoedit({ ...blogtoedit, tagList: selectedOptions.map(l=>l.label) });
  }

  async function finaliseUpdate() {
    console.log(blogtoedit);
    setLoading(true);
    axios
      .patch(url + `/blogs/${blogtoedit.blog_id}`, blogtoedit)
      .then((response) => {
        console.log(response);
        setLoading(false);
        toast.success("Update Successful");
        handleEditClick();
        const temp = blogs.map((ithblog) => {
          if (ithblog.blog_id === blogtoedit.blog_id)
            return {
              ...ithblog,
              title: blogtoedit.title,
              author: blogtoedit.author,
              body: blogtoedit.body,
              tagList: tagstobeedited.map(l => l.label)
            };
          return ithblog;
        });
        setBlogs(temp);
      })
      .catch((error) => console.error(error));
  }

//Serach by title fetches from backend
var serachTitle;

async function handleSearch(event) {
  axios
    .get(url + `/blogs?keyword=` + event.target.value)
    .then((res) => {
      console.log(res);
      setBlogs(res.data);
      if(res.data.length===0)        
        toast.warning("No Data Found")
    })
    .catch((err) => console.log(err));
}

  async function deletePost(blog_ID) {
    setLoading(true);
    axios
      .delete(url + `/blogs/${blog_ID}`)
      .then((response) => {
        setLoading(false);
        toast.success("Deleted Successfully");
        // blog deleted from back-end but to immediately reflect changes in front end:
        const temp = blogs.filter((i) => i.blog_id !== blog_ID);
        setBlogs(temp);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }

  return (
    <div className="posts"> 

      <div className='searchBar-wrap'> 
        <h2>Search Using Title</h2>
        <input type="text" className="searchInput" value={serachTitle} onChange={handleSearch}/>
      </div>
    
      <center>
        <h2>Tag Filter</h2>
        <Select
          isMulti
          className="tagfilter"
          options={availableTags}
          value={selectedTags}
          onChange={tagFilterFunction}
          placeholder=""
        />
      </center>

    
      <div className="posts-container">
        {/* display all posts if filter off */}
        {
          !isFilterOn &&
          blogs.map((ithblog) => {
            return (
              <Post
                blog={ithblog}
                key={ithblog.blog_id}
                blogID={ithblog.blog_id}
                deletecallbackfunc={deletePost}
                editcallbackfunc={editPost}
              />
            );
          })
        }

        {/* only tag filterd posts displayed */}
        {
          isFilterOn &&
          filteredBlogs.map((ithblog) => {
            return (
              <Post
                blog={ithblog}
                key={ithblog.blog_id}
                blogID={ithblog.blog_id}
                deletecallbackfunc={deletePost}
                editcallbackfunc={editPost}
              />
            );
          })
        }
      </div>
      
      {/* Edit Modal */}
      {
        isOpen && 
        (
          <div className="modal-wrapper">
            <div className="modal">
              <div className="modal-content">
                <p>
                  Title
                  <br />
                  <input
                    type="text"
                    className="titleedit"
                    value={blogtoedit.title}
                    onChange={(e) => {
                      setblogtoedit({ ...blogtoedit, title: e.target.value });
                    }}
                  />
                </p>
                <p>
                  Author
                  <br />
                  <input
                    type="text"
                    className="authoredit"
                    value={blogtoedit.author}
                    onChange={(e) => {
                      setblogtoedit({ ...blogtoedit, author: e.target.value });
                    }}
                  />
                </p>
                <p>
                  <center>
                    <Select
                      id="add-tag"
                      isMulti
                      value={tagstobeedited}
                      options={editavailabletags}
                      onChange={handleEditSelectedTags}
                      placeholder="Select Tags"
                    />
                  </center>
                </p>
                <p>
                  Description <br />
                  <textarea
                    type="text"
                    className="descedit"
                    value={blogtoedit.body}
                    onChange={(e) => {
                      setblogtoedit({ ...blogtoedit, body: e.target.value });
                    }}
                  />
                </p>
                <div className="editbuttons">
                  <button className="cancel" onClick={handleEditClick}>
                    Cancel
                  </button>
                  <button className="finalise" onClick={finaliseUpdate}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        isLoading &&
        <Loading></Loading>
      }
    </div>
  );
}

export default AllPosts;
