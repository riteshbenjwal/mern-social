import React from "react";
import User from "../User/User";
import Post from "../Post/Post"
import "./Home.css";
const Home = () => {
  return (
    <div className="home">
      <div className="homeleft">
         <Post/>
      </div>
      <div className="homeright">
        <User userId={"user._id"} name={"user.name"} avatar={"https://avatars.githubusercontent.com/u/25058652"} />
      </div>
    </div>
  );
};

export default Home;
