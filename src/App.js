import React, { useEffect, useState } from "react";
import {
	FormControl,
	Select,
	MenuItem,
	Card,
	CardContent,
} from "@material-ui/core";
import Table from "./components/Table";
import InfoBox from "./components/InfoBox";
import "./App.css";
import { sortData } from "./util";
import MyMap from "./components/MyMap";

import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
	const [countries, setcountries] = useState([]);
	const [country, setcountry] = useState("Worldwide");
	const [countryInfo, setcountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState("cases");
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
	const [mapZoom, setMapZoom] = useState(3);

	useEffect(() => {
		// code runs once inside the this effect when the components loads
		const getcountries = async () => {
			let data = await fetch("https://disease.sh/v3/covid-19/countries");
			let jsondata = await data.json();
			const countriess = await jsondata.map((country) => ({
				name: country.country,
				value: country.countryInfo.iso2,
			}));

			const sortedData = sortData(jsondata);
			setTableData(sortedData);
			setMapCountries(jsondata);
			setcountries(countriess);
		};

		getcountries();
	}, []);

	useEffect(() => {
		const fetchdata = async () => {
			const rawdata = await fetch("https://disease.sh/v3/covid-19/all");
			const data = await rawdata.json();

			setcountryInfo(data);
		};

		fetchdata();
	}, []);

	const onChangecountry = async (e) => {
		const countryCode = e.target.value;
		const url =
			countryCode === "Worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		const rawdata = await fetch(url);
		const data = await rawdata.json();

		setcountry(countryCode);
		setcountryInfo(data);
		if (countryCode !== "Worldwide") {
			setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
		} else {
			setMapCenter([35.23684, -32.356]);
		}
		setMapZoom(4);
	};
	console.log(tableData);
	return (
		<div className="app">
			<div className="app_left">
				<div className="app_header">
					<h1>{"Covid19 Tracker"}</h1>
					<FormControl className="app_dropdown">
						<Select
							variant="outlined"
							value={country}
							onChange={onChangecountry}
						>
							<MenuItem value={"Worldwide"}>WorldWide</MenuItem>
							{/* loop through all the countries and sho the dropdown */}
							{countries.map((country) => {
								return (
									<MenuItem key={country?.value} value={country?.value}>
										{country?.name}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>

				<div className="app_states">
					{/* InforBox with props title={coronacases} */}
					<InfoBox
						key="1"
						onClick={(e) => setCasesType("cases")}
						active={casesType === "cases"}
						title={"Coronavirus Cases"}
						cases={countryInfo.todayCases}
						total={countryInfo.cases}
					/>
					<InfoBox
						key="2"
						onClick={(e) => setCasesType("recovered")}
						active={casesType === "recovered"}
						title={"Recovered"}
						isRed
						cases={countryInfo.todayRecovered}
						total={countryInfo.recovered}
					/>
					<InfoBox
						key="3"
						onClick={(e) => setCasesType("deaths")}
						active={casesType === "deaths"}
						title={"Deaths"}
						isRed
						cases={countryInfo.todayDeaths}
						total={countryInfo.deaths}
					/>
				</div>

				{/* map */}
				<MyMap
					countries={mapCountries}
					casesType={casesType}
					center={mapCenter}
					zoom={mapZoom}
				/>
			</div>
			<Card className="app_right">
				<CardContent>
					{/* Graph */}
					<h3 style={{ marginTop: "20px", marginBottom: "20px" }}>
						{"Worldwide Report"}
					</h3>
					<LineGraph casesType={casesType} />

					{/* Table */}
					<h3 style={{ marginTop: "20px", marginBottom: "20px" }}>
						{"Live Casses by Country"}
					</h3>
					<Table countries={tableData} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
