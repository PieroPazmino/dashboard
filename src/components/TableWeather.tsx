// src/components/TableWeather.tsx
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/Item';

interface MyProp {
  itemsIn: Item[];
}

export default function BasicTable(props: MyProp) {
  const [rows, setRows] = useState<Item[]>([]);

  useEffect(() => {
    setRows(props.itemsIn);
  }, [props.itemsIn]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Hora de inicio</TableCell>
            <TableCell align="left">Hora de fin</TableCell>
            <TableCell align="right">Precipitación - probabilidad</TableCell>
            <TableCell align="right">Humedad%</TableCell>
            <TableCell align="right">Nubosidad%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.dateStart}
              </TableCell>
              <TableCell align="right">{row.dateEnd}</TableCell>
              <TableCell align="center">{row.precipitation}</TableCell>
              <TableCell align="center">{row.humidity}</TableCell>
              <TableCell align="center">{row.clouds}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
