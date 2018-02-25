import React from 'react';
import ReactDOM from 'react-dom';
import DiveCard from './loggedDiveCard';


// Initialize Firebase
var config = {
  apiKey: "AIzaSyDieHVB0PDA4oCaxX_k_ksUSnI_vctva8o",
  authDomain: "diving-logobook-app.firebaseapp.com",
  databaseURL: "https://diving-logobook-app.firebaseio.com",
  projectId: "diving-logobook-app",
  storageBucket: "diving-logobook-app.appspot.com",
  messagingSenderId: "782182316324"
};
firebase.initializeApp(config);


//Here is the main App Component
class App extends React.Component {

    constructor(props) {
      super(props); //allows me to acces the this keyword for the App component.
      //Setting the initial states for the Parent App component
      //creating empty user details including starting two counters at 0 (dives logged and countries dived)
      //creating an empty diveSite array with an object with empty fields within it.
      this.state = {
        userFullName: '',
        userCertifcationLevel: '',
        userPadiNumber: '',
        diveCount: 0,
        totalCountries: 0,
        dives: []
      }
      //need to bind this to the logDiveLinkClicked() function inorder to use the this keyword inside of it.
      this.logDiveLinkClicked = this.logDiveLinkClicked.bind(this);
      //need to bind this to the accessBucketlistLinkClicked() function inorder to use the this keyword inside of it.
      this.accessBucketlistLinkClicked = this.accessBucketlistLinkClicked.bind(this);
      //need to bind this to the handleSubmit() function in order to use the this keyword inside of it for our form.
      this.handleSubmit = this.handleSubmit.bind(this);
      //need to bind this to the handleChange() function in order to use the this keyword inside of it for our form.
      this.handleChange = this.handleChange.bind(this);
    } //constructor lifecycle ends

  //creating link to our database
  componentDidMount() {
    const dbref = firebase.database().ref('/dives');

    dbref.on('value', (snapshot) => {
      const data = snapshot.val();
      const state = [];
      for (let key in data) {
        data[key].key = key;

        state.push(data[key]);
      }
      console.log(state);
      this.setState({
        dives: state, 
        diveCount: this.state.diveCount
      });
    });
  }

  //creating the logDiveLinkClicked function
  logDiveLinkClicked() {
    console.log("It worked");
    this.addDiveCard.addClass.toggle("hidden");
  }
  //creating the accessBucketListLinkClicked function
  accessBucketlistLinkClicked() {

  }

  //Creating the method that is used to handle the submit of our form
  //Using e.preventDefault() to stop the form from submitting
  handleSubmit(e) {
    e.preventDefault();
    //on submit, create a new object that represents the dive
    const dive = {
      diveSite: this.state.diveSite,
      diveDate: this.state.diveDate,
      diveLocation: this.state.diveLocation,
      diveDepth: this.state.diveDepth,
      diveTime: this.state.diveTime,
      diveCompany: this.state.diveCompany,
      diveNotes: this.state.diveNotes
    }
    const dbref = firebase.database().ref('/dives');
    //.ref is a method on the database that tells us where to store our data. in this case a collection called dives.
    //using the push array method, add the dive object and its property values to the dives collection database array.
    dbref.push(dive);
    //then we set the state
    this.setState({
      diveCount: this.state.diveCount + 1,//this changes the dive count number in the header to match number of dives logged.
      diveSite: '',
      diveDate: '',
      diveLocation: '',
      diveDepth: '',
      diveTime: '',
      diveCompany: '',
      diveNotes: ''
    });
    console.log(this.state.diveCount);
  }
  //creating the handleChange function for our main form inputs
  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  


    render() {
      return (
        <div>
          <header>
            <div className="wrapper">
              <div className="header-main">
                <h4>Name: {this.state.userFullName}</h4>
                <h4>Certification Level: {this.state.userCertificationLevel}</h4>
                <h4>PADI Number: {this.state.userPadiNumber}</h4>
                <h4>Total Dives Logged: {this.state.diveCount}</h4>
                <h4>Total Countries Visited: {this.state.totalCountries}</h4>
              </div>
              <nav className="nav">
                <a href="" onClick={this.logDiveLinkClicked}>Log Recent Dive</a>
                <a href="" onClick={this.accessBucketlistLinkClicked}>Bucketlist Dives</a>
              </nav>
            </div>
          </header>
          <section>
            <div className="wrapper">
              <div className="addDiveCard hidden">
                <form onSubmit={this.handleSubmit}>
                  <label htmlFor="diveSite">Dive Site:</label>
                  <input type="text" placeholder="Enter dive site name." value={this.state.diveSite} onChange={this.handleChange} id="diveSite"/>

                  <label htmlFor="diveDate">Dive Date:</label>
                  <input type="text" placeholder="Enter Date." value={this.state.diveDate} onChange={this.handleChange} id="diveDate" />

                  <label htmlFor="diveTime">Dive Time (minutes):</label>
                  <input type="text" placeholder="Enter Dive Length" value={this.state.diveTime} onChange={this.handleChange} id="diveTime" />

                  <label htmlFor="diveLocation">Dive Location:</label>
                  <input type="text" placeholder="Enter Location." value={this.state.diveLocation} onChange={this.handleChange} id="diveLocation" />

                  <label htmlFor="diveDepth">Dive Depth (metres):</label>
                  <input type="text" placeholder="Enter Depth." value={this.state.diveDepth} onChange={this.handleChange} id="diveDepth" />

                  <label htmlFor="diveCompany">Dive Company:</label>
                  <input type="text" placeholder="Enter Dive Company." value={this.state.diveCompany} onChange={this.handleChange} id="diveCompany" />

                  <label htmlFor="diveNotes">Dive Notes:</label>
                  <textarea name="dive-notes" placeholder="Enter Notes." value={this.state.diveNotes} onChange={this.handleChange} id="diveNotes"></textarea>

                  <input type="submit" value="Log Dive" />
                </form>
              </div>
              <ul className="recentDives">
                {this.state.dives.map((dive) => {
                  return(
                    <DiveCard data={dive} key={dive.key}/>
                  )
                })}
              </ul>
            </div>
          </section>
          <footer>
            <div className="wrapper"></div>
          </footer>
        </div>
      )
    }//render lifecycle ends 
}

ReactDOM.render(<App />, document.getElementById('app'));
