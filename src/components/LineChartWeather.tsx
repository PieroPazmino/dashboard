// import Paper from '@mui/material/Paper';
// import { LineChart } from '@mui/x-charts/LineChart';

// const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
// const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
// const xLabels = [
//     'Page A',
//     'Page B',
//     'Page C',
//     'Page D',
//     'Page E',
//     'Page F',
//     'Page G',
// ];

// export default function LineChartWeather() {
//     return (
//         <Paper
//             sx={{
//                 p: 2,
//                 display: 'flex',
//                 flexDirection: 'column'
//             }}
//         >

//             {/* Componente para un gráfico de líneas */}
//             <LineChart
//                 width={400}
//                 height={250}
//                 series={[
//                     { data: pData, label: 'pv' },
//                     { data: uData, label: 'uv' },
//                 ]}
//                 xAxis={[{ scaleType: 'point', data: xLabels }]}
//             />
//         </Paper>
//     );
// }
// LineChartWeather.tsx
import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';

interface LineChartData {
  data: number[];
  label: string;
}

interface LineChartWeatherProps {
  series: LineChartData[];
  xLabels: string[];
}

export default function LineChartWeather({ series, xLabels }: LineChartWeatherProps) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <LineChart
        width={400}
        height={250}
        series={series}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
      />
    </Paper>
  );
}
