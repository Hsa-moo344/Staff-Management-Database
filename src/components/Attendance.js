import React, { useState } from "react";
import ProfileCss from "../css/staff.module.css";

function Attendance() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    position: "",
    department: "",
    email: "",
    type: "",
    date: "",
    timeIn: "",
    timeOut: "",
    workingHours: "",
    startLeaveDay: "", // For leave start
    endLeaveDay: "", // For leave end
    totalLeaveDaysThisMonth: 0, // Calculated leave days for current month
    approvedBy: "",
  });

  // Function to get last day of the month of a given date
  const getLastDayOfMonth = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    // Calculate working hours if timeIn and timeOut are set
    if (
      (name === "timeIn" || name === "timeOut") &&
      updatedFormData.timeIn &&
      updatedFormData.timeOut
    ) {
      const [startHour, startMinute] = updatedFormData.timeIn
        .split(":")
        .map(Number);
      const [endHour, endMinute] = updatedFormData.timeOut
        .split(":")
        .map(Number);

      const start = new Date();
      const end = new Date();

      start.setHours(startHour, startMinute, 0);
      end.setHours(endHour, endMinute, 0);

      let diff = end - start;

      if (diff < 0) {
        // Handle overnight shifts
        end.setDate(end.getDate() + 1);
        diff = end - start;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      updatedFormData.workingHours = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    // Calculate leave days up to the end of the month if startDate or endDate change
    if (name === "startLeaveDay" || name === "endLeaveDay") {
      const start = new Date(updatedFormData.startLeaveDay);
      const end = new Date(updatedFormData.endLeaveDay);

      if (!isNaN(start) && !isNaN(end) && end >= start) {
        const lastDayOfStartMonth = getLastDayOfMonth(start);
        const lastCountDay =
          end > lastDayOfStartMonth ? lastDayOfStartMonth : end;

        const dayInMs = 1000 * 60 * 60 * 24;
        const diffDays = Math.ceil((lastCountDay - start) / dayInMs) + 1;

        updatedFormData.totalLeaveDaysThisMonth = diffDays;
      } else {
        updatedFormData.totalLeaveDaysThisMonth = 0;
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/attendancefunction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        setFormData({
          name: "",
          gender: "",
          position: "",
          department: "",
          email: "",
          type: "",
          date: "",
          timeIn: "",
          timeOut: "",
          workingHours: "",
          startLeaveDay: "",
          endLeaveDay: "",
          totalLeaveDaysThisMonth: 0,
          approvedBy: "",
        });
      } else {
        const errorText = await response.text();
        alert("Failed to submit: " + errorText);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className={ProfileCss.MainAttendance}>
      <h2>Mae Tao Clinic Staff Timesheet</h2>
      <form className={ProfileCss.Attend} onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Position:
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="">position</option>
            <option>in charge</option>
            <option>Supervisor</option>
            <option>Shiftleader</option>
            <option>Medic Staff</option>
            <option>Staff</option>
          </select>
        </label>

        <label>
          Department:
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Departments</option>
            <option>Finance</option>
            <option>HR</option>
            <option>Adult OPD</option>
            <option>Eye</option>
            <option>Dental</option>
            <option>Child OPD/Immunization</option>
            <option>RH OPD</option>
            <option>Lab</option>
            <option>RH IPD</option>
            <option>VCT/Blood Bank</option>
            <option>Pharmacy OPD/IPD/Main Center</option>
            <option>RH IPD</option>
            <option>Child IPD</option>
            <option>Surgical OPD/IPD</option>
            <option>Adult IPD</option>
            <option>Physiotherapy</option>
            <option>TCM</option>
            <option>Security/Public Relation</option>
            <option>Health Administraion Office</option>
            <option>HIS/Registration</option>
            <option>HR/OD</option>
            <option>ECU</option>
            <option>Administartion</option>
            <option>Kitchen</option>
            <option>BBHS</option>
            <option>Training</option>
          </select>
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Type:
          <input
            list="typeOptions"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
          <datalist id="typeOptions">
            <option value="Work" />
            <option value="Leave" />
            <option value="Absent" />
            <option value="Day Off" />
            <option value="Leave Without Pay" />
            <option value="Maternity Leave" />
            <option value="Paternity Leave" />
            <option value="Health Accident" />
            <option value="Education Leave" />
          </datalist>
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        {/* Leave start date */}
        <label>
          Leave Start Date:
          <input
            type="date"
            name="startLeaveDay"
            value={formData.startLeaveDay}
            onChange={handleChange}
          />
        </label>

        {/* Leave end date */}
        <label>
          Leave End Date:
          <input
            type="date"
            name="endLeaveDay"
            value={formData.endLeaveDay}
            onChange={handleChange}
          />
        </label>

        {/* Display leave days this month */}
        <label>
          Leave Days This Month:
          <input
            type="number"
            value={formData.totalLeaveDaysThisMonth}
            readOnly
          />
        </label>

        <label>
          Time In:
          <input
            type="time"
            name="timeIn"
            value={formData.timeIn}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time Out:
          <input
            type="time"
            name="timeOut"
            value={formData.timeOut}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Working hour:
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
            readOnly
          />
        </label>

        <label>
          Approved By:
          <input
            type="text"
            name="approvedBy"
            value={formData.approvedBy}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className={ProfileCss.submitBtn}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Attendance;
