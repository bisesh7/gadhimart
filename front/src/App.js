import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import RegisterComponent from "./Components/Register";
import SignIn from "./Components/SignIn";
import AuthContextProvider from "./Contexts/AuthContext";
import SocketContextProvider from "./Contexts/SocketContext";
import Inbox from "./Components/InboxComponents/Inbox";
import ProfileCarListing from "./Components/ProfileComponents/ProfileCarListing";
import ProfileMotorcycleListing from "./Components/ProfileComponents/ProfileMotorcycleListings";
import EditProfile from "./Components/ProfileComponents/EditProfile";
import Notifications from "./Components/NotificationComponents/Notifications";
import SavedCars from "./Components/SavedVehiclesComponents/SavedCars";
import SavedMotorcycles from "./Components/SavedVehiclesComponents/SavedMotorcycles";
import Sell from "./Components/SellCarComponents/Sell";
import PreviewCarAd from "./Components/SellCarComponents/PreviewCarAd";
import CarSearch from "./Components/CarSearch/CarSearch";
import MotorcycleSearch from "./Components/MotorcycleSearch/MotorcycleSearch";
import CarListingView from "./Components/CarSearch/CarListingView";
import MotorcycleDetailView from "./Components/MotorcycleSearch/MotorcycleDetailView";
import { ToastProvider } from "react-toast-notifications";
import SavedCarSearches from "./Components/SavedSearchesComponents/SavedCarSearches";
import SavedMotorcycleSearches from "./Components/SavedSearchesComponents/SavedMotorcycleSearches";
import SellCarComponent from "./Components/SellCarComponents/SellCarComponent";
import SellMotorcycleForm from "./Components/SellMotorcycleComponents/SellMotorcycleForm";
import PreviewMotorcycleAd from "./Components/SellMotorcycleComponents/PreviewMotorcycleAd";
import UserCarListings from "./Components/UserListingsComponents/UserCarListings";
import UserMotorcycleListings from "./Components/UserListingsComponents/UserMotorcycleListings";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import ConfirmEmail from "./Components/ConfirmEmail";
import NotFoundPage from "./Components/NotFoundPage";
import Admin from "./Components/AdminComponents.js/AdminComponent";
import HelpBasics from "./Components/HelpComponents/HelpBasics";
import HelpTechnicalIssues from "./Components/HelpComponents/HelpTechnicalIssues";
import HelpPolicies from "./Components/HelpComponents/HelpPolicies";
import HelpSafety from "./Components/HelpComponents/HelpSafety";
import HelpContactUs from "./Components/HelpComponents/HelpContactUs";
import Feedback from "./Components/Feedback";

function App() {
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="App">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/register" component={RegisterComponent} />
                <Route path="/signin" component={SignIn} />
                <Route
                  path="/profile/listings/car"
                  component={ProfileCarListing}
                />
                <Route
                  path="/profile/listings/motorcycle"
                  component={ProfileMotorcycleListing}
                />
                <Route path="/profile/edit" component={EditProfile} />
                <Route path="/inbox" component={Inbox} />
                <Route path="/notifications" component={Notifications} />
                <Route path="/savedvehicles/cars" component={SavedCars} />
                <Route
                  path="/savedvehicles/motorcycles"
                  component={SavedMotorcycles}
                />
                <Route
                  path="/savedsearches/cars"
                  component={SavedCarSearches}
                />
                <Route
                  path="/savedsearches/motorcycles"
                  component={SavedMotorcycleSearches}
                />
                <Route exact path="/sell" component={Sell} />
                <Route path="/sell/car" component={SellCarComponent} />
                <Route path="/sell/motorcycle" component={SellMotorcycleForm} />
                <Route path="/preview/car" component={PreviewCarAd} />
                <Route
                  path="/preview/motorcycle"
                  component={PreviewMotorcycleAd}
                />
                <Route path="/cars/:make/:model" component={CarSearch} />
                <Route
                  path="/motorcycle/:make/:model"
                  component={MotorcycleSearch}
                />
                <Route path="/car/:carListingId" component={CarListingView} />
                <Route
                  path="/motorcycle/:listingId"
                  component={MotorcycleDetailView}
                />
                <Route
                  path="/listings/car/:userId"
                  component={UserCarListings}
                />
                <Route
                  path="/listings/motorcycle/:userId"
                  component={UserMotorcycleListings}
                />
                <Route path="/forgotPassword" component={ForgotPassword} />
                <Route path="/resetPassword" component={ResetPassword} />
                <Route path="/confirmEmail" component={ConfirmEmail} />
                <Route path="/g-sad" component={Admin} />
                <Route exact path="/help" component={HelpBasics} />
                <Route exact path="/help/basics" component={HelpBasics} />
                <Route
                  exact
                  path="/help/technicalIssues"
                  component={HelpTechnicalIssues}
                />
                <Route exact path="/help/policies" component={HelpPolicies} />
                <Route exact path="/help/safety" component={HelpSafety} />
                <Route exact path="/help/contactUs" component={HelpContactUs} />
                <Route path="/feedback" component={Feedback} />
                {/* Always at the end since this is 404 page */}
                <Route component={NotFoundPage} />
              </Switch>
            </div>
          </BrowserRouter>
        </ToastProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  );
}

export default App;
