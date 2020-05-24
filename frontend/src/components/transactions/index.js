import React, {useEffect} from 'react';
import Row from "react-bootstrap/Row";
import ListGroup from 'react-bootstrap/ListGroup'
import {useDispatch, useSelector} from "react-redux";
import {selectTransactions, setTransactions} from "../../features/transactions/transactionsSlice";
import Col from "react-bootstrap/Col";

export default function Transactions() {
    const dispatch = useDispatch();
    const transactions = useSelector(selectTransactions);

    useEffect(() => {
        fetch("/transactions", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(transactionData => dispatch(setTransactions(transactionData)))
    }, [dispatch])
    return (
        <>
            <h2>Transactions</h2>
            <Row className="justify-content-sm-center">
                <Col xs="auto">
                    <ListGroup>
                        {transactions.map(transaction => {
                                const text = `${transaction.action} (${transaction.symbol}) - ${transaction.amount} Shares $${transaction.price}`;
                                return (
                                    <ListGroup.Item>
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