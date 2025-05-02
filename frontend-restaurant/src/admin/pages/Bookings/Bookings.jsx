/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./Bookings.css";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchBookings = async () => {
    try {
      let query = "";
      if (filterDate) query += `date=${filterDate}`;
      if (filterStatus !== "all") query += `&status=${filterStatus}`;
      const res = await axios.get(`https://restaurant-booking-35qh.onrender.com/api/bookings/all?${query}`);
      if (res.data.success) setBookings(res.data.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.post("https://restaurant-booking-35qh.onrender.com/api/bookings/update-status", { id, status: newStatus });
      fetchBookings();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterDate, filterStatus]);


  const resetFilters = async () => {
    setFilterDate("");
    setFilterStatus("all");
    try {
      const res = await axios.get("https://restaurant-booking-35qh.onrender.com/api/bookings/all");
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (error) {
      console.error("Error resetting filters:", error);
    }
  };
  

  return (
    <div className="admin-bookings">
      <h2>📅 Table Bookings</h2>

      <div className="filters">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="reset-btn" onClick={resetFilters}>Reset</button>
      </div>


      <div style={{ overflowX: "auto" }}>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Name</th>
            <th>Guests</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{new Date(b.date).toLocaleDateString('en-GB')}</td>
              <td>{b.timeSlot}</td>
              <td>{b.firstName} {b.lastName}</td>
              <td>{b.guestCount}</td>
              <td className="status-cell">
                <span className={`status-${b.status}`}>{b.status}</span>
                </td>

              <td>
                {b.status === "pending" && (
                  <>
                    <button className="approve-button" onClick={() => updateStatus(b._id, "approved")}>
                      Approve
                    </button>
                    <button className="cancel-button" onClick={() => updateStatus(b._id, "cancelled")}>
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Bookings;
