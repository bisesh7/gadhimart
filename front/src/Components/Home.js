import React, { Component, useEffect, useContext, useState } from "react";
import NavbarComponent from "./HomeComponents/Navbar";
import Slogan from "./HomeComponents/Slogan";
import SearchBar from "./HomeComponents/SearchBar";
import BodyType from "./HomeComponents/BodyTypes";
import PopularMakes from "./HomeComponents/PopularMakes";
import AllMakes from "./HomeComponents/AllMakes";
import { AuthContext } from "../Contexts/AuthContext";
import { SocketContext } from "../Contexts/SocketContext";
import { checkAuth, clearCarDetailsInSessionStorage } from "../methods";
import axios from "axios";
import socketIOClient from "socket.io-client";
import PopularListings from "./HomeComponents/PopularListings";
import Footer from "./Footer";

const host = window.location.hostname;
const ENDPOINT = "http://" + host + ":5000";
let socket;

const Home = (props) => {
  const { auth, dispatch } = useContext(AuthContext);
  const { socketDispatch } = useContext(SocketContext);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      checkAuth(dispatch, props);
    }
    clearCarDetailsInSessionStorage();
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      const promises = [];

      promises.push(
        axios
          .post("/api/users/deleteForgotPassword", {
            valid: "ValID32",
            email: auth.user.email,
          })
          .then(() => {
            console.log("Handled operation 2 succesfully.");
          }),
        axios
          .post("/api/notification/deleteNotificationsOlderThan25Days")
          .then(() => {
            console.log("Handled operation 3 succesfully.");
          })
      );

      Promise.all(promises)
        .then(() => {
          console.log("2,3 conplete");
        })
        .catch((err) => {
          console.log("Error has occurred");
        });
    }
  }, [auth]);

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);

    // Set the socket in the context
    socketDispatch({
      type: "LOGIN_PASS",
      socket,
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [socketDispatch, ENDPOINT]);

  return (
    <div className="Home">
      <NavbarComponent history={props.history} location={props.location} />
      <Slogan />
      <SearchBar history={props.history} />
      <PopularListings history={props.history} />
      <BodyType history={props.history} />
      <PopularMakes history={props.history} />
      <AllMakes history={props.history} />
      <Footer className="mb-4" history={props.history} />
    </div>
  );
};

export default Home;
