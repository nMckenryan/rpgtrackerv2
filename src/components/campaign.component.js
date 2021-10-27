import React, { useState, useEffect } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";

// VIEW OF SINGULAR CAMPAIGN

const Campaign = (props) => {
  const initialCampaignState = {
    campaign_name: "",
    game_master: "",
    date_started: "",
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
    CampaignDataService.deleteSession(sessionId, props.user.id)
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
      {campaign ? (
        <div>
          <h5>{campaign.campaign_name}</h5>
          <p>
            {campaign.game_system}
            <br />
            <strong>Active: </strong>
            {campaign.active}
            <strong>GM: </strong>
            {campaign.game_master}
          </p>

          {/* ADD SESSIONS */}
          <Link
            to={"/campaigns/" + props.match.params.id + "/session"}
            className="btn btn-primary"
          >
            Add Session
          </Link>

          {/* SESSION TABLE DISPLAY */}
          <h4> Sessions </h4>
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
                          {session.session_date}
                          <br />
                          <strong>Session Log: </strong>
                          <p>{trimSession(session.session_log)}</p>
                        </p>
                        {props.user && props.user.id === session.user_id && (
                          <div className="row">
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
                              Edit
                            </Link>
                            <a
                              className="btn btn-danger col-lg-5 mx-1 mb-1"
                              onClick={() => deleteSession(session._id, index)}
                            >
                              Delete
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
