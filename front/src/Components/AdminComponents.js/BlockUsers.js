import React from "react";
import {
  List,
  TextField,
  Show,
  SimpleShowLayout,
  NumberField,
  ReferenceField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import CustomizableDatagrid from "ra-customizable-datagrid";

const BlockUsersFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_id" label="Id" />
    <ReferenceInput label="User" source="user" reference="users">
      <SelectInput optionText="email" />
    </ReferenceInput>
    <ReferenceInput
      label="Blocked User"
      source="blockedUsers"
      reference="users"
    >
      <SelectInput optionText="email" />
    </ReferenceInput>
  </Filter>
);

export const BlockuserList = (props) => (
  <List title="User's Block List" filters={<BlockUsersFilter />} {...props}>
    <CustomizableDatagrid rowClick="show">
      <TextField source="id" />

      <ReferenceField source="user" reference="users" link="show">
        <TextField source="email" />
      </ReferenceField>

      <ReferenceArrayField
        source="blockedUsers"
        reference="users"
        label="Blocked Users"
        link="show"
      >
        <SingleFieldList>
          <ChipField source="email" />
        </SingleFieldList>
      </ReferenceArrayField>

      <NumberField source="totalBlocked" />
    </CustomizableDatagrid>
  </List>
);

export const BlockuserShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />

      <ReferenceField source="user" reference="users" link="show">
        <TextField source="email" />
      </ReferenceField>

      <ReferenceArrayField
        source="blockedUsers"
        reference="users"
        label="Blocked Users"
        link="show"
      >
        <SingleFieldList>
          <ChipField source="email" />
        </SingleFieldList>
      </ReferenceArrayField>

      <NumberField source="totalBlocked" />
    </SimpleShowLayout>
  </Show>
);
