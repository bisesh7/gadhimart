import React, { useEffect, useState, Fragment } from "react";
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import UserIcon from "@material-ui/icons/Group";
import EmailIcon from "@material-ui/icons/Email";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import MotorcycleRoundedIcon from "@material-ui/icons/MotorcycleRounded";
import PageviewIcon from "@material-ui/icons/Pageview";
import FolderIcon from "@material-ui/icons/Folder";
import ReportIcon from "@material-ui/icons/Report";
import FavoriteIcon from "@material-ui/icons/Favorite";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import BlockIcon from "@material-ui/icons/Block";
import ChatIcon from "@material-ui/icons/Chat";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import Dashboard from "./Dashboard";
import DataProvider from "./DataProvider";
import { UserList, UserEdit, UserShow, UserCreate } from "./Users";
import { ConfirmEmailList, ConfirmEmailShow } from "./ConfirmEmail";
import { CarList, CarEdit, CarShow } from "./Cars";
import { MotorcycleList, MotorcycleShow, MotorcycleEdit } from "./Motorcycles";
import { TempfolderList, TempfolderShow } from "./TempFolders";
import { MotorcycleviewList, MotorcycleviewShow } from "./MotorcycleViews";
import { CarviewList, CarviewShow } from "./CarViews";
import {
  ReportmotorcyclelistingShow,
  ReportmotorcyclelistingList,
} from "./MotorcycleListingReports";
import {
  ReportCarlistingList,
  ReportCarlistingShow,
} from "./CarListingReports";
import { SavedcarList, SavedcarShow } from "./SavedCars";
import { SavedMotorcycleList, SavedMotorcycleShow } from "./SavedMotorcycles";
import { SavedsearchList, SavedsearchShow } from "./SavedSearches";
import { BlockuserList, BlockuserShow } from "./BlockUsers";
import {
  MotorcyclechatsessionList,
  MotorcyclechatsessionShow,
} from "./MotorcycleChatSessions";
import { CarChatsessionList, CarChatsessionShow } from "./CarChatSessions";
import {
  ReportusermotorcycleShow,
  ReportusermotorcycleList,
} from "./ReportUserMotorcycles";
import { ReportUserCarList, ReportUserCarShow } from "./ReportUserCars";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { NotificationList, NotificationShow } from "./Notifications";
import { UserlogindetailList, UserlogindetailShow } from "./UserLoginDetails";
import AuthProvider from "./AuthProvider";
import { AdminList, AdminEdit, AdminCreate, AdminShow } from "./Admin";
import bcrypt from "bcryptjs";
import {
  CarmakesandmodelCreate,
  CarmakesandmodelEdit,
  CarmakesandmodelList,
  CarmakesandmodelShow,
} from "./CarMakesAndModels";
import {
  MotorcyclemakesandmodelCreate,
  MotorcyclemakesandmodelEdit,
  MotorcyclemakesandmodelList,
  MotorcyclemakesandmodelShow,
} from "./MotorcycleMakesAndModels";
import {
  ProvincewithdistrictCreate,
  ProvincewithdistrictEdit,
  ProvincewithdistrictList,
  ProvincewithdistrictShow,
} from "./ProvinceWithDistricts";
import { FilterList, FilterShow } from "./Filters";

const AdminComponent = () => {
  useEffect(() => {
    if (localStorage.getItem("AuthToken")) {
      bcrypt.compare(
        process.env.REACT_APP_ADMIN_KEY,
        localStorage.getItem("AuthToken"),
        (error, isMatch) => {
          if (error) {
            console.log(error);
            localStorage.removeItem("AuthToken");
          }
          if (!isMatch) {
            localStorage.removeItem("AuthToken");
          }
        }
      );
    }
  });

  return (
    <div>
      <Admin
        title="Gadhimart Admin"
        dashboard={Dashboard}
        dataProvider={DataProvider}
        authProvider={AuthProvider}
      >
        <Resource
          name="admin"
          list={AdminList}
          edit={AdminEdit}
          create={AdminCreate}
          show={AdminShow}
        />
        <Resource
          name="users"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          show={UserShow}
          icon={UserIcon}
        />
        <Resource
          name="userLoginDetails"
          options={{ label: "User Login Details" }}
          list={UserlogindetailList}
          show={UserlogindetailShow}
          icon={ExitToAppIcon}
        />
        <Resource
          name="confirmEmails"
          options={{ label: "Confirm Emails" }}
          list={ConfirmEmailList}
          show={ConfirmEmailShow}
          icon={EmailIcon}
        />
        {/* confirm email and forgot password has the same model layout
    so using the ConfirmEmailList and ConfirmEmailShow here as well */}
        <Resource
          name="forgotPasswords"
          options={{ label: "Forgot Passwords" }}
          list={ConfirmEmailList}
          show={ConfirmEmailShow}
          icon={VpnKeyIcon}
        />
        <Resource
          name="car"
          list={CarList}
          edit={CarEdit}
          show={CarShow}
          icon={DriveEtaIcon}
        />
        <Resource
          name="motorcycle"
          list={MotorcycleList}
          edit={MotorcycleEdit}
          show={MotorcycleShow}
          icon={MotorcycleRoundedIcon}
        />
        <Resource
          name="tempFolders"
          options={{ label: "Temp Folders" }}
          list={TempfolderList}
          show={TempfolderShow}
          icon={FolderIcon}
        />
        <Resource
          name="motorcycleViews"
          options={{ label: "Motorcycle Views" }}
          list={MotorcycleviewList}
          show={MotorcycleviewShow}
          icon={PageviewIcon}
        />
        <Resource
          name="carViews"
          options={{ label: "Car Views" }}
          list={CarviewList}
          show={CarviewShow}
          icon={PageviewIcon}
        />
        <Resource
          name="reportMotorcycleListings"
          options={{ label: "Motorcycle Reports" }}
          list={ReportmotorcyclelistingList}
          show={ReportmotorcyclelistingShow}
          icon={ReportIcon}
        />
        <Resource
          name="reportCarListings"
          options={{ label: "Car Reports" }}
          list={ReportCarlistingList}
          show={ReportCarlistingShow}
          icon={ReportIcon}
        />
        <Resource
          name="savedCars"
          options={{ label: "Saved Cars" }}
          list={SavedcarList}
          show={SavedcarShow}
          icon={FavoriteIcon}
        />
        <Resource
          name="savedMotorcycles"
          options={{ label: "Saved Motorcycles" }}
          list={SavedMotorcycleList}
          show={SavedMotorcycleShow}
          icon={FavoriteIcon}
        />
        <Resource
          name="savedSearch"
          options={{ label: "Saved Searches" }}
          list={SavedsearchList}
          show={SavedsearchShow}
          icon={BookmarksIcon}
        />
        <Resource
          name="blockUser"
          options={{ label: "User's Block List" }}
          list={BlockuserList}
          show={BlockuserShow}
          icon={BlockIcon}
        />
        <Resource
          name="motorcycleChatSessions"
          options={{ label: "Motorcycle Chat Sessions" }}
          list={MotorcyclechatsessionList}
          show={MotorcyclechatsessionShow}
          icon={ChatIcon}
        />
        <Resource
          name="carChatSessions"
          options={{ label: "Car Chat Sessions" }}
          list={CarChatsessionList}
          show={CarChatsessionShow}
          icon={ChatIcon}
        />
        <Resource
          name="reportUserMotorcycles"
          options={{ label: "User Reports -Motorcycle" }}
          list={ReportusermotorcycleList}
          show={ReportusermotorcycleShow}
          icon={ReportIcon}
        />
        <Resource
          name="reportUserCars"
          options={{ label: "User Reports -Car" }}
          list={ReportUserCarList}
          show={ReportUserCarShow}
          icon={ReportIcon}
        />
        <Resource
          name="notification"
          list={NotificationList}
          show={NotificationShow}
          icon={NotificationsIcon}
        />
        <Resource
          name="carMakesAndModels"
          options={{ label: "Car Makes And Models" }}
          create={CarmakesandmodelCreate}
          list={CarmakesandmodelList}
          show={CarmakesandmodelShow}
          edit={CarmakesandmodelEdit}
          icon={FormatListNumberedIcon}
        />
        <Resource
          name="motorcycleMakesAndModels"
          options={{ label: "Motorcycle Makes And Models" }}
          create={MotorcyclemakesandmodelCreate}
          list={MotorcyclemakesandmodelList}
          show={MotorcyclemakesandmodelShow}
          edit={MotorcyclemakesandmodelEdit}
          icon={FormatListNumberedIcon}
        />
        <Resource
          name="provinceWithDistricts"
          options={{ label: "Province and districts" }}
          create={ProvincewithdistrictCreate}
          list={ProvincewithdistrictList}
          show={ProvincewithdistrictShow}
          edit={ProvincewithdistrictEdit}
          icon={FormatListNumberedIcon}
        />
        <Resource
          name="filters"
          list={FilterList}
          show={FilterShow}
          icon={FormatListNumberedIcon}
        />
      </Admin>
    </div>
  );
};

export default AdminComponent;
