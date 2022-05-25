const User = require("../models/User");
const Post = require("../models/Post");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ sucess: false, message: "User already exists" });
    }
    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: " sample_id",
        url: "sample_url",
      },
    });

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexFollowing, 1);

      userToFollow.followers.splice(indexFollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      loggedInUser.following.unshift(userToFollow._id);
      userToFollow.followers.unshift(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { oldpassword, newPassword } = req.body;

    if (!oldpassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Old and new Password",
      });
    }

    const isMatch = await user.matchPassword(oldpassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Old Password",
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email } = req.body;

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    // User Avatar : todo

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const userId = user._id;
    await user.remove();

    //Logout user after remove
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    //Delete all associated Posts

    for (let post = 0; post < posts.length; post++) {
      const postToDelete = await Post.findById(postToDelete[i]);
      await postToDelete.remove();
    }

    //Removing user from  followers following

    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);
      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }

    res.status(200).json({
      success: true,
      message: "Account Removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("posts");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
