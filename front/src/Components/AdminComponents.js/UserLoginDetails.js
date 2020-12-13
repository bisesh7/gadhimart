import React from "react";
import {
  List,
  Datagrid,
  ReferenceField,
  TextField,
  DateField,
  Show,
  SimpleShowLayout,
  Filter,
  ReferenceInput,
  TextInput,
  DateInput,
  SelectInput,
} from "react-admin";

const UserFilter = (props) => (
  <Filter {...props}>
    <ReferenceInput label="User" source="userId" reference="users" alwaysOn>
      <SelectInput optionText="email" />
    </ReferenceInput>
    <TextInput source="_id" label="Id" />
    <DateInput source="lastLoginDate" label="Last login date" />
    <DateInput source="lastLogoutDate" label="Last logout date" />
  </Filter>
);

export const UserlogindetailList = (props) => (
  <List filters={<UserFilter />} title="User Login Details" {...props}>
    <Datagrid rowClick="show">
      <ReferenceField source="userId" reference="users" link="show">
        <TextField source="email" />
      </ReferenceField>
      <TextField source="id" />
      <DateField source="lastLoginDate" />
      <DateField source="lastLogoutDate" />
      <TextField source="lastLoginTime" />
      <TextField source="lastLogoutTime" />
    </Datagrid>
  </List>
);

export const UserlogindetailShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <ReferenceField source="userId" reference="users" link="show">
        <TextField source="id" />
      </ReferenceField>
      <TextField source="id" />
      <DateField source="lastLoginDate" />
      <DateField source="lastLogoutDate" />
      <TextField source="lastLoginTime" />
      <TextField source="lastLogoutTime" />
    </SimpleShowLayout>
  </Show>
);
