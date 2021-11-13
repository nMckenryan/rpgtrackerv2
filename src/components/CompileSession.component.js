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
    <div className="card bg-dark text-white p-4">
      {/* Check if Logged in. No edit/creation available if not */}
      {user ? (
        <div className="submit-form">
          <div className="container">
            {/* // COMPILE SESSION */}
            <div className="form-group text-white bg-dark card">
              <div className="row justify-content-between">
                {/* BACK BUTTON */}
                <div className="col">
                  <Link to={"/"} className="btn btn-primary" title="Go Back">
                    <i className="bi bi-arrow-left-circle"></i>
                  </Link>
                </div>
                {/* SET TO H1 FOR SEO REASONS */}
                <h1
                  className="h2 col text-center text-nowrap"
                  htmlFor="description"
                >
                  {editing ? "Edit" : "Create"} Session
                </h1>
                <div className="col"></div>
              </div>

              {/* CHAR NAME ENTRY */}
              <div className="d-flex flex-row justify-content-center gap-5">
                <div className="col-4 pl-auto">
                  <label id="basic-addon3">Character Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="text"
                    required
                    value={values.char_name}
                    onChange={handleInputChange}
                    name="char_name"
                  />
                </div>

                {/* CLASS/LEVEL ENTRY */}
                <div className="col-4  ">
                  <label htmlFor="campaignName" id="basic-addon3">
                    Class & Level
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="text"
                    required
                    value={values.char_level}
                    onChange={handleInputChange}
                    name="char_level"
                  />
                </div>

                {/* TODO: GET STYLING WORKING - GET WORKIGN WITH GRID.  */}
                {/* DATE ENTRY */}
                <div className="col">
                  <label id="basic-addon3">Date:</label> <br />
                  <DatePicker
                    locale="en"
                    onChange={setCalendate}
                    value={calendate}
                    styles="background-color: white"
                  />
                </div>
              </div>

              <div className="d-flex flex-row justify-content-center gap-5">
                <div className="col">
                  {/* TODO: GET TEXTAREA WORKING */}
                  <label id="basic-addon3">Session Log:</label>

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

              <div className="col mt-3 mx-auto">
                <button onClick={saveSession} className="btn btn-success">
                  Submit
                </button>
              </div>
            </div>

            {/* ON SUCCESSFUL SUBMIT  */}
            {/* TODO: Replace with Toast? */}
            {submitted && (
              <div>
                <p>You submitted successfully!</p>
                {editing
                  ? props.history.push(
                      "/campaigns/" + props.location.state.currentCampaign._id
                    )
                  : props.history.push("/")}
              </div>
            )}
          </div>
        </div>
      ) : (
        // TO DO: Enfore Login, notify customer
        //   Reroutes to Login page if not logged in
        props.history.push("/")
      )}
    </div>
  );
};

export default CompileSession;
