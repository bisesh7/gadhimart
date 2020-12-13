import React from "react";
import {
  List,
  DateField,
  ReferenceField,
  TextField,
  Show,
  SimpleShowLayout,
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput,
  DateInput,
} from "react-admin";
import CustomizableDatagrid from "ra-customizable-datagrid";

const ReportCarChatSessionsFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_id" label="Id" alwaysOn />
    <ReferenceInput label="Car" source="carId" reference="car">
      <SelectInput optionText="id" />
    </ReferenceInput>
    <ReferenceInput label="Reported By" source="reportedBy" reference="users">
      <SelectInput optionText="email" />
    </ReferenceInput>
    <ReferenceInput
      label="Reported User"
      source="reportedUser"
      reference="users"
    >
      <SelectInput optionText="email" />
    </ReferenceInput>
    <ReferenceInput
      label="Chat Session"
      source="chatSession"
      reference="carChatSessions"
    >
      <SelectInput optionText="id" />
    </ReferenceInput>

    <TextInput label="Report Type" source="reportType" />
    <DateInput source="date" label="Date" />
  </Filter>
);

export const ReportUserCarList = (props) => (
  <List
    title="User Reports -Cars"
    filters={<ReportCarChatSessionsFilter />}
    {...props}
  >
    <CustomizableDatagrid rowClick="show">
      <DateField source="date" />
      <TextField source="id" />
      <ReferenceField source="carId" reference="car" link="show">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField source="reportedBy" reference="users" link="show">
        <TextField source="email" />
      </ReferenceField>
      <ReferenceField source="reportedUser" reference="users" link="show">
        <TextField source="email" />
      </ReferenceField>
      <ReferenceField
        source="chatSession"
        reference="carChatSessions"
        link="show"
      >
        <TextField source="id" />
      </ReferenceField>
      <TextField source="reportType" />
      <TextField source="reportDescription" />
    </CustomizableDatagrid>
  </List>
);

export const ReportUserCarShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <DateField source="date" />
      <TextField source="id" />
      <ReferenceField source="carId" reference="car" link="show">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField source="reportedBy" reference="users" link="show">
        <TextField source="email" />
      </ReferenceField>
      <ReferenceField source="reportedUser" reference="users" link="show">
        <TextField source="email" />
      </ReferenceField>
      <ReferenceField
        source="chatSession"
        reference="carChatSessions"
        link="show"
      >
        <TextField source="id" />
      </ReferenceField>
      <TextField source="reportType" />
      <TextField source="reportDescription" />
    </SimpleShowLayout>
  </Show>
);
