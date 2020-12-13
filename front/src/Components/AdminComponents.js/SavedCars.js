import React from "react";
import {
  List,
  ReferenceField,
  ReferenceArrayField,
  ReferenceFieldController,
  Show,
  SimpleShowLayout,
  TextField,
  ChipField,
  SingleFieldList,
  Filter,
  ReferenceInput,
  SelectInput,
  TextInput,
  NumberField,
} from "react-admin";
import CustomizableDatagrid from "ra-customizable-datagrid";

const SavedCarFilter = (props) => (
  <Filter {...props}>
    <ReferenceInput label="Car" source="vehicleId" reference="car">
      <SelectInput optionText="id" />
    </ReferenceInput>

    <TextInput source="_id" label="Id" />
  </Filter>
);

export const SavedcarList = (props) => (
  <List title="Saved Cars" filters={<SavedCarFilter />} {...props}>
    <CustomizableDatagrid rowClick="show">
      <ReferenceField source="carId" reference="car" link="show">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceFieldController
        label="User"
        reference="car"
        source="carId"
        linkType={false}
      >
        {({ referenceRecord, ...props }) => (
          <ReferenceField
            basePath="/user"
            resource="user"
            reference="users"
            source="userId"
            record={referenceRecord || {}}
            linkType="show"
            label="User"
          >
            <TextField source="name" label="User" />
          </ReferenceField>
        )}
      </ReferenceFieldController>
      <TextField source="id" />
      <NumberField source="totalSavers" label="Total Saved" />
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
    </CustomizableDatagrid>
  </List>
);

export const SavedcarShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <ReferenceField source="carId" reference="car" link="show">
        <TextField source="id" />
      </ReferenceField>
      <small className="text-muted">User</small>
      <ReferenceFieldController
        label="User"
        reference="car"
        source="carId"
        linkType={false}
      >
        {({ referenceRecord, ...props }) => (
          <ReferenceField
            basePath="/user"
            resource="user"
            reference="users"
            source="userId"
            record={referenceRecord || {}}
            linkType="show"
            label="User"
          >
            <TextField source="name" label="User" />
          </ReferenceField>
        )}
      </ReferenceFieldController>
      <TextField source="id" />
      <NumberField source="totalSavers" label="Total Saved" />
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
    </SimpleShowLayout>
  </Show>
);
