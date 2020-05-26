import React, {useEffect} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Navbar from './components/navbar';
import Container from 'react-bootstrap/Container'
import Login from './components/login';
import Register from './components/register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Portfolio from "./components/portfolio";
import Transactions from "./components/transactions";
import { isLoading } from "./features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import Spinner from 'react-bootstrap/Spinner';
import { setLoading, setAuth, selectAuth } from "./features/user/userSlice";
import isAuthenticated from "./app/auth";

function App() {
    const dispatch = useDispatch();
    const auth = useSelector(selectAuth);
    const loading = useSelector(isLoading);

    useEffect(() => {
        isAuthenticated().then(result => {
            dispatch(setAuth(result));
            dispatch(setLoading(false));
        });
    }, [dispatch]);

    if (loading) {
        return <Spinner animation="border" />
    }

    return (
        <Router>
            <div className="App">
                <Navbar />

                <Container>
                    <Switch>
                        <Route exact path="/">
                            {auth
                                ? <Redirect to="/portfolio" />
                                : <Redirect to="/login" />
                            }
                        </Route>
                        <Route exact path="/login">
                            {auth
                                ? <Redirect to="/portfolio" />
                                : <Login />
                            }
                        </Route>
                        <Route exact path="/register">
                            {auth
                                ? <Redirect to="/portfolio" />
                                : <Register />
                            }
                        </Route>
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
