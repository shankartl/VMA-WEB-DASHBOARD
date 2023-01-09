import React from "react";
import { FiHome, FiUsers } from "react-icons/fi";
import { BsListCheck } from "react-icons/bs";

const adminMenu = [
  {
    name: "Home",
    link: "/admin/home",
    icon: <FiHome />,
  },
  {
    name: "Surveys",
    submenu: [
      { name: "Pre-lesson tests", link: "/admin/lessontest" },
      { name: "Post-lesson tests", link: "/admin/postLessonTest" },
      { name: "Score Comparison", link: "/admin/scoreComparison" },
      { name: "Survey", link: "/admin/survey" },
    ],
    link: "/admin/lessontest",
    icon: <BsListCheck />,
  },

  {
    name: "User Management",
    link: "/admin/userManagement",
    icon: <FiUsers />,
  },
];

export default adminMenu;
