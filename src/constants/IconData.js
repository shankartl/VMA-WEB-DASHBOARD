import GuitarIconData from "../assets/icon/guitar-logo.svg";
import ProfilePicturePlaceHolderData from "../assets/icon/profile-placehilder.svg";
import React from "react";

const GuitarIcon = (props) => <img alt="guitar-icon" src={GuitarIconData} style={{ width: "50%", height: "5.2em" }} {...props} />;
const ProfilePlaceHolder = (props) => (
  <img alt="guitar-icon" src={ProfilePicturePlaceHolderData} style={{ width: 400, height: "5.2em" }} {...props} />
);
export { GuitarIcon, ProfilePlaceHolder };
