import React from "react";
import CustomizableDatagrid from "ra-customizable-datagrid";
import {
  List,
  TextField,
  EmailField,
  DateField,
  Show,
  SimpleShowLayout,
  ListButton,
  TopToolbar,
  ReferenceField,
  Filter,
  TextInput,
  DateInput,
} from "react-admin";
import ChevronLeft from "@material-ui/icons/ChevronLeft";

const ConfirmEmailFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search Email" source="email" alwaysOn />
    <TextInput source="_id" label="Id" />
    <DateInput source="date" label="Date" />
  </Filter>
);

export const ConfirmEmailList = (props) => {
  let title;
  if (props.resource === "confirmEmails") {
    title = "Confirm Emails";
  } else {
    title = "Forgot Passwords";
  }

  return (
    <List filters={<ConfirmEmailFilter />} title={title} {...props}>
      <CustomizableDatagrid rowClick="show">
        <TextField source="email" />
        <ReferenceField source="userId" link="show" reference="users">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="id" />
        <TextField source="uuid" />
        <DateField source="date" />
      </CustomizableDatagrid>
    </List>
  );
};

const EmailShowActions = ({ basePath, data, resource }) => {
  return (
    <TopToolbar>
      <ListButton basePath={basePath} label="Back" icon={<ChevronLeft />} />
    </TopToolbar>
  );
};

const ConfirmEmailTitle = ({ record }) => {
  return <span>{record ? `"${record.email}"` : ""}</span>;
};

export const ConfirmEmailShow = (props) => (
  <Show actions={<EmailShowActions />} title={<ConfirmEmailTitle />} {...props}>
    <SimpleShowLayout>
      <EmailField source="email" />
      <ReferenceField source="userId" link="show" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="id" />
      <TextField source="uuid" />
      <DateField source="date" />
    </SimpleShowLayout>
  </Show>
);
