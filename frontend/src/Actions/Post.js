import axios from "axios";

export const likePost= () => async (dispatch) => {
    try {
      dispatch({
        type: "likeRequest",
      });
  
      const { data } = await axios.get("/api/v1/users");
  
      dispatch({
        type: "likeSuccess",
        payload: data.users,
      });
    } catch (error) {
      dispatch({
        type: "likeFailure",
        payload: error.response.data.message,
      });
    }
  };
  