import React, { useState } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";

// Add or Edit a Session

const CompileCampaign = (props) => {
  let initialValues = {
    campaign_name: "",
    game_master: "",
    date_started: "",
    game_system: "",
    active: false,
  };

  let editing = false; //   Verify if Session is being Edited or Created.

  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);

  //   Enables Edit Mode
  if (props.location.state && props.location.state.currentCampaign) {
    editing = true;
    initialValues = props.location.state.currentCampaign;
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
      campaign_name: values.campaign_name,
      game_master: new Date(),
      date_started: values.date_started,
      game_system: values.game_system,
      active: values.active,
      user_id: props.user.id,
      campaign_id: props.match.params.id,
    };

    // EDITING
    if (editing) {
      data.session_id = props.location.state.currentCampaign._id;
      CampaignDataService.updateCampaign(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });

      // CREATING
    } else {
      CampaignDataService.createCampaign(data)
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
            // COMPILE CAMPAIGN
            <div>
              <div className="form-group">
                <h2 htmlFor="description">
                  {editing ? "Edit" : "Create"} Campaign
                </h2>

                <div class="input-group mb-3">
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

                <div class="input-group mb-3">
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

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon3">
                      Date Started:
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="text"
                    required
                    value={values.date_started}
                    onChange={handleInputChange}
                    name="date_started"
                  />
                </div>

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
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
                <div>
                  {editing ? (
                    <input
                      type="radio"
                      className="form-control"
                      id="text"
                      required
                      value={values.active}
                      onChange={handleInputChange}
                      name="active"
                    />
                  ) : (
                    <div></div>
                  )}
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

export default CompileCampaign;
