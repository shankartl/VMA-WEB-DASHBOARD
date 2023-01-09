import React from "react";
import { AiOutlineAppstore, AiOutlineSetting, AiOutlineCheckCircle } from "react-icons/ai";

const userMenu = [
  {
    name: "Home",
    link: "/student/home",
    icon: <AiOutlineAppstore />,
  },
  {
    name: "Completed",
    link: "/student/completed",
    icon: <AiOutlineCheckCircle />,
  },
  {
    name: "Settings",
    link: "/student/settings",
    icon: <AiOutlineSetting />,
  },
];

export default userMenu;
