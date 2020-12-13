import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  CardBody,
  CardTitle,
  CardSubtitle,
  Card,
  CardImg,
} from "reactstrap";
import CarIcon from "../../icons/new-car.svg";
import FlagIcon from "../../icons/flag.svg";
import UserReportIcon from "../../icons/user.svg";
import NewUsersIcon from "../../icons/new-users.svg";
import ChatIcon from "../../icons/chat.svg";
import FolderIcon from "../../icons/folder.svg";
import axios from "axios";
import { stringify } from "query-string";
import ChartsData from "./ChartsData";

const getCards = (features) => {
  if (typeof features !== "undefined") {
    const totalAnchors = features.length;

    let windowSize = "large";

    let numberOfCols = null;
    switch (windowSize) {
      case "large":
      case "medium":
      case "small":
        numberOfCols = 3;
        break;
      case "extraSmall":
        numberOfCols = 2;
        break;
      default:
        numberOfCols = 3;
    }

    const numberOfRows = Math.ceil(totalAnchors / numberOfCols);

    let anchorRowsAndCols = [];

    // For each columns we need a 4 rows
    for (var x = 0; x < numberOfRows; x++) {
      let cols = [];
      // for each row we need a different index of features
      for (var y = x * numberOfCols; y < x * numberOfCols + numberOfCols; y++) {
        if (typeof features[y] === "undefined") {
          break;
        }

        cols.push(
          <Col xs="6" sm="4">
            {features[y]}
          </Col>
        );
      }
      anchorRowsAndCols.push(<Row className="mt-2">{cols}</Row>);
    }

    return anchorRowsAndCols;
  }
};

export default () => {
  const [datas, setDatas] = useState({});

  useEffect(() => {
    let promises = [];
    let datas = {};
    let date = new Date(Date.now());
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let query = stringify({
      filter: JSON.stringify({ date }),
    });

    promises.push(
      axios
        .get(`api/car?${query}`, {
          headers: {
            Authorization: process.env.REACT_APP_ADMIN_KEY,
          },
        })
        .then(({ data }) => {
          datas.carListingsTotal = data.total;
        }),
      axios
        .get(`api/motorcycle?${query}`, {
          headers: {
            Authorization: process.env.REACT_APP_ADMIN_KEY,
          },
        })
        .then(({ data }) => {
          datas.motorcycleListingsTotal = data.total;
        }),
      axios
        .get(`/api/reportListing/getTotal?${query}`, {
          headers: {
            Authorization: process.env.REACT_APP_ADMIN_KEY,
          },
        })
        .then(({ data }) => {
          datas.listingReportsTotal = data.total;
        }),
      axios
        .get(`/api/reportUser/getTotal?${query}`, {
          headers: {
            Authorization: process.env.REACT_APP_ADMIN_KEY,
          },
        })
        .then(({ data }) => {
          datas.userReportsTotal = data.total;
        }),
      axios
        .post(
          `/api/users/getTotal?${query}`,
          {},
          {
            headers: {
              Authorization: process.env.REACT_APP_ADMIN_KEY,
            },
          }
        )
        .then(({ data }) => {
          datas.usersTotal = data.total;
        }),
      axios
        .get(`/api/message/getTotal?${query}`, {
          headers: {
            Authorization: process.env.REACT_APP_ADMIN_KEY,
          },
        })
        .then(({ data }) => {
          datas.conversationsTotal = data.total;
        }),
      axios
        .post(
          `/api/tempFolders/getTotal?${query}`,
          {},
          {
            headers: {
              Authorization: process.env.REACT_APP_ADMIN_KEY,
            },
          }
        )
        .then(({ data }) => {
          datas.tempFoldersTotal = data.total;
        })
    );
    Promise.all(promises).then(() => {
      setDatas(datas);
    });
  }, []);

  const dashBoardCards = [
    <Card outline color="secondary">
      <CardBody>
        <Row>
          <Col xs="8">
            <CardTitle className="text-primary heading">
              <small>New Listings</small>
            </CardTitle>
            <CardSubtitle className="heading">
              {datas.carListingsTotal + datas.motorcycleListingsTotal}
            </CardSubtitle>
          </Col>
          <Col xs="4">
            <CardImg src={CarIcon} />
          </Col>
        </Row>
      </CardBody>
    </Card>,
    <Card outline color="info">
      <CardBody>
        <Row>
          <Col xs="8">
            <CardTitle className="text-primary heading">
              <small>Listing Reports</small>
            </CardTitle>
            <CardSubtitle className="heading">
              {datas.listingReportsTotal}
            </CardSubtitle>
          </Col>
          <Col xs="4">
            <CardImg src={FlagIcon} />
          </Col>
        </Row>
      </CardBody>
    </Card>,
    <Card outline color="secondary">
      <CardBody>
        <Row>
          <Col xs="8">
            <CardTitle className="text-primary heading">
              <small>User Reports</small>
            </CardTitle>
            <CardSubtitle className="heading">
              {datas.userReportsTotal}
            </CardSubtitle>
          </Col>
          <Col xs="4">
            <CardImg src={UserReportIcon} />
          </Col>
        </Row>
      </CardBody>
    </Card>,
    <Card outline color="info">
      <CardBody>
        <Row>
          <Col xs="8">
            <CardTitle className="text-primary heading">
              <small>New Users</small>
            </CardTitle>
            <CardSubtitle className="heading">{datas.usersTotal}</CardSubtitle>
          </Col>
          <Col xs="4">
            <CardImg src={NewUsersIcon} />
          </Col>
        </Row>
      </CardBody>
    </Card>,
    <Card outline color="secondary">
      <CardBody>
        <Row>
          <Col xs="8">
            <CardTitle className="text-primary heading">
              <small>New Conversations</small>
            </CardTitle>
            <CardSubtitle className="heading">
              {datas.conversationsTotal}
            </CardSubtitle>
          </Col>
          <Col xs="4">
            <CardImg src={ChatIcon} />
          </Col>
        </Row>
      </CardBody>
    </Card>,
    <Card outline color="info">
      <CardBody>
        <Row>
          <Col xs="8">
            <CardTitle className="text-primary heading">
              <small>Temp Folders</small>
            </CardTitle>
            <CardSubtitle className="heading">
              {datas.tempFoldersTotal}
            </CardSubtitle>
          </Col>
          <Col xs="4">
            <CardImg src={FolderIcon} />
          </Col>
        </Row>
      </CardBody>
    </Card>,
  ];

  return (
    <div className="mt-4">
      <React.Fragment>{getCards(dashBoardCards)}</React.Fragment>
      <div className="mt-3">
        <ChartsData />
      </div>
    </div>
  );
};
