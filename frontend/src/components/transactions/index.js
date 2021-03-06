import React, {useEffect} from 'react';
import Row from "react-bootstrap/Row";
import ListGroup from 'react-bootstrap/ListGroup'
import {useDispatch, useSelector} from "react-redux";
import {selectTransactions, setTransactions} from "../../features/transactions/transactionsSlice";
import Col from "react-bootstrap/Col";
import {useHistory} from "react-router-dom";
import {setAuth} from "../../features/user/userSlice";

export default function Transactions() {
    const dispatch = useDispatch();
    const history = useHistory();
    const transactions = useSelector(selectTransactions);

    useEffect(() => {
        fetch("/api/transactions", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        })
            .then(res => {
                if (res.status === 401) {
                    throw new Error("error retrieving transactions");
                }
                return res.json();
            })
            .then(transactionData => dispatch(setTransactions(transactionData)))
            .catch(() => {
                history.replace("/login");
                dispatch(setAuth(false));
            });
    }, [dispatch, history])
    return (
        <>
            <h2>Transactions</h2>
            <Row className="justify-content-sm-center">
                <Col xs="auto">
                    <ListGroup>
                        {transactions.map((transaction, index) => {
                                const text = `${transaction.action} (${transaction.symbol}) - ${transaction.amount} Shares $${transaction.price.toFixed(2)}`;
                                return (
                                    <ListGroup.Item key={index}>
                                        {text}
                                    </ListGroup.Item>
                                )
                            }
                        )}
                    </ListGroup>
                </Col>

            </Row>
        </>
    );
}