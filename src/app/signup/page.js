"use client";

import { useContext, useState } from "react";
import {
  Alert,
  AlertIcon,
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useApisHook } from "@/hooks/useApi";

import "@/styles/signup.scss";
import Link from "next/link";
import { AppContext } from "@/context/appContext";

const form = [
  {
    lable: "Username",
    name: "username",
  },
  {
    lable: "Email",
    name: "email",
  },
  {
    lable: "Password",
    name: "password",
  },
  {
    lable: "PhoneNumber",
    name: "phone_number",
  },
];
export default function Signup() {
  const { onHandleSignup } = useContext(AppContext);
  const [error, setError] = useState({
    status: false,
    message: "Please Fill Form",
  });

  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    profilePhoto: "",
  });
  const [imgUrl, setImageUrl] = useState("");

  const { username, email, password, phone_number } = inputValue;

  const handleSignup = async () => {
    if (email == "" || password == "" || username == "" || phone_number == "") {
      setError({ ...error, status: true });
    } else {
      const res = await onHandleSignup(inputValue);
      setError({ ...error, status: res?.status, message: res?.message });
      setTimeout(() => {
        setError({ ...error, status: false, message: "Please Fill Form" });
      }, 3000);
    }
  };

  const onHandleForm = (e) => {
    setError(false);
    const name = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [name]: value });
  };

  const onhandleFile = (e) => {
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setImageUrl(imageUrl);
    setInputValue({ ...inputValue, profilePhoto: e.target.files[0] });
  };

  return (
    <div className="main">
      <div className="container">
        <h2 className="heading">Register</h2>
        {error.status && (
          <Alert status="error">
            <AlertIcon />
            {error.message}
          </Alert>
        )}
        <FormControl>
          {form.map((val, key) => (
            <div key={key}>
              <FormLabel size={"md"} style={{ color: "white", paddingTop: 10 }}>
                {val.lable}
              </FormLabel>
              <Input
                required
                size={"sm"}
                borderRadius={"5px"}
                color={"white"}
                backgroundColor={"rgba(25, 24, 24, 0.789) !important"}
                borderColor={"gray"}
                type={val.name}
                name={val.name}
                onChange={onHandleForm}
              />
            </div>
          ))}
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={onhandleFile}
          />
          <label htmlFor="file" className="imgdiv">
            <Avatar src={imgUrl} />
            <span style={{ color: "white" }}>Add an Avatar</span>
          </label>
          <div className="formbutton">
            <Button color={"white"} onClick={handleSignup}>
              Button
            </Button>
          </div>
          <div className="footer">
            You do have an account?{" "}
            <Link href="/login">
              <span style={{ color: "#f6a504" }}>Login</span>
            </Link>
          </div>
        </FormControl>
      </div>
    </div>
  );
}
