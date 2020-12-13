import React, { useState, useEffect, useContext, Fragment } from "react";
import {
  Container,
  Jumbotron,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import AuthNavbar from "../AuthNavbar";
import {
  clearCarDetailsInSessionStorage,
  promiseCheckAuth,
} from "../../methods";
import { AuthContext } from "../../Contexts/AuthContext";
import sellSignSVG from "../../icons/sign.svg";

const Sell = (props) => {
  useEffect(() => {
    clearCarDetailsInSessionStorage();
  }, [clearCarDetailsInSessionStorage]);

  const { auth, dispatch } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // If user is not logged in redirect to home
  useEffect(() => {
    if (!auth.isAuthenticated) {
      setCheckingAuth(true);

      promiseCheckAuth()
        .then((res) => {
          if (res.data.isAuthenticated) {
            dispatch({
              type: "LOGIN_PASS",
              user: res.data.user,
            });
            setIsAuthenticated(true);
          } else {
            dispatch({
              type: "LOGIN_FAIL",
            });
            setIsAuthenticated(false);
            props.history.push("/signIn");
          }
          setCheckingAuth(false);
        })
        .catch((err) => {
          dispatch({
            type: "LOGIN_FAIL",
          });
          setIsAuthenticated(false);
          props.history.push("/signIn");
        });
    } else {
      setIsAuthenticated(true);
    }

    clearCarDetailsInSessionStorage();
  }, [auth]);

  const [checked, setChecked] = useState("car");

  const handleChange = (e) => {
    setChecked(e.target.value);
    console.log(e.target.value);
  };

  const handleSellButton = () => {
    if (checked === "car") {
      props.history.push("/sell/car");
    } else if (checked === "motorcycle") {
      props.history.push("/sell/motorcycle");
    }
  };

  return (
    <Fragment>
      {isAuthenticated || !checkingAuth ? (
        <div>
          <AuthNavbar history={props.history} location={props.location} />
          <Container className="mt-5">
            <Jumbotron>
              <img src={sellSignSVG} width="100" alt="" />
              <h1 className="display-4">What do you want to sell?</h1>
              <p className="lead">
                <FormGroup tag="fieldset">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="radio1"
                        value="car"
                        defaultChecked={checked === "car"}
                        className="mt-2"
                        onChange={handleChange}
                      />{" "}
                      Car
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        value="motorcycle"
                        name="radio1"
                        className="mt-2"
                        defaultChecked={checked === "motorcycle"}
                        onChange={handleChange}
                      />{" "}
                      Motorcycle
                    </Label>
                  </FormGroup>
                </FormGroup>
              </p>
              <hr className="my-2" />
              <p className="lead mt-4">
                <Button color="primary" onClick={handleSellButton}>
                  Sell
                </Button>
              </p>
            </Jumbotron>
          </Container>
        </div>
      ) : null}
    </Fragment>
  );
};

export default Sell;
