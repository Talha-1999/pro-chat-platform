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
import Link from "next/link";
import { AppContext } from "@/context/appContext";

const form = [
  {
    lable: "Email",
    name: "email",
  },
  {
    lable: "Password",
    name: "password",
  },
];
export default function Login() {
  const { onhandleLogin } = useContext(AppContext);
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  const handleLogin = async () => {
    try {
      if (email == "" || password == "") {
        setError(true);
      } else {
        await onhandleLogin(inputValue);
      }
    } catch (error) {}
  };

  const onHandleForm = (e) => {
    setError(false);
    const name = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [name]: value });
  };

  return (
    <div className="main">
      <div className="container">
        <h2 className="heading">Login</h2>
        {error && (
          <Alert status="error">
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
          <div className="loginformbutton">
            <Button color={"white"} onClick={handleLogin}>
              Button
            </Button>
          </div>
          <div className="footer">
            You don't have an account?{" "}
            <Link href="/signup">
              <span style={{ color: "#f6a504" }}>Register</span>
            </Link>
          </div>
        </FormControl>
      </div>
    </div>
  );
}
