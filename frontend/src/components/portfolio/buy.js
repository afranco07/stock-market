import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { add } from "../../features/stocks/stocksSlice"
import { selectCash, setCash } from "../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import Spinner from 'react-bootstrap/Spinner';
import { useHistory } from "react-router-dom";

export default function Buy() {
    const [ticker, setTicker] = useState("");
    const [amount, setAmount] = useState("");
    const [buying, setBuying] = useState(false);
    const cash = useSelector(selectCash);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        fetch("/cash", {
            method: "GET",
            headers: {
                "Content-TYpe": "application/json",
                "Accept": "application/json",
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("error getting balance");
                }
                return res.json();
            })
            .then(cashData => {
                dispatch(setCash(cashData.cash));
            })
            .catch(() => {
                history.replace("/login");
            });
    }, [dispatch, history]);

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
                dispatch(setCash(cash - stockData.price));
                setBuying(false);
            })
    };
    return(
        <Form onSubmit={submitPurchase} method="POST">
            <h3>Cash - ${cash}</h3>
            <Form.Group controlId="ticker">
                <Form.Control type="input" placeholder="Ticker" value={ticker} onChange={(e) => setTicker(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="qty">
                <Form.Control type="number" min="1" placeholder="Qty" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Form.Group>
            <Button variant="primary" block type="submit" disabled={buying || ticker.length < 1}>
                {buying ? <Spinner animation="border" size="sm" role="status" as="span"/> : "Submit"}
            </Button>
        </Form>
    );
}