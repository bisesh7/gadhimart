import React, { createContext, useReducer } from "react";
import { SocketReducer } from "../Reducers/SocketReducer";

export const SocketContext = createContext();

const SocketContextProvider = (props) => {
    const [socketDetail, socketDispatch] = useReducer(SocketReducer, {
        socket: null,
    });

    return (
        <SocketContext.Provider value={{ socketDetail, socketDispatch }}>
            {props.children}
        </SocketContext.Provider>
    );
};

export default SocketContextProvider;
