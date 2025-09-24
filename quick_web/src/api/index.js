import axios from "axios";
import { API_BASE_URL } from "../pages/config";
// import { AuthContext } from "../context/AuthContext";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getCard = async (slug, token) => {
  return api.get(`/cards/${slug}/`, {
    headers: { Authorization: `Token ${token}` },
  });
};
