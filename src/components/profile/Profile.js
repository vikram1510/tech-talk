import React from 'react'
import axios from 'axios'
import Auth from '../../lib/auth'
import { Link } from 'react-router-dom'

class Profile extends React.Component {
  constructor() {
    super()

    this.state = {
      user: null
    }
  }

  componentDidMount(){
    axios.get('/api/profile', {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => this.setState({ user: res.data }))
  }

  render(){
    console.log(this.state)
    const { user } = this.state
    if (!user) return null
    return (
      <div className="profile-page">
        <div className="profile-nav-wrapper">
          <div className="profile-nav">
            <Link to='/profile/'>Dashboard</Link>
            <Link to='/profile/upcoming-events'>Upcoming Events</Link>
            <Link to='/profile/past-events'>Past Events</Link>
          </div>
        </div>

        <div className="dashboard-wrapper">
          <h1>Profile</h1>

          <div className="dashboard-content">
            <div className="events-attending-wrapper">
              <h2>Events Attending</h2>
              {user.eventsAttend.map((event, i) =>(
                <div className="event-wrapper" key={i}>
                  <div className="event-icon">Category icon</div>
                  <div className="event-summary">
                    <h4>{event.name}</h4>
                    <p>{event.date} at {event.time}</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="your-info-wrapper">
              <h2>Your Info</h2>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
            </div>

          </div>

        </div>

      </div>
      
    )
  }
}

export default Profile