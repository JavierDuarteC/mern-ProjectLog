import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  //Switch 
} from "react-router-dom";
import {
  getFromStorage,
  //setInStorage
} from '../Utils/storage'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from "../components/layout/navbar";
import Landing from "../components/layout/home";
//import Register from "./components/auth/Register";
import Login from "../components/auth/login";
import Logout from "../components/auth/logout";
import Create from "../components/views/create-log";
//import Dashboard from "./components/dashboard/Dashboard";


class App extends Component {

  constructor(props) {
    super(props)

    this.verifyToken = this.verifyToken.bind(this);

    this.state = {
      token: '',
      isLoading: true
    }
  }

  verifyToken() {
    if (window.location != 'http://52.23.159.97:3000/login') {
      const obj = getFromStorage('the_main_app')

      if (obj && obj.token) {
        const { token } = obj
        //verify token
        axios.get('http://52.23.159.97:5000/account/verify?token=' + token)
          .then(res => {
            if (res.data.success) {
              this.setState({
                token: token,
                isLoading: false
              })
            } else {
              this.setState({
                isLoading: false
              })
              window.location = "/login" 
            }
          }).catch(err => {
            console.log(err)
          })
      } else {
        window.location = "/login"
      }

    }
    if (this.state.isLoading) {
      this.setState({
        isLoading: false
      })
    }
  }

  componentDidMount() {
    // Check for token to keep user logged in
    this.verifyToken()
  }

  render() {

    if (this.state.isLoading) {
      return (<div className="container">Loading...</div>)
    } else if (!this.state.token) {
      return (
        <Router>
          <div className="container">
            <Route exact path="/" component={Landing} />
            <Route exact path="/create" component={Create} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            {/* <Route exact path="/register" component={Register} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch> */}
          </div>
        </Router>
      )
    } else {
      return (<Router>
        <div className="container">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />
          {/* <Route exact path="/register" component={Register} />
          <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch> */}
        </div>
      </Router>)
    }
  }
}
export default App;