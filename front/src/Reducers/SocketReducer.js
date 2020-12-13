export const SocketReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_PASS":
            console.log("Socket is set");
            return { socket: action.socket };
        case "LOGOUT_PASS":
        case "LOGIN_FAIL":
            return { socket: null };
        default:
            return state;
    }
};
