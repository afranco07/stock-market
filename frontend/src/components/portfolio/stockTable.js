import React, {useEffect} from 'react';
import Table from 'react-bootstrap/Table'
import {useDispatch, useSelector} from "react-redux";
import {selectStocks, setStocks} from "../../features/stocks/stocksSlice";
import { useHistory } from 'react-router-dom';

export default function StockTable() {
    const dispatch = useDispatch();
    const stocks = useSelector(selectStocks);
    const history = useHistory();

    useEffect(() => {
        fetch("/list", {
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

    return (
        <Table>
            <thead>
            <tr>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {stocks.map(stock => {
                return (
                    <tr>
                        <td>{stock.symbol}</td>
                        <td>{stock.amount}</td>
                        <td><span style={{color: stock.performance}}>{stock.total_price}</span></td>
                    </tr>
                )
            })}
            </tbody>
        </Table>
    );
}