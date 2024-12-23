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
import Button from '@mui/material/Button';

interface MyProp {
  itemsIn: Item[];
}

export default function BasicTable(props: MyProp) {
  const [rows, setRows] = useState<Item[]>([]);
  const [useCelsius, setUseCelsius] = useState(false); // Estado para controlar el formato de temperatura

  useEffect(() => {
    setRows(props.itemsIn);
  }, [props.itemsIn]);

  const toggleTemperature = () => {
    setUseCelsius(!useCelsius);
  };

  const formatTemperature = (kelvin: string) => {
    if (useCelsius) {
      const celsius = parseFloat(kelvin) - 273.15;
      return `${celsius.toFixed(2)} °C`;
    }
    return `${kelvin} K`;
  };
  return (
    <div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Hora de inicio</TableCell>
              <TableCell align="left">Hora de fin</TableCell>
              <TableCell align="right">Precipitación - probabilidad</TableCell>
              <TableCell align="right">Humedad%</TableCell>
              <TableCell align="right">Nubosidad%</TableCell>
              <TableCell align="right">Temperatura</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.dateStart.split('T')[0] + ' - ' + row.dateStart.split('T')[1]}
                </TableCell>
                <TableCell align="right">
                  {row.dateEnd.split('T')[0] + ' - ' + row.dateEnd.split('T')[1]}
                </TableCell>
                <TableCell align="center">{row.precipitation}</TableCell>
                <TableCell align="center">{row.humidity}</TableCell>
                <TableCell align="center">{row.clouds}</TableCell>
                <TableCell align="right">{formatTemperature(row.temperature)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={toggleTemperature}>
          {useCelsius ? "Mostrar en Kelvin" : "Mostrar en Celsius"}
        </Button>
      </div>
    </div>
  );
}
