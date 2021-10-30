import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch, Link } from "react-router-dom";

import CampaignList from "./components/CampaignList.component";
import CompileSession from "./components/CompileSession.component";
import Login from "./components/Login.js";

import Campaign from "./components/CampaignPage.component";
import CompileCampaign from "./components/CompileCampaign.component";
import Profile from "./components/Profile.component";

import "react-toastify/dist/ReactToastify.css";
import Auth0ProviderWithHistory from "./auth0Provider";
import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "./components/LoginButton.component";
import LogoutButton from "./components/LogoutButton.component.js";

function App() {
  // const [user, setUser] = React.useState(null);

  // async function login(user = null) {
  //   setUser(user);
  // }

  // async function logout() {
  //   setUser(null);
  // }

  const { loginWithRedirect, logout, user, isLoading } = useAuth0();

  return (
    <>
      <Auth0ProviderWithHistory>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a class="navbar-brand" href="/campaigns">
            <img
              src="/vikinglogo.png"
              width="30"
              height="30"
              class="d-inline-block align-top"
              alt="vikingLogo"
            />
            Dungeon Tracker
          </a>

          {/* NAV BAR */}
          <div className="navbar-nav mr-auto">
            {/* Create Campaign Link */}
            <li className="nav-item">
              <Link to={"/campaign-new"} className="nav-link">
                <i class="bi bi-pencil-fill"></i> New Campaign
              </Link>
            </li>
            <li className="nav-item">
              {/* {user ? ( 
                <a
                  onClick={logout}
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                >
                  <i class="bi bi-door-closed-fill"></i>
                  Logout {user.name}
                </a>
              ) : (
                <Link to={"/login"} className="nav-link">
                  <i class="bi bi-door-open"></i>
                  Login
                </Link>
              )} */}
              <LoginButton></LoginButton>
              <LogoutButton></LogoutButton>
              <Profile></Profile>

              {!isLoading && !user && (
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => loginWithRedirect}
                >
                  Login
                </button>
              )}

              {!isLoading && user && (
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => logout()}
                >
                  Log Out
                </button>
              )}
            </li>
          </div>
        </nav>

        {/* MAIN SECTION / ROUTER */}
        <div className="container mt-3 ">
          <Switch>
            <Route exact path={["/", "/campaigns"]} component={CampaignList} />
            {/* GET SESSION */}
            <Route
              path="/campaigns/:id/session"
              render={(props) => <CompileSession {...props} user={user} />}
            />
            {/* SEARCH CAMPAIGN */}
            <Route
              path="/campaigns/:id"
              render={(props) => <Campaign {...props} user={user} />}
            />

            {/* CREATE CAMPAIGN */}
            <Route
              path="/campaign-new/"
              render={(props) => <CompileCampaign {...props} user={user} />}
            />

            {/* EDIT  CAMPAIGN */}
            <Route
              path="/campaign-edit/"
              render={(props) => <CompileCampaign {...props} user={user} />}
            />

            {/* LOGIN */}
            {/* <Route
              path="/login"
              render={(props) => <Login {...props} login={login} />}
            /> */}
          </Switch>
        </div>
      </Auth0ProviderWithHistory>
    </>
  );
}

export default App;
