import axios from "axios";
import { BASE_URL } from "../constants/apiRoutes";

axios.defaults.baseURL = BASE_URL;

export function setAxiosHeader(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    axios.defaults.headers.common["Authorization"] = "";
  }
}
