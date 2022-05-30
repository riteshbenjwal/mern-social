import React from "react";
import "./Post.css";
import { Link } from "react-router-dom";
import { Avatar, Typography } from "@mui/material";

const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = false,
}) => {
  return (
    <div className="post">
      <div className="postHeader"></div>
      <img src={"postImage"} alt="Post" />
      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{
            height: "3vmax",
            width: "3vmax",
          }}
        />
        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>

        <Typography
          fontWeight={100}
          color="rgba(0,0,0,0.582)"
          style={{ alignSelf: "center" }}
        >
            {caption}
        </Typography>
      </div>
    </div>
  );
};

export default Post;
