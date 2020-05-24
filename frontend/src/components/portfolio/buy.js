import React, {useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Buy() {
    const [ticker, setTicker] = useState("");
    const [amount, setAmount] = useState("");

    const submitPurchase = (e) => {
        e.preventDefault();
        fetch("/buy", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({symbol: ticker, amount: parseInt(amount)})
        })
            .then(res => res.json())
            .then(() => {
                setTicker("");
                setAmount("");
            })
    };
    return(
        <Form onSubmit={submitPurchase} method="POST">
            <h3>Cash - $5000.00</h3>
            <Form.Group controlId="ticker">
                <Form.Control type="input" placeholder="Ticker" value={ticker} onChange={(e) => setTicker(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="qty">
                <Form.Control type="number" placeholder="Qty" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Form.Group>
            <Button variant="primary" block type="submit">
                Submit
            </Button>
        </Form>
    );
}