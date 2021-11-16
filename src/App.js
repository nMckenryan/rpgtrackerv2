import React from "react";
import { Route, Switch } from "react-router-dom";
import {Helmet} from "react-helmet";
import { useAuth0 } from "@auth0/auth0-react";

import { ReactComponent as VikingLogo } from './img/vikinglogo.svg';
import CampaignList from "./components/CampaignList.component";
import CompileSession from "./components/CompileSession.component";
import Campaign from "./components/CampaignPage.component";
import CompileCampaign from "./components/CompileCampaign.component";

const App = () => {
  const { loginWithPopup, logout, user, isLoading } =
    useAuth0();

  const headers = {
    title: "Dungeon Tracker",
    desc: "A Tracker for Tabletop RPG Games",
  };

  return (
    <div className="application">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{headers.title}</title>
                <meta name="description" content={headers.desc} />
                <meta name="theme-color" content="#121212" />
                <link rel="canonical" href="https://rpg-tracker-zugah.mongodbstitch.com/" />
                <style>{'body { background-color: #121212; }'}</style>
            </Helmet>

      {/* NAV BAR */}
      <nav className="navbar navbar-dark bg-dark  mr-auto text-white container-fluid">
        <a className="navbar-brand d-flex" href="/campaigns">
          <h1 class="d-flex my-auto" ><VikingLogo width="40" height="40" fill="#121212"/>
          {headers.title}</h1>
        </a>

        <span className="nav-item">
          {!isLoading && !user && <button className="btn btn-dark" onClick={() => loginWithPopup()}>Log In</button>}
          {!isLoading && user && (
            <>
              <div className="d-flex">
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
                <button className="btn btn-dark"
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  <i className="bi bi-door-open-fill"></i>
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
