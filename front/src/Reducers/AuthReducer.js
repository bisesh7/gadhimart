export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_PASS":
    case "PROFILE_PICTURE_SET":
    case "PROFILE_EDITED":
      console.log({ isAuthenticated: true, user: action.user });
      return { isAuthenticated: true, user: action.user };
    case "LOGOUT_PASS":
    case "LOGIN_FAIL":
      return { isAuthenticated: false, user: {} };
    default:
      return state;
  }
};
