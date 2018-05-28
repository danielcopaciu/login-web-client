import React, { Component } from 'react';

export class QRCode extends React.Component {
    render() {
        return (
            <div className="col-xs-12 jumbotron text-center">
                <h1>Login</h1>
                <img
                    className="img-fluid img-thumbnail"
                    src={"data:image/png;base64," + this.props.qrCode}
                    alt="scan this" />
            </div>
        )
    }
}