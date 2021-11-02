import React, { useState } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";
import DatePicker from "react-date-picker";
import { useAuth0 } from "@auth0/auth0-react";

// Add or Edit a Session

const CompileSession = (props) => {
  let initialValues = {
    session_log: "",
    session_date: new Date(),
    char_name: "",
    char_level: "",
  };

  let editing = false; //   Verify if Session is being Edited or Created.
  const [calendate, setCalendate] = useState(new Date());

  //   Enables Edit Mode
  if (props.location.state && props.location.state.currentSession) {
    editing = true;
    initialValues = props.location.state.currentSession;
  }

  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth0();

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
      session_date: calendate,
      char_name: values.char_name,
      char_level: values.char_level,
      user_id: user.name,
      campaign_id: props.match.params.id,
    };

    // EDITING
    if (editing) {
      data.session_id = props.location.state.currentSession._id;
      CampaignDataService.updateRecord(data, "session")
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.error("Could not Create Session " + e);
        });

      // CREATING
    } else {
      CampaignDataService.createRecord(data, "session")
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.error("Could not Create Session " + e);
        });
    }
  };

  return (
    <div>
      {/* Check if Logged in. No edit/creation available if not */}
      {user ? (
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
            // COMPILE SESSION
            <div class="container">
              <div class="row justify-content-between">
                <div class="col-1 mb-3">
                  <Link to={"/"} className="btn btn-primary" title="Go Back">
                    <i class="bi bi-arrow-left-circle"></i>
                  </Link>
                </div>

                <div className="form-group">
                  <h2 htmlFor="description">
                    {editing ? "Edit" : "Create"} Session
                  </h2>
                </div>
              </div>

              <div class="input-group mb-2">
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
                    Class & Level:
                  </span>
                </div>

                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={values.char_level}
                  onChange={handleInputChange}
                  name="char_level"
                />

                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3">
                    Date:
                  </span>
                </div>
                <DatePicker onChange={setCalendate} value={calendate} />
              </div>

              <div class="input-group">
                <span class="input-group-text">Session Log</span>
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
              <button onClick={saveSession} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        //   Failstate if not Logged in
        props.history.push("/")
      )}
    </div>
  );
};

export default CompileSession;
