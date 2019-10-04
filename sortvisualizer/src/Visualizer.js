import React, {Component} from 'react';

export class Visualizer extends Component {

    state = {
        array : [],
        processID : -1,
        sorts : [
            {
                name: 'Scramble',
                /*
                indexA
                indexB
                 */
                data : [-1, -1]
            },
            {
                name: 'Bubble',
                /*
                index
                swaps
                pass
                 */
                data : [-1, -1, -1]
            },
            {
                name: 'Bubble2',
                /*
                index
                swaps
                pass
                 */
                data : [-1, -1, -1]
            }
        ]
    };

    componentDidMount() {

        let maxValue = 100;
        let array = [];
        for (let i = 0; i < maxValue; i++) {
            array.push({
                value : i+1,
                selected : false
            });
        }

        this.setState({array});
        this.handleEvent = this.handleEvent.bind(this);
        setInterval(this.update,10);
    }

    clearSelectedElements = () => {
        let {array} = this.state;
        for (let i = 0; i < array.length; i++) {
            array[i].selected = false;
        }
        this.setState({array});
    };

    clearProcess = () => {
        let {processID} = this.state;
        let sorts = this.state.sorts;
        let currentProcess = sorts[processID];

        processID = -1;
        // eslint-disable-next-line no-unused-vars
        for (let i = 0; i < currentProcess.data.length; i++) {
            currentProcess.data[i] = -1;
        }

        this.setState({processID, sorts});
    };

    finished = () => {
        const {processID, array} = this.state;
        const currentProcess = this.state.sorts[processID];
        let r;
        if (processID === 0) {
            /*
            scrambleData.indexA === array.length-1
             */
            r = (
                currentProcess.data[0] === array.length-1
            );
        } else if (processID === 1) {
            /*
            bubbleSortData.swapsDone === 0 && bubbleSortData.index >= array.length-2
             */
            r = (
                currentProcess.data[1] <= 0 && currentProcess.data[0] >= array.length-2
            );
        } else if (processID === 2) {
            /*
            bubbleSortData.swapsDone === 0 && bubbleSortData.index >= array.length-2-bubbleSortData.pass
             */
            r = (
                currentProcess.data[1] <= 0 && currentProcess.data[0] >= array.length-3-currentProcess.data[2]
            );
        }
        return r;
    };

    doProcess = () => {
        const {processID, array} = this.state;

        if (processID === -1)
            return;

        const {data} = this.state.sorts[processID];
        if (processID === 0) {
            this.scramble(array, data);
        } else if (processID === 1) {
            this.bubble(array, data);
        } else if (processID === 2) {
            this.bubble2(array, data);
        }
    };

    saveChanges = (array, data) => {
        this.setState({array});
        let {processID, sorts} = this.state;
        sorts[processID].data = data;
        this.setState({sorts});
    };

    update = () => {
        if (this.finished()) {
            this.clearSelectedElements();
            this.clearProcess();
        } else {
            this.doProcess();
        }
    };

    handleEvent = id => {
        if (this.state.processID === -1) {
            this.setState({processID: id});
        }
    };

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    scramble = (array, data) => {
        let [indexA, indexB] = data;

        this.clearSelectedElements();

        indexA ++;

        let min = indexA;
        let max = array.length-1;

        let valueA = array[indexA].value;
        indexB = this.getRndInteger(min,max);

        let valueB = array[indexB].value;

        array[indexB].value = valueA;
        array[indexB].selected = true;
        array[indexA].value = valueB;
        array[indexA].selected = true;

        data = [indexA, indexB];

        this.saveChanges(array,data);
    };

    bubble = (array, data) => {
        let [index, swaps, pass] = data;

        this.clearSelectedElements();

        index ++;

        if (index >= array.length-1) {
            index = 0;
            swaps = 0;
            pass ++;
        }

        let valueA = array[index].value;
        let valueB = array[index+1].value;

        array[index].selected = true;
        array[index+1].selected = true;

        if (valueA > valueB) {
            swaps ++;
            array[index + 1].value = valueA;
            array[index].value = valueB;
        }

        data = [index, swaps, pass];
        this.saveChanges(array,data);
    };

    bubble2 = (array, data) => {
        let [index, swaps, pass] = data;

        this.clearSelectedElements();

        index ++;

        if (index >= array.length-2-pass) {
            index = 0;
            swaps = 0;
            pass ++;
        }

        let valueA = array[index].value;
        let valueB = array[index+1].value;

        array[index].selected = true;
        array[index+1].selected = true;

        if (valueA > valueB) {
            swaps ++;
            array[index + 1].value = valueA;
            array[index].value = valueB;
        }

        data = [index, swaps, pass];
        this.saveChanges(array,data);
    };

    render() {
        const {sorts, array} = this.state;

        return (
            <div className='view'>

                <div className='graph'>
                    {array.map(item => {return(
                        <div key={item.value} className='bar'>
                            <div style={{height: (item.value*2)+'px' }} className={'value '+(item.selected?'selected':'')}>
                            </div>
                        </div>
                    )})}
                </div>

                <div className='panel'>
                    {sorts.map(item => {return(
                        <div key={sorts.indexOf(item)} className='btn' onClick={(e) => this.handleEvent(sorts.indexOf(item))}>
                            {item.name}
                        </div>
                    )})}
                </div>
            </div>
        );
    }
}
