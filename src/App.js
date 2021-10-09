import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./custom.scss";

import SessionList from "./components/SessionList.component";
import CompileSession from "./components/CompileSession.component";
import CreateCampaign from "./components/CreateCampaign.component";
import TopBar from "./components/TopBar.component";

function App() {
  return (
    <Router>
      <Container>
        {/* <br />
        <h1>Dungeon Tracker</h1>
        <br />
        <TopBar />
        <div className="mainSection">
          <Route path="/" exact component={SessionList} />
          <Route path="/edit/:id" component={CompileSession} />
          <Route path="/createSes" component={CompileSession} />
          <Route path="/createCamp" component={CreateCampaign} />
        </div>
        <footer>
          <small>Built by Nigel Mckenzie-Ryan (github.com/nMckenryan)</small>
        </footer> */}
      </Container>
    </Router>
  );
}

export default App;
