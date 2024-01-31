import { AppContext } from "@/context/appContext";
import "@/styles/contacts.scss";
import { Avatar, AvatarBadge, Text } from "@chakra-ui/react";
import { useContext } from "react";

const Contacts = () => {
  const {
    allConversations,
    user,
    lastmsg,
    onlineUsers,
    onHandleStartConversation,
  } = useContext(AppContext);

  const getDisplay = () => {
    const res = allConversations?.map((val) =>
      val.creator.id == user.id
        ? {
            conversationId: val.id,
            ...val.recipient,
            lastMessageSent: val.lastMessageSent,
          }
        : {
            conversationId: val.id,
            ...val.creator,
            lastMessageSent: val.lastMessageSent,
          }
    );
    for (let i = 0; i < res?.length; i++) {
      const { recipientId, ...other } = lastmsg;
      if (lastmsg.recipientId == res[i].id) {
        res[i].lastMessageSent = other;
      }
    }
    return res;
  };

  getDisplay().sort((a, b) => console.log(a, b));
  return (
    <>
      {getDisplay()?.map((val, index) => {
        const now = new Date(val.lastMessageSent?.createdAt);
        const options = {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        const formattedTime = now.toLocaleString("en-US", options);

        return (
          <div
            className="contactitem"
            key={index}
            onClick={() => onHandleStartConversation(val)}
          >
            <div>
              <Avatar
                src={`http://localhost:5000/user/images/${val.profilePhoto}`}
                size={"md"}
              >
                {onlineUsers.recipientId == val.id &&
                  onlineUsers.status == true && (
                    <AvatarBadge
                      boxSize="0.70rem"
                      borderColor="green.300"
                      bg="green.300"
                    />
                  )}
              </Avatar>
            </div>
            <div className="nameDiv">
              <Text fontSize={"16px"} fontWeight={"bold"}>
                {val.username}
              </Text>
              <Text isTruncated maxInlineSize={150} fontSize={"14px"}>
                {val.lastMessageSent != null && val.lastMessageSent.content}
              </Text>
              <p className="date">
                {formattedTime != "Invalid Date" ? formattedTime : ""}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default Contacts;
