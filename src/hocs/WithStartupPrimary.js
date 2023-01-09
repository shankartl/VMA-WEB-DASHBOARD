import React from "react";
import { Outlet } from "react-router-dom";
import { redirectToLogin, useAuth } from "../services/auth";
import api from "../services/api";

function WithStartupPrimary() {
  const { user = null, token } = useAuth();
  api.setHeader(token);
  return user && user.role === "startupPrimary" ? <Outlet /> : redirectToLogin();
}

export default WithStartupPrimary;
