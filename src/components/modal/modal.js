import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import AddRecipientForm from "./addRecipient";

export default function CustomModal({ handleModal, isOpen }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModal}>
        <ModalOverlay />
        <ModalContent bg="rgb(26, 25, 25)">
          <ModalHeader color={"#ffa500"} fontSize={"25px"} textAlign={"center"}>
            Add Recipient
          </ModalHeader>
          <ModalCloseButton color={"#ffa500"} />
          <ModalBody>
            <AddRecipientForm handleModal={handleModal} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
