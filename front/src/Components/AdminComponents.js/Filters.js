import React, { cloneElement } from "react";
import {
  Button,
  ChipField,
  CreateButton,
  Datagrid,
  ExportButton,
  List,
  sanitizeListRestProps,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
  useListContext,
  useNotify,
  useRefresh,
} from "react-admin";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import axios from "axios";

const ListActions = (props) => {
  const { className, exporter, filters, maxResults, ...rest } = props;
  const {
    currentSort,
    resource,
    displayedFilters,
    filterValues,
    showFilter,
    total,
    basePath,
  } = useListContext();
  const notify = useNotify();
  const refresh = useRefresh();
  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: "button",
        })}
      <ExportButton
        disabled={total === 0}
        resource={resource}
        sort={currentSort}
        filterValues={filterValues}
        maxResults={maxResults}
      />
      <CreateButton basePath={basePath} />
      {/* Add your custom actions */}
      <Button
        onClick={() => {
          axios
            .post("/api/filters/createLists", {
              valid: process.env.REACT_APP_ADMIN_KEY,
            })
            .then((res) => {
              let msg = res.data.msg;

              notify(msg);
              refresh();
            })
            .catch((err) => {
              notify("Error occurred.");
              refresh();
            });
        }}
        label="Generate Filters"
      >
        <NoteAddIcon />
      </Button>
    </TopToolbar>
  );
};

export const FilterList = (props) => (
  <List actions={<ListActions />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ChipField source="vehicleType" />
    </Datagrid>
  </List>
);

const createLists = (filter) => {
  return filter.length ? (
    <ul>
      {filter.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ) : (
    <span>This is not used in motorcycle details.</span>
  );
};

// Since the array is of strings, we need to create the custom field
const TagsField = ({ record, source }) => {
  console.log(record, source);
  return createLists(record[source]);
};
TagsField.defaultProps = {
  addLabel: true,
};

export const FilterShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="vehicleType" />
      <TagsField source="transmissions" />
      <TagsField source="bodyTypes" />
      <TagsField source="conditions" />
      <TagsField source="fuelTypes" />
      <TagsField source="driveTrains" />
      <TagsField source="colors" />
      <TagsField source="seats" />
      <TagsField source="doors" />
      <TagsField source="featuresFrontEnd" />
      <TagsField source="featuresDatabase" />
    </SimpleShowLayout>
  </Show>
);
