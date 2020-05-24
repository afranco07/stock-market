import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Navbar from './components/navbar';
import Container from 'react-bootstrap/Container'
import Login from './components/login';
import Register from './components/register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Portfolio from "./components/portfolio";
import Transactions from "./components/transactions";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />

                <Container>
                    <Switch>
                        <Route exact path="/"></Route>
                        <Route exact path="/login">
                            <Login />
                        </Route>
                        <Route exact path="/register">
                            <Register />
                        </Route>
                        <Route exact path="/list"></Route>
                        <Route exact path="/transactions">
                            <Transactions />
                        </Route>
                        <Route exact path="/portfolio">
                            <Portfolio />
                        </Route>
                    </Switch>
                </Container>
            </div>
        </Router>

    );
}

export default App;
