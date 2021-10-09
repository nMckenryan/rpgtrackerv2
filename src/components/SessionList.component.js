import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import '../custom.scss';
import Swal from 'sweetalert2'

//SESSION FUNC COMPONENT FOR DISPLAYING INDIVIDUAL FIELDS 
const Session = props => (
    <tr>
      <td>{props.session.campaign}</td>
      <td>{props.session.date.substring(0,10)}</td>
      <td>{props.session.character}</td>
      <td>{props.session.sesLog}</td>
      <td>
        <Link to={"/edit/"+props.session._id}><button>Edit</button></Link> <button href="#" onClick={() => { props.deleteSession(props.session._id) }}>Delete</button>
      </td>
    </tr>
  )

export default class SessionList extends Component {
    constructor(props){
        super(props);
        this.deleteSession = this.deleteSession.bind(this);
        this.state = { sessions: [] }
    }

    componentDidMount() { //adds list of exercises to state before page gen
        axios.get('http:/localhost:5000/sessions/')
        .then(response => { 
            this.setState({ sessions: response.data }); //gets all fields in sessions
        })
        .catch((error) => {
            console.log(error);
        })
    }

    //DELETE SESSION
    deleteSession(id) {
      Swal.fire({
        title: 'Are you sure your want to delete this session?',
        showCancelButton: true,
        confirmButtonText: `Delete`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          axios.delete('https://dungeonrpgtracker.herokuapp.com/sessions/' + id)
          .then(res => console.log(res.data))
        //updates page state upon deletion.
        this.setState({ 
            sessions: this.state.sessions.filter(el => el._id !== id)
        })
        } 
      })
    }

    sessionList() {
        return this.state.sessions.map(currentsession => {
            return <Session session={currentsession} deleteSession={this.deleteSession}key={currentsession._id}/>;
        })
    }

    render() {
        return (
            <Table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Date</th>
                  <th>Character</th>
                  <th>Session Log</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                { this.sessionList() }
              </tbody>
            </Table>
        )
      }
    }
