import React, { useState, useEffect, Fragment } from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Show,
  SimpleShowLayout,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  useShowController,
  Filter,
  ReferenceInput,
  SelectInput,
  TextInput,
  DateInput,
} from "react-admin";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(key, value) {
  return { key, value };
}

const NotificationFilter = (props) => (
  <Filter {...props}>
    <ReferenceInput label="User" source="user" reference="users">
      <SelectInput optionText="email" />
    </ReferenceInput>
    <TextInput source="kind" />
    <TextInput source="_id" label="Id" />
    <DateInput source="date" label="Date" />
    <DateInput source="beforeDate" label="Before Date" />
    <DateInput source="afterDate" label="After Date" />
  </Filter>
);

export const NotificationList = (props) => (
  <List filters={<NotificationFilter />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="kind" />
      <TextField source="id" />
      <DateField source="date" />
      <ReferenceArrayField source="user" reference="users" link="show">
        <SingleFieldList>
          <ChipField source="email" />
        </SingleFieldList>
      </ReferenceArrayField>
    </Datagrid>
  </List>
);

export const NotificationShow = (props) => {
  const {
    record, // record fetched via dataProvider.getOne() based on the id from the location
  } = useShowController(props);

  const [data, setData] = useState(null);
  const classes = useStyles();

  const generateDataFromRows = (rows) => {
    setData(
      <Fragment>
        <small className="text-muted mb-3 mt-2">Data</small>
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.key}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fragment>
    );
  };

  useEffect(() => {
    let rows = [];
    if (typeof record !== "undefined" && record.kind === "newMessage") {
      for (const key in record.data) {
        if (record.data.hasOwnProperty(key)) {
          const value = record.data[key];
          rows.push(createData(key, value));
        }
      }
    }
    if (rows.length) {
      generateDataFromRows(rows);
    }
  }, [record]);

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="kind" />
        <TextField source="id" />
        <DateField source="date" />
        <ReferenceArrayField source="user" reference="users" link="show">
          <SingleFieldList>
            <ChipField source="email" />
          </SingleFieldList>
        </ReferenceArrayField>
        {data}
      </SimpleShowLayout>
    </Show>
  );
};
