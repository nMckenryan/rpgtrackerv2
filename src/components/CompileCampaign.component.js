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
    <div class="card bg-dark text-white p-4">
      {/* Checks if Logged in. No edit/creation available if not */}
      {user ? (
        <form className="submit-form needs-validation" novalidate>
          <div class="container">
            {/* // COMPILE CAMPAIGN */}
            <div className="form-group text-white bg-dark card">
              <div class="row justify-content-between">
                {/* BACK BUTTON */}
                <div class="col">
                  <Link to={"/"} className="btn btn-primary" title="Go Back">
                    <i class="bi bi-arrow-left-circle"></i>
                  </Link>
                </div>
                <h2 htmlFor="description" class="col text-center">
                  {editing ? "Edit" : "Create"} Campaign
                </h2>

                <div class="col">
                  {/* ACTIVE CAMPAIGN CHECKBOX (conditional) */}
                  {editing && (
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
                  )}
                </div>
              </div>

              {/* CAMPAIGN NAME ENTRY */}
              <div class="d-flex flex-row justify-content-center gap-5">
                <div class="col-4 pl-auto">
                  <label for="campaignName" id="basic-addon3">
                    Campaign Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="text"
                    required="true"
                    value={values.campaign_name}
                    onChange={handleInputChange}
                    name="campaign_name"
                  />
                </div>

                {/* GAME SYSTEM ENTRY */}
                <div class="col-4  ">
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

              <div class="d-flex flex-row justify-content-center gap-5">
                {/* DATE STARTED ENTRY */}
                <div class="col-4">
                  <label id="basic-addon3">Date Started:</label> <br />
                  <DatePicker
                    onChange={setStartDate}
                    value={startDate}
                    styles="background-color: white"
                  />
                </div>
                {/* TODO: Get required fields working */}

                {/* GM ENTRY */}
                <div class="col-4">
                  <label id="basic-addon3">Game Master:</label>

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
              <div class="pt-3 mx-auto">
                <button type="button" onClick={saveCampaign} className="btn btn-success">
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
        </form>
      ) : (
        // TO DO: Enfore Login, notify customer
        //   Reroutes to Login page if not logged in
        props.history.push("/")
      )}
    </div>
  );
};

export default CompileCampaign;
