import React from 'react'
import axios from 'axios'
import Auth from '../../lib/auth'
import moment from 'moment'
import { Link } from 'react-router-dom'


class Profile extends React.Component {
  constructor() {
    super()

    this.state = {
      user: null
    }

    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount(){
    this.getProfile() 
  }

  getProfile() {
    axios.get('/api/profile', {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => this.setState({ user: res.data }))
  }

  sortEventDates(array) {
    return array.sort((a,b) => b.event.date - a.event.date)
  }

  handleDelete(id) {
    axios.delete(`/api/events/${id}`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(() => this.getProfile())
      .catch(err => console.log(err))
  }

  render(){
    console.log(this.state)
    const { user } = this.state
    if (!user) return null
    console.log(this.state.user.hostedEvents)
    return (
      <div className="profile-page animated fadeIn">
        
        <div className="profile-bar-wrapper animated fadeInDown">
          <div className="profile-bar">
            <h2>Welcome to your profile, {user.username}!</h2>
            <img className="profile-bar-image" src={user.profilePic}></img>
          </div>
        </div>

        <div className="dashboard-wrapper animated fadeInUp">
          <div className="dashboard-content">

            <div className="your-events">
              <h4>Your Events:</h4>
              <table className="u-full-width">
                <thead>
                  <tr>
                    <th>Language</th>
                    <th>Event</th>
                    <th>Date and Time</th>
                    <th>Event Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.eventsAttend.map((event, i) =>(
                    <tr key={i}>
                      <td className="event-icon">{event.category}</td>
                      <td>
                        <Link to={`/events/${event._id}`}>{event.name}</Link>
                      </td>
                      <td>{moment(event.date).format('MMM Do YYYY')} @ {moment(event.time,'HH:mm').format('h:mm A')}</td>
                      <td>{moment().isBefore(event.date) ? 'Upcoming Event' : moment().isSame(event.date) ? 'Event Today' : 'Attended'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="your-hosted-events">
              <h4 className="hosted-title">Events hosted by you:</h4>
              <table className="u-full-width">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date and Time</th>
                    <th>Edit/Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {user.hostedEvents.map((event, i) =>(
                    <tr key={i}>
                      <td>
                        <Link to={`/events/${event._id}`}>{event.name}</Link>
                      </td>
                      <td>{moment(event.date).format('MMM Do YYYY')} @ {moment(event.time,'HH:mm').format('h:mm A')}</td>
                      <td>
                        <div>
                          <Link to={`/events/${event._id}`}>Edit Event</Link>
                          <button onClick={() => this.handleDelete(event._id)}>
                            <i className="far fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
      
    )
  }
}

export default Profile

// to={`/events/${event._id}}
