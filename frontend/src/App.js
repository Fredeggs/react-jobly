import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CompaniesPage from "./CompaniesPage";
import CompanyPage from "./CompanyPage";
import JobsPage from "./JobsPage";
import Home from "./Home";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ProfileForm from "./ProfileForm";
import MOAForm from "./MOAForm";
import NavBar from "./NavBar";
import UserContext from "./userContext";
import { useState, useEffect } from "react";
import BKPApi from "./api";
import { decodeToken } from "react-jwt";
import useLocalStorage from "./hooks/useLocalStorage";
import NewApplications from "./NewApplicationsPage";
import LibrariesPage from "./LibrariesPage";
import ShippingEntryForm from "./ShippingEntryForm";
import LibraryForm from "./LibraryForm";

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);

  const signup = async (signupCredentials) => {
    const res = await BKPApi.register(signupCredentials);
    setToken(res.token);
  };

  const login = async (loginCredentials) => {
    const res = await BKPApi.getToken(loginCredentials);
    setToken(res.token);
  };

  const logout = () => {
    setToken("");
  };

  const updateUserDetails = async (updatedDetails) => {
    const res = await BKPApi.updateUser(currentUser.username, updatedDetails);
    return res;
  };

  const getRegionsAndProvinces = async () => {
    const res = await BKPApi.getRegionsAndProvinces();
    return res;
  };

  const getLibrary = async (id) => {
    const res = await BKPApi.getLibrary(id);
    return res;
  };

  const getLibraries = async (data) => {
    const res = await BKPApi.getLibraries(data);
    return res;
  };

  const createLibrary = async (data) => {
    const res = await BKPApi.createLibrary(data);
    return res;
  };

  const getCurrentUser = async () => {
    try {
      let { email } = decodeToken(token);
      // put the token on the Api class so it can use it to call the API.
      BKPApi.token = token;
      let user = await BKPApi.getUser(email);
      setCurrentUser(user);
      return user;
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App">
        <BrowserRouter>
          <NavBar logout={logout} />
          <Switch>
            <Route exact path="/">
              <Home getCurrentUser={getCurrentUser} getLibrary={getLibrary} />
            </Route>
            <Route exact path="/shipping-entry">
              <ShippingEntryForm getLibraries={getLibraries} />
            </Route>
            <Route exact path="/new-applications">
              <NewApplications getLibraries={getLibraries} />
            </Route>
            <Route exact path="/library-form">
              <LibraryForm
                getRegionsAndProvinces={getRegionsAndProvinces}
                createLibrary={createLibrary}
              />
            </Route>
            <Route exact path="/moa-form">
              <MOAForm />
            </Route>
            <Route exact path="/libraries">
              <LibrariesPage getLibraries={getLibraries} />
            </Route>
            <Route exact path="/companies">
              <CompaniesPage />
            </Route>
            <Route path="/companies/:id">
              <CompanyPage />
            </Route>
            <Route exact path="/jobs">
              <JobsPage />
            </Route>
            <Route path="/login">
              <LoginForm login={login} />
            </Route>
            <Route path="/signup">
              <SignupForm signup={signup} />
            </Route>
            <Route path="/profile">
              <ProfileForm updateUserDetails={updateUserDetails} />
            </Route>
            <Route>
              <p>Hmmm. I can't seem to find what you want.</p>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
