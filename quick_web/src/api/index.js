import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

export const getCard = async (slug, token) => {
  return api.get(`/cards/${slug}/`, {
    headers: { Authorization: `Token ${token}` },
  });
};
