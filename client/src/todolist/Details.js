import React, { Component } from "react";
import CalendarOverlay from "./CalendarOverlay.js";
import PrioritiesOverlay from "./PrioritiesOverlay.js";

import "./Todolist.css";
import $ from "jquery";

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.titleInputRef = React.createRef();
    this.descInputRef = React.createRef();
    this.state = {
      itemID: this.props.selectedItemID,
      title: this.props.selectedItemTitle,
      dueDate: this.props.selectedItemDueDate,
      priority: this.props.selectedItemPriority,
      description: this.props.selectedItemDescription,
      completed: this.props.selectedItemCompleted,
      calendarOverlayDisplaying: false,
      prioritiesOverlayDisplaying: false,
    };
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleTitleInputBlur = (e) => {
    const title = e.target.value;
    if (title !== this.props.selectedItemTitle)
      this.props.setItemTitle(
        this.props.listName,
        this.props.selectedItemID,
        title
      );
  };

  handleTitleInputKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.titleInputRef.current.blur();
    }
  };

  handleDescInputBlur = (e) => {
    const description = e.target.value;
    if (description !== this.props.selectedItemDescription)
      this.props.setItemDescription(
        this.props.listName,
        this.props.selectedItemID,
        description
      );
  };

  handleDescInputKeyPress = (e) => {
    if (e.keyCode === 9) {
      this.descInputRef.current.blur();
    }
  };

  handleCalendarOverlayOK() {
    this.setState({ calendarOverlayDisplaying: false });
  }

  handleCalendarOverlayClear() {
    this.setState({
      calendarOverlayDisplaying: false,
      dueDate: "",
    });
    this.props.setItemDueDate(this.props.listName, this.state.itemID, "");
  }

  handleShowCalendarOverlay() {
    if (this.state.calendarOverlayDisplaying)
      this.setState({ calendarOverlayDisplaying: false });
    else this.setState({ calendarOverlayDisplaying: true });
  }

  handleShowPrioritiesOverlay(e) {
    const xCoord = (e.clientX * 7) / 12;
    $("#details-priorities-overlay").css("left", xCoord + "px");
    if (this.state.prioritiesOverlayDisplaying)
      this.setState({ prioritiesOverlayDisplaying: false });
    else this.setState({ prioritiesOverlayDisplaying: true });
  }

  handleCheck(e) {
    var completed = e.target.checked;

    this.props.setItemCompleted(
      this.props.listName,
      this.state.itemID,
      completed
    );
  }

  handleCalendarChange(date) {
    this.props.setItemDueDate(this.props.listName, this.state.itemID, date);
  }

  handlePriorityChange(priority) {
    this.props.setItemPriority(
      this.props.listName,
      this.state.itemID,
      priority
    );
    this.setState({
      priority: priority,
      prioritiesOverlayDisplaying: false,
    });
  }

  componentDidUpdate(prevProp) {
    if (
      prevProp.selectedItemTitle === this.props.selectedItemTitle &&
      prevProp.selectedItemDueDate === this.props.selectedItemDueDate &&
      prevProp.selectedItemCompleted === this.props.selectedItemCompleted &&
      prevProp.selectedItemDescription === this.props.selectedItemDescription &&
      prevProp.selectedItemPriority === this.props.selectedItemPriority &&
      prevProp.selectedItemID === this.props.selectedItemID
    )
      return;
    this.setState({
      title: this.props.selectedItemTitle,
      dueDate: this.props.selectedItemDueDate,
      completed: this.props.selectedItemCompleted,
      description: this.props.selectedItemDescription,
      priority: this.props.selectedItemPriority,
      itemID: this.props.selectedItemID,
    });
  }

  render() {
    var priorityPickerClasses = "col-1 offset-md-4 details-priority-picker";
    if (this.state.priority === "high") priorityPickerClasses += " text-danger";
    else if (this.state.priority === "medium")
      priorityPickerClasses += " text-warning";
    else if (this.state.priority === "low")
      priorityPickerClasses += " text-primary";

    const calendarOverlayClasslist = this.state.calendarOverlayDisplaying
      ? ""
      : "d-none";
    const prioritiesOverlayClasslist = this.state.prioritiesOverlayDisplaying
      ? ""
      : "d-none";

    return (
      <React.Fragment>
        <div
          className={
            "details-container " + (this.state.itemID === "" ? "d-none" : "")
          }
        >
          <div
            id="details-top-row"
            className="row align-items-center mt-4 pb-3 justify-content-around mb-4"
          >
            <div className="col-1 details-top-row-check d-flex justify-content-center">
              <input
                className="mx-auto"
                type="checkbox"
                value=""
                checked={this.state.completed}
                onChange={this.handleCheck}
              />
            </div>
            <div
              className={
                "details-date-picker col-4" +
                (getIsLate(this.state.dueDate)
                  ? " text-danger"
                  : this.state.dueDate === "" ||
                    this.state.dueDate === undefined ||
                    this.state.dueDate === null
                  ? ""
                  : " text-primary")
              }
              onClick={() => {
                this.handleShowCalendarOverlay();
                this.props.hideAddListOverlay();
              }}
            >
              <span className="mr-2">
                <i className="fas fa-calendar-alt"></i>
              </span>
              {formatDate(this.state.dueDate)}
            </div>
            <div
              className={priorityPickerClasses}
              onClick={(e) => {
                this.handleShowPrioritiesOverlay(e);
                this.props.hideAddListOverlay();
              }}
            >
              <i className="fas fa-balance-scale-left"></i>
            </div>
            <div
              className="details-delete-btn col-1"
              onClick={() => {
                this.props.handleDelete(
                  this.props.listName,
                  this.state.itemID,
                  this.props.selectedItemList
                );
                this.props.hideAddListOverlay();
              }}
            >
              <i className="fas fa-trash"></i>
            </div>
          </div>
          <div id="calendar-overlay" className={calendarOverlayClasslist}>
            <CalendarOverlay
              setDueDate={(date) => this.handleCalendarChange(date)}
              handleCalendarOverlayOK={() => this.handleCalendarOverlayOK()}
              handleCalendarOverlayClear={() =>
                this.handleCalendarOverlayClear()
              }
              currentlySelectedDate={this.state.dueDate}
            />
          </div>
          <div
            id="details-priorities-overlay"
            className={prioritiesOverlayClasslist}
          >
            <PrioritiesOverlay
              handlePrioritiesOverlayClick={(priority) =>
                this.handlePriorityChange(priority)
              }
              currentlySelectedPriority={this.state.priority}
            />
          </div>
          <div id="details-title-input-container" className="mb-4">
            <input
              spellCheck="false"
              className="details-title-input"
              placeholder="Title"
              value={this.state.title}
              onKeyDown={(e) => this.handleTitleInputKeyPress(e)}
              onBlur={(e) => this.handleTitleInputBlur(e)}
              ref={this.titleInputRef}
              onChange={(e) => this.setState({ title: e.target.value })}
              onClick={() => this.props.hideAddListOverlay()}
              autoComplete="off"
            />
          </div>
          <div
            id="details-desc-input-container"
            className="details-desc-input-container"
          >
            <textarea
              id="details-desc-input"
              spellCheck="false"
              value={this.state.description}
              placeholder="Description"
              ref={this.descInputRef}
              onKeyDown={(e) => this.handleDescInputKeyPress(e)}
              onBlur={(e) => this.handleDescInputBlur(e)}
              onChange={(e) => this.setState({ description: e.target.value })}
              onClick={() => this.props.hideAddListOverlay()}
              autoComplete="off"
            />
          </div>
          <div
            className={"details-list-name d-flex align-items-center"}
            style={{ fontWeight: "600", pointerEvents: "none" }}
          >
            <i className="font-grey fas fa-tasks sidebar-icon mr-2"></i>
            <span className="font-grey ">{this.props.selectedItemList}</span>

            <i
              className="ml-2 fa fa-circle"
              style={{
                fontSize: "8px",
                color: this.props.selectedItemColor,
                paddingTop: "3px",
              }}
            ></i>
          </div>
        </div>
        <div
          id="details-placeholder"
          className={
            "row h-100 align-items-center justify-content-center font-italic" +
            (this.state.itemID !== "" ? "d-none" : "")
          }
        >
          <div
            className="col-12 text-center my-auto"
            style={{ fontSize: "14px" }}
          >
            Click on an item to see it's details <br />
            <br />
            <i className="fas fa-tasks" style={{ fontSize: "20px" }}></i>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function formatDate(str) {
  if (str === "" || str === undefined || str === null) return "Due Date";
  const today = new Date();
  const currYear = today.getFullYear();

  const monthAbbr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const year = parseInt(str.substring(0, 4));
  const month = parseInt(str.substring(5, 7));
  const day = parseInt(str.substring(8, 10));

  var dateObj = new Date(year + "-" + month + "-" + day + " 00:00");

  if (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth()
  ) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateObj.getDate() === today.getDate()) return "Today";
    else if (dateObj.getDate() === yesterday.getDate()) return "Yesterday";
    else if (dateObj.getDate() === tomorrow.getDate()) return "Tomorrow";
  }

  var formatted =
    monthAbbr[month - 1] + " " + day + (currYear === year ? "" : ", " + year);

  return formatted;
}

function getIsLate(date) {
  if (date === "" || date === undefined) return false;
  const today = new Date() - 1;
  const d = new Date(date + " 00:00");

  return d < today;
}
