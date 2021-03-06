import React, { useState, useEffect } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const CampaignList = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  // const [searchName, setSearchName] = useState("");
  const [searchSystem, setSearchSystem] = useState("");
  const [systems, setSystems] = useState(["All Systems"]);

  const { user, isAuthenticated, loginWithPopup, isLoading } = useAuth0();

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


  const findBySystem = () => {
    if (searchSystem === "All Systems") {
      refreshList();
      console.log("sort by all systems")
    } else {
      find(searchSystem, "game_system");

    }
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
        console.error("Not Found" + e);
      });
  };

  return (
    <>
      {/* SORT BAR */}
      {/* TODO: Repair Sort by System */}
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
        </div>  */}

      {/* RESULTS GRID */}
      <div className="row justify-content-center text-white">
        {isLoading ? (
          <div className="spinner-border text-light mt-100" style={{width: '5rem', height: '5rem'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        ) : (
          <div className="col-lg-4 pb-3">
            {isAuthenticated ? (
              <Link
                to={"/campaign-new"}
                className="btn btn-dark h-100 w-100 d-flex justify-content-center align-items-center"
              >
                <h4>
                  <i className="bi bi-pencil-fill"></i>
                  Add Campaign
                </h4>
              </Link>
            ) : (
              <button
                onClick={loginWithPopup}
                className="btn btn-dark h-100 w-100 d-flex justify-content-center align-items-center"
              >
                <h4>
                  <i className="bi bi-pencil-fill"></i>
                  Login to Add Campaigns
                </h4>
              </button>
            )}
          </div>
        )}

        {campaigns.map((camp) => {
          return (
            <>
              {isAuthenticated && user.name === camp.user_id && (
                <div className="col-lg-4 pb-3">
                  <div className="card h-100 bg-dark text-white">
                    {/* CAMPAIGN CARD BOX */}
                    <div className="card-header d-flex mx-auto">
                      <h4 className="text-nowrap mw-100">
                        {camp.campaign_name + " "}
                        {camp.active ? (
                          <i className="bi bi-check-circle-fill"></i>
                        ) : (
                          <i className="bi bi-x-circle-fill"></i>
                        )}
                      </h4>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <div className="row justify-content-around">
                        <div className="col-5 d-flex flex-column">
                          <p className="card-text m-0">{camp.game_system}</p>
                          <small className="text-muted">Game System</small>
                        </div>
                        <div className="col-5 d-flex flex-column">
                          <p className="card-text m-0">{camp.game_master}</p>
                          <small className="text-muted mt-auto">Game Master</small>
                        </div>
                      </div>
                      <br />

                      <div className="row justify-content-around mt-auto">
                        <div className="col-5  d-flex flex-column">
                          <Link
                            to={"/campaigns/" + camp._id}
                            className="btn btn-primary btn-sm mx-1 mb-1"
                          >
                            <h6>
                              <i className="bi bi-search"></i>
                              <br />
                              View Sessions
                            </h6>
                          </Link>
                        </div>

                        <div className="col-5  d-flex flex-column">
                          {/* EDIT CAMPAiGN BUTTONS */}
                          <Link
                            to={{
                              pathname: "/campaign-edit/" + camp._id,
                              state: {
                                currentCampaign: camp,
                              },
                            }}
                            className="btn btn-info btn-sm mx-1 mb-1"
                          >
                            <h6>
                              <i className="bi bi-pencil-square"></i> <br />
                              Edit Campaign
                            </h6>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })}
      </div>
    </>
  );
};

export default CampaignList;
