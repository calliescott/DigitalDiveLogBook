import React from 'react';
import ReactDOM from 'react-dom';
import Sticky from 'react-sticky-el';
import DiveCard from './components/loggedDiveCard';
import UserProfile from './components/userProfile';

import Header from './components/header';
import Footer from './components/footer';

// Initialize Firebase
const config = {
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
        user: [],
        formToShow: ''
      }

      //binding the this keyword to our functions so we can use this inside of them to reference their parent component.
      this.createUser = this.createUser.bind(this);
      this.signIn = this.signIn.bind(this);
      this.signOut = this.signOut.bind(this);
      this.logDiveLinkClicked = this.logDiveLinkClicked.bind(this);
      this.addDive = this.addDive.bind(this);
      this.removeDive = this.removeDive.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleUserChange = this.handleUserChange.bind(this);
      this.formToShow = this.formToShow.bind(this);
    } //constructor lifecycle ends



  //creating link to our database once App component renders
  componentDidMount() {
    firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        const dbRef = firebase.database().ref(`users/${ user.uid }/dives`);

        dbRef.on('value', (snapshot) => {

          const data = snapshot.val();
          const fbstate =[];
          for (let key in data) {

            const newVal = data[key];
            newVal["fbKey"] = key;
            fbstate.push(newVal);
          }
          this.setState({
            dives: fbstate,
            loggedIn: true, 
            user: user
          });
        });
      }
      else {
        this.setState({
          loggedIn: false,
          dives: [],
          user: {}
        })
      }
    });

    const dbRef = firebase.database().ref(`users`);
      dbRef.on("value", (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      this.setState({
        users: data
      })
    });
  }

  

  createUser(e) {
    e.preventDefault();
    const email = this.state.createEmail;
    const password = this.state.createPassword;
    const newDiver = {
      userFullName: this.state.userFullName,
      userPadiNumber: this.state.userPadiNumber,
      userCertification: this.state.userCertification
      }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const dbRef = firebase.database().ref(`users/${user.uid}`);
        dbRef.set(newDiver);
      })
      .catch((error) => console.log(error.code, error.message));
  }

  signIn() {
    console.log("signing in!");
    const email = this.state.enterEmail;
    const password = this.state.enterPassword;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
      });
  }

  signOut() {
    firebase.auth().signOut();
    this.setState({
      loggedIn: false
    })
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
    const newDive = {
      diveSite: this.state.diveSite,
      diveDate: this.state.diveDate,
      diveLocation: this.state.diveLocation,
      diveDepth: this.state.diveDepth,
      diveTime: this.state.diveTime,
      diveCompany: this.state.diveCompany,
      diveNotes: this.state.diveNotes
    }
    const newDiveState = Array.from(this.state.dives);
    newDiveState.push(newDive);
    // const userId = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref(`users/${this.state.user.uid}/dives`);
    //.ref is a method on the database that tells us where to store our data. in this case a collection called dives.
    //using the push array method, add the dive object and its property values to the dives collection database array.
    dbRef.push(newDive);


 
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
      loggedDives: true,
      dives: newDiveState
    });

  }

  removeDive(diveToRemove){
    const dbRef = firebase.database().ref(diveToRemove);
    dbRef.remove();
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

  formToShow(e) {
    e.preventDefault();
    this.setState({
      formToShow: e.target.className
    })
  }
    render() {
      let loginForm = '';
      if (this.state.formToShow === 'signup') {
        loginForm = (
            <form onSubmit={this.createUser}>
              <div className="form-div">
                <label htmlFor="createEmail">Email Address:</label>
                <input type="email" value={this.state.createEmail} id="createEmail" onChange={(event) => this.handleChange(event, "createEmail")} />
              </div>
              <div className="form-div">
                <label htmlFor="createPassword">Password:</label>
                <input type="password" value={this.state.createPassword} id="createPassword" onChange={(event) => this.handleChange(event, "createPassword")} />
              </div>
              <div className="form-div">
                <label htmlFor="userFullName">Full Name:</label>
                <input type="text" value={this.state.userFullName} id="userFullName" onChange={(event) => this.handleChange(event, "userFullName")} />
              </div>
              <div className="form-div">
                <label htmlFor="userPadiNumber">PADI Number:</label>
                <input type="text" value={this.state.userPadiNumber} id="userPadiNumber" onChange={(event) => this.handleChange(event, "userPadiNumber")} />
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
        )
      } else if (this.state.formToShow === 'login') {
        loginForm = (
          <form onSubmit={this.signIn}>
            <div className="form-div">
              <label htmlFor="enterEmail">Email Address:</label>
              <input type="email" id="enterEmail" onChange={(event) => this.handleChange(event, "loginEmail")} />
            </div>
            <div className="form-div">
              <label htmlFor="enterPassword">Password:</label>
              <input type="password" id="enterPassword" onChange={(event) => this.handleChange(event, "loginPassword")} />
            </div>
            <div className="form-div">
              <button>Login</button>
            </div>
          </form>
        )
      }
      return (
        <div>
          {this.state.loggedIn ? 
            <div className="userLoggedInContainer">
                <Header />
                <Sticky topOffset={0}>
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
                </Sticky>
                <section className="sectionMainContainer">
                <UserProfile name={this.state.userFullName} cert={this.state.userCertification} number={this.state.userPadiNumber} count={this.state.dives.length}/>
                <section>
                    <div className="wrapper">
                      {this.state.addDiveCard ?
                        <div>
                          <div className="addDiveCard" value={this.state.addDiveCard} onChange={this.handleChange}>
                            <h3>Log New Dive</h3>
                            <form onSubmit={this.addDive}>
                              <div className="form-container">
                                <div className="form-container-column">
                                  <label htmlFor="diveSite">Dive Site:</label>
                                  <input type="text"  value={this.state.diveSite} onChange={this.handleChange} id="diveSite" />
                                </div>
                                <div className="form-container-column">
                                  <label htmlFor="diveDate">Date:</label>
                                  <input type="text"  value={this.state.diveDate} onChange={this.handleChange} id="diveDate" />
                                </div>
                              </div>
                              <div className="form-container">
                                <div className="form-container-column">
                                  <label htmlFor="diveTime">Total Time (mins):</label>
                                  <input type="text"  value={this.state.diveTime} onChange={this.handleChange} id="diveTime" />
                                </div>
                                <div className="form-container-column">
                                  <label htmlFor="diveLocation">Country:</label>
                                  <input type="text" value={this.state.diveLocation} onChange={this.handleChange} id="diveLocation" />
                                </div>
                              </div>
                              <div className="form-container">
                                <div className="form-container-column">
                                  <label htmlFor="diveDepth">Total Depth (m):</label>
                                  <input type="text"  value={this.state.diveDepth} onChange={this.handleChange} id="diveDepth" />
                                </div>
                                <div className="form-container-column">
                                  <label htmlFor="diveCompany">Dive Company:</label>
                                  <input type="text" value={this.state.diveCompany} onChange={this.handleChange} id="diveCompany" />
                                </div>
                              </div>

                              <div className="form-container">
                                <div className="form-container-column">
                                  <label htmlFor="diveNotes">Dive Notes:</label>
                                  <textarea name="dive-notes" value={this.state.diveNotes} onChange={this.handleChange} id="diveNotes"></textarea>
                                </div>
                              </div>
                              <input type="submit" value="Log Dive" />
                            </form>
                          </div>
                        
                            <ul className="recentDives">
                              {this.state.dives.map((dive, i) => {
                                return (
                                  <DiveCard data={dive} key={dive.key} remove={this.removeDive} />
                                )
                              })}
                            </ul>
                        </div>
                          
                      : 
                          <ul className="recentDives">
                        {this.state.dives.map((dive, i) => {
                              return (
                                <DiveCard data={dive} key={dive.key} remove={this.removeDive}/>
                              )
                            })}
                          </ul>
                      }
                    </div>
                    {/* /.wrapper ends */}
                  </section>
                </section>
                <Footer />
            </div>// ./userLoggedInContainer ends 
          : 
            <div className="userLoginContainer">
              <div className="bubble x1"></div>
              <div className="bubble x2"></div>
              <div className="bubble x3"></div>
              <div className="bubble x4"></div>
              <div className="bubble x5"></div>
              <div className="bubble x6"></div>
              <div className="bubble x7"></div>
              <div className="bubble x8"></div>
              <div className="bubble x9"></div>
              <div className="bubble x10"></div>
              <div className="wrapper">
                <div className="userOptions">
                  <h2>Bubbles</h2>
                  <h3>Digital Diving Log Book</h3>
                  <div className="userOptionsRow">
                    <div className="userSignIn">
                      <ul className="sign-in-links">
                        <li className="sign-in-links-li"><a href="" className="signup" onClick={this.formToShow}>Create Diver Account</a></li>
                        <li className="sign-in-links-li"><a href="" className="login" onClick={this.formToShow}>Sign into Diver Account</a></li>
                      </ul>
                    </div>
                    {loginForm}
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
