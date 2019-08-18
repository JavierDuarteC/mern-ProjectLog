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
//import PrivateRoute from "./components/private-route/PrivateRoute";
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
    if (window.location != 'http://localhost:3000/login') {
      const obj = getFromStorage('the_main_app')
      console.log(obj)
      if (obj && obj.token) {
        const { token } = obj
        //verify token
        axios.get('http://localhost:5000/account/verify?token=' + token)
          .then(res => {
            if (res.data.success) {
              this.setState({
                token: token,
                isLoading: false
              })
            } else {
              window.location = "/login"
              this.setState({
                isLoading: false
              })
            }
          })
      } else {
        window.location = "/login"
      }
      
    }
    this.setState({
      isLoading: false
    })
  }

  componentDidMount() {
    // Check for token to keep user logged in
    this.verifyToken()
  }

  render() {

    if (this.state.isLoading) {
      return (<div className="container">Loading...</div>)
    } else {
      return (
        <Router>
          <div className="container">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            {/* <Route exact path="/register" component={Register} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch> */}
          </div>
        </Router>
      )
    }
  }
}
export default App;