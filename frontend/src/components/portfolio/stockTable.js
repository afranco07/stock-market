import React, {useEffect} from 'react';
import Table from 'react-bootstrap/Table';

export default function StockTable({fetchList, stocks}) {
    useEffect(() => {
        fetchList();
    }, [fetchList])

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
            {stocks.map((stock, index) => {
                return (
                    <tr key={index}>
                        <td>{stock.symbol}</td>
                        <td>{stock.amount}</td>
                        <td><span style={{color: stock.performance}}>{stock.total_price.toFixed(2)}</span></td>
                    </tr>
                )
            })}
            </tbody>
        </Table>
    );
}