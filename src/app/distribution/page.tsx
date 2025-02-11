'use client';

import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Box } from '@mui/material';
import './distribution-calculator.css';

const DistributionCalculator = () => {
    const [people, setPeople] = useState('');
    const [distributionAmount, setDistributionAmount] = useState('');
    const [commission, setCommission] = useState('');
    const [result, setResult] = useState<number | null>(null);

    const calculateDistribution = () => {
        const numPeople = parseFloat(people);
        const amount = parseFloat(distributionAmount);
        const fee = parseFloat(commission);

        if (isNaN(numPeople) || isNaN(amount) || isNaN(fee)) {
            alert('모든 값을 올바르게 입력해주세요.');
            return;
        }

        if (numPeople <= 0 || amount <= 0 || fee < 0) {
            alert('음수나 0을 입력할 수 없습니다.');
            return;
        }

        if (!Number.isInteger(numPeople) || !Number.isInteger(amount) || !Number.isInteger(fee)) {
            alert('소수점을 입력할 수 없습니다.');
            return;
        }

        const totalDistribution = amount * ((100 - fee)*0.01);
        const perPerson = totalDistribution / numPeople;
        setResult(perPerson);
    };

    return (
        <Container maxWidth="md" className="container">
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    보스 분배금 계산기
                </Typography>
            </Box>
            <TableContainer component={Paper} elevation={3}>
                <Table className="table">
                    <TableHead className="tableHeader">
                        <TableRow>
                            <TableCell align="center" className="tableCell">항목</TableCell>
                            <TableCell align="center" className="tableCell">값</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">인원수</TableCell>
                            <TableCell align="center">
                                <TextField
                                    value={people}
                                    onChange={(e) => setPeople(e.target.value)}
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">분배금</TableCell>
                            <TableCell align="center">
                                <TextField
                                    value={distributionAmount}
                                    onChange={(e) => setDistributionAmount(e.target.value)}
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">수수료</TableCell>
                            <TableCell align="center">
                                <TextField
                                    value={commission}
                                    onChange={(e) => setCommission(e.target.value)}
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box textAlign="center" className="button">
                <Button variant="contained" color="primary" onClick={calculateDistribution}>
                    계산하기
                </Button>
            </Box>
            {result !== null && (
                <Box textAlign="center" className="result">
                    <Typography variant="h6" component="p">
                        결과: {result.toFixed(2)} 메소
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default DistributionCalculator;