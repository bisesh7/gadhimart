import React, { cloneElement } from "react";
import {
  ArrayField,
  ArrayInput,
  Button,
  ChipField,
  Create,
  CreateButton,
  Datagrid,
  Edit,
  ExportButton,
  List,
  sanitizeListRestProps,
  Show,
  SimpleForm,
  SimpleFormIterator,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  TextInput,
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
            .post("/api/provinceWithDistricts/createLists", {
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
        label="Generate Provinces"
      >
        <NoteAddIcon />
      </Button>
    </TopToolbar>
  );
};

export const ProvincewithdistrictList = (props) => (
  <List title="Provinces with districts" actions={<ListActions />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="province" />
      <TextField source="id" />
      <TextField source="name" />
      <ArrayField source="districts">
        <SingleFieldList>
          <ChipField source="district" />
        </SingleFieldList>
      </ArrayField>
    </Datagrid>
  </List>
);

export const ProvincewithdistrictCreate = (props) => (
  <Create {...props} undoable={false}>
    <SimpleForm>
      <TextInput source="province" />
      <TextInput source="id" />
      <TextInput source="name" />
      <ArrayInput source="districts">
        <SimpleFormIterator>
          <TextInput source="district" />
          <TextInput source="key" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);

export const ProvincewithdistrictEdit = (props) => (
  <Edit {...props} undoable={false}>
    <SimpleForm>
      <TextInput source="province" />
      <TextInput source="id" />
      <TextInput source="name" />
      <ArrayInput source="districts">
        <SimpleFormIterator>
          <TextInput source="district" />
          <TextInput source="key" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const ProvincewithdistrictShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="province" />
      <TextField source="id" />
      <TextField source="name" />
      <ArrayField source="districts">
        <Datagrid>
          <TextField source="district" />
          <TextField source="key" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
