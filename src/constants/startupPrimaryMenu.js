import React from "react";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { GiProgression } from "react-icons/gi";

const startupPrimaryMenu = [
  {
    name: "Home",
    link: "/startupPrimary/home",
    icon: <AiFillHome color="white" />,
  },
  {
    name: "Profile",
    link: "/startupPrimary/profile",
    icon: <GiProgression color="white" />,
  },
  {
    name: "Admins",
    link: "/startupPrimary/users",
    icon: <AiOutlineUser color="white" />,
  },
  {
    name: "Visitors List",
    link: "/startupPrimary/visitors",
    icon: <AiOutlineUser color="white" />,
  },
];

export default startupPrimaryMenu;
