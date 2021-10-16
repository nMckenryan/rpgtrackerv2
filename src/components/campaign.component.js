import React, { useState, useEffect } from "react";
import CampaignDataService from "../services/campaign";
import { Link } from "react-router-dom";

const Campaign = (props) => {
  const initialCampaignState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
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

  // CLIENT VIEW
  return (
    <div>
      {campaign ? (
        <div>
          <h5>{campaign.name}</h5>
          <p>
            <strong>Cuisine: </strong>
            {campaign.cuisine}
            <br />
            <strong>Address: </strong>
            {campaign.address.building} {campaign.address.street},{" "}
            {campaign.address.zipcode}
          </p>

          <Link
            to={"/campaigns/" + props.match.params.id + "/session"}
            className="btn btn-primary"
          >
            Add Session
          </Link>

          <h4> Sessions </h4>
          <div className="row">
            {campaign.sessions.length > 0 ? (
              campaign.sessions.map((session, index) => {
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {session.text}
                          <br />
                          <strong>User: </strong>
                          {session.name}
                          <br />
                          <strong>Date: </strong>
                          {session.date}
                        </p>
                        {props.user && props.user.id === session.user_id && (
                          <div className="row">
                            <a
                              onClick={() => deleteSession(session._id, index)}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Delete
                            </a>
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
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Edit
                            </Link>
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
