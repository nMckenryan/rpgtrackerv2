import React, { useState } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";

// Add or Edit a Campaign

const CompileCampaign = (props) => {
  let initialCampaignState = "";

  //   Verify if Campaign is being Edited or Created.
  let editing = false;

  //   Enables Edit Mode
  if (props.location.state && props.location.state.currentCampaign) {
    editing = true;
    initialCampaignState = props.location.state.currentCampaign.text;
  }

  // Dunno if i can set this all to the same value.
  const [campname, setCampname] = useState(initialCampaignState);
  const [gm, setGm] = useState(initialCampaignState);
  const [act, setAct] = useState(initialCampaignState);
  const [system, setSystem] = useState(initialCampaignState);

  const [submitted, setSubmitted] = useState(false);

  //   Change State on Type
  const handleInputChange = (event) => {
    setCampname(event.target.value);
    setGm(event.target.value);
    setAct(event.target.value);
    setSystem(event.target.value);
  };

  const saveCampaign = () => {
    var data = {
      campaign_name: campname,
      gamemaster: gm,
      game_system: system,
      active: act,
      user_id: props.user.id,
      campaign_id: props.match.params.id,
    };

    // EDITING
    if (editing) {
      data.campaign_id = props.location.state.currentCampaign._id;
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
            // COMPILE REVIEW
            <div>
              {/* TODO: Reusable components?  */}

              <div className="form-group">
                <label htmlFor="description">
                  {editing ? "Edit" : "Create"} Campaign
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={campaign}
                  onChange={handleInputChange}
                  name="text"
                />

                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={campaign}
                  onChange={handleInputChange}
                  name="text"
                />
              </div>
              <button onClick={saveCampaign} className="btn btn-success">
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
