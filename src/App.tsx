// src/App.tsx
import './App.css';
import Grid from '@mui/material/Grid2';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import { useEffect, useState } from 'react';
import Item from './interface/Item';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))

  useEffect(() => {
    const request = async () => {
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      let nowTime = (new Date()).getTime();

      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        let API_KEY = "98acfabcda9c5482335016a1b987592d";
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
        savedTextXML = await response.text();

        // Calculando el tiempo de expiración
        let hours = 0.01; // Esto representa una expiración de 36 segundos
        let delay = hours * 3600000; // Convertir horas en milisegundos
        let expiringTime = nowTime + delay;

        // Almacenamiento en LocalStorage
        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", expiringTime.toString());

        // Actualizar el estado con el nuevo valor
        setOWM(savedTextXML);
      }

      if (savedTextXML) {
        // XML Parser
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        let dataToIndicators: Indicator[] = [];

        let name = xml.getElementsByTagName("name")[0].innerHTML || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name });

        let location = xml.getElementsByTagName("location")[1];

        let latitude = location.getAttribute("latitude") || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude });

        let longitude = location.getAttribute("longitude") || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude });

        let altitude = location.getAttribute("altitude") || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude });

        console.log(dataToIndicators);
        setIndicators(dataToIndicators);

        // Análisis del XML y almacenamiento de los primeros 6 objetos
        const times = xml.getElementsByTagName("time");
        let dataToItems: Item[] = [];
        for (let i = 0; i < times.length && dataToItems.length < 6; i++) {
          const time = times[i];
          const dateStart = time.getAttribute("from") || "";
          const dateEnd = time.getAttribute("to") || "";
          const precipitation = time.getElementsByTagName("precipitation")[0].getAttribute("probability") || "";
          const humidity = time.getElementsByTagName("humidity")[0].getAttribute("value") || "";
          const cloudsElement = time.getElementsByTagName("clouds")[0];
          const cloudsValue = cloudsElement.getAttribute("value") || "";
          const cloudsAll = cloudsElement.getAttribute("all") || "";
          const clouds = `${cloudsValue} - ${cloudsAll}`;

          dataToItems.push({
            dateStart,
            dateEnd,
            precipitation,
            humidity,
            clouds,
          });
        }
        setItems(dataToItems);
      }
    };

    request();
  }, [owm]); // El efecto se ejecutará cada vez que cambie 'owm'

  const renderIndicators = () => {
    return indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather
          title={indicator["title"]}
          subtitle={indicator["subtitle"]}
          value={indicator["value"]}
        />
      </Grid>
    ));
  };

  const series = [
    { data: items.map(item => parseFloat(item.precipitation || '0')*100), label: 'Precipitación' },
    { data: items.map(item => parseInt(item.humidity || '0')), label: 'Humedad' }
  ];
  const xLabels = items.map(item => item.dateStart.split('T')[1]); // Asumiendo que dateStart está en formato ISO
  return (
    <Grid container spacing={5}>
      {renderIndicators()}
      <Grid size={{ xs: 12, xl: 8 }}></Grid>

      {/* Grid Anidado */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 3 }}>
          <ControlWeather />
        </Grid>
        <Grid size={{ xs: 12, xl: 9 }}>
          <TableWeather itemsIn={items} />
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, xl: 4 }}>
        <LineChartWeather series={series} xLabels={xLabels} />
      </Grid>
    </Grid>
  );
}

export default App;

