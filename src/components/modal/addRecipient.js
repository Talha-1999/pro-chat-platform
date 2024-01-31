"use client";

import { useContext, useState } from "react";
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import "@/styles/login.scss";
import { AppContext } from "@/context/appContext";

const form = [
  {
    lable: "Recipient",
    name: "recipient",
    placeHolder: "Enter Recipient Number",
  },
  {
    lable: "Message",
    name: "message",
    placeHolder: "Enter Message (Optional)",
  },
];
export default function AddRecipientForm({ handleModal }) {
  const { onHandleAddRecipient } = useContext(AppContext);
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState({
    recipient: "",
    message: "",
  });

  const handleRecipient = async () => {
    try {
      if (inputValue.recipient == "") {
        setError(true);
      } else {
        const data = {
          recipient_number: inputValue.recipient,
          message: inputValue.message,
        };
        await onHandleAddRecipient(data);
        handleModal(false);
      }
    } catch (error) {
      alert("ADD Recipient");
    }
  };

  const onHandleForm = (e) => {
    setError(false);
    const name = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [name]: value });
  };

  return (
    <div>
      {error && (
        <Alert status={"error"}>
          <AlertIcon />
          Please Fill Form
        </Alert>
      )}

      <FormControl>
        {form.map((val, key) => (
          <div key={key}>
            <FormLabel size={"md"} style={{ color: "white", paddingTop: 20 }}>
              {val.lable}
            </FormLabel>
            <Input
              required
              placeholder={val.placeHolder}
              size={"sm"}
              style={{
                height: `${val.name == "message" ? "100px" : ""}`,
                paddingBottom: `${val.name == "message" ? "50px" : ""}`,
              }}
              borderRadius={"5px"}
              color={"white"}
              backgroundColor={"rgba(25, 24, 24, 0.789)"}
              borderColor={"gray"}
              type={val.name}
              name={val.name}
              onChange={onHandleForm}
            />
          </div>
        ))}
        <div className="loginformbutton" style={{ padding: 20 }}>
          <Button color={"white"} onClick={handleRecipient}>
            Submit
          </Button>
        </div>
      </FormControl>
    </div>
  );
}
