import React, { useState, useEffect } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";

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
    CampaignDataService.delete(sessionId, props.user.id, "session")
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

  // Trims Session log to excerpt if over 150 chars.
  const trimSession = (sLog) => {
    if (sLog.length > 150) {
      return sLog.substr(0, 160) + "..";
    } else {
      return sLog;
    }
  };

  // CLIENT VIEW
  return (
    <div>
      <div class="col-1 mb-3">
        <Link to={"/"} className="btn btn-primary">
          <i class="bi bi-arrow-left-circle"></i>
        </Link>
      </div>
      {/* CAMPAIGN DETAILS */}
      {campaign ? (
        <div>
          <div class="container">
            <div class="row">
              <div class="col">
                <h1 className="text-uppercase">{campaign.campaign_name}</h1>
                <small class="text-muted">Campaign Name</small>
              </div>
            </div>
            <br />
            <div class="row">
              <div class="col-2">
                <h2>{campaign.game_system}</h2>
                <small class="text-muted">Game System</small>
              </div>

              <div class="col-2">
                {campaign.active ? (
                  <>
                    <i class="bi bi-check-circle-fill"></i>
                    <small class="text-muted">Campaign Ongoing</small>
                  </>
                ) : (
                  <i class="bi bi-x-lg">Campaign Concluded</i>
                )}
              </div>
              <div class="col-3">
                <h3>{campaign.game_master} </h3>
                <small class="text-muted">Game Master </small>
              </div>
            </div>
          </div>
          <br />

          {/* SESSION TABLE DISPLAY */}

          {/* ADD SESSIONS */}
          <Link
            to={"/campaigns/" + props.match.params.id + "/session"}
            className="btn btn-primary"
          >
            <i class="bi bi-plus"></i>
            Add Session
          </Link>

          {/* DELETE BUTTON */}
          {/* <a
            className="btn btn-danger col-lg-5 mx-1 mb-1"
            onClick={() => deleteRecord(campaign._id, index, "campaign")}
          >
            <i class="bi bi-trash"></i>
            <h6>Delete</h6>
          </a> */}

          <div className="row">
            {campaign.sessions.length > 0 ? (
              campaign.sessions.map((session, index) => {
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          <strong>User: </strong>
                          {session.char_name}
                          <br />
                          <strong>Level: </strong>
                          {session.char_level.toString()}
                          <strong>Date: </strong>
                          {Date.parse(session.session_date)}
                          <br />
                          <strong>Session Log: </strong>
                          <p>{trimSession(session.session_log)}</p>
                        </p>

                        {props.user && props.user.id === session.user_id && (
                          <div className="row">
                            {/* EDIT BUTTONS */}
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
                              className="btn btn-info col-lg-5 mx-1 mb-1"
                            >
                              <i class="bi bi-pencil-square"></i>
                              <h6>Edit</h6>
                            </Link>

                            {/* DELETE BUTTON */}
                            <a
                              className="btn btn-danger col-lg-5 mx-1 mb-1"
                              onClick={() =>
                                deleteSession(session._id, index, "session")
                              }
                            >
                              <i class="bi bi-trash"></i>
                              <h6>Delete</h6>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // NO SESSION AVAILABLE
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
