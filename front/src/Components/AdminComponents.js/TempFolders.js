import React, { cloneElement, useMemo } from "react";
import {
  List,
  ReferenceField,
  DateField,
  TextField,
  Show,
  SimpleShowLayout,
  ListButton,
  Filter,
  TextInput,
  DateInput,
  ExportButton,
  Button,
  TopToolbar,
  sanitizeListRestProps,
  useListContext,
  useNotify,
  useRefresh,
} from "react-admin";
import CustomizableDatagrid from "ra-customizable-datagrid";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import IconEvent from "@material-ui/icons/Event";
import axios from "axios";

const TempFolderFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_id" label="Id" />
    <DateInput source="date" label="Date" />
  </Filter>
);

const ListActions = (props) => {
  const { className, exporter, filters, maxResults, ...rest } = props;
  const {
    currentSort,
    resource,
    displayedFilters,
    filterValues,
    showFilter,
    total,
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
      {/* Add your custom actions */}
      <Button
        onClick={() => {
          axios
            .delete("/api/tempFolders/deleteBeforeToday", {
              headers: {
                Authorization: process.env.REACT_APP_ADMIN_KEY,
              },
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
        label="Delete Before Today"
      >
        <IconEvent />
      </Button>
    </TopToolbar>
  );
};

export const TempfolderList = (props) => (
  <List
    title="Temp Folders"
    filters={<TempFolderFilter />}
    actions={<ListActions />}
    {...props}
  >
    <CustomizableDatagrid rowClick="show">
      <ReferenceField source="user" reference="users" link="show">
        <TextField source="email" />
      </ReferenceField>
      <TextField source="id" />
      <DateField source="date" />
      <TextField source="uniqueId" />
    </CustomizableDatagrid>
  </List>
);

const TempFolderShowActions = ({ basePath, data, resource }) => {
  return (
    <div className="d-flex justify-content-end">
      <ListButton basePath={basePath} label="Back" icon={<ChevronLeft />} />
    </div>
  );
};

export const TempfolderShow = (props) => (
  <Show actions={<TempFolderShowActions />} {...props}>
    <SimpleShowLayout>
      <ReferenceField source="user" reference="users" link="show">
        <TextField source="email" />
      </ReferenceField>
      <TextField source="id" />
      <DateField source="date" />
      <TextField source="uniqueId" />
    </SimpleShowLayout>
  </Show>
);
