import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import { selectAuth } from "../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { setAuth } from "../../features/user/userSlice"

export default function NavBar() {
    const isAuthenticated = useSelector(selectAuth);
    const history = useHistory();
    const dispatch = useDispatch();

    const handleLogout = () => {
        document.cookie = "jwt-token=";
        document.cookie = "jwt-refresh-token=";
        dispatch(setAuth(false));
        history.push("/login");
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Stock Market</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {!isAuthenticated && <NavLink exact to="/login" className="nav-link">Login</NavLink>}
                    {!isAuthenticated && <NavLink exact to="/register" className="nav-link">Register</NavLink>}
                    {isAuthenticated && <Nav.Link onClick={handleLogout}>Logout</Nav.Link>}
                    {isAuthenticated && <NavLink exact to="/transactions" className="nav-link">Transactions</NavLink>}
                    {isAuthenticated && <NavLink exact to="/portfolio" className="nav-link">Portfolio</NavLink>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}