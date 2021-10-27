import React, { useState, useEffect } from "react";
import CampaignDataService from "../services/campaign.service";
import { Link } from "react-router-dom";

const SessionList = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const [searchCuisine, setSearchCuisine] = useState("");
  const [cuisines, setCuisines] = useState(["All Cuisines"]);

  useEffect(() => {
    retrieveCampaigns();
    retrieveCuisines();
  }, []);

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchZip = (e) => {
    const searchZip = e.target.value;
    setSearchZip(searchZip);
  };

  const onChangeSearchCuisine = (e) => {
    const searchCuisine = e.target.value;
    setSearchCuisine(searchCuisine);
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

  const retrieveCuisines = () => {
    CampaignDataService.getCuisines()
      .then((response) => {
        console.log(response.data);
        setCuisines(["All Cuisines"].concat(response.data));
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

  const findByZip = () => {
    find(searchZip, "zipcode");
  };

  const findByCuisine = () => {
    if (searchCuisine === "All Cuisines") {
      refreshList();
    } else {
      find(searchCuisine, "cuisine");
    }
  };

  return (
    <div>
      <div className="row pb-1">
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
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={searchZip}
            onChange={onChangeSearchZip}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByZip}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <select onChange={onChangeSearchCuisine}>
            {cuisines.map((cuisine) => {
              return <option value={cuisine}> {cuisine.substr(0, 20)} </option>;
            })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCuisine}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* DISPLAY RESULTS */}
      <div className="row">
        {campaigns.map((camp) => {
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{camp.campaign_name}</h5>
                  <h6 className="card-text">{camp.game_system}</h6>
                  <p className="card-text">
                    <strong>Game Master: </strong>
                    {camp.game_master}
                    <br />
                    <strong>Active: </strong>
                    {camp.active ? (
                      <i class="bi bi-check-circle-fill"></i>
                    ) : (
                      <i class="bi bi-x-lg"></i>
                    )}
                  </p>
                  <div className="row">
                    <Link
                      to={"/campaigns/" + camp._id}
                      className="btn btn-primary col-lg-5 mx-1 mb-1"
                    >
                      View Sessions
                    </Link>
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
