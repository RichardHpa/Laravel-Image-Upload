import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Form from './form';

export default class Example extends Component {
    render() {
        return (
            <div className="container h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-md-12">
                        <Form/>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<Example />, document.getElementById('app'));
}
