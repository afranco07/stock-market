import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Stock Market</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavLink exact to="/" className="nav-link">Home</NavLink>
                    <NavLink exact to="/login" className="nav-link">Login</NavLink>
                    <NavLink exact to="/transactions" className="nav-link">Transactions</NavLink>
                    <NavLink exact to="/portfolio" className="nav-link">Portfolio</NavLink>
                    <NavLink exact to="/register" className="nav-link">Register</NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}