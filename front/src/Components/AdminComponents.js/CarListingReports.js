import React from "react";
import {
  List,
  ReferenceField,
  TextField,
  DateField,
  Show,
  SimpleShowLayout,
  ReferenceFieldController,
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import CustomizableDatagrid from "ra-customizable-datagrid";

const CarReportsFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_id" label="Id" />
    <ReferenceInput label="Car" source="listingId" reference="car">
      <SelectInput optionText="id" />
    </ReferenceInput>
  </Filter>
);

export const ReportCarlistingList = (props) => (
  <List filters={<CarReportsFilter />} title="Car Reports" {...props}>
    <CustomizableDatagrid rowClick="show">
      <TextField source="id" />
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
            <TextField source="name" label="Lister" />
          </ReferenceField>
        )}
      </ReferenceFieldController>
      <TextField source="reportedBy" />
      <TextField source="reportType" />
      <TextField source="reportDescription" label="Description" />
      <DateField source="date" />
    </CustomizableDatagrid>
  </List>
);

export const ReportCarlistingShow = (props) => (
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
            <TextField source="name" label="Lister" />
          </ReferenceField>
        )}
      </ReferenceFieldController>
      <TextField source="reportedBy" />
      <TextField source="reportType" />
      <TextField source="reportDescription" />
      <DateField source="date" />
      <TextField source="id" />
    </SimpleShowLayout>
  </Show>
);
