import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css"
import Swal from 'sweetalert2'

export default class CompileSession extends Component {
    constructor(props){
        super(props);

        //BINDING this TO CLASS. V IMPORTANT!!!
        this.onChangeCampaign = this.onChangeCampaign.bind(this);
        this.onChangeCharacter = this.onChangeCharacter.bind(this);
        this.onChangeSeslog = this.onChangeSeslog.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            campaign: "",
            character: "",
            sesLog: "",
            date: new Date(),
            campaignList: [],
            editCheck: "" //Can be either 'Edit' or 'Create'. 'Edit' sets methods + UI to 'edit mode', and vice versa.
        }
    }

    componentDidMount() {
      //GET SESSION DATA (if editting)
      if(this.props.location.pathname.substring(0,5) === "/edit") { 
        this.setState({editCheck: "Edit"});
        axios.get('https://localhost:5000/sessions/'+this.props.match.params.id)
        .then(response => {
          this.setState({
            campaign: response.data.campaign,
            character: response.data.character,
            sesLog: response.data.sesLog,
            date: new Date(response.data.date)
          })   
        })
        .catch(function (error) {
          console.log("ERROR: " + error);
        })
      } else {
        this.setState({editCheck: "Create"});
      }

      //GET CAMPAIGN
      axios.get('https://localhost:5000/campaigns')
      .then(response => {
          if(response.data.length > 0) {
              this.setState({
              campaignList: response.data.map(campaignItem => campaignItem.cName),
              campaign: response.data[0].cName //displays campaign name of first in db
          })
          }
      })
    }

    //SET METHODS / UPDATING PROPS
    onChangeCampaign(e) {
        this.setState(
            {
              campaign: e.target.value
            }
        );
    }

    onChangeCharacter(e) {
        this.setState(
            {
              character: e.target.value
            }
        );
    }

    onChangeSeslog(e) {
        this.setState(
            {
                sesLog: e.target.value
            }
        );
    }

    onChangeDate(date) { //date cast in from calendar
        this.setState(
            {
                date: date
            }
        );
    }

    onSubmit(e) {
      //Declares toast confirmations
      const Toast = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

        e.preventDefault();
        const session = {
            campaign: this.state.campaign,
            character: this.state.character,
            sesLog: this.state.sesLog,
            date: this.state.date
        }

        if(this.state.editCheck === "Edit") { //reads path to check if editing or creating.
          axios.post('https://localhost:5000/sessions/update/'+this.props.match.params.id, session)
              .then(res => console.log(res.data)) //promise that acknowledges submission
              .catch(err => {
                console.log(err)
            })
            Toast.fire({
              icon: 'info',
              title: 'Session Edited!'
            });
        } else if (this.state.editCheck === "Create") {
          console.log(session);
          axios.post('https://localhost:5000/sessions/add', session)	
              .then(res => console.log(res.data))
              .catch(err => {
                console.log(err)
            })
            Toast.fire({
              icon: 'success',
              title: 'Session Added!'
            });
        }
        setTimeout(function(){
          window.location = "/"}, 2000);//Go to create Session page after 2 seconds
    }

    render() {
        return (
          <div className="activeWindow">
            <h3>{this.state.editCheck} RPG Session</h3>
            <br/>
            <form onSubmit={this.onSubmit}>
              <div className="form-group"> 
                <h6>Campaign: </h6>
                <select 
                    required
                    className="form-control"
                    value={this.state.campaign}
                    onChange={this.onChangeCampaign}>
                    {
                      this.state.campaignList.map(function(campaign) {
                        return <option 
                          key={campaign}
                          value={campaign}>{campaign}
                          </option>;
                      })
                    }
                </select>
              </div>
              <div className="form-group"> 
                <h6>Character: </h6>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.character}
                    onChange={this.onChangeCharacter}
                    />
              </div>
              <div className="form-group">
                <h6>Session Log</h6>
                <textarea 
                    required
                    rows="4" 
                    cols="50"
                    type="text" 
                    className="form-control"
                    value={this.state.sesLog}
                    onChange={this.onChangeSeslog}
                    />
              </div>
              <div className="form-group">
                <h6>Date: </h6>
                <div>
                  <DatePicker
                    required
                    selected={this.state.date}
                    onChange={this.onChangeDate}
                  />
                </div>
              </div>
    
              <div className="form-group">
                <input type="submit" className="btn" />
              </div>
            </form>
            <br/>
          </div>
          
        )
    }
}
