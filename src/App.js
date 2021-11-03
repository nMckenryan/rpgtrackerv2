import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch, Link } from "react-router-dom";

import CampaignList from "./components/CampaignList.component";
import CompileSession from "./components/CompileSession.component";

import Campaign from "./components/CampaignPage.component";
import CompileCampaign from "./components/CompileCampaign.component";
import Profile from "./components/Profile.component";

import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Auth0Provider } from "@auth0/auth0-react";

import LoginButton from "./components/LoginButton.component";
import Auth0ProviderWithHistory from "./auth0Provider";

const App = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } =
    useAuth0();

  return (
      <>
        {/* NAV BAR */}
        {/* Create Campaign Link */}
        <nav className="navbar navbar-dark bg-dark  mr-auto">
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
          <ul class="navbar-nav">
            <li className="nav-item">
              <Link to={"/campaign-new"} className="nav-link">
                <i class="bi bi-pencil-fill"></i> New Campaign
              </Link>
            </li>
          </ul>
           <span className="nav-item">

            {!isLoading && !user && (
              <LoginButton></LoginButton>
            )}
             {!isLoading && user && (
              <Profile></Profile>
             )}
          </span> 
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
              path="/campaign-edit/:id"
              render={(props) => <CompileCampaign {...props} user={user} />}
            />
          </Switch>
        </div>
        </>
  );
};

export default App;
