import React, { useState, useEffect } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const SessionList = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  // const [searchName, setSearchName] = useState("");
  const [searchSystem, setSearchSystem] = useState("");
  const [systems, setSystems] = useState(["All Systems"]);

  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    retrieveCampaigns();
    retrieveSystems();
  }, []);

  // const onChangeSearchName = (e) => {
  //   const searchName = e.target.value;
  //   setSearchName(searchName);
  // };

  // const findByName = () => {
  //   find(searchName, "name");
  // };

  const onChangeSearchSystem = (e) => {
    const searchSystem = e.target.value;
    console.log(e);
    setSearchSystem(searchSystem);
  };

  const retrieveCampaigns = () => {
    CampaignDataService.getAll()
      .then((response) => {
        setCampaigns(response.data.campaigns);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Getting Systems for System Sort Menu
  const retrieveSystems = () => {
    CampaignDataService.getSystems()
      .then((response) => {
        setSystems(["All Systems"].concat(response.data));
      })
      .catch((e) => {
        console.error("Could not retrieve Systems: " + e);
      });
  };

  const refreshList = () => {
    retrieveCampaigns();
  };

  const find = (query, by) => {
    CampaignDataService.find(query, by)
      .then((response) => {
        // console.log(response.data);
        setCampaigns(response.data.campaigns);
      })
      .catch((e) => {
        console.error("Not Found" + e);
      });
  };

  const findBySystem = () => {
    if (searchSystem === "All Systems") {
      refreshList();
    } else {
      find(searchSystem, "game_system");
    }
  };

  return (
    <>
      {/* SEARCH BAR */}
      {/* TODO: Get Functional */}
      {/* <div className="row pb-1"> 
        

        <div className="input-group col-lg-4">
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
        </div> */}

      {/* SORT BAR */}
      {/* TODO: Repair */}
      {/* <div className="input-group col-lg-4">
          <select onChange={onChangeSearchSystem}>
            {systems.map((sys) => {
              return <option value={sys}> {sys.substr(0, 20)} </option>;
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
      </div>*/}

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
                      <i class="bi bi-x-circle-fill"></i>
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

                    {isAuthenticated && user.name === camp.user_id && (
                      <div className="col-5">
                        {/* EDIT CAMPAiGN BUTTONS */}
                        <Link
                          to={{
                            pathname: "/campaign-edit/" + camp._id,
                            state: {
                              currentCampaign: camp,
                            },
                          }}
                          className="btn btn-info mx-1 mb-1"
                        >
                          <i class="bi bi-pencil-square"></i>
                          <h6>Edit Campaign</h6>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SessionList;
