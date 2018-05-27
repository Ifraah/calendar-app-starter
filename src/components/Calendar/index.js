import React from "react"
import moment from "moment"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import "react-dates/initialize"
import { DayPickerRangeController , isInclusivelyBeforeDay } from "react-dates"
import "./Calendar.css"

 function getIndex(value, arr) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] === value) {
            return i;
        }
    }
    return -1; //to handle the case where the value doesn't exist
}

class Calendar extends React.Component {
  constructor(props) {
    super(props)
    global.booked = [];
    moment.updateLocale("en", {
      weekdaysMin: ["S", "M", "T", "W", "T", "F", "S"],
    })

    this.state = {
      focusedInput: "startDate",
      startDate: props.startDate,
      endDate: props.endDate,
      focused: false,
      isBooked: false
    }
  }

  formatDateString = date => {
    return date && date.format(this.props.formatString)
  }

  onDatesChange = ({ startDate, endDate }) => {
    if (
      this.state.focusedInput === "startDate" ||
      (this.state.focusedInput === "endDate" && endDate < startDate)
    ) {
      this.setState({
        startDate: startDate,
        endDate: null,
        appointment: null,
      })
    } else {
      this.setState({
        focusedInput: "startDate",
        startDate,
        endDate,
      })
    }
  }

  onFocusChange = focusedInput => {
    this.setState({
      focusedInput,
    })
  }

  onCancel = () => {
    let startDate = 0
    let endDate = 0
    this.setState({
      isBooked: false
    })

    if (this.state.startDate && this.state.endDate) {
      startDate = this.state.startDate
      endDate = this.state.endDate
    } else {
      startDate = this.state.startDate
      endDate = this.state.startDate
    }
    while(startDate<=endDate){
      const index = getIndex (startDate._d.toString().substring(0,16),global.booked)
      if (index > -1) {
        global.booked = global.booked.filter((_,i) => i !== index)
      }
        startDate = moment(startDate, "DD-MM-YYYY").add(1, 'days')
    }
    this.forceUpdate()
  }

  apply = () => {
    let startDate = 0
    let endDate = 0

    if (this.state.startDate && this.state.endDate) {
      startDate = this.state.startDate
      endDate = this.state.endDate
    } else {
      // If only one selection was made, assume a 1-day range.
      startDate = this.state.startDate
      endDate = this.state.startDate
    }

    while (startDate<=endDate) {
      const index = getIndex (startDate._d.toString().substring(0,16),global.booked)
      if (index > -1) {
        this.setState({
          isBooked: true
        })
          startDate = moment(endDate, "DD-MM-YYYY").add(1, 'days')
      }
      else if (index === -1) {
          global.booked.push(startDate._d.toString().substring(0,16));
          startDate = moment(startDate, "DD-MM-YYYY").add(1, 'days')
          this.setState({
            isBooked: false
          })
      }

    }
    this.forceUpdate()
  }

  handleChange(event) {
  this.setState({appointment: event.target.value})
}

  render() {
    const data = global.booked.map(t => <span>{t}</span>)
    const input = <form>
    <label>
      Appointment:
      <input type="text" name="appointment" value={this.state.appointment} onChange={this.handleChange.bind(this)}/>
    </label>
  </form>
    const result=(data.map(i=>i.props.children))

    return (
      <div className="Calendar">
        <div className="picker-container">
          <DayPickerRangeController
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            focusedInput={this.state.focusedInput}
            onDatesChange={this.onDatesChange}
            onFocusChange={this.onFocusChange}
            numberOfMonths={1}
            initialVisibleMonth={() =>
              moment(this.state.endDate)
            }
            keepOpenOnDateSelect={true}
            isOutsideRange={day =>
              isInclusivelyBeforeDay(day, moment().subtract(1, "days"))
            }
            hideKeyboardShortcutsPanel={true}
            minimumNights={0}
            daySize={150}
            weekDayFormat="dd"
          />
        </div>
        <div className="button-container">
          <a onClick={this.onCancel}>Cancel Appointment Day</a>
          <Button color="primary" onClick={this.apply}>
            Book Appointment Day
          </Button>
        </div>
        <div className="schedule">
          <div className="booked">
            {this.state.isBooked ? (
               <h1> ALREADY BOOKED </h1>
             ) : (
               null
             )}
          </div>
          <h2>Booked Days {'\n'}</h2>
          <div className="booked-days">
            <div style={{'whiteSpace':'pre-line'}}>
            {result.join('\n')}
          </div>
          </div>
        </div>
      </div>
    )
  }
}

Calendar.propTypes = {
  formatString: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(moment).isRequired,
  endDate: PropTypes.instanceOf(moment).isRequired,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
}

Calendar.defaultProps = {
  formatString: "M/D/Y",
  startDate: moment(),
  endDate: moment(),
}

export default Calendar;
