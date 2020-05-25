import React, {useState} from 'react';
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creating, setCreating] = useState(false);
    const [showError, setError] = useState(false);
    const [showSuccess, setSuccess] = useState(false);

    const submitData = (e) => {
        e.preventDefault();
        setCreating(true);
        setError(false);
        setSuccess(false);

        fetch("/createuser", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("error creating new user")
                }
                setError(false);
                setCreating(false);
                setSuccess(true);
            })
            .catch(() => {
               setCreating(false);
               setError(true);
               setSuccess(false);
            })
            .finally(() => {
                setName("");
                setEmail("");
                setPassword("");
            });
    };
    
    return (
        <Row>
            <Col>
                <Card style={{marginTop: "20px"}}>
                    <Card.Body>
                        <Card.Title>Sign In</Card.Title>
                        {showError && <Alert variant="danger">Could not create</Alert> }
                        {showSuccess && <Alert variant="success">User created successfully!</Alert> }
                        <Form onSubmit={submitData}>
                            <Form.Group controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={creating}>
                                {creating ? <Spinner animation="border" size="sm" role="status" as="span"/> : "Submit"}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}