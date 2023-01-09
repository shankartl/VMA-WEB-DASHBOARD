import React from "react";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { GiProgression } from "react-icons/gi";

const startupSecondaryMenu = [
  {
    name: "Home",
    link: "/startupSecondary/home",
    icon: <AiFillHome color="white" />,
  },
  {
    name: "Profile",
    link: "/startupSecondary/profile",
    icon: <GiProgression color="white" />,
  },
  {
    name: "Admins",
    link: "/startupSecondary/users",
    icon: <AiOutlineUser color="white" />,
  },
  {
    name: "Visitors List",
    link: "/startupSecondary/visitors",
    icon: <AiOutlineUser color="white" />,
  },
];

export default startupSecondaryMenu;
