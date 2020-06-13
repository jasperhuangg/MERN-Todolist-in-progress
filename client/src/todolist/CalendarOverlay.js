import React, { Component } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default class CalendarOverlay extends Component {
  state = { selectedDate: "" };
  render() {
    return (
      <div className="calendar-overlay">
        <Calendar onChange={(date) => this.setDate(date)} />
        <div className="row mt-4">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-secondary calendar-overlay-button"
            >
              Clear
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn btn-primary  calendar-overlay-button"
              onClick={() => this.props.handleCalendarOverlayOK()}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  setDate(date) {
    var formatted = formatDate(date);
    this.props.setAddItemDate(formatted);
  }
}

function formatDate(date) {
  var day = date.getDate();
  if (day < 10) day = "0" + day.toString();

  var month = date.getMonth() + 1;
  if (month < 10) month = "0" + month.toString();

  var year = date.getFullYear().toString();

  var formatted = year + "-" + month + "-" + day;

  return formatted;
}