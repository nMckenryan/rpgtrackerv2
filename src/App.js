import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch, Link } from "react-router-dom";

import CampaignList from "./components/CampaignList.component";
import CompileSession from "./components/CompileSession.component";

import Campaign from "./components/CampaignPage.component";
import CompileCampaign from "./components/CompileCampaign.component";

import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "./components/LoginButton.component";

const App = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } =
    useAuth0();

  return (
      <>
        {/* NAV BAR */}
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

           <span className="nav-item">

            {!isLoading && !user && (
              <LoginButton></LoginButton>
            )}
             {!isLoading && user && (
               <>
                <div class="d-flex">
                  <img src={user.picture} alt={user.name} width="50" height="50" />
                  <div>
                    <h6>{user.name}</h6>
                    <small>{user.email}</small>

                  </div>                    <button onClick={() => logout({ returnTo: window.location.origin })}>
                      Log Out
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
        </>
  );
};

export default App;
