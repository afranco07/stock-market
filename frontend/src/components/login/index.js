import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Spinner from "react-bootstrap/Spinner";
import Alert from 'react-bootstrap/Alert'
import { useHistory } from "react-router-dom";
import { setAuth } from "../../features/user/userSlice"
import {useDispatch} from "react-redux";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggingIn, setLogin] = useState(false);
    const [showError, setError] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const submitLogin = (e) => {
        e.preventDefault();
        setLogin(true);
        setError(false);

        fetch("/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })
            .then(res => {
                console.log("res status", res.status);
                if (!res.ok) {
                    throw new Error("error logging in")
                }
                setError(false);
                dispatch(setAuth(true));
                history.replace("/portfolio");
            })
            .catch(() => {
                setError(true);
                setLogin(false);
            });
    };

    return (
        <Row>
            <Col>
                <Card style={{marginTop: "20px"}}>
                    <Card.Body>
                        <Card.Title>Sign In</Card.Title>

                        {showError && <Alert variant="danger">There was an error logging in</Alert>}
                        <Form onSubmit={submitLogin}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={loggingIn}>
                                {loggingIn ? <Spinner animation="border" size="sm" /> : "Submit" }
                                {/*Submit*/}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}