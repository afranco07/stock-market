import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import StockTable from "./stockTable";
import Buy from "./buy";

export default function Portfolio() {
    return (
        <>
            <h2>Portfolio</h2>
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