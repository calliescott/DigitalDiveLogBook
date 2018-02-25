import React from 'react';

const DiveCard = (props) => {
    return (
        <li className="diveCard">
            <h3>{props.data.diveSite}</h3>
            <p>Date:{props.data.diveDate}</p>
            <p>Length: {props.data.diveLength}</p>
            <p>Depth: {props.data.diveDepth}</p>
            <p>Country: {props.data.diveLocation}</p>
            <p>Company:{props.data.diveCompany}</p>
            <p>Notes:{props.data.diveNotes}</p>
        </li>
    );
};

export default DiveCard;