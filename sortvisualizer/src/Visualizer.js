import React, {Component} from 'react';

export class Visualizer extends Component {

    state = {
        array : [],
        currentProcess : '',
        scrambleData : {
            indexA : -1,
            indexB : -1
        },
        blankData : {
            indexA : -1,
            indexB : -1
        }
    };

    componentDidMount() {

        let maxValue = 100;
        let array = [];
        for (let i = 0; i < maxValue; i++) {
            array.push({
                value : i+1,
                checking : false
            });
        }

        this.setState({array});
        setInterval(this.doProcess,100);
    }

    doProcess = () => {
        let {currentProcess} = this.state;
        if (currentProcess === 'scramble') {
            let {array, scrambleData} = this.state;

            if (scrambleData.indexA === array.length-1) {
                currentProcess = '';

                array[scrambleData.indexB].checking = false;
                array[scrambleData.indexA].checking = false;

                scrambleData.indexA = -1;
                scrambleData.indexB = -1;
            } else {
                this.scramble(array, scrambleData);
            }

            this.setState({array, currentProcess, scrambleData});
        }
    };

    doScramble = () => {
        let {currentProcess, scrambleData} = this.state;

        currentProcess = 'scramble';

        this.setState({currentProcess, scrambleData});
    };

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    scrambleIterative = (array) => {
        for (let i = 0; i < array.length; i++) {
            let min = i+1;
            let max = array.length-1;

            let valueA = array[i].value;
            let shuffleIndex = this.getRndInteger(min,max);

            let valueB = array[shuffleIndex].value;

            array[shuffleIndex].value = valueA;
            array[i].value = valueB;
        }
    };

    scramble = (array, scramble) => {

        if (scramble.indexA !== -1) {
            array[scramble.indexB].checking = false;
            array[scramble.indexA].checking = false;
        }

        scramble.indexA ++;

        let min = scramble.indexA;
        let max = array.length-1;

        let valueA = array[scramble.indexA].value;
        scramble.indexB = this.getRndInteger(min,max);

        let valueB = array[scramble.indexB].value;

        array[scramble.indexB].value = valueA;
        array[scramble.indexB].checking = true;
        array[scramble.indexA].value = valueB;
        array[scramble.indexA].checking = true;

    };

    render() {
        const {array} = this.state;


        return (
            <div className='view'>
                <div className='graph'>
                {array.map(item => {return(
                    <div key={item.value} className='bar'>
                        <div style={{height: (item.value*2)+'px' }} className={'value '+(item.checking?'selected':'')}>
                        </div>
                    </div>
                )})}
                </div>
                <div className='btn' onClick={this.doScramble}>
                    Scramble
                </div>
            </div>
        );
    }
}
