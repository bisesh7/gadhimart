import React, { Fragment } from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  Edit,
  SimpleForm,
  TextInput,
  Show,
  SimpleShowLayout,
  BooleanField,
  BooleanInput,
  NumberInput,
  Create,
  PasswordInput,
  ImageField,
  ShowButton,
  ListButton,
  useRefresh,
  useNotify,
  Filter,
  DateInput,
  Button as reactAdminButton,
} from "react-admin";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import PhotoIcon from "@material-ui/icons/Photo";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import CustomizableDatagrid from "ra-customizable-datagrid";
import BlockIcon from "@material-ui/icons/Block";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search Email" source="email" alwaysOn />
    <BooleanInput source="confirmed" />
    <BooleanInput source="blocked" />
    <TextInput source="name" />
    <TextInput source="_id" label="Id" />
    <DateInput source="registeredDate" label="Registered date" />
  </Filter>
);

export const UserList = (props) => (
  <List filters={<UserFilter />} {...props}>
    <CustomizableDatagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <DateField source="date" label="Registered date" />
      <BooleanField source="confirmed" />
      <BooleanField source="blocked" />
      <TextField source="profilePicture" />
      <TextField source="streetAddress" />
      <TextField source="phoneNumber" />
      <BooleanField source="messageReadCanBeSeen" />
      <BooleanField source="getNews" />
    </CustomizableDatagrid>
  </List>
);

const UserTitle = ({ record }) => {
  return <span>{record ? `"${record.name}"` : ""}</span>;
};

const validateUserEdit = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = ["The name is required"];
  }
  return errors;
};

const UserEditActions = ({ basePath, data, resource }) => {
  const classes = useStyles();
  const refresh = useRefresh();
  const notify = useNotify();
  return (
    <div className="d-flex justify-content-end">
      <ListButton basePath={basePath} label="Back" icon={<ChevronLeft />} />
      <ShowButton basePath={basePath} record={data} />
      <Button
        color="primary"
        className={classes.button}
        startIcon={<PhotoIcon />}
        disabled={
          typeof data !== "undefined" &&
          data.profilePicture === "/assets/images/default-profile.png"
        }
        onClick={(e) => {
          e.preventDefault();
          if (typeof data !== "undefined") {
            axios
              .put(`/api/users/removeProfilePicture/${data.id}`, {
                valid: process.env.REACT_APP_ADMIN_KEY,
              })
              .then((res) => {
                if (res.data.success) {
                  notify("User profile picture changed to default.");
                  refresh();
                }
              })
              .catch((err) => {
                if (typeof err.response !== "undefined") {
                  notify(err.response.data.msg);
                  refresh();
                }
              });
          }
        }}
      >
        Default Picture
      </Button>
    </div>
  );
};

export const UserEdit = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();

  const onSuccess = ({ data }) => {
    notify(`Changes to user saved`);
    refresh();
  };

  return (
    <Edit
      actions={<UserEditActions />}
      title={<UserTitle />}
      undoable={false}
      onSuccess={onSuccess}
      {...props}
    >
      <SimpleForm validate={validateUserEdit}>
        <TextInput source="name" />
        <NumberInput source="phoneNumber" />
        <BooleanInput source="confirmed" />
        <BooleanInput source="blocked" />
        <TextInput source="streetAddress" />
        <BooleanInput source="messageReadCanBeSeen" />
        <BooleanInput source="getNews" />
      </SimpleForm>
    </Edit>
  );
};

export const UserShow = (props) => (
  <Show title={<UserTitle />} {...props}>
    <SimpleShowLayout>
      <DateField label="Registered Date" source="date" />
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="phoneNumber" />
      <BooleanField source="confirmed" />
      <BooleanField source="blocked" />
      <TextField source="streetAddress" />
      <ImageField source="profilePicture" title="Profile Picture" />
      <TextField source="profilePicture" />
      <BooleanField source="messageReadCanBeSeen" />
      <BooleanField source="getNews" />
    </SimpleShowLayout>
  </Show>
);

const validateUserCreation = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = ["The name is required"];
  }
  if (!values.email) {
    errors.email = ["The email is required"];
  } else {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(values.email)) {
      errors.email = ["Please provide a valid email"];
    }
  }
  if (!values.password) {
    errors.password = ["The password is required"];
  } else {
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(values.password)) {
      errors.password = ["Please provide a valid password"];
    }
  }
  return errors;
};

const Aside = () => (
  <div style={{ width: 200, margin: "1em" }}>
    <Typography variant="h6">Create details</Typography>
    <Typography variant="body4">
      Password should contain <br />
      1 lowercase <br />
      1 uppercase <br />
      8 characters <br />
      1 number <br />
    </Typography>
  </div>
);

export const UserCreate = (props) => (
  <Create aside={<Aside />} {...props}>
    <SimpleForm validate={validateUserCreation}>
      <TextInput source="name" />
      <TextInput source="email" />
      <PasswordInput source="password" />
    </SimpleForm>
  </Create>
);
