/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({setShowLogin}) => {

    const [menu,setMenu] = useState("home");
    
    const {getTotalCartAmount,token,setToken} = useContext(StoreContext);

    const navigate = useNavigate();

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const logout = () =>{
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        setToken("");
        navigate("/")
    }
    
  return (
    <div className='navbar'>
        <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
    

        <ul className={`navbar-menu ${showMobileMenu ? 'mobile-visible' : ''}`}>
            <Link to='/' onClick={() => { setMenu("home"); setShowMobileMenu(false); }} className={menu === "home" ? "active" : ""}>home</Link>
            <Link to="/menu" onClick={() => { setMenu("menu"); setShowMobileMenu(false); }} className={menu === "menu" ? "active" : ""}>menu</Link>
            <Link to="/booking" onClick={() => { setMenu("booking"); setShowMobileMenu(false); }} className={menu === "booking" ? "active" : ""}>Booking</Link>
            <a href='#footer' onClick={() => { setMenu("contact-us"); setShowMobileMenu(false); }} className={menu === "contact-us" ? "active" : ""}>contact us</a>
        </ul>

        <div className="navbar-right">
            <div className="hamburger" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                ☰
            </div>
            <div className="navbar-search-icon">
            <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
            </div>

            {!token ? (
            <button onClick={() => setShowLogin(true)}>sign in</button>
            ) : (
            <div className='navbar-profile'>
                <img src={assets.profile_icon} alt="" />
                <ul className="nav-profile-dropdown">
                <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                <hr />
                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                </ul>
            </div>
            )}
        </div>
    </div>

  )
}

export default Navbar
