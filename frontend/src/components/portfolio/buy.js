import React, {useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {add} from "../../features/stocks/stocksSlice"
import {useDispatch} from "react-redux";
import Spinner from 'react-bootstrap/Spinner';

export default function Buy() {
    const [ticker, setTicker] = useState("");
    const [amount, setAmount] = useState("");
    const [buying, setBuying] = useState(false);
    const dispatch = useDispatch();

    const submitPurchase = (e) => {
        e.preventDefault();
        setBuying(true);
        fetch("/buy", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({symbol: ticker, amount: parseInt(amount)})
        })
            .then(res => res.json())
            .then(stockData => {
                dispatch(add(stockData))
                setTicker("");
                setAmount("");
                setBuying(false);
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
            <Button variant="primary" block type="submit" disabled={buying}>
                {buying ? <Spinner animation="border" size="sm" role="status" as="span"/> : "Submit"}
            </Button>
        </Form>
    );
}