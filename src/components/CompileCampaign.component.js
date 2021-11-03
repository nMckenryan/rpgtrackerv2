import React, { useState } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import { useAuth0 } from "@auth0/auth0-react";

// Add or Edit a Session

const CompileCampaign = (props) => {
  let initialValues = {
    campaign_name: "",
    game_master: "",
    date_started: new Date(),
    game_system: "",
    active: true,
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

  // SAVE CAMPAIGN
  const saveCampaign = () => {
    var data = {
      campaign_name: values.campaign_name,
      game_master: values.game_master,
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
          console.error("Could not Edit Campaign: " + e);
        });

      // CREATING
    } else {
      CampaignDataService.createRecord(data, "campaign")
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.error("Could not Add New Campaign: " + e);
        });
    }
  };

  return (
    <div>
      {/* Checks if Logged in. No edit/creation available if not */}
      {user ? (
        <div className="submit-form">
          {/* ON SUCCESSFUL SUBMIT  */}
          {/* TODO: Replace with Toast? */}
          {/* TODO: Returns undefined... Fix */}
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Link
                to={"/campaigns/" + props.match.params.campaign_id}
                className="btn btn-success"
              >
                Back to Campaign
              </Link>
            </div>
          ) : (
            // COMPILE CAMPAIGN
            <div class="container">
              <div className="form-group">
                <div class="row justify-content-between">
                  {/* BACK BUTTON */}
                  <div class="col">
                    <Link to={"/"} className="btn btn-primary" title="Go Back">
                      <i class="bi bi-arrow-left-circle"></i>
                    </Link>
                  </div>
                  <h2 htmlFor="description" class="col">
                    {editing ? "Edit" : "Create"} Campaign
                  </h2>
                  {editing && (
                    <div class="col">
                      {/* ACTIVE CAMPAIGN CHECKBOX (conditional) */}
                      <div class="form-check">
                        <label class="form-check-label" for="flexCheckDefault">
                          Active?
                        </label>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value={values.active}
                          id="flexCheckDefault"
                          onChange={handleInputChange}
                          name="active"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* CAMPAIGN NAME ENTRY */}
                <div class="row">
                  <div class="col-4">
                    <label for="campaignName" id="basic-addon3">
                      Campaign Name:
                    </label>
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

                  {/* GAME SYSTEM ENTRY */}
                  <div class="col-4">
                    <label for="campaignName" id="basic-addon3">
                      Game System:
                    </label>

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

                <div class="row">
                  {/* GM ENTRY */}
                  <div class="col-4">
                    <label for="campaignName" id="basic-addon3">
                      Game Master:
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="text"
                      required
                      value={values.game_master}
                      onChange={handleInputChange}
                      name="game_master"
                    />

                    {/* DATE STARTED ENTRY */}
                    <div class="col">
                      <DatePicker onChange={setStartDate} value={startDate} />

                      <button
                        onClick={saveCampaign}
                        className="btn btn-success"
                      >
                        Submit
                      </button>
                    </div>
                    
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
