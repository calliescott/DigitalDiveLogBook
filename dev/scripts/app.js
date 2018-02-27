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
        userLogin: 'userLoginContainer',
        userSignIn: 'userSignInContainer',
        createEmail: '',
        createPassword: '',
        loginEmail: '',
        loginPassword: '',
        loggedIn: false,
        loggedDives: false,
        dives: [],
        diveCount: 0,
        totalCountries: '',
        addDiveCard: false,
        user: {
          userFullName: '',
          userCertification: '',
          userPadiNumber: ''
        }
      }

      //binding the this keyword to our functions so we can use this inside of them to reference their parent component.
      this.createUser = this.createUser.bind(this);
      this.signIn = this.signIn.bind(this);
      this.signOut = this.signOut.bind(this);
      this.logDiveLinkClicked = this.logDiveLinkClicked.bind(this);
      this.addDive = this.addDive.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
    } //constructor lifecycle ends



  //creating link to our database once App component renders
  componentDidMount() {
    firebase.auth().onAuthStateChanged((response) => {
      console.log(response);
      if (response) {
        this.setState({
          loggedIn: true,
          user: response
        })
      }
      else {
        this.setState({
          loggedIn: false,
          user: {}
        })
      }
    })

    const dbref = firebase.database().ref(`users / ${ this.state.user.uid }/dives`);

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
        diveCount: this.state.dives.length
      });
    });
    
  }

  signOut() {
    console.log("Sign out working!");
    firebase.auth().signOut();
    this.setState({
      loggedIn: false
    })
  }

  createUser(e) {
    e.preventDefault();
    const email = this.state.createEmail;
    const password = this.state.createPassword;

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        const dbref = firebase.database().ref(`users/${this.state.user.uid }`);
        console.log(dbref);
        dbref.push({})
      })
      .catch((error) => console.log(error.code, error.message));
  }

  signIn() {
    console.log("signing in!");
    const email = this.state.enterEmail;
    const password = this.state.enterPassword;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
      });
  }

  //creating the logDiveLinkClicked function
  logDiveLinkClicked(e) {
    e.preventDefault();
    this.setState({
      addDiveCard: true
    });
    
  }


  //Creating the method that is used to handle the submit of our form
  //Using e.preventDefault() to stop the form from submitting
  addDive(e) {
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
    console.log("dive", dive);
    const dbref = firebase.database().ref(`users/${ this.state.user.uid }/dives`);
    console.log("once", dbref);
    //.ref is a method on the database that tells us where to store our data. in this case a collection called dives.
    //using the push array method, add the dive object and its property values to the dives collection database array.
    dbref.push(dive);
    console.log("twice", dbref);
    //then we set the state
    this.setState({
      diveSite: '',
      diveDate: '',
      diveLocation: '',
      diveDepth: '',
      diveTime: '',
      diveCompany: '',
      diveNotes: '', 
      addDiveCard: false, 
      loggedDives: true
    });

  }
  
  handleUserChange(event, field) {
    const newState = Object.assign({}, this.state);
    newState[field] = event.target.value;
    this.setState(newState);
  }

  //creating the handleChange function for our main form inputs
  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
    render() {
      return (
        <div>
          {this.state.loggedIn ? 
            <div className="userLoggedInContainer">
              <header>
                <div className="wrapper">
                  <img src="../images/flippersLarge.png" alt=""/>
                  <h1>Bubbles</h1>
                  <h3>A digital log book created for scuba diving enthusiasts around the world.</h3>
                </div>
              </header>
              <nav className="nav">
                <div className="wrapper">
                  <div className="nav-img">
                    <img src="../images/diveLogo.png" alt=""/>
                    <h4>Bubbles</h4>
                  </div>
                  <div className="nav-links">
                    <a href="#" className="nav-left" onClick={this.logDiveLinkClicked}>Log Recent Dive</a>
                    <a href="#" className="nav-right" onClick={this.signOut}>Sign Out</a>
                  </div>
                </div>
              </nav>
              <section className="sectionMainContainer">
                <div className="userProfile">
                  <div className="wrapper">
                    <h4>Name: {this.state.userFullName}</h4>
                    <h4>Certification Level: {this.state.userCertification}</h4>
                    <h4>PADI Number: {this.state.userPadiNumber}</h4>
                    <h4>Total Dives Logged: {this.state.dives.length}</h4>
                  </div>
                </div>
              <section>
                  <div className="wrapper">
                    {this.state.addDiveCard ?
                      <div className="addDiveCard" value={this.state.addDiveCard} onChange={this.handleChange}>
                        <h3>Log New Dive</h3>
                        <form onSubmit={this.addDive}>
                          <div className="form-container">
                            <div className="form-container-column">
                              <label htmlFor="diveSite">Dive Site:</label>
                              <input type="text" placeholder="Enter dive site name." value={this.state.diveSite} onChange={this.handleChange} id="diveSite" />
                            </div>
                            <div className="form-container-column">
                              <label htmlFor="diveDate">Date:</label>
                              <input type="text" placeholder="Enter Date." value={this.state.diveDate} onChange={this.handleChange} id="diveDate" />
                            </div>
                          </div>
                          <div className="form-container">
                            <div className="form-container-column">
                              <label htmlFor="diveTime">Total Time (mins):</label>
                              <input type="text" placeholder="Enter Dive Length" value={this.state.diveTime} onChange={this.handleChange} id="diveTime" />
                            </div>
                            <div className="form-container-column">
                              <label htmlFor="diveLocation">Country:</label>
                              <input type="text" placeholder="Enter Location." value={this.state.diveLocation} onChange={this.handleChange} id="diveLocation" />
                            </div>
                          </div>
                          <div className="form-container">
                            <div className="form-container-column">
                              <label htmlFor="diveDepth">Total Depth (m):</label>
                              <input type="text" placeholder="Enter Depth." value={this.state.diveDepth} onChange={this.handleChange} id="diveDepth" />
                            </div>
                            <div className="form-container-column">
                              <label htmlFor="diveCompany">Dive Company:</label>
                              <input type="text" placeholder="Enter Dive Company." value={this.state.diveCompany} onChange={this.handleChange} id="diveCompany" />
                            </div>
                          </div>

                          <div className="form-container">
                            <div className="form-container-column">
                              <label htmlFor="diveNotes">Dive Notes:</label>
                              <textarea name="dive-notes" placeholder="Enter Notes." value={this.state.diveNotes} onChange={this.handleChange} id="diveNotes"></textarea>
                            </div>
                          </div>
                          <input type="submit" value="Log Dive" />
                        </form>
                      </div>
                        
                    : 
                        <ul className="recentDives">
                        {this.state.dives.map((dive, i) => {
                            return (
                              <DiveCard data={dive} key={i} />
                            )
                          })}
                        </ul>
                    }
                    {this.state.loggedDives ?
                      <ul className="recentDives">
                        {this.state.dives.map((dive, i) => {
                          return (
                            <DiveCard data={dive} key={i} />
                          )
                        })}
                      </ul>
                    : 
                    null
                    }
                    
                    
                  </div>
                  {/* /.wrapper ends */}
                </section>
              </section>

              <footer>
                <div className="wrapper">
                  <p>Created by Callie Scott | <a href="https://twitter.com/_calliescott"><i className="fab fa-twitter"></i></a><a href="https://github.com/calliescott"><i className="fab fa-github"></i></a></p>
                </div>
              </footer>
            </div>// ./userLoggedInContainer ends 

          : 
            <div className="userLoginContainer">
              <video playsInline autoPlay muted loop poster="../images/water-min.png" className="fullscreenUserLoginContainerVideo">
                    <source src="../images/dive-video.mp4" type="video/mp4"/>
              </video>
              <div className="wrapper">
                <img src="../images/dive-Logo.png" alt=""/>
                <h2>Bubbles</h2>
                
                <div className="userOptions">
                  <h3>Digital Diving Log Book</h3>
                  <div className="userOptionsRow">
                    <div className="createUser">
                      <form onSubmit={this.createUser}>
                        <h4>Create New Diver Profile</h4>
                        <div className="form-div">
                          <label htmlFor="createEmail">Email Address:</label>
                          <input type="email" placeholder="Please enter your e-mail address" value={this.state.createEmail} id="createEmail" onChange={(event) => this.handleChange(event, "createEmail")} />
                        </div>
                        <div className="form-div">
                          <label htmlFor="createPassword">Password:</label>
                          <input type="password" placeholder="Please enter your desired password" value={this.state.createPassword} id="createPassword" onChange={(event) => this.handleChange(event, "createPassword")} />
                        </div>
                        <div className="form-div">
                          <label htmlFor="userFullName">Full Name:</label>
                          <input type="text" placeholder="Please enter your full name" value={this.state.userFullName} id="userFullName" onChange={(event) => this.handleChange(event, "userFullName")}/>
                        </div>
                        <div className="form-div">
                          <label htmlFor="userPadiNumber">PADI Number:</label>
                          <input type="text" placeholder="Please enter your PADI number" value={this.state.userPadiNumber} id="userPadiNumber" onChange={(event) => this.handleChange(event, "userPadiNumber")} />
                        </div>
                        <div className="form-div">
                          <label htmlFor="userCertification">Certification Level:</label>
                          <select name="" value={this.state.userCertification} id="userCertification" onChange={(event) => this.handleChange(event, "userCertification")}>
                            <option value="Discover Scuba Diving">Discover Scuba Diving</option>
                            <option value="PADI Scuba Diver">PADI Scuba Diver</option>
                            <option value="Open Water Diver">Open Water Diver</option>
                            <option value="Divemaster">Divemaster</option>
                            <option value="Enriched Air Diver">Enriched Air Diver</option>
                            <option value="Assistant Instructor">Assistant Instructor</option>
                            <option value="Open Water Scuba Instructor">Open Water Scuba Instructor</option>
                          </select>
                        </div>
                        <button>Create Diver</button>
                      </form>
                    </div>
                    {/* ./create-user ends */}
                    <div className="userSignIn">
                        <h4>Or Sign in to Diver Account</h4>
                        <form onSubmit={this.signIn}>
                          <div className="form-div">
                            <label htmlFor="enterEmail">Email Address:</label>
                          <input type="email" placeholder="Please enter your email address" id="enterEmail" onChange={(event) => this.handleChange(event, "loginEmail")} />
                          </div>
                          <div className="form-div">
                            <label htmlFor="enterPassword">Password:</label>
                          <input type="password" placeholder="Please enter your account password" id="enterPassword" onChange={(event) => this.handleChange(event, "loginPassword")} />
                          </div>
                          <div className="form-div">
                            <button>Login</button>
                          </div>
                        </form>
                    </div>
                    {/* ./user-sign-in ends */}
                  </div>
                </div>
              </div>
              {/* wrapper ends */}
            </div>
            // ./userLoginContainer ends 
          }
        </div>
      )
    }//render lifecycle ends 
}

ReactDOM.render(<App />, document.getElementById('app'));
