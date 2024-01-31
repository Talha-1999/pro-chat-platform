import Cookies from "js-cookie";
import axios from "axios";

export const useApisHook = () => {
  const useFetchUserByToken = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.data) {
        return { path: "/", data: res.data };
      }
      return { path: "/login", data: [] };
    } catch (err) {
      return { path: "/login", data: [] };
    }
  };

  const signupApi = async (mainData, image) => {
    try {
      const formData = new FormData();
      for (let [key, value] of Object.entries(mainData)) {
        formData.append(key, value);
      }
      formData.append("profile_img", image);
      const res = await axios.post("/user/register", formData);
      const { data } = res;
      return data;
    } catch (err) {
      console.log(err, "Register Api");
      alert("Error in Register Api");
    }
  };

  const loginApi = async (Data) => {
    try {
      const res = await axios.post("/user/login", Data);
      const { access_token, user } = res.data;
      if (access_token.length && user) {
        Cookies.set("token", access_token, { expires: 7 });
        return user;
      }
      return null;
    } catch (err) {
      console.log(err, "login Api");
      alert("Error in Login Api");
    }
  };

  const addRecipientApi = async (payload) => {
    try {
      const token = Cookies.get("token");
      await axios.post("/conversation/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return;
    } catch (err) {
      alert("Error in Add Recipient");
    }
  };

  const fetchAllConversation = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get("/conversation/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { data } = res;
      if (data.length) return data;
    } catch (err) {
      alert("Error fetch All Conversations");
    }
  };

  const fetchMessagesByConversationId = async (id) => {
    try {
      const res = await axios.get(`/messages/${id}`);
      const { data } = res;
      return data.messages;
    } catch (err) {
      alert("Error Fetch Messages by Conversation Id");
    }
  };

  const postSendMessages = async (conversationId, content) => {
    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        `/messages/send/${conversationId}`,
        content,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (err) {
      alert("Error Send Message");
    }
  };

  return {
    signupApi,
    loginApi,
    useFetchUserByToken,
    fetchAllConversation,
    fetchMessagesByConversationId,
    postSendMessages,
    addRecipientApi,
  };
};
