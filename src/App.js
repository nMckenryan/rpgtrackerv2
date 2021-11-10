import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import {Helmet} from "react-helmet";
import { useAuth0 } from "@auth0/auth0-react";

import { ReactComponent as VikingLogo } from './img/vikinglogo.svg';
import CampaignList from "./components/CampaignList.component";
import CompileSession from "./components/CompileSession.component";
import Campaign from "./components/CampaignPage.component";
import CompileCampaign from "./components/CompileCampaign.component";
import LoginButton from "./components/LoginButton.component";

const App = () => {
  const { loginWithRedirect, loginWithPopup, logout, isAuthenticated, user, isLoading } =
    useAuth0();

  return (
    <div className="application">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Dungeon Tracker</title>
                <link rel="canonical" href="http://mysite.com/example" />
                <style>{'body { background-color: #121212; }'}</style>
            </Helmet>

      {/* NAV BAR */}
      <nav className="navbar navbar-dark bg-dark  mr-auto text-white">
        <a class="navbar-brand" href="/campaigns">
          <VikingLogo width="45" height="45" fill="#121212"/>
          Dungeon Tracker
        </a>

        <span className="nav-item">
          {!isLoading && !user && <button class="btn btn-dark" onClick={() => loginWithPopup()}>Log In</button>}
          {!isLoading && user && (
            <>
              <div class="d-flex">
                <img
                  src={user.picture}
                  alt={user.name}
                  width="50"
                  height="50"
                />
                <div>
                  <h6>{user.name}</h6>
                  <small>{user.email}</small>
                </div>
                <button class="btn btn-dark"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  <i class="bi bi-door-open-fill"></i>
                </button>
              </div>
            </>
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
    </div>
  );
};

export default App;
