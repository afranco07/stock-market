import React, {useCallback, useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { selectCash, setCash, setAuth } from "../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import Spinner from 'react-bootstrap/Spinner';
import { useHistory } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

export default function Buy({refreshPortfolio, refreshList}) {
    const [ticker, setTicker] = useState("");
    const [amount, setAmount] = useState("");
    const [buying, setBuying] = useState(false);
    const [purchaseError, setPurchaseError] =useState(false);
    const cash = useSelector(selectCash);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        fetch("/api/cash", {
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
                dispatch(setAuth(false));
            });
    }, [dispatch, history]);

    const submitPurchase = useCallback((e) => {
        e.preventDefault();
        setBuying(true);
        setPurchaseError(false);

        fetch("/api/buy", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({symbol: ticker, amount: parseInt(amount)})
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("error submitting purchase")
                }
                return res.json()
            })
            .then(stockData => {
                refreshPortfolio();
                refreshList();
                dispatch(setCash(cash - (stockData.price * parseInt(amount))));
                setTicker("");
                setAmount("");
                setBuying(false);
                setPurchaseError(false);
            })
            .catch(() => {
                setPurchaseError(true);
                setBuying(false);
            });
    }, [amount, cash, dispatch, refreshPortfolio, ticker, refreshList]);

    return(
        <Form onSubmit={submitPurchase} method="POST">
            <h3>Cash - ${cash.toFixed(2)}</h3>
            {purchaseError && <Alert variant="danger">Error submitting purchase</Alert> }
            <Form.Group controlId="ticker">
                <Form.Control type="input" placeholder="Ticker" value={ticker} onChange={(e) => setTicker(e.target.value)}/>
            </Form.Group>
            <Form.Group controlId="qty">
                <Form.Control type="number" min="1" placeholder="Qty" value={amount} onChange={(e) => setAmount(e.target.value)} pattern="\d+"/>
            </Form.Group>
            <Button variant="primary" block type="submit" disabled={buying || ticker.length < 1}>
                {buying ? <Spinner animation="border" size="sm" role="status" as="span"/> : "Submit"}
            </Button>
        </Form>
    );
}