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
                 */
                data : [-1]
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
                index
                pivot
                left
                right
                 */
                data : [-1, -1, -1, -1]
            }
        ]
    };

    componentDidMount() {
        let maxValue = 20;
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
        setInterval(this.update,5000);
    }

    getColor = (value, max) => {
        let p = ((value/max)*.9)+.1;
        let v = 'rgba(9,211,172,'+p+')';
        return v;
    };

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
            array = this.setSelected(array, i, 0);
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
                data.index >= array.length
             */
            r = (
                currentProcess.data[0] >= array.length
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
            this.quicksort3(array, data);
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

    setSelected = (array, index, value) => {
      array[index].selected = value;
      return array;
    };

    swapValues = (array, indexA, indexB) => {
        let valueA = array[indexA].value;
        array[indexA].value = array[indexB].value;
        array[indexB].value = valueA;

        return array;
    };

    scrambleArray = (array, data) => {
        let [indexA] = data;

        this.clearSelectedElements();

        indexA ++;

        let min = indexA;
        let max = array.length-1;

        let indexB = this.getRndInteger(min,max);

        array = this.swapValues(array, indexA, indexB);

        array = this.setSelected(array, indexB, 1);
        array = this.setSelected(array, indexA, 2);

        data = [indexA];

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

        array = this.setSelected(array, index, 1);
        array = this.setSelected(array, index+1, 1);

        if (array[index].value > array[index+1].value) {
            swaps ++;
            array = this.swapValues(array,index,index+1);
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

        array = this.setSelected(array, index, 1);
        array = this.setSelected(array, index+1, 1);

        if (array[index].value > array[index+1].value) {
            swaps ++;
            array = this.swapValues(array,index,index+1);
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
        // let med = Math.floor(lo + (segSize/2));

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

        array = this.setSelected(array, lo, 2);
        array = this.setSelected(array, hi, 2);

        // array = this.setSelected(array, med, 3);

        array = this.setSelected(array, i, 1);
        // array = this.setSelected(array, j, 1);

        let pivot = array[hi].value;

        if (array[i].value < pivot) {
            i = i + 1;
            data =  [parts, segment, i, j, dir];
            this.saveChanges(array,data);
            return;
        }
/*
        if (array[j].value > pivot) {
            j = j - 1;
            data =  [parts, segment, i, j, dir];
            this.saveChanges(array,data);
            return;
        }
 */
        if (i >= j) {
            segment ++;
            i = -1;
            j = -1;
            data =  [parts, segment, i, j, dir];
            this.saveChanges(array,data);
            return;
        }

        array = this.swapValues(array,i,hi);

        data =  [parts, segment, i, j, dir];
        this.saveChanges(array,data);
    };

    quickSort2 = (array, data) => {
        let [parts, segment, i, j, dir] = data;
        let low = 0;
        let high = 0;
        this.clearSelectedElements();

        /* low  --> Starting index,  high  --> Ending index */
        if (low < high) {
            /* pi is partitioning index, arr[pi] is now
               at right place */
            let pi = this.partition(array, low, high);

            this.quickSort2(array, low, pi - 1);  // Before pi
            this.quickSort2(array, pi + 1, high); // After pi
        }
    };

    partition = (array, data) => {
        // pivot (Element to be placed at right position)
        let high = 0;
        let low = 0;
        let pivot = array[high];

        let i = (low - 1)  // Index of smaller element

        for (let j = low; j <= high - 1; j++)
        {
            // If current element is smaller than the pivot
            if (array[j] < pivot);
            {
                i++;
                // increment index of smaller element

                array = this.swapValues(array,i,j);
            }
        }
        array = this.swapValues(array,i+1, high);
        return (i + 1);
    };

    pushIntoArray = (array, newIndex, oldIndex) => {
        if (newIndex === oldIndex) {
            return array;
        }
        let lo = Math.min(newIndex,oldIndex);
        let hi = Math.max(newIndex,oldIndex);

        //let value = array[hi];

        for (let i = hi-1; i >= lo; i--) {
            array = this.swapValues(array,i,i+1);
        }

        return array;
    };

    quicksort3  = (array, data) => {
        let [index, pivot, left, right] = data;
        this.clearSelectedElements();

        if (index < 0) {
            index = 1;
            pivot = 0;
            left = 1;
            right = array.length-1;
        }

        let pivotValue = array[pivot].value;

        this.setSelected(array, pivot, 2);
        this.setSelected(array, index, 1);
        this.setSelected(array, left, 3);
        this.setSelected(array, right, 3);

        console.log(array[index].value,pivotValue);

        if(array[index].value < pivotValue) {
            console.log('left');
            array = this.pushIntoArray(array,left,index);
            left++;
        } else {
            console.log('right');
            console.log('inserting ' +array[index].value+' into '+right);
            array = this.pushIntoArray(array,right,index);
            right--;
        }

        index++;

        if (index === array.length) {
            array = this.pushIntoArray(array,left,pivot);

        }

        data = [index, pivot, left, right];
        this.saveChanges(array,data);
    };

    render() {
        const {sorts, array} = this.state;
        const styles = ['','one', 'two','three','four'];

        return (
            <div className='view'>

                <div className='graph'>
                    {array.map(item => {return(
                        <div key={item.value} className='bar'>
                            <div style={{height: ((item.value/array.length)*90)+'%', backgroundColor: this.getColor(item.value,array.length) }} className={'value '+(item.selected > 0?'selected '+styles[item.selected]:'')}>
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
