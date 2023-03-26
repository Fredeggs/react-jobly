import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import UserContext from "./userContext";
import "./NavBar.css";
function NavBar({ logout }) {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  return (
    <div>
      <Navbar expand="md">
        <NavLink exact to="/" className="navbar-brand">
          Jobly
        </NavLink>
        {currentUser ? (
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink to="/companies">Companies</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/jobs">Jobs</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/profile">Profile</NavLink>
            </NavItem>
            <NavItem>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => {
                  logout();
                  history.push("/");
                }}
              >
                Logout {currentUser.username}
              </a>
            </NavItem>
          </Nav>
        ) : (
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink to="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/signup">Sign Up</NavLink>
            </NavItem>
          </Nav>
        )}
      </Navbar>
    </div>
  );
}

export default NavBar;
