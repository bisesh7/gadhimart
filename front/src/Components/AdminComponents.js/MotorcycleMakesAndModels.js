import React, { cloneElement } from "react";
import {
  TextField,
  ArrayField,
  ChipField,
  Datagrid,
  List,
  SingleFieldList,
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  Show,
  SimpleShowLayout,
  Create,
  Filter,
  useListContext,
  useNotify,
  useRefresh,
  TopToolbar,
  sanitizeListRestProps,
  ExportButton,
  CreateButton,
  Button,
} from "react-admin";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import axios from "axios";

const MotorcycleMakesAndModelFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_id" label="Id" />
    <TextInput source="make" label="make" />
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
            .post("/api/motorcycleMakesAndModels/createLists", {
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
        label="Generate Makes"
      >
        <NoteAddIcon />
      </Button>
    </TopToolbar>
  );
};

export const MotorcyclemakesandmodelList = (props) => (
  <List
    filters={<MotorcycleMakesAndModelFilter />}
    title="Motorcycle Makes And Models"
    actions={<ListActions />}
    {...props}
  >
    <Datagrid rowClick="edit">
      <TextField source="make" />
      <TextField source="id" />
      <ArrayField source="models">
        <SingleFieldList>
          <ChipField source="model" />
        </SingleFieldList>
      </ArrayField>
    </Datagrid>
  </List>
);

export const MotorcyclemakesandmodelCreate = (props) => (
  <Create title="Add new make and models" undoable={false} {...props}>
    <SimpleForm>
      <TextInput source="make" />
      <ArrayInput source="models">
        <SimpleFormIterator>
          <TextInput source="model" label="model" />
          <TextInput source="bodyType" label="bodyType" />
          <TextInput source="id" label="id" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);

const EditTitle = ({ record }) => {
  return <span>{record ? `Edit "${record.make}"` : ""}</span>;
};

export const MotorcyclemakesandmodelEdit = (props) => (
  <Edit title={<EditTitle />} undoable={false} {...props}>
    <SimpleForm>
      <TextInput source="make" />
      <ArrayInput source="models">
        <SimpleFormIterator>
          <TextInput source="model" label="model" />
          <TextInput source="bodyType" label="bodyType" />
          <TextInput source="id" label="id" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export const MotorcyclemakesandmodelShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="make" />
      <TextField source="id" />
      <ArrayField source="models">
        <Datagrid>
          <TextField source="model" />
          <TextField source="bodyType" />
          <TextField source="id" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
