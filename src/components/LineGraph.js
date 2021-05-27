import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
	legend: {
		display: false,
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	maintainAspectRatio: false,
	tooltips: {
		mode: "index",
		intersect: false,
		callbacks: {
			label: function (tooltipItem, data) {
				return numeral(tooltipItem.value).format("+0,0");
			},
		},
	},
	scales: {
		xAxes: [
			{
				type: "time",
				time: {
					format: "MM/DD/YY",
					tooltipFormat: "ll",
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: {
					// Include a dollar sign in the ticks
					callback: function (value, index, values) {
						return numeral(value).format("0a");
					},
				},
			},
		],
	},
};

function LineGraph({ casesType }) {
	const [graphData, setgraphData] = useState({});
	const [background, setbackground] = useState("rgba(204,16,54,0.5)");
	const [border, setborder] = useState("rgb(204, 16, 52)");

	useEffect(() => {
		let fetchdata = async () => {
			let rawdata = await fetch(
				"https://disease.sh/v3/covid-19/historical/all?lastdays=120"
			);
			let data = await rawdata.json();
			const buildChartData = (data, casestype = casesType) => {
				const chartdata = [];
				let lastDataPoint;
				for (let date in data[casestype]) {
					if (lastDataPoint) {
						const newdataPoint = {
							x: date,
							y: data[casestype][date] - lastDataPoint,
						};
						chartdata.push(newdataPoint);
					}
					lastDataPoint = data[casestype][date];
				}
				return chartdata;
			};
			const chartdata = buildChartData(data, casesType);
			setgraphData(chartdata);
		};
		fetchdata();
		if (casesType === "deaths") {
			setbackground("rgba(251, 68, 67, 0.5)");
			setborder("rgb(251, 68, 67)");
		} else if (casesType === "recovered") {
			setbackground("rgba(125, 215, 29, 0.75)");
			setborder("rgb(125, 215, 29)");
		} else {
			setbackground("rgba(204, 16, 52, 0.75)");
			setborder("rgb(204, 16, 52)");
		}
	}, [casesType]);

	return (
		<div>
			{graphData?.length > 0 && (
				<Line
					data={{
						datasets: [
							{
								backgroundColor: background,
								borderColor: border,
								data: graphData,
							},
						],
					}}
					options={options}
				/>
			)}
		</div>
	);
}

export default LineGraph;
