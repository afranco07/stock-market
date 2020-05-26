import React, {useCallback, useEffect} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import StockTable from "./stockTable";
import Buy from "./buy";
import { selectCash, setCash } from "../../features/portfolio/portfolioSlice";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import {selectStocks, setStocks} from "../../features/stocks/stocksSlice";

export default function Portfolio() {
    const cash = useSelector(selectCash);
    const stocks = useSelector(selectStocks);
    const dispatch = useDispatch();
    const history = useHistory();

    const fetchPortfolio = useCallback(()=> {
        console.log("fetching...");
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
            });
    }, [dispatch, history]);

    const fetchList = useCallback(() => {
        fetch("/api/list", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("error fetching portfolio list");
                }
                return res.json()
            })
            .then(stockData => {
                dispatch(setStocks(stockData))
            })
            .catch(() => {
                history.replace("/login");
            })
    }, [dispatch, history])

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio])

    return (
        <>
            <h2>Portfolio (${cash.toFixed(2)})</h2>
            <Row>
                <Col>
                    <StockTable fetchList={fetchList} stocks={stocks}/>
                </Col>
                <Col>
                    <Buy refreshPortfolio={fetchPortfolio} refreshList={fetchList}/>
                </Col>
            </Row>
        </>
    );
}