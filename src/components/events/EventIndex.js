import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import moment from 'moment'

import Map from '../common/Map'
import EventLogo from './EventLogo'

const animatedComponents = makeAnimated()

class EventIndex extends React.Component {
  constructor(){
    super()

    this.state = {
      events: null,
      showEvents: null,
      filter: {
        category: [],
        date: {
          value: 'all'
        },
        price: []
      },
      checkbox: false,
      loading: true,
      loadingBars: true,
      loadingCards: true
    }

    this.categories = [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'python', label: 'Python' },
      { value: 'php', label: 'PHP' },
      { value: 'java', label: 'Java' },
      { value: 'swift', label: 'Swift' },
      { value: 'c++', label: 'C++' },
      { value: 'sql', label: 'SQL' },
      { value: 'ruby', label: 'Ruby' }
    ]
    
    this.date = [
      { value: 7, label: 'Next 7 Days' },
      { value: 30, label: 'Next 30 Days' },
      { value: 'all', label: 'All Events' }
    ]

    this.locations = [
      { value: 'london', label: 'London' }
    ]

    this.handleFreeEventClick = this.handleFreeEventClick.bind(this)
    this.handleMultiCatergorySelect = this.handleMultiCatergorySelect.bind(this)
    // this.handleDateSelect = this.handleDateSelect.bind(this)
    
  }

  componentDidMount() {
    axios.get('/api/events')
      .then(res => {
        this.setState({ events: res.data })
        setTimeout(() => {
          this.setState({ loading: false })
        }, 300)
        setTimeout(() => {
          this.setState({ loadingBars: false })
        }, 1000)
        setTimeout(() => {
          this.setState({ loadingCards: false })
        }, 2000)
      })
      
  }

  handleFreeEventClick(e) {
    this.setState({ checkbox: !this.state.checkbox })
    e.target.blur()
  }

  filteredEvents() {
    console.log(this.state.checkbox)
    const selectedCategory = this.state.filter.category ? this.state.filter.category.map(cat => cat.value) : []
    const selectedPeriod = this.state.filter.date.value
    return this.state.events.filter(event => {
      //would not render the current day as it between does not seem to include the start date - therefore I have minused on the start and plused on the end date
      const startDate = moment().add(-1, 'days')
      const endDate = moment().add(selectedPeriod + 1, 'days')
      if (selectedCategory.length === 0 && selectedPeriod === 'all')  return true
      if (selectedCategory.length === 0) return moment(event.date).isBetween(startDate, endDate)
      if (selectedPeriod === 'all') return selectedCategory.includes(event.category.toLowerCase())
      const catFilter = selectedCategory.includes(event.category.toLowerCase())
      const dateFilter = moment(event.date).isBetween(startDate, endDate)
      return catFilter && dateFilter
    })
  }
  
  priceFilter(events){
    return events.filter(event => {
      if (this.state.checkbox) return event.price === 0
      return true
    })
  }

  handleMultiCatergorySelect(selected, action) {
    this.setState({ filter: { ...this.state.filter, [action.name]: selected } }) 
  }


  render() {
    console.log(this.state)
    const { events } = this.state
    if (!events) return null
    return (
      <div className="index-page">
        <div className={`map-wrapper ${!this.state.loading ? 'animated fadeIn' : 'hidden'}`}>
          <Map className="map-element" events={this.priceFilter(this.filteredEvents())}/>
        </div>
        <div className="index-foreground">
          <div className="flex-foreground">
            <div className="foreground-top">
              <div className={`filter-list-wrapper ${!this.state.loadingBars ? 'animated fadeInDown' : 'hidden'}`}>
                <Select className="category-select"
                  options={this.categories} 
                  placeholder="Categories" 
                  isMulti 
                  components={animatedComponents}
                  onChange={this.handleMultiCatergorySelect}
                  name="category" 
                />
                <Select className="date-select" name="date" options={this.date} placeholder="Date" deafultValue={this.date[2]} onChange={this.handleMultiCatergorySelect} />
                <button onClick={this.handleFreeEventClick} 
                  className={`checkbox-input ${!this.state.checkbox ? 'off' : 'on' }`}
                >Free Events Only</button>
              </div>
            </div>
            <div className="foreground-bottom">
              <div className={`list-map-wrapper ${!this.state.loadingBars ? 'animated fadeInRight' : 'hidden'}`}>
                <div className="map-events-title">
                  <h4>Events</h4>
                </div>
                <div className="event-list">
                  {
                    this.priceFilter(this.filteredEvents()).map(event => (
                      <Link to={`/events/${event._id}`} key={event._id} className="event-linktag">
                        <div className={`event-wrapper ${!this.state.loadingCards ? 'animated fadeIn' : 'hidden'}`} >
                          <div className="event-text">
                            <div className="event-name">
                              <h4 className="event-name-text">{event.name}</h4>
                            </div>
                            <div className="event-description">
                              <p>{moment(event.date).format('MMM DD YYYY')}</p>
                              <p>{moment(event.time, 'HH:mm').format('h:mm A')}</p>
                            </div>
                          </div>
                          <div className="event-thumbnail-image">
                            <EventLogo category={event.category} />
                          </div>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EventIndex
