import React from 'react';

const UserProfile = (props) => {
    return (
        <div className="userProfile">
            <div className="wrapper">
                {/* <h4>Name: {props.name}</h4>
                <h4>Certification Level: {props.cert}</h4>
                <h4>PADI Number: {props.number}</h4> */}
                <h4>Total Dives Logged: {props.count}</h4>
            </div>
        </div>
    );
};

export default UserProfile;