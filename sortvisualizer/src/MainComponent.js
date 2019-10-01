import React, {Component} from 'react';
import {Header} from "./Header";
import {Visualizer} from "./Visualizer";

export class MainComponent extends Component {
    render() {
        return (
            <div className='app'>
                <Header/>
                <Visualizer/>
            </div>
        );
    }
}
