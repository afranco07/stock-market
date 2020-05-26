import React, {useEffect} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import StockTable from "./stockTable";
import Buy from "./buy";
import { selectCash, setCash } from "../../features/portfolio/portfolioSlice";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";

export default function Portfolio() {
    const cash = useSelector(selectCash);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        fetch("/api/portfolio", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("error getting portfolio cash")
                }
                return res.json();
            })
            .then(cash => {
                dispatch(setCash(cash.total_cash))
            })
            .catch(() => {
                history.replace("/login")
            })
    }, [dispatch, history])

    return (
        <>
            <h2>Portfolio (${cash})</h2>
            <Row>
                <Col>
                    <StockTable/>
                </Col>
                <Col>
                    <Buy/>
                </Col>
            </Row>
        </>
    );
}