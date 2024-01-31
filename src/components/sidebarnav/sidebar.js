import "@/styles/sidebarnav.scss";
import { Avatar, Button, Text } from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import CustomModal from "../modal/modal";
import { useContext, useState } from "react";
import { AppContext } from "@/context/appContext";

const SideNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AppContext);

  const onHandleModal = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className="navflex1">
        <Avatar
          src={`http://localhost:5000/user/images/${user.profilePhoto}`}
        />
        <Text fontSize="lg" fontWeight={"600"}>
          {user.username}
        </Text>
      </div>
      <div className="navflex2">
        <Button colorScheme={"transparent"} onClick={onHandleModal}>
          <FaRegEdit />
        </Button>
      </div>
      <CustomModal handleModal={onHandleModal} isOpen={isOpen} />
    </>
  );
};
export default SideNavBar;
