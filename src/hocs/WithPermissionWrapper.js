import React from "react";
import { useAuth } from "../services/auth";

const WithPermissionWrapper = (props) => {
  const { user } = useAuth();
  const hasPermission = user.role === props.permission;
  return hasPermission ? props.children : <></>;
};

export default WithPermissionWrapper;
