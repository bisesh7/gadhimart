import React, { useState, useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  NumberField,
  ReferenceFieldController,
  ReferenceInput,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";

const CarViewsFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search Email" source="email" alwaysOn />
    <TextInput source="_id" label="Id" />
    <ReferenceInput label="Car" source="vehicleId" reference="car">
      <SelectInput optionText="id" />
    </ReferenceInput>
  </Filter>
);

export const CarviewList = (props) => (
  <List title="Car Views" filters={<CarViewsFilter />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <NumberField source="views" />
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
    </Datagrid>
  </List>
);

export const CarviewShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <NumberField source="views" />
      <TextField source="ipAddresses" />
      <ReferenceField source="carId" link="show" reference="car">
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
    </SimpleShowLayout>
  </Show>
);
