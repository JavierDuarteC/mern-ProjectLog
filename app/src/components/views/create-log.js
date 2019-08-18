import React, { Component } from 'react'
import {
    getFromStorage,
    setInStorage
} from '../../Utils/storage'
import axios from 'axios'

export default class CreateLog extends Component {
    constructor(props) {
        super(props)

        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangeContent = this.onChangeContent.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            isLoading: true,
            fromUsername: '',
            toUsername: '',
            content: '',
            sendError: '',
            users: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/users/')
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({
                        users: res.data,
                        toUsername: res.data[0]
                    })
                }
            })

        const obj = getFromStorage('the_main_app')

        if (obj && obj.token) {
            const { token } = obj
            axios.get('http://localhost:5000/account/username?token=' + token)
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data.username)
                        this.setState({
                            fromUsername: res.data.username,
                            isLoading: false
                        })
                    } else {
                        setInStorage('the_main_app', {})
                        this.setState({
                            isLoading: false
                        })
                        window.location = "/login"
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
        this.setState({
            isLoading: false
        })
    }

    onChangeUsername(e) {
        this.setState({
            toUsername: e.target.value
        })
    }

    onChangeContent(e) {
        this.setState({
            content: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault()

        const log = {
            fromUsername: this.state.fromUsername,
            toUsername: this.state.toUsername,
            content: this.state.content,
        }

        axios.post('http://localhost:5000/logs/add', log)
            .then(res => {
                if (res.data.success) {
                    window.location = "/sent"
                } else {
                    this.setState({
                        sendError: res.data.message
                    })
                }
            })
            .catch(err => console.log(err))
    }

    render() {
        if (this.state.isLoading) {
            return (<div className="container">Loading...</div>)
        } else {
            return (
                <div >
                    <h3 >Create New Message</h3>
                    {
                        (this.state.sendError) ? (<div className="text-danger"><p>{this.state.sendError}</p></div>) : (null)
                    }
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label >To: </label>
                            <select ref="userInput"
                                required
                                className="form-control"
                                value={this.state.toUsername}
                                onChange={this.onChangeUsername}>
                                {
                                    this.state.users.map(function (user) {
                                        return (
                                            <option key={user}
                                                value={user}>
                                                {user}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Content: </label>
                            <textarea
                                name="Text"
                                rows={5}
                                className="form-control"
                                value={this.state.content}
                                onChange={this.onChangeContent} />
                        </div>
                        <div className="form-group">
                            <input type="submit"
                                value="Create Log"
                                className="btn btn-primary" />
                        </div>
                    </form>
                </div>
            )
        }
    }
}