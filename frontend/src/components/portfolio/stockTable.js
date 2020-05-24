import React, {useEffect} from 'react';
import Table from 'react-bootstrap/Table'
import {useDispatch, useSelector} from "react-redux";
import {selectStocks, setStocks} from "../../features/stocks/stocksSlice";

export default function StockTable() {
    const dispatch = useDispatch();
    const stocks = useSelector(selectStocks);

    useEffect(() => {
        fetch("/list", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        })
            .then(res => res.json())
            .then(stockData => {
                console.log(stockData);
                dispatch(setStocks(stockData))
            });
    }, [dispatch])

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
                        <td>{stock.price}</td>
                    </tr>
                )
            })}
            </tbody>
        </Table>
    );
}