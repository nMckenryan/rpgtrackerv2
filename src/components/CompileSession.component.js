import React, { useState } from "react";
import CampaignDataService from "../services/campaign";
import { Link } from "react-router-dom";

// Add or Edit a Session

const CompileSession = (props) => {
  let initialSessionState = "";

  //   Verify if Session is being Edited or Created.
  let editing = false;

  //   Enables Edit Mode
  if (props.location.state && props.location.state.currentSession) {
    editing = true;
    initialSessionState = props.location.state.currentSession.text;
  }

  const [session, setSession] = useState(initialSessionState);
  const [submitted, setSubmitted] = useState(false);

  //   Change State on Type
  const handleInputChange = (event) => {
    setSession(event.target.value);
  };

  const saveSession = () => {
    var data = {
      text: session,
      name: props.user.name,
      user_id: props.user.id,
      campaign_id: props.match.params.id,
    };

    // EDITING
    if (editing) {
      data.session_id = props.location.state.currentSession._id;
      CampaignDataService.updateSession(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      // CREATING
    } else {
      CampaignDataService.createSession(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      {/* Check if Logged in. No edit/creation available if not */}
      {props.user ? (
        <div className="submit-form">
          {/* Check if Submitted */}
          {/* TODO: Replace with Toast? */}
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Link
                to={"/campaigns/" + props.match.params.id}
                className="btn btn-success"
              >
                Back to Campaign
              </Link>
            </div>
          ) : (
            // COMPILE REVIEW
            <div>
              <div className="form-group">
                <label htmlFor="description">
                  {editing ? "Edit" : "Create"} Session
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={session}
                  onChange={handleInputChange}
                  name="text"
                />
              </div>
              <button onClick={saveSession} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        //   Failstate if not Logged in
        <div>Please log in.</div>
      )}
    </div>
  );
};

export default CompileSession;
