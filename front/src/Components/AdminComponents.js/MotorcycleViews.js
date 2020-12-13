import React from "react";
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

const MotorcycleViewsFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_id" label="Id" />
    <ReferenceInput
      label="Motorcycle"
      source="vehicleId"
      reference="motorcycle"
    >
      <SelectInput optionText="id" />
    </ReferenceInput>
  </Filter>
);

export const MotorcycleviewList = (props) => (
  <List title="Motorcycle Views" filters={<MotorcycleViewsFilter />} {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <NumberField source="views" />
      <ReferenceField source="motorcycleId" reference="motorcycle" link="show">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceFieldController
        label="User"
        reference="motorcycle"
        source="motorcycleId"
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

export const MotorcycleviewShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <NumberField source="views" />
      <TextField source="ipAddresses" />
      <ReferenceField source="motorcycleId" link="show" reference="motorcycle">
        <TextField source="id" />
      </ReferenceField>
      <small className="text-muted">User</small>

      <ReferenceFieldController
        label="User"
        reference="motorcycle"
        source="motorcycleId"
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
