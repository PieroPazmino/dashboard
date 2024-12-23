// src/App.tsx
import './App.css';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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

interface ChartSeries {
  data: number[];
  label: string;
}

function App() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  const [city, setCity] = useState("Guayaquil");
  const [cityInput, setCityInput] = useState("");
  const [selectedVariable, setSelectedVariable] = useState<string>('');
  const [averageTemperature, setAverageTemperature] = useState<number>(0); // Estado para almacenar la temperatura promedio
  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (cityName: string) => {
    const API_KEY = "98acfabcda9c5482335016a1b987592d";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&mode=xml&appid=${API_KEY}`);
    const textXML = await response.text();
    parseXML(textXML);
  };

  const parseXML = (textXML: string) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(textXML, "application/xml");

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

    setIndicators(dataToIndicators);

    const times = xml.getElementsByTagName("time");
    let dataToItems: Item[] = [];
    for (let i = 0; i < 6; i++) {
      const time = times[i];
      const dateStart = time.getAttribute("from") || "";
      const dateEnd = time.getAttribute("to") || "";
      const precipitation = time.getElementsByTagName("precipitation")[0].getAttribute("probability") || "";
      const humidity = time.getElementsByTagName("humidity")[0].getAttribute("value") || "";
      const cloudsElement = time.getElementsByTagName("clouds")[0];
      const cloudsValue = cloudsElement.getAttribute("value") || "";
      const cloudsAll = cloudsElement.getAttribute("all") || "";
      const clouds = `${cloudsValue} - ${cloudsAll}`;
      const temperature = time.getElementsByTagName("temperature")[0].getAttribute("value") || "0";

      dataToItems.push({
        dateStart,
        dateEnd,
        precipitation,
        humidity,
        clouds,
        temperature,
        cloudsAll
      });
    }
    const totalTemperature = dataToItems.reduce((acc, item) => acc + parseFloat(item.temperature), 0);
    const avgTemperature = (totalTemperature / 6).toFixed(2);
    setAverageTemperature(parseFloat(avgTemperature));  // Actualiza el estado con la temperatura promedio
    setItems(dataToItems);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityInput(event.target.value);
  };

  const handleSearch = () => {
    setCity(cityInput);
  };

  const handleVariableSelect = (variable: string) => {
    setSelectedVariable(variable);
  };

  let LinechartData: ChartSeries[] = [];
  let xLabels = items.map(item => item.dateStart.split('T')[1]);

  switch (selectedVariable) {
    case 'Temperatura':
      LinechartData = [{ data: items.map(item => parseFloat(item.temperature)), label: 'Temperatura' }];
      break;
    case 'Humedad':
    case 'Precipitación':
      LinechartData = [
        { data: items.map(item => parseFloat(item.humidity)), label: 'Humedad' },
        { data: items.map(item => parseFloat(item.precipitation) * 100), label: 'Precipitación (%)' }
      ];
      break;
    case 'Nubosidad':
      LinechartData = [{ data: items.map(item => parseFloat(item.cloudsAll)), label: 'Nubosidad' }];
      break;
    default:
      LinechartData = []; // Si no hay selección válida, no se muestra ningún dato
  }


  return (
    <Grid container spacing={5}>
      <Grid size={{ xs: 12, xl: 8 }}>
        <TextField
          label="Buscar ciudad"
          variant="outlined"
          value={cityInput}
          onChange={handleCityChange}
          style={{ marginRight: 8 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Buscar
        </Button>
      </Grid>
      {indicators.map((indicator, idx) => (
        
        <Grid key={idx} size={{ xs:12, xl:3 }}>
          <IndicatorWeather
            title={indicator.title}
            subtitle={indicator.subtitle}
            value={indicator.value}
          />
        </Grid>
      ))}
      <Grid container spacing={2}>
        <Grid size= {{xs: 12, xl: 3}}>
          <ControlWeather onVariableSelect={handleVariableSelect}/>
        </Grid>
        <Grid size={{xs:12, xl:9}}>
        <TableWeather itemsIn={items} averageTemperature={averageTemperature} />
        </Grid>
      </Grid>
      <Grid size= {{xs:12, xl: 4}}>
        {LinechartData.length > 0 && <LineChartWeather series={LinechartData} xLabels={xLabels} />}
      </Grid>
    </Grid>
    
  );
}

export default App;
