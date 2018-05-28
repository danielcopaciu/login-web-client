import React, { Component } from 'react';
import { QRCode } from './qrCode';
import { UserHome } from './user'
import 'bootstrap/dist/css/bootstrap.min.css';

const EventSource = require('eventsource');

export class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            qrCode: {},
            token: "",
            isLoggedIn: false,
        };
    }

    componentWillMount() {
        const uuid = require("uuid/v4")
        const token = uuid();

        this.setState({ token: token })
        let url = "http://localhost:8080/api/1.0/qrCode?token=" + token

        fetch(url, {
            method: "GET",
            headers: {
                Accept: 'application/json',
            }
        })
            .then(result => {
                if (result.status) {
                    return result.json();
                }
            }).then(data => {
                this.setState({ qrCode: data.qrCode })
            }).catch(err => {
                alert(err)
            })
    }

    componentDidMount() {
        let eventSource = new EventSource("http://localhost:8080/api/1.0/loggedIn?token=" + this.state.token)
        eventSource.onmessage = e => {
            let status = JSON.parse(e.login);

            if (status === 'success') {
                this.setState({ isLoggedIn: true })
            }
        }
        eventSource.onopen = () => console.log(`event=PUSH_API_CONNECTION_OPEN`);
        eventSource.onerror = err => {
            let stack = typeof err.stack === 'string' ? err.stack.replace(/\n/g, '; ') : '';
            let status = err.status || null;
            error('EVENT_SOURCE_ERROR', { message: err.message, stack: stack, status: status });
        };
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;

        return (
            <div className="container">
                {isLoggedIn ? (
                    <UserHome />
                ) : (
                        <QRCode qrCode={this.state.qrCode} />
                    )}
            </div>
        )
    }
}

function error(type, d) {
    let logStr = `event=PUSH_EVENT_ERROR error=${type}`;
    console.log(logStr, d);
}