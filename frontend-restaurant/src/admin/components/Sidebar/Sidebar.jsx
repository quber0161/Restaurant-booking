/* eslint-disable no-unused-vars */
import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/admin/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to="/admin/bookings" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Bookings</p>
        </NavLink>
        <NavLink to="/admin/list" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/admin/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/admin/categories" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Manage Categories</p>
        </NavLink>
        <NavLink to="/admin/extras" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Extra Ingredients</p>
        </NavLink>
        <NavLink to="/admin/store-hours" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Store Hours</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
