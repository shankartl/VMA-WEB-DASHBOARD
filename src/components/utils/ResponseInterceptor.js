import { useEffect, useRef } from "react";
import { useAuth, useLogout } from "../../services/auth";
import axios from "axios";
import useCustomToastr from "../../utils/useCustomToastr";
import api from "../../services/api";

export const ResponseInterceptor = () => {
  const logout = useLogout();
  const toast = useCustomToastr();
  const { user = null, token } = useAuth();
  api.setHeader(token);

  const interceptorId = useRef(null);

  useEffect(() => {
    interceptorId.current = axios.interceptors.response.use(undefined, (error) => {
      switch (error.response.status) {
        case 0:
          error.response.data = { message: "Error connecting to the server!" };
          throw error;
        case 400:
        case 403:
        case 404:
        case 405:
        case 500:
          throw error;
        case 401:
          logout();
          break;
        default:
          break;
      }
      return Promise.reject(error);
    });
    return () => {
      axios.interceptors.response.eject(interceptorId.current);
    };
  }, [logout, toast]);
  return null;
};
