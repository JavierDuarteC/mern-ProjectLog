import React, { Component } from 'react'
import {
    getFromStorage,
    setInStorage
} from '../../Utils/storage'
import axios from 'axios'

const Log = props => (
    <div className="card">
        <div className="card-body">
            <p className="card-text">{props.log.content}</p>
            <p className="text-muted">- {props.log.fromUsername}</p>
        </div>
        <div class="card-footer">
            <div className="text-right">
                <p className="text-muted">{props.log.updatedAt.split('T')[0] + ' a las ' + props.log.updatedAt.split('T')[1].split('.')[0]}</p>
            </div>
        </div>
    </div>
)

export default class LogList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            logs: []
        }
    }

    componentDidMount() {
        const obj = getFromStorage('the_main_app')

        if (obj && obj.token) {
            const { token } = obj
            axios.get('http://localhost:5000/account/verify?token=' + token)
                .then(res => {
                    if (!res.data.success) {
                        setInStorage('the_main_app', {})
                        this.setState({
                            isLoading: false
                        })
                        window.location = "/login"
                    } else {
                        console.log('Session up')
                    }
                }).catch(err => {
                    console.log(err)
                })

            axios.get('http://localhost:5000/logs/in?token=' + token)
                .then(res => {
                    this.setState({
                        logs: res.data,
                        isLoading: false
                    })
                })
                .catch(err => console.log(err))
        }
        this.setState({
            isLoading: false
        })
    }

    logList() {
        return this.state.logs.map(current => {
            return <Log
                log={current}
                key={current._id} />
        })
    }

    render() {
        return (
            <div className="container">
                <br/>
                <h3>My Wall</h3>
                <br/>
                {this.logList()}
            </div>
        )
    }
}