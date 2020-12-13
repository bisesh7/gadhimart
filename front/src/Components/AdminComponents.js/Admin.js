import React from "react";
import {
  List,
  Datagrid,
  TextField,
  Show,
  Create,
  TextInput,
  Edit,
  EmailField,
  SimpleForm,
  PasswordInput,
  SimpleShowLayout,
} from "react-admin";

export const AdminList = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <EmailField source="email" />
      </Datagrid>
    </List>
  );
};

export const AdminShow = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <EmailField source="email" />
      </SimpleShowLayout>
    </Show>
  );
};

export const AdminCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="email" />
        <PasswordInput source="password" />
      </SimpleForm>
    </Create>
  );
};

export const AdminEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="email" />
        <TextInput source="password" />
      </SimpleForm>
    </Edit>
  );
};
