import React from "react";
import "./table.css";
function Table({ countries }) {
	return (
		<div className="table">
			{/* <tbody> */}
			{countries.map(({ country, cases }) => (
				// emmet
				<tr key={country}>
					<td>{country}</td>
					<td>
						<strong>{cases}</strong>
					</td>
				</tr>
			))}
			{/* </tbody> */}
		</div>
	);
}

export default Table;
