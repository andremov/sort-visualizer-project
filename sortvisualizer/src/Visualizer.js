import React, {Component} from 'react';

export class Visualizer extends Component {

    state = {
        array : [],
        currentProcess : '',
        scrambleData : {
            indexA : -1,
            indexB : -1
        },
        bubbleSortData : {
            pass : 0,
            index : -1,
            swapsDone : -1
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
        setInterval(this.doProcess,10);
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
        } else if (currentProcess === 'bubble') {
            let {array, bubbleSortData} = this.state;

            if (bubbleSortData.swapsDone === 0 && bubbleSortData.index >= array.length-2) {
                currentProcess = '';

                array[bubbleSortData.index].checking = false;
                array[bubbleSortData.index+1].checking = false;

                bubbleSortData.index = -1;
                bubbleSortData.swapsDone = -1;
                bubbleSortData.pass = 0;
            } else {
                this.bubble(array, bubbleSortData);
            }

            this.setState({array, currentProcess, bubbleSortData});
        }
    };

    doScramble = () => {
        let {currentProcess} = this.state;

        currentProcess = 'scramble';

        this.setState({currentProcess});
    };

    doBubbleSort = () => {
        let {currentProcess} = this.state;

        currentProcess = 'bubble';

        this.setState({currentProcess});
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

    scramble = (array, data) => {

        if (data.indexA !== -1) {
            array[data.indexB].checking = false;
            array[data.indexA].checking = false;
        }

        data.indexA ++;

        let min = data.indexA;
        let max = array.length-1;

        let valueA = array[data.indexA].value;
        data.indexB = this.getRndInteger(min,max);

        let valueB = array[data.indexB].value;

        array[data.indexB].value = valueA;
        array[data.indexB].checking = true;
        array[data.indexA].value = valueB;
        array[data.indexA].checking = true;

    };

    bubble = (array, data) => {

        if (data.index !== -1) {
            array[data.index].checking = false;
            array[data.index+1].checking = false;
        }

        data.index ++;

        if (data.index >= array.length-1) {
            data.index = 0;
            data.swapsDone = 0;
            data.pass ++;
        }

        let valueA = array[data.index].value;
        let valueB = array[data.index+1].value;

        array[data.index].checking = true;
        array[data.index+1].checking = true;

        if (valueA > valueB) {
            data.swapsDone ++;
            array[data.index + 1].value = valueA;
            array[data.index].value = valueB;
        }
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

                <div className='panel'>
                    <div className='btn' onClick={this.doScramble}>
                        Scramble
                    </div>
                    <div className='btn' onClick={this.doBubbleSort}>
                        Bubble
                    </div>
                </div>
            </div>
        );
    }
}
