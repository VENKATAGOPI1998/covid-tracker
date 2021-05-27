import React from "react";
import { Map, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "../util";

function MyMap({ countries, casesType, center, zoom }) {
	return (
		<div className="map">
			<Map center={center} zoom={zoom} minZoom={2} scrollWheelZoom={false}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				{showDataOnMap(countries, casesType)}
			</Map>
		</div>
	);
}

export default MyMap;
