"use client";

import { useApisHook } from "@/hooks/useApi";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const AppContext = createContext(null);

axios.defaults.baseURL = "http://localhost:5000";

const AppProvider = ({ children }) => {
  const {
    useFetchUserByToken,
    loginApi,
    signupApi,
    fetchAllConversation,
    fetchMessagesByConversationId,
    postSendMessages,
    addRecipientApi,
  } = useApisHook();

  const router = useRouter();
  const [user, setUser] = useState({});
  const [allConversations, setAllConversations] = useState([]);
  const [startConversation, setStartConversation] = useState({});
  const [socket, setSocket] = useState();
  const [newMessage, setNewMessage] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastmsg, setLastMsg] = useState({});

  useEffect(() => {
    (async () => {
      const res = await useFetchUserByToken();
      const { path, data } = res;
      router.push(path);
      setUser(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetchAllConversation();
      setAllConversations(res);
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(newMessage).length) {
      setStartConversation({
        ...startConversation,
        messages: startConversation.messages?.length
          ? [...startConversation.messages, newMessage]
          : [newMessage],
      });
    }
  }, [newMessage]);

  const handleRecieve = useCallback((data) => {
    setNewMessage(data);
  }, []);

  const handleOnlineUser = useCallback((data) => {
    setOnlineUsers(data);
  });

  const handelCreateConversation = useCallback((data) => {
    console.log(data, "event");
    setAllConversations((prev) => [...prev, data]);
  }, []);

  const handleLastMessage = useCallback((data) => {
    setLastMsg(data);
  });

  useEffect(() => {
    let _socket = io("http://localhost:5000", {
      query: {
        userId: Object.keys(user).length && user.id,
      },
    });

    setSocket(_socket);
    _socket.on("recieveMessage", handleRecieve);
    _socket.on("recieveOnlineUser", handleOnlineUser);
    _socket.on("reciveConversationCreate", handelCreateConversation);
    _socket.on("lastMessage", handleLastMessage);
    return () => {
      setSocket();
      _socket.off("recieveMessage", handleRecieve);
      _socket.off("recieveOnlineUser", handleOnlineUser);
      _socket.off("reciveConversationCreate", handelCreateConversation);
      _socket.off("lastMessage", handleLastMessage);
      _socket.disconnect();
    };
  }, [user]);

  const onhandleLogin = async (data) => {
    const res = await loginApi(data);
    if (res) {
      setUser(res);
      router.push("/");
    }
  };

  const onHandleAddRecipient = async (data) => {
    const res = await addRecipientApi(data);
    return res;
  };

  const onHandleSignup = async (data, img) => {
    const { profilePhoto, ...all } = data;
    const res = await signupApi(all, profilePhoto);
    if (res.message == "User Created Successfully") {
      router.push("/signup");
    } else if (res.message == "User Available") {
      return { status: true, message: "User Available" };
    } else {
      return { status: true, message: "Retry" };
    }
  };

  const onHandleStartConversation = async (val) => {
    const { conversationId, ...other } = val;
    const messages = await fetchMessagesByConversationId(conversationId);
    setStartConversation({ conversationId, recipient: other, messages });
  };

  const onHandleSendMessage = async (conversationId, content) => {
    await postSendMessages(conversationId, content);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        onhandleLogin,
        onHandleSignup,
        onHandleAddRecipient,
        allConversations,
        onHandleStartConversation,
        startConversation,
        onlineUsers,
        socket,
        lastmsg,
        onHandleSendMessage,
        newMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
