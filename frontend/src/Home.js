import React, { useContext } from "react";
import UserContext from "./userContext";

function Home() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  return (
    <div>
      <h1>Jobly</h1>
      <h4>All the jobs in one, convenient place.</h4>
      {currentUser ? (
        <h2>
          Welcome back {currentUser.firstName} ({currentUser.username})
        </h2>
      ) : (
        <h2>Welcome to Jobly! Please sign up or log in to get started 😁 </h2>
      )}
    </div>
  );
}

export default Home;
