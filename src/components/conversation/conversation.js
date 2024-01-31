import { AppContext } from "@/context/appContext";
import "@/styles/conversation.scss";
import { Avatar, Input, Button } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import { GoDeviceCameraVideo } from "react-icons/go";

const Conversation = () => {
  const divRef = useRef(null);
  const [content, setInput] = useState("");
  const { startConversation, user, onHandleSendMessage } =
    useContext(AppContext);

  const { conversationId, recipient, messages } = startConversation;

  useEffect(() => {
    divRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const onSendMessage = async () => {
    if (content != "") {
      await onHandleSendMessage(conversationId, { content });
    }
  };

  const onInputSendMessages = (e) => {
    setInput(e.target.value);
  };

  return (
    <>
      <div className="conversationBar">
        <div>
          <Avatar
            size={"sm"}
            src={`http://localhost:5000/user/images/${recipient?.profilePhoto}`}
          />
          <h1>{recipient?.username}</h1>
        </div>
        <div className="barEnd">
          <div style={{ marginRight: 20 }}>
            <Button
              colorScheme={"transparent"}
              rightIcon={<GoDeviceCameraVideo />}
            />
            <Button colorScheme={"transparent"} rightIcon={<FiPhoneCall />} />
          </div>
        </div>
      </div>
      <div className="conversations">
        {messages
          ?.sort((a, b) => a.id - b.id)
          .map((val, index) => {
            const now = new Date(val.createdAt);
            const options = {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            };
            const formattedTime = now.toLocaleString("en-US", options);
            return (
              <div
                className="messages"
                ref={divRef}
                key={index}
                style={{
                  flexDirection: `${
                    val.author?.id == user.id && "row-reverse"
                  }`,
                }}
              >
                <Avatar
                  size={"sm"}
                  src={`http://localhost:5000/user/images/${val.author?.profilePhoto}`}
                />
                <div style={{ maxWidth: 300 }}>
                  <h2>{val.content}</h2>
                </div>
                <p style={{ fontSize: 12, color: "lightgray" }}>
                  {formattedTime}
                </p>
              </div>
            );
          })}
      </div>

      <div className="conversationsInput">
        <Input
          placeholder="Enter a Message...."
          border={"1px solid orange"}
          onChange={onInputSendMessages}
        />
        <div>
          <BsFillSendFill onClick={onSendMessage} size={25} color="orange" />
        </div>
      </div>
    </>
  );
};
export default Conversation;
