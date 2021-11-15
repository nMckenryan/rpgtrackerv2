import React, { useState, useEffect } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ConfirmationModal from "./ConfirmationModal.component";
// import ConfirmationModal from "./ConfirmationModal.component";

// VIEW OF INDIVIDUAL CAMPAIGN. Shows Campaign details and a grid of sessions

const Campaign = (props) => {
  const initialCampaignState = {
    campaign_name: "",
    game_master: "",
    date_started: new Date(),
    game_system: "",
    active: false,
    sessions: [],
  };

  const [campaign, setCampaign] = useState(initialCampaignState);
  const { user, isAuthenticated } = useAuth0();

  const getCampaign = (id) => {
    CampaignDataService.get(id)
      .then((response) => {
        setCampaign(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // LOAD CAMPAIGN only gets called if ID is updated
  useEffect(() => {
    getCampaign(props.match.params.id);
  }, [props.match.params.id]);

  // DELETE - only allows user who created session to delete session
  const deleteSession = (sessionId, index) => {
    CampaignDataService.deleteRecord(sessionId, user.name, "session")
      .then((response) => {
        setCampaign((prevState) => {
          prevState.sessions.splice(index, 1);
          return {
            ...prevState,
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteCampaign = (campId) => {
    CampaignDataService.deleteRecord(campId, user.name, "campaign")
      .then((response) => {
        console.log("DELETED CAMPAIGN: " + campId);
        props.history.push("/");
      //   setCampaign((prevState) => {
      //     prevState.campaign.splice(i, 1);
      //     return {
      //       ...prevState,
      //     };
      //   });
      })
      .catch((e) => {
        console.log(e);
      });
  };


  // Trims Session log to excerpt if over 150 chars.
  const trimSession = (sLog) => {
    if (sLog.length > 150) {
      return sLog.substr(0, 160) + "..";
    } else {
      return sLog;
    }
  };

  // const deleteConfirmation = () => {
  //   try {
  //     <ConfirmationModal title="WARNING"></ConfirmationModal>;
  //   } catch (e) {
  //     console.error("Could not launch Campaign Delete Confirmation Modal" + e);
  //   }
  // };

  // CLIENT VIEW
  return (
    <div className="card bg-dark p-3">
      <div className="d-flex justify-content-between mb-4">
        {/* BACK BUTTON */}
        <div className="col-1">
          <Link to={"/"} className="btn btn-primary" title="Go Back">
            <i className="bi bi-arrow-left-circle"></i>
          </Link>
        </div>

        {isAuthenticated && user.name === campaign.user_id && (
          <div className="col-5 text-center">
            {/* EDIT CAMPAiGN BUTTONS */}
            <Link
              to={{
                pathname: "/campaign-edit/" + campaign._id,
                state: {
                  currentCampaign: campaign,
                },
              }}
              className="btn btn-info col"
            >
              <i className="bi bi-pencil-square"></i>
            </Link>
          </div>
        )}

        {/* DELETE CAMPAIGN BUTTON */}
        <div className="col-1 text-center">
          <button
            onClick={() => deleteCampaign(campaign._id)}
            className="btn btn-danger"
            title="Delete your Campaign?"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>

      {/* CAMPAIGN DETAILS */}
      {campaign ? (
        <div className="text-white">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1 className="h4 text-uppercase">{campaign.campaign_name}</h1>
                <small className="text-muted">Campaign Name</small>
              </div>

              <div className="col">
                <h4>{campaign.game_system}</h4>
                <small className="text-muted">Game System</small>
              </div>

              <div className="col">
                <h4>{campaign.game_master} </h4>
                <small className="text-muted">Game Master </small>
              </div>

              {/* CAMPAIGN ACTIVE STATUS */}
              <div className="col">
                {campaign.active ? (
                  <div className="text-center">
                    <h4>
                      <i className="bi bi-check-circle-fill"></i>
                    </h4>
                    <small className="text-muted">Campaign Active</small>
                  </div>
                ) : (
                  <>
                    <h4 className="text-center">
                      <i className="bi bi-x-circle-fill"></i>
                    </h4>
                    <small className="text-muted">Campaign Inactive</small>
                  </>
                )}
              </div>

              {/* DATE STARTED */}
              <div className="col">
                <h4 className="">
                  {new Date(campaign.date_started).toLocaleDateString("en-AU")}
                </h4>
                <small className="text-muted">Start Date </small>
              </div>
            </div>

            <br />
          </div>

          {/* SESSION TABLE DISPLAY */}

          <div className="row">
            {/* ADD NEW SESSION BUTTON */}
            {isAuthenticated && user.name === campaign.user_id && (
              <div className="col-lg-4 pb-1" key="0">
                <Link
                  to={"/campaigns/" + props.match.params.id + "/session"}
                  className="btn btn-secondary h-100 w-100 d-flex justify-content-center align-items-center"
                >
                  <h4 className="p-10">
                    <i className="bi bi-pencil-fill"></i>
                    Add New Session
                  </h4>
                </Link>
              </div>
            )}

            {/* INDIVIDUAL SESSION CARDS */}
            {campaign.sessions.length > 0 ? (
              campaign.sessions.map((session, index) => {
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card bg-secondary ">
                      <h5 className="card-header text-center">
                        {session.char_name}-{session.char_level}
                      </h5>
                      <div className="card-body">
                        <p className="card-text">
                          <strong>Player: </strong>
                          {session.user_id}
                          <br />
                          <strong>Date: </strong>
                          {new Date(session.session_date).toLocaleDateString(
                            "en-AU"
                          )}
                          <br />
                          <strong>Session Log: </strong>
                          <p>{trimSession(session.session_log)}</p>
                        </p>

                        {isAuthenticated && user.name === session.user_id && (
                          <div className="card-footer row">
                            {/* EDIT SESSION  BUTTONS */}
                            <Link
                              to={{
                                pathname:
                                  "/campaigns/" +
                                  props.match.params.id +
                                  "/session",
                                state: {
                                  currentSession: session,
                                },
                              }}
                              className="btn btn-info btn-sm col"
                            >
                              <i className="bi bi-pencil-square"></i>
                              View/Edit Session
                            </Link>

                            {/* DELETE SESSION BUTTON */}
                            <button
                              className="btn btn-danger btn-sm col"
                              onClick={() => deleteSession(session._id, index)}
                            >
                              <i className="bi bi-trash"></i>
                              Delete Session
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // IF NO SESSIONS AVAILABLE
              <div className="col-sm-4">
                <p>No sessions yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        //   NO CAMP SELECTED
        <div>
          <br />
          <p>No campaign selected.</p>
        </div>
      )}
    </div>
  );
};

export default Campaign;
