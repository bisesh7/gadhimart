import axios from "axios";
import bcrypt from "bcryptjs";

export default {
  // called when the user attempts to log in
  login: ({ username, password }) => {
    const request = new Request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: process.env.REACT_APP_ADMIN_KEY,
      }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((auth) => {
        sessionStorage.setItem("AuthToken", auth.token);
      });
  },

  // called when the user clicks on the logout button
  logout: () => {
    sessionStorage.removeItem("AuthToken");
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      sessionStorage.removeItem("AuthToken");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return sessionStorage.getItem("AuthToken")
      ? Promise.resolve()
      : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};
