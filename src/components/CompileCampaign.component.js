import React, { useState } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";
import DatePicker from "react-date-picker";
import { useAuth0 } from "@auth0/auth0-react";

// Add or Edit a Session

const CompileCampaign = (props) => {
  let initialValues = {
    campaign_name: "",
    game_master: "",
    date_started: new Date(),
    game_system: "",
    active: false,
  };

  let editing = false; //   Verify if Session is being Edited or Created.
  const [startDate, setStartDate] = useState(new Date());

  //   Enables Edit Mode
  if (props.location.state && props.location.state.currentCampaign) {
    editing = true;
    initialValues = props.location.state.currentCampaign;
  }

  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const { user, isAuthenticated } = useAuth0();

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
      campaign_name: values.campaign_name,
      game_master: new Date(),
      date_started: startDate,
      game_system: values.game_system,
      active: values.active,
      user_id: user.name,
      campaign_id: props.match.params.id,
    };

    // EDITING
    if (editing) {
      data.campaign_id = props.location.state.currentCampaign._id;
      CampaignDataService.updateRecord(data, "campaign")
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });

      // CREATING
    } else {
      CampaignDataService.createRecord(data, "campaign")
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
      {/* Checks if Logged in. No edit/creation available if not */}
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
            // COMPILE CAMPAIGN
            <div class="container">
              <div className="form-group">
                <h2 htmlFor="description">
                  {editing ? "Edit" : "Create"} Campaign
                </h2>

                <div class="row">
                  <div class="col-5">
                    <div class="input-group mb-3">
                      {/* CAMPAIGN NAME ENTRY */}
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon3">
                          Campaign Name:
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        required
                        value={values.campaign_name}
                        onChange={handleInputChange}
                        name="campaign_name"
                      />
                    </div>
                  </div>

                  {editing && (
                    <div class="col-3">
                      {/* ACTIVE CAMPAIGN CHECKBOX (conditional) */}
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value={values.active}
                          id="flexCheckDefault"
                          onChange={handleInputChange}
                          name="active"
                        />

                        <label class="form-check-label" for="flexCheckDefault">
                          Active?
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div class="row">
                  <div class="col-3">
                    <div class="input-group mb-3">
                      {/* GM ENTRY */}
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon3">
                          Game Master:
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        required
                        value={values.game_master}
                        onChange={handleInputChange}
                        name="game_master"
                      />
                    </div>
                  </div>

                  <div class="col-3">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        {/* GAME SYSTEM ENTRY */}
                        <span class="input-group-text" id="basic-addon3">
                          Game System:
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        required
                        value={values.game_system}
                        onChange={handleInputChange}
                        name="game_system"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  {/* DATE STARTED ENTRY */}
                  <div class="col-3">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text">Date Started:</span>
                      </div>
                      <DatePicker onChange={setStartDate} value={startDate} />
                    </div>
                  </div>

                  <div class="col-3">
                    <button onClick={saveSession} className="btn btn-success">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // TO DO: Enfore Login, notify customer
        //   Reroutes to Login page if not logged in
        props.history.push("/")
      )}
    </div>
  );
};

export default CompileCampaign;
