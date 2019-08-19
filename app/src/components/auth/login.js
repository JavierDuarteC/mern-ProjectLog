import React, { Component } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import './login.css';
import {
    //getFromStorage,
    setInStorage
} from '../../Utils/storage'
import axios from 'axios'

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            singnInError: ''
        }

        this.validateForm = this.validateForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSingIn = this.onSingIn.bind(this);

    }

    validateForm() {
        return this.state.username > 3 && this.state.password.length > 0
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleSubmit = event => {
        event.preventDefault()
    }

    onSingIn() {
        //Grab state and post request to backend
        const userLogin = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post('http://localhost::5000/account/signin',userLogin)
        .then(res=>{
            this.setState({
                singnInError: res.data.message,
            })
            if(res.data.success){
                setInStorage('the_main_app', {token: res.data.token})
                window.location = "/"
            }
        })
        .catch(err=>{
            this.setState({
                singnInError: err.toString(),
            })
        })
    }

    render() {
        return (
            <div className="Login">
                {
                    (this.state.singnInError) ? (<div className="text-danger"><p>{this.state.singnInError}</p></div>) : (null)
                }
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="username" bssize="large">
                        <FormLabel>
                            Username
                        </FormLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bssize="large">
                        <FormLabel>
                            Password
                        </FormLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        bssize="large"
                        disabled={!this.validateForm}
                        type="submit"
                        onClick={this.onSingIn}>
                        Login
                    </Button>
                </form>
            </div>
        )
    }
}

