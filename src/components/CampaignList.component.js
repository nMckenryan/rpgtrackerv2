import React, { useState, useEffect } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";

const SessionList = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchSystem, setSearchSystem] = useState("");
  const [systems, setSystems] = useState(["All Systems"]);

  useEffect(() => {
    retrieveCampaigns();
    retrieveSystems();
  }, []);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchSystem = (e) => {
    const searchSystem = e.target.value;
    setSearchSystem(searchSystem);
  };

  const retrieveCampaigns = () => {
    CampaignDataService.getAll()
      .then((response) => {
        console.log(response.data);
        setCampaigns(response.data.campaigns);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveSystems = () => {
    CampaignDataService.getSystems()
      .then((response) => {
        console.log(response.data);
        setSystems(["All Systems"].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveCampaigns();
  };

  const find = (query, by) => {
    CampaignDataService.find(query, by)
      .then((response) => {
        console.log(response.data);
        setCampaigns(response.data.campaigns);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name");
  };

  const findBySystem = () => {
    if (searchSystem === "All Systems") {
      refreshList();
    } else {
      find(searchSystem, "cuisine");
    }
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          {/* SEARCH BAR */}
          {/* TODO: Make searchable by anything */}
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>

        {/* SORT BY CAMPAIGN (LARGEST?) */}
        {/* TODO: Sort by largest campaign */}
        <div className="input-group col-lg-4">
          <select onChange={onChangeSearchSystem}>
            {systems.map((cuisine) => {
              return <option value={cuisine}> {cuisine.substr(0, 20)} </option>;
            })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findBySystem}
            >
              Sort
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS GRID */}
      <div className="row">
        {campaigns.map((camp) => {
          console.log(camp);
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                {/* CAMPAIGN CARD BOX */}
                <div className="card-header">
                  <h3>
                    {camp.campaign_name + " "}
                    {camp.active ? (
                      <i class="bi bi-check-circle-fill"></i>
                    ) : (
                      <i class="bi bi-x-lg"></i>
                    )}
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row justify-content-around">
                    <div className="col">
                      <h6 className="card-text">{camp.game_system}</h6>
                      <small class="text-muted">Game System</small>
                    </div>
                    <div className="col">
                      <h6 className="card-text">{camp.game_master}</h6>
                      <small class="text-muted">Game Master</small>
                    </div>
                  </div>
                  <br />

                  <div className="row justify-content-around">
                    <div className="col-5">
                      <Link
                        to={"/campaigns/" + camp._id}
                        className="btn btn-primary mx-1 mb-1"
                      >
                        <i class="bi bi-eyeglasses"></i>
                        <h6>View Sessions</h6>
                      </Link>
                    </div>

                    {/* {props.user && props.user.id === camp.user_id && ( */}
                    <div className="col-5">
                      {/* EDIT CAMPAiGN BUTTONS */}
                      <Link
                        to={{
                          pathname: "/campaigns/" + camp._id,
                          state: {
                            currentCampaign: camp,
                          },
                        }}
                        className="btn btn-info mx-1 mb-1"
                      >
                        <i class="bi bi-pencil-square"></i>
                        <h6>Edit Session</h6>
                      </Link>
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionList;
