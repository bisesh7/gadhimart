import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Input, FormGroup, Label, Button } from "reactstrap";
import axios from "axios";
import { stringify } from "query-string";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartsData = () => {
  const [dataOption, setDataOption] = useState("Users");
  const [respectTo, setRespectTo] = useState("Year");
  const [yearSelected, setYearSelected] = useState(new Date().getFullYear());
  const [monthSelected, setMonthSelected] = useState(1);
  const [vehicleSelected, setVehicleSelected] = useState("Car");
  const [yearOptions, setYearOptions] = useState([]);
  const [chartData, setChartsData] = useState([
    {
      name: "Jan",
      total: 4000,
    },
    {
      name: "Feb",
      total: 3000,
    },
    {
      name: "Mar",
      total: 2000,
    },
    {
      name: "Apr",
      total: 2780,
    },
    {
      name: "May",
      total: 1890,
    },
    {
      name: "Jun",
      total: 2390,
    },
    {
      name: "Jul",
      total: 3490,
    },
    {
      name: "Aug",
      total: 3490,
    },
    {
      name: "Sep",
      total: 3490,
    },
    {
      name: "Oct",
      total: 3490,
    },
    {
      name: "Nov",
      total: 3490,
    },
    {
      name: "Dec",
      total: 3490,
    },
  ]);
  const [data, setData] = useState(null);

  useEffect(() => {
    let yearOptions = [];
    for (let year = 2020; year <= parseInt(new Date().getFullYear()); year++) {
      yearOptions.push(<option>{year}</option>);
    }
    setYearOptions(yearOptions);
  }, []);

  const vehicleSelect = (
    <div>
      <Label>Vehicle</Label>
      <Input
        type="select"
        defaultValue="Car"
        onChange={(e) => {
          setVehicleSelected(e.target.value);
        }}
      >
        <option>Car</option>
        <option>Motorcycle</option>
      </Input>
    </div>
  );

  useEffect(() => {
    if (data !== null) {
      const newData = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];

          newData.push({ name: key, total: value });
        }
      }
      setChartsData(newData);
    }
  }, [data]);

  const getNewData = (data) => {
    if (respectTo === "Year") {
      const newData = {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      };
      data.forEach((user) => {
        const date = new Date(user.date);

        if (yearSelected === parseInt(date.getFullYear())) {
          const month = parseInt(date.getMonth()) + 1;
          switch (month) {
            case 1:
              newData["Jan"] += 1;
              break;

            case 2:
              newData["Feb"] += 1;
              break;

            case 3:
              newData["Mar"] += 1;
              break;

            case 4:
              newData["Apr"] += 1;
              break;

            case 5:
              newData["May"] += 1;
              break;

            case 6:
              newData["Jun"] += 1;
              break;

            case 7:
              newData["Jul"] += 1;
              break;

            case 8:
              newData["Aug"] += 1;
              break;

            case 9:
              newData["Sep"] += 1;
              break;

            case 10:
              newData["Oct"] += 1;
              break;

            case 11:
              newData["Nov"] += 1;
              break;

            case 12:
              newData["Dec"] += 1;
              break;

            default:
              break;
          }
        }
      });

      return newData;
    } else {
      const newData = {};

      data.forEach((user) => {
        const date = new Date(user.date);
        const month = parseInt(date.getMonth()) + 1;
        if (
          yearSelected === parseInt(date.getFullYear()) &&
          monthSelected === month
        ) {
          const day = parseInt(date.getDate());
          if (typeof newData[day] === "undefined") {
            newData[day] = 1;
          } else {
            newData[day]++;
          }
        }
      });

      // Adding the days when users didnt sign up
      switch (monthSelected) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          for (let x = 0; x < 31; x++) {
            if (x in newData) {
              continue;
            } else {
              newData[x] = 0;
            }
          }
          break;
        case 2:
        case 4:
        case 6:
        case 9:
        case 11:
          for (let x = 0; x < 30; x++) {
            if (x in newData) {
              continue;
            } else {
              newData[x] = 0;
            }
          }
          break;

        default:
          break;
      }
      return newData;
    }
  };

  const handleCreateChart = (e) => {
    e.preventDefault();
    let query = stringify({
      filter: JSON.stringify({}),
    });
    switch (dataOption) {
      case "Listings":
        switch (vehicleSelected) {
          case "Car":
            axios
              .get(`/api/car?${query}`, {
                headers: {
                  Authorization: process.env.REACT_APP_ADMIN_KEY,
                },
              })
              .then(({ data }) => {
                setData(getNewData(data.data));
              })
              .catch((err) => {
                console.log(err);
              });
            break;
          case "Motorcycle":
            axios
              .get(`/api/motorcycle?${query}`, {
                headers: {
                  Authorization: process.env.REACT_APP_ADMIN_KEY,
                },
              })
              .then(({ data }) => {
                setData(getNewData(data.data));
              })
              .catch((err) => {
                console.log(err);
              });
            break;

          default:
            break;
        }
        break;
      case "Listing Reports":
        switch (vehicleSelected) {
          case "Car":
            axios
              .get(`/api/reportCarListings?${query}`, {
                headers: {
                  Authorization: process.env.REACT_APP_ADMIN_KEY,
                },
              })
              .then(({ data }) => {
                setData(getNewData(data.data));
              })
              .catch((err) => {
                console.log(err);
              });
            break;
          case "Motorcycle":
            axios
              .get(`/api/reportMotorcycleListings?${query}`, {
                headers: {
                  Authorization: process.env.REACT_APP_ADMIN_KEY,
                },
              })
              .then(({ data }) => {
                setData(getNewData(data.data));
              })
              .catch((err) => {
                console.log(err);
              });
            break;

          default:
            break;
        }
        break;
      case "Users":
        axios
          .get(`/api/users?${query}`, {
            headers: {
              Authorization: process.env.REACT_APP_ADMIN_KEY,
            },
          })
          .then(({ data }) => {
            setData(getNewData(data.data));
          })
          .catch((err) => {
            console.log(err);
          });

        break;
      case "User Reports":
        axios
          .get(`/api/reportUser`, {
            headers: {
              Authorization: process.env.REACT_APP_ADMIN_KEY,
            },
          })
          .then(({ data }) => {
            setData(getNewData(data.data));
          })
          .catch((err) => {
            console.log(err);
          });

        break;
      case "Chat Sessions":
        axios
          .get(`/api/message`, {
            headers: {
              Authorization: process.env.REACT_APP_ADMIN_KEY,
            },
          })
          .then(({ data }) => {
            setData(getNewData(data.data));
          })
          .catch((err) => {
            console.log(err);
          });

        break;
      case "Block Lists":
        axios
          .get(`/api/blockUser?${query}`, {
            headers: {
              Authorization: process.env.REACT_APP_ADMIN_KEY,
            },
          })
          .then(({ data }) => {
            setData(getNewData(data.data));
          })
          .catch((err) => {
            console.log(err);
          });

        break;
      case "Forgot Passwords":
        axios
          .get(`/api/forgotPasswords?${query}`, {
            headers: {
              Authorization: process.env.REACT_APP_ADMIN_KEY,
            },
          })
          .then(({ data }) => {
            setData(getNewData(data.data));
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      default:
        setChartsData([
          { x: 1, y: 1, label: "Jan" },
          { x: 2, y: 2, label: "Feb" },
          { x: 3, y: 3, label: "Mar" },
          { x: 4, y: 4, label: "Apr" },
          { x: 5, y: 5, label: "May" },
          { x: 6, y: 6, label: "Jun" },
          { x: 7, y: 7, label: "Jul" },
          { x: 8, y: 8, label: "Aug" },
          { x: 9, y: 9, label: "Sep" },
          { x: 10, y: 10, label: "Oct" },
          { x: 11, y: 11, label: "Nov" },
          { x: 12, y: 12, label: "Dec" },
        ]);
        break;
    }
  };

  return (
    <Fragment>
      <Row>
        <Col md="9">
          <div style={{ width: "100%", height: 300 }} className="mt-4">
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#1881d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
        <Col md="3" className="pt-3">
          <FormGroup>
            <Label>Data</Label>
            <Input
              type="select"
              onChange={(e) => setDataOption(e.target.value)}
            >
              <option>Users</option>
              <option>Listings</option>
              <option>User Reports</option>
              <option>Listing Reports</option>
              <option>Chat Sessions</option>
              <option>Block Lists</option>
              <option>Forgot Passwords</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Respect To</Label>
            <Input
              type="select"
              defaultValue="Year"
              onChange={(e) => {
                setRespectTo(e.target.value);
                switch (e.target.value) {
                  case "Year":
                    setYearSelected(new Date().getFullYear());
                    break;
                  case "Month":
                    setMonthSelected(1);
                    break;
                  default:
                    break;
                }
              }}
            >
              <option>Year</option>
              <option>Month</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Year</Label>
            <Input
              type="select"
              onChange={(e) => {
                console.log(e.target.value);
                setYearSelected(parseInt(e.target.value));
              }}
              defaultValue={new Date().getFullYear()}
            >
              {yearOptions}
            </Input>
          </FormGroup>
          <FormGroup hidden={respectTo === "Year"}>
            <Label>Month</Label>
            <Input
              type="select"
              onChange={(e) => {
                setMonthSelected(parseInt(e.target.value));
              }}
              defaultValue={1}
            >
              <option value="1">Jan</option>
              <option value="2">Feb</option>
              <option value="3">Mar</option>
              <option value="4">Apr</option>
              <option value="5">May</option>
              <option value="6">Jun</option>
              <option value="7">Jul</option>
              <option value="8">Aug</option>
              <option value="9">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dec</option>
            </Input>
          </FormGroup>

          <FormGroup
            hidden={
              dataOption === "Users" ||
              dataOption === "User Reports" ||
              dataOption === "Chat Sessions" ||
              dataOption === "Block Lists" ||
              dataOption === "Forgot Passwords"
            }
          >
            <Label>Vehicle</Label>
            <Input
              type="select"
              defaultValue="Car"
              onChange={(e) => {
                setVehicleSelected(e.target.value);
              }}
            >
              <option>Car</option>
              <option>Motorcycle</option>
            </Input>
          </FormGroup>

          <FormGroup className="mt-3">
            <Button color="secondary" outline block onClick={handleCreateChart}>
              Create Chart
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ChartsData;
