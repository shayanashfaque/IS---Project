import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function login(username, password, device) {
  return api.post("/login", { username, password, device });
}

export function fetchLoginEvents() {
  return api.get("/dashboard/logins");
}

export default api;
