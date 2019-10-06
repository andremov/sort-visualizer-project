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
            },
            {
                name: 'Quick',
                /*
                parts
                segment
                i
                j
                dir
                 */
                data : [-1, -1, -1, -1, -1]
            }
        ]
    };

    componentDidMount() {

        let maxValue = 100;
        let array = [];
        for (let i = 0; i < maxValue; i++) {
            array.push({
                value : i+1,
                selected : 0
            });
        }

        this.scrambleIterative(array);

        this.setState({array});
        this.handleEvent = this.handleEvent.bind(this);
        setInterval(this.update,10);
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

    clearSelectedElements = () => {
        let {array} = this.state;
        for (let i = 0; i < array.length; i++) {
            array[i].selected = 0;
        }
        this.setState({array});
    };

    clearProcess = () => {
        let {processID} = this.state;
        let sorts = this.state.sorts;
        let currentProcess = sorts[processID];

        processID = -1;
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
            data.indexA === array.length-1
             */
            r = (
                currentProcess.data[0] === array.length-1
            );
        } else if (processID === 1) {
            /*
            data.swapsDone === 0 && data.index >= array.length-2
             */
            r = (
                currentProcess.data[1] <= 0 && currentProcess.data[0] >= array.length-2
            );
        } else if (processID === 2) {
            /*
            data.swapsDone === 0 && data.index >= array.length-2-data.pass
             */
            r = (
                currentProcess.data[1] <= 0 && currentProcess.data[0] >= array.length-3-currentProcess.data[2]
            );
        } else if (processID === 3) {
            /*
                data.parts < data.segment && data.dir === -1
             */
            r = (
                currentProcess.data[0] < currentProcess.data[1] && currentProcess.data[4] === 1
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
            this.scrambleArray(array, data);
        } else if (processID === 1) {
            this.bubbleSort(array, data);
        } else if (processID === 2) {
            this.bubbleSort2(array, data);
        } else if (processID === 3) {
            this.quickSort(array, data);
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

    scrambleArray = (array, data) => {
        let [indexA, indexB] = data;

        this.clearSelectedElements();

        indexA ++;

        let min = indexA;
        let max = array.length-1;

        let valueA = array[indexA].value;
        indexB = this.getRndInteger(min,max);

        let valueB = array[indexB].value;

        array[indexB].value = valueA;
        array[indexB].selected = 1;
        array[indexA].value = valueB;
        array[indexA].selected = 2;

        data = [indexA, indexB];

        this.saveChanges(array,data);
    };

    bubbleSort = (array, data) => {
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

        array[index].selected = 1;
        array[index+1].selected = 1;

        if (valueA > valueB) {
            swaps ++;
            array[index + 1].value = valueA;
            array[index].value = valueB;
        }

        data = [index, swaps, pass];
        this.saveChanges(array,data);
    };

    bubbleSort2 = (array, data) => {
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

        array[index].selected = 1;
        array[index+1].selected = 1;

        if (valueA > valueB) {
            swaps ++;
            array[index + 1].value = valueA;
            array[index].value = valueB;
        }

        data = [index, swaps, pass];
        this.saveChanges(array,data);
    };

    quickSort = (array, data) => {
        let [parts, segment, i, j, dir] = data;
        this.clearSelectedElements();

        parts = parts < 0? 1 : parts;
        segment = segment < 0? 0 : segment;

        if (segment >= parts) {
            parts *= Math.pow(2,dir*-1);
            segment = 0;
        }

        let segSize = Math.floor((array.length-1)/parts);

        let lo = segSize * segment;
        let hi = lo + segSize;
        let med = Math.floor(lo + (segSize/2));

        if (segSize <= 3) {
            dir *= -1;
            parts *= Math.pow(2,dir*-1);
            segment = 0;
            data =  [parts, segment, i, j, dir];
            this.saveChanges(array,data);
            return;
        }

        if (i === -1 && j === -1) {
            i = lo;
            j = hi;
        }

        array[lo].selected = 2;
        array[hi].selected = 2;
        array[med].selected = 3;
        array[i].selected = 1;
        array[j].selected = 1;

        let pivot = array[med].value;

        if (array[i].value < pivot) {
            i = i + 1;
            data =  [parts, segment, i, j, dir];
            this.saveChanges(array,data);
            return;
        }

        if (array[j].value > pivot) {
            j = j - 1;
            data =  [parts, segment, i, j, dir];
            this.saveChanges(array,data);
            return;
        }

        if (i >= j) {
            segment ++;
            i = -1;
            j = -1;
            data =  [parts, segment, i, j, dir];
            this.saveChanges(array,data);
            return;
        }

        let valueA = array[i].value;
        array[i].value = array[j].value;
        array[j].value = valueA;
        data =  [parts, segment, i, j, dir];
        this.saveChanges(array,data);
    };

    quickSort2 = (array, data) => {
        let [parts, segment, i, j, dir] = data;
        this.clearSelectedElements();

        /* low  --> Starting index,  high  --> Ending index */
        if (low < high) {
            /* pi is partitioning index, arr[pi] is now
               at right place */
            let pi = partition(arr, low, high);

            quickSort(arr, low, pi - 1);  // Before pi
            quickSort(arr, pi + 1, high); // After pi
        }
    };

    /* This function takes last element as pivot, places
    the pivot element at its correct position in sorted
    array, and places all smaller (smaller than pivot)
    to left of pivot and all greater elements to right
    of pivot */
    partition = (array, data) => {
        // pivot (Element to be placed at right position)
        let pivot = arr[high];

        let i = (low - 1)  // Index of smaller element

        for (let j = low; j <= high - 1; j++)
        {
            // If current element is smaller than the pivot
            if (arr[j] < pivot);
            {
                i++;
                // increment index of smaller element
                swap arr[i] and arr[j];
            }
        }
        swap arr[i + 1] and arr[high]);
        return (i + 1);
    }

    render() {
        const {sorts, array} = this.state;
        const styles = ['','one', 'two','three','four'];

        return (
            <div className='view'>

                <div className='graph'>
                    {array.map(item => {return(
                        <div key={item.value} className='bar'>
                            <div style={{height: (item.value*2)+'px' }} className={'value '+(item.selected > 0?'selected '+styles[item.selected]:'')}>
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
