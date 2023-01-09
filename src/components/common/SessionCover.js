import { Image } from "@chakra-ui/react";
import React from "react";
import { ACCESSING_GUITAR, DRUMS_IMAGE, GUITAR_IMAGE } from "../../constants/common";
import { useAuth } from "../../services/auth";

const SessionCover = (props) => {
  const { user } = useAuth();
  const accessibleCourse = Object.values(user.accessibleCourses);

  return <Image src={accessibleCourse[0] === ACCESSING_GUITAR ? GUITAR_IMAGE : DRUMS_IMAGE} {...props} />;
};

export default SessionCover;
