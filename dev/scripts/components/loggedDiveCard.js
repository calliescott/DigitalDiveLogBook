import React from 'react';

const DiveCard = (props) => {
    return (
        <li className="diveCard">
            <h3>Dive Site: {props.data.diveSite}</h3>
            <p>Date:{props.data.diveDate}</p>
            <p>Length: {props.data.diveTime} minutes</p>
            <p>Depth: {props.data.diveDepth} metres</p>
            <p>Country: {props.data.diveLocation}</p>
            <p>Company:{props.data.diveCompany}</p>
            <p>Notes:{props.data.diveNotes}</p>
            <button onClick={() => props.remove(props.data.key)}><i class="far fa-trash-alt"></i></button>
        </li>
    );
};

export default DiveCard;