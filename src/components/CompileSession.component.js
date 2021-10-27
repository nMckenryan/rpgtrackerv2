import React, { useState } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";

// Add or Edit a Session

const CompileSession = (props) => {
  let initialValues = {
    session_log: "",
    session_date: "",
    char_name: "",
    char_level: 0,
  };

  let editing = false; //   Verify if Session is being Edited or Created.

  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);

  //   Enables Edit Mode
  if (props.location.state && props.location.state.currentSession) {
    editing = true;
    initialValues = props.location.state.currentSession;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  // SAVE SESSION
  const saveSession = () => {
    var data = {
      session_log: values.session_log,
      session_date: new Date(),
      char_name: values.char_name,
      char_level: values.char_level,
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

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon3">
                      Session Date:
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="text"
                    required
                    value={values.session_date}
                    onChange={handleInputChange}
                    name="session_date"
                  />
                </div>

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon3">
                      Character Name:
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="text"
                    required
                    value={values.char_name}
                    onChange={handleInputChange}
                    name="char_name"
                  />

                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon3">
                      Level:
                    </span>
                  </div>

                  <input
                    type="number"
                    className="form-control"
                    id="text"
                    required
                    value={values.char_level}
                    onChange={handleInputChange}
                    name="char_level"
                  />
                </div>

                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Session Log</span>
                  </div>
                  <textarea
                    type="text"
                    className="form-control"
                    aria-label="With textarea"
                    id="text"
                    required
                    value={values.session_log}
                    onChange={handleInputChange}
                    name="session_log"
                  />
                </div>
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
