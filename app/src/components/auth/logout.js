import React, { Component } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap'
import './login.css';
import {
    getFromStorage,
    setInStorage
} from '../../Utils/storage'
import axios from 'axios'

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            singnOutError: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSingOut = this.onSingOut.bind(this);

    }

    handleSubmit = event => {
        event.preventDefault()
    }

    onSingOut() {

        const obj = getFromStorage('the_main_app')

        if (obj && obj.token) {
            const { token } = obj

            axios.get('http://localhost:5000/account/logout?token=' + token)
                .then(res => {

                    this.setState({
                        singnOutError: res.data.message,
                        isLoading: false
                    })
                    setInStorage('the_main_app', {})
                    window.location = "/login"

                })
                .catch(err => {
                    this.setState({
                        singnOutError: err.toString(),
                    })
                })

        } else {
            window.location = "/login"
        }
    }

    render() {
        return (
            <div className="Login">
                {
                    (this.state.singnOutError) ? (<div><p>{this.state.singnOutError}</p></div>) : (null)
                }
                <form onSubmit={this.handleSubmit}>
                    <Button
                        block
                        bssize="large"
                        type="submit"
                        onClick={this.onSingOut}>
                        Logout
                    </Button>
                </form>
            </div>
        )
    }
}

