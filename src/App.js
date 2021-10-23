import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch, Link } from "react-router-dom";
// import Container from "react-bootstrap/Container";
// import "./custom.scss";

import SessionList from "./components/SessionList.component";
import CompileSession from "./components/CompileSession.component";
import Login from "./components/Login.js";

import Campaign from "./components/campaign.component";
import TopBar from "./components/TopBar.component";

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
          Sessions
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/campaigns"} className="nav-link">
              Campaigns
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

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/campaigns"]} component={SessionList} />
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

          {/* LOGIN */}
          <Route
            path="/login"
            render={(props) => <Login {...props} login={login} />}
          />
        </Switch>
      </div>
    </div>
    // <Router>
    //   <Container>
    //     <br />
    //     <h1>Dungeon Tracker</h1>
    //     <br />
    //     <TopBar />
    //     <div className="mainSection">
    //       <Route path="/" exact component={SessionList} />
    //       <Route path="/edit/:id" component={CompileSession} />
    //       <Route path="/createSes" component={CompileSession} />
    //       <Route path="/createCamp" component={CreateCampaign} />
    //     </div>
    //     <footer>
    //       <small>Built by Nigel Mckenzie-Ryan (github.com/nMckenryan)</small>
    //     </footer>
    //   </Container>
    // </Router>
  );
}

export default App;
