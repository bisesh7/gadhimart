import React from "react";
import {
  List,
  Datagrid,
  ReferenceField,
  TextField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  DateField,
  Show,
  SimpleShowLayout,
  ArrayField,
  ReferenceFieldController,
  BooleanField,
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput,
  DateInput,
} from "react-admin";
import CustomizableDatagrid from "ra-customizable-datagrid";

const CarChatSessionsFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_id" label="Id" alwaysOn />
    <ReferenceInput label="Car" source="listingId" reference="car">
      <SelectInput optionText="id" />
    </ReferenceInput>
    <ReferenceInput
      label="User Involved"
      source="usersInvolved"
      reference="users"
    >
      <SelectInput optionText="email" />
    </ReferenceInput>

    <TextInput label="Unique id" source="uniqueId" />
    <DateInput source="date" label="Date" />
  </Filter>
);

export const CarChatsessionList = (props) => (
  <List
    filters={<CarChatSessionsFilter />}
    title="Car Chat Sessions"
    {...props}
  >
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
      <TextField source="uniqueId" label="Unique id" />
      <ReferenceArrayField source="usersInvolved" reference="users" link="show">
        <SingleFieldList>
          <ChipField source="email" />
        </SingleFieldList>
      </ReferenceArrayField>
      <DateField source="date" />
    </CustomizableDatagrid>
  </List>
);

export const CarChatsessionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <DateField source="date" />
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
      <TextField source="uniqueId" label="Unique id" />
      <ReferenceArrayField source="usersInvolved" reference="users" link="show">
        <SingleFieldList>
          <ChipField source="email" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ArrayField source="messages">
        <CustomizableDatagrid>
          <TextField source="id" label="Message Id" />
          <DateField source="date" label="Sent date" />
          <TextField source="message" label="Message" />
          <ReferenceField source="sender" reference="users" link="show">
            <TextField source="email" />
          </ReferenceField>
          <ReferenceField source="reciever" reference="users" link="show">
            <TextField source="email" />
          </ReferenceField>
          <BooleanField source="seenDetail.seen" label="Seen" />
          <TextField source="seenDetail.date" label="Seen Date" />
        </CustomizableDatagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
