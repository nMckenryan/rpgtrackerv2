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
    date_started: null,
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
  const { user } = useAuth0();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  // SAVE CAMPAIGN
  const handleSubmit = (e) => {
    e.preventDefault();
    var data = {
      campaign_name: values.campaign_name,
      game_master: values.game_master,
      date_started: startDate,
      game_system: values.game_system,
      active: values.active,
      user_id: user.name,
      campaign_id: props.match.params.id,
    };

    console.log(data);

    // EDITING
    if (editing) {
      data.campaign_id = props.location.state.currentCampaign._id;
      CampaignDataService.updateRecord(data, "campaign")
        .then((response) => {
          setSubmitted(true);
          console.log("Editted Campaign Successfully" + response.data);
        })
        .catch((e) => {
          console.error("Could not Edit Campaign: " + e);
        });

      // CREATING
    } else {
      CampaignDataService.createRecord(data, "campaign")
        .then((response) => {
          setSubmitted(true);
          console.log("Created Campaign Successfully" + response.data);
        })
        .catch((e) => {
          console.error("Could not Add New Campaign: " + e);
        });
    }
  };

  return (
    <div className="card bg-dark text-white p-4">
      {/* Checks if Logged in. No edit/creation available if not */}
      {user ? (
        <div className="container">
          <form className="needs-validation" onSubmit={handleSubmit}>
            {/* // COMPILE CAMPAIGN */}
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
                  {editing ? "Edit" : "Create"} Campaign
                </h1>

                <div className="col mt-5">
                  {/* ACTIVE CAMPAIGN CHECKBOX (conditional) */}
                  {editing && (
                    <div className="form-check">
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        Active?
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={values.active}
                        id="flexCheckDefault"
                        onChange={handleInputChange}
                        name="active"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CAMPAIGN NAME ENTRY */}
              <div className="d-flex flex-row justify-content-center gap-5">
                <div className="col-4 pl-auto">
                  <label htmlFor="campaignName" id="basic-addon3">
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
                  <div className="invalid-feedback">
                    Please provide a valid campaign name.
                  </div>
                </div>

                {/* GAME SYSTEM ENTRY */}
                <div className="col-4  ">
                  <label htmlFor="campaignName" id="basic-addon3">
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

              <div className="d-flex flex-row justify-content-center gap-5">
                {/* DATE STARTED ENTRY */}
                <div className="col-4">
                  <label id="basic-addon3">Date Started:</label> <br />
                  <DatePicker
                    className="w-50"
                    locale="en-AU"
                    onChange={setStartDate}
                    value={startDate}
                    styles="background-color: white"
                    required
                  />
                </div>
                {/* TODO: Get required fields working */}

                {/* GM ENTRY */}
                <div className="col-4">
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
              <div className="pt-3 mx-auto">
                <input
                  type="submit"
                  value="Create"
                  className="btn btn-success"
                />

                {/* ON SUCCESSFUL CAMPAIGN SUBMIT  */}
                {submitted && (
                  <div class="text-center text-success">
                    <p>{editing ? "Campaign Edited!" : "Campaign Created!"}</p>
                    {editing
                      ? setTimeout(() => {
                          props.history.push(
                            "/campaigns/" +
                              props.location.state.currentSession._id
                          );
                        }, 1000)
                      : setTimeout(() => {
                          props.history.push("/");
                        }, 1000)}
                  </div>
                )}
              </div>
            </div>
          </form>
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
