import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import AllPosts from "./components/AllPosts";
import Details from './components/Details';
import Create from './components/Create';
import {toast} from "react-toastify";

function App() {
  return ( 
    <div className="app">
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" exact element={<AllPosts/>}></Route>
          <Route path="/details/:id" exact element={<Details/>}></Route>
          <Route path="/newblog" exact element={<Create/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
