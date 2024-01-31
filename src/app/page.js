"use client";

import { AppContext } from "@/context/appContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import "@/styles/home.scss";
import SideNavBar from "@/components/sidebarnav/sidebar";
import Contacts from "@/components/contacts/contacts";
import Conversation from "@/components/conversation/conversation";

export default function Home() {
  const router = useRouter();
  const { user, startConversation } = useContext(AppContext);

  useEffect(() => {
    if (user.length) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="home">
      <div className="container">
        <div className="sidebar">
          <div className="sidebarnav">
            <SideNavBar />
          </div>
          <div className="sidebarcontacts">
            <Contacts />
          </div>
        </div>
        <div className="conversation">
          {Object.keys(startConversation).length ? <Conversation /> : ""}
        </div>
      </div>
    </div>
  );
}
