import React, { useContext, useEffect } from "react";
import { Container, Jumbotron, Button } from "reactstrap";
import NavbarComponent from "./HomeComponents/Navbar";
import notFoundSVG from "../icons/error-404.svg";
import { AuthContext } from "../Contexts/AuthContext";
import {
  checkAuth,
  clearCarDetailsInSessionStorage,
  promiseCheckAuth,
} from "../methods";
import Footer from "./Footer";

const NotFoundPage = (props) => {
  const { auth, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      promiseCheckAuth()
        .then((res) => {
          if (res.data.isAuthenticated) {
            dispatch({
              type: "LOGIN_PASS",
              user: res.data.user,
            });
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    clearCarDetailsInSessionStorage();
  }, []);

  return (
    <div>
      <NavbarComponent history={props.history} location={props.location} />
      <Container className="mt-5">
        <Jumbotron>
          <img src={notFoundSVG} width="160" alt="" />
          <h1 className="display-3 mt-3">Not Found!</h1>
          <p className="lead">
            404: We could not find the page you are looking for
          </p>
          <p className="lead">
            <Button
              color="primary"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                props.history.push("/");
              }}
            >
              Go to Home
            </Button>
          </p>
        </Jumbotron>
      </Container>
      <Footer className="mb-4" history={props.history} />
    </div>
  );
};

export default NotFoundPage;
