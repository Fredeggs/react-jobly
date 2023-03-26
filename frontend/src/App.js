import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CompaniesPage from "./CompaniesPage";
import CompanyPage from "./CompanyPage";
import JobsPage from "./JobsPage";
import Home from "./Home";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ProfileForm from "./ProfileForm";
import NavBar from "./NavBar";
import UserContext from "./userContext";
import { useState, useEffect } from "react";
import JoblyApi from "./api";
import { decodeToken } from "react-jwt";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);

  const signup = async (signupCredentials) => {
    const res = await JoblyApi.register(signupCredentials);
    setToken(res.token);
  };

  const login = async (loginCredentials) => {
    const res = await JoblyApi.getToken(loginCredentials);
    setToken(res.token);
  };

  const logout = () => {
    setToken("");
  };

  const updateUserDetails = async (updatedDetails) => {
    const res = await JoblyApi.updateUser(currentUser.username, updatedDetails);
    return res;
  };

  useEffect(() => {
    async function getCurrentUser() {
      try {
        let { username } = decodeToken(token);
        // put the token on the Api class so it can use it to call the API.
        JoblyApi.token = token;
        let user = await JoblyApi.getUser(username);
        setCurrentUser(user);
      } catch (e) {
        setCurrentUser(null);
      }
    }
    getCurrentUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App">
        <BrowserRouter>
          <NavBar logout={logout} />
          <Switch>
            <Route exact path="/">
              <Home />
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
