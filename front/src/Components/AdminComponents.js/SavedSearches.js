import React, { useState, Fragment, useEffect } from "react";
import {
  List,
  TextField,
  ReferenceArrayField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  ChipField,
  Filter,
  ReferenceInput,
  SelectInput,
  TextInput,
  NumberField,
  useShowController,
} from "react-admin";
import CustomizableDatagrid from "ra-customizable-datagrid";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const SavedSearchesFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_id" label="Id" />
    <SelectInput
      source="vehicleType"
      label="Vehicle"
      choices={[
        { id: "Car", name: "Car" },
        { id: "Motorcycle", name: "Motorcycle" },
      ]}
      resettable={true}
    />
    <ReferenceInput label="Saved By" source="userIds" reference="users">
      <SelectInput optionText="email" />
    </ReferenceInput>
    <TextInput resettable multiline source="filters" label="Filters JSON" />
  </Filter>
);

export const SavedsearchList = (props) => (
  <List title="Saved Searches" filters={<SavedSearchesFilter />} {...props}>
    <CustomizableDatagrid rowClick="show">
      <TextField source="id" />
      <ReferenceArrayField
        source="userIds"
        reference="users"
        label="Saved By"
        link="show"
      >
        <SingleFieldList>
          <ChipField source="email" />
        </SingleFieldList>
      </ReferenceArrayField>
      <TextField source="filters" />
      <NumberField source="totalSaved" />
      <TextField source="vehicleType" label="Vehicle" />
    </CustomizableDatagrid>
  </List>
);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(key, value) {
  return { key, value };
}

export const SavedsearchShow = (props) => {
  const {
    record, // record fetched via dataProvider.getOne() based on the id from the location
  } = useShowController(props);

  const [data, setData] = useState(null);
  const classes = useStyles();

  const generateDataFromRows = (rows) => {
    setData(
      <Fragment>
        <small className="text-muted mb-3 mt-2">Filters</small>
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
    if (typeof record !== "undefined" && record.filters) {
      for (const key in record.filters) {
        if (record.filters.hasOwnProperty(key)) {
          const value = record.filters[key];
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
        <TextField source="id" />
        <ReferenceArrayField source="userIds" reference="users" link="show">
          <SingleFieldList>
            <ChipField source="email" />
          </SingleFieldList>
        </ReferenceArrayField>
        <NumberField source="totalSaved" />
        <TextField source="vehicleType" label="Vehicle" />
        {data}
      </SimpleShowLayout>
    </Show>
  );
};
