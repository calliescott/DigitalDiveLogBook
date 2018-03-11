import React from 'react';

const Header = (props) => {
    return (
        <div>
            <header>
                <div className="wrapper">
                    <img src="../images/flippersLarge.png" alt="" />
                    <h1>Bubbles</h1>
                    <h3>A digital log book created for scuba diving enthusiasts around the world.</h3>
                </div>
            </header>
        </div>
    );
};

export default Header;


// onClick = { this.logDiveLinkClicked }
// onClick = { this.signOut }