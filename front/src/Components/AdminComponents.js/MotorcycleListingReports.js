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

const MotorcycleReportsFilter = (props) => (
  <Filter {...props}>
    <TextInput source="_id" label="Id" />
    <ReferenceInput
      label="Motorcycle"
      source="listingId"
      reference="motorcycle"
    >
      <SelectInput optionText="id" />
    </ReferenceInput>
  </Filter>
);

export const ReportmotorcyclelistingList = (props) => (
  <List
    filters={<MotorcycleReportsFilter />}
    title="Motorcycle Reports"
    {...props}
  >
    <CustomizableDatagrid rowClick="show">
      <TextField source="id" />
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

export const ReportmotorcyclelistingShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <ReferenceField source="motorcycleId" reference="motorcycle" link="show">
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
