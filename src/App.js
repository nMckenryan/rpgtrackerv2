import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch, Link } from "react-router-dom";

import CampaignList from "./components/CampaignList.component";
import CompileSession from "./components/CompileSession.component";
import Login from "./components/Login.js";

import Campaign from "./components/campaign.component";
import CompileCampaign from "./components/CompileCampaign.component";

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/campaigns" className="navbar-brand">
          Dungeon Tracker
        </a>
        <div className="navbar-nav mr-auto">
          {/* Create Campaign Link */}
          <li className="nav-item">
            <Link to={"/campaign-new"} className="nav-link">
              Create a Campaign
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              <a
                onClick={logout}
                className="nav-link"
                style={{ cursor: "pointer" }}
              >
                Logout {user.name}
              </a>
            ) : (
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
          </li>
        </div>
      </nav>

      {/* ROUTER */}
      <div className="container mt-3">
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

          {/* LOGIN */}
          <Route
            path="/login"
            render={(props) => <Login {...props} login={login} />}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
