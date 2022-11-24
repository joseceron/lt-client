import axios from "axios";
import { API_PATHS } from "@/constants/api-pahts";

const setErr = (e: any, message: string) => {
  return new Error(e.response.data.message || message);
};

export default {
  login(context: any, user: any): Promise<any> {
    return context.dispatch("auth", {
      ...user,
      mode: "login",
    });
  },
  signup(context: any, user: any): Promise<any> {
    return context.dispatch("auth", {
      ...user,
      mode: "signup",
    });
  },
  auth(context: any, payload: any): Promise<any> {
    const mode = payload.mode;
    let url = `${API_PATHS.users}/login`;

    if (mode === "signup") {
      url = `${API_PATHS.users}`;
    }

    return axios
      .post(url, {
        email: payload.email,
        password: payload.password,
      })
      .then((res) => {
        const { id, email, token, isAdmin } = res.data;

        localStorage.setItem("id", id);
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("isAdmin", isAdmin);

        context.commit("setUser", { id, token, email, isAdmin });
      })
      .catch((e) => {
        throw setErr(e, "Fail to login");
      });
  },
  tryLogin(context: any) {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const isAdmin = localStorage.getItem("isAdmin");

    if (id && token && email && isAdmin) {
      context.commit("setUser", { id, email, token, isAdmin });
    }
  },
  logout(context: any) {
    const url = `${API_PATHS.userSession}`
    const token = localStorage.getItem("token")

    return axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then(() => {
      localStorage.removeItem("id")
      localStorage.removeItem("token")
      localStorage.removeItem("email")
      localStorage.removeItem("isAdmin")
      context.commit("setUser", null)
    }).catch((e) => {
        throw setErr(e, "Fail to logout");
    });

  }
};
