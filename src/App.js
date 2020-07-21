import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";

import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import {sortData} from './util.js';

import './App.css';

function App() {

  const [countries, setCountries] = useState([]);
  //"USA","UK","INDIA"
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  // for Initial page load, show worldwide data
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    });
  },[]);
  

  // https://disease.sh/v3/covid-19/countries
  // useEFFECT- run a peice of code, based on condition
  useEffect(()=>{
    // code here, will run once when component loads and not again
    // async-> send a request, wait for it, do something with info
    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data)=>
      {
        const countries = data.map((country)=>(
          {
            name: country.country, // United States, United Kingdom
            value: country.countryInfo.iso2, // US, UK 
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);

          setCountries(countries);
      });
    };

    getCountriesData();
  },[]);
    
  
  const onCountryChange = async(event)=>{
    const countryCode = event.target.value;

    console.log("DAAAHHHH........", countryCode)
    setCountry(countryCode); 

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    
    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;


    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);

      // All of the data, from Country response
      setCountryInfo(data);
    })
  };

  console.log("COUNTRY INFO--->>>>> ",countryInfo);



  return (
    <div className="app">
      <div className="app__left">
        <div class="app__header">
        <h1>Covid 19 Tracker</h1>
        <FormControl className="app_dropdown">
          <Select variant="outlined" 
            onChange = {onCountryChange}
            name={country}>
            <MenuItem value = "worldwide">Worldwide</MenuItem>
            {
              countries.map(country=>(<MenuItem value={country.value}>{country.name}</MenuItem>))
            }
            {/*<MenuItem value = "worldwide">Worldwide</MenuItem>
            <MenuItem value = "worldwide">Option2</MenuItem>*/}
          </Select>
        </FormControl>
      </div>

      { /* CASES STATS CARDS*/ }
      <div class="app__stats">
        <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
        <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
        <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
      </div>

      { /* MAP */ }
      <Map/>
      </div>

      <Card className="app__right">
        <CardContent>
          <h1>Live Cases By Country</h1>
            <Table countries={tableData} />
          <h3>World New Cases</h3>
            <LineGraph />
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
