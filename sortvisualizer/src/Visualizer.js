import React, {Component} from 'react';

export class Visualizer extends Component {

    state = {
        array : [],
        processID : -1,
        info : {
            name : '',
            swaps : 0,
            access : 0,
            comparisons : 0
        },
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
                name: 'Short Bubble',
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
                left
                right
                lo
                hi
                 */
                data : [-1]
            },
            {
                name: 'Insert',
                /*
                main
                alt
                 */
                data : [-1, -1]
            },
            {
                name: 'Select',
                /*
                i
                j
                min
                 */
                data : [-1, -1, -1]
            },
        ]
    };

/*
        COMPONENT METHODS
 */

    componentDidMount() {
        let maxValue = 50;
        let array = [];
        for (let i = 0; i < maxValue; i++) {
            array.push({
                value : i+1,
                selected : 0
            });
        }

        // this.scrambleIterative(array);

        this.setState({array});
        this.handleEvent = this.handleEvent.bind(this);
        setInterval(this.update,20);
    }

    render() {
        const {sorts, info, array} = this.state;
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
                <div className='info'>
                    <span>{info.name+ ' sort'}</span>
                    <span>{info.swaps+' swaps'}</span>
                    <span>{info.access+' array accesses'}</span>
                    <span>{info.comparisons+' comparisons'}</span>
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

/*
        VISUAL METHODS
 */

    getColor = (value, max) => {
        let p = ((value/max)*.9)+.1;
        return 'rgba(9,211,172,' + p + ')';
    };

    clearSelectedElements = () => {
        let {array} = this.state;
        for (let i = 0; i < array.length; i++) {
            array = this.setSelected(array, i, 0);
        }
        this.setState({array});
    };

    setSelected = (array, index, value) => {
        array[index].selected = value;
        return array;
    };

/*
        UPDATE METHODS
 */

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
                currentProcess.data[0] === 1
            );
        } else if (processID === 4) {
            /*
                data.main === array.length-1
             */
            r = (
              currentProcess.data[0] === array.length
            );
        } else if (processID === 5) {
            /*
                data.i === array.length
             */
            r = (
                currentProcess.data[0] === array.length-1
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
            this.shortBubbleSort(array, data);
        } else if (processID === 3) {
            this.quickSort(array, data);
        } else if (processID === 4) {
            this.insertSort(array, data);
        } else if (processID === 5) {
            this.selectSort(array,data);
        }
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
            const name = this.state.sorts[id].name;
            this.setState({
                processID: id,
                info : {
                    name,
                    swaps : 0,
                    access : 0,
                    comparisons : 0
                }
            });
        }
    };

/*
            FUNCTIONAL METHODS
 */

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

/*
        ARRAY HANDLING METHODS
 */

    swapValues = (array, indexA, indexB) => {
        let {info} = this.state;
        info.swaps += 1;
        this.setState({info});

        let valueA = this.getValue(array,indexA);
        array[indexA].value = this.getValue(array,indexB);
        array[indexB].value = valueA;

        return array;
    };

    pushIntoArray = (array, newIndex, oldIndex) => {
        if (newIndex === oldIndex)
            return array;

        let lo = Math.min(newIndex,oldIndex);
        let hi = Math.max(newIndex,oldIndex);

        for (let i = lo; i < hi; i++) {
            array = this.swapValues(array, i, i + 1);
        }

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

    saveChanges = (array, data) => {
        this.setState({array});
        let {processID, sorts} = this.state;
        sorts[processID].data = data;
        this.setState({sorts});
    };

    getValue = (array,index) => {
        let {info} = this.state;
        info.access += 1;
        this.setState({info});

        return array[index].value;
    };

    compareValues = (array, indexA, indexB) => {
        let {info} = this.state;
        info.comparisons += 1;
        this.setState({info});
        return this.getValue(array,indexA) > this.getValue(array,indexB);
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

/*
        SORTS
 */

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

        if (this.compareValues(array, index, index+1)) {
            swaps ++;
            array = this.swapValues(array,index,index+1);
        }

        data = [index, swaps, pass];
        this.saveChanges(array,data);
    };

    shortBubbleSort = (array, data) => {
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

        if (this.compareValues(array, index, index+1)) {
            swaps ++;
            array = this.swapValues(array,index,index+1);
        }

        data = [index, swaps, pass];
        this.saveChanges(array,data);
    };

    quickSort  = (array, data) => {
        if (data[0] === -1) {
            data[0] = [-1, -1, -1, -1, -1];
        }

        let [index, left, right, lo, hi] = data[0];
        this.clearSelectedElements();

        if (lo < 0) {
            lo = 0;
            hi = array.length;
        }

        if (hi-lo < 2) {
            data.splice(0,1);
            if (data.length === 0) {
                data.push(1);
            }
            this.saveChanges(array, data);
            return;
        }

        let pivot = 0;

        let prev = array.slice(0,lo);
        let current = array.slice(lo,hi);
        let next = array.slice(hi,array.length);

        if (index < 0) {
            index = 1;
            right = current.length-1;
        }

        this.setSelected(array, index+lo, 1);
        this.setSelected(array, pivot+lo, 3);
        this.setSelected(array, lo+1, 4);
        this.setSelected(array, right+lo, 4);
        this.setSelected(array, lo, 2);
        this.setSelected(array, hi-1, 2);
        if (left !== -1) {
            this.setSelected(array, lo+left, 3);
        }

        if (index <= right) {
            if (left === -1) {
                if (!this.compareValues(current, index, pivot)) {
                    index++;
                } else {
                    left = index;
                }
            } else {
                if (left === current.length - 1) {
                    left = -1;
                    right--;
                } else {
                    current = this.swapValues(current, left, left + 1);
                    left++;
                }
            }
        } else {
            if (pivot < index-1 && left === -1) {
                left = pivot;
            } else if (left < index-1 && left !== -1) {
                current = this.swapValues(current, left, left+1);
                left++;
            } else {
                left = -1;

                // setting up for next next cycle
                data.push( [-1, -1, -1, lo+index, hi] );

                // setting up for next cycle
                hi = lo+index-1;
                index = -1;
                right = -1;
            }
        }

        array = prev.concat(current,next);

        data[0] = [index, left, right, lo, hi];
        this.saveChanges(array, data);
    };

    insertSort = (array,data) => {
        let [main, alt] = data;
        this.clearSelectedElements();

        if (main === -1) {
            main = 1;
            alt = main;
        }

        array = this.setSelected(array, alt, 1);
        array = this.setSelected(array, main, 2);

        if (alt <= 0 || this.compareValues(array,alt,alt-1)) {
            main = main + 1;
            alt = main;
        } else {
            array = this.swapValues(array, alt, alt-1);
            alt += -1;
        }

        data = [main, alt];
        this.saveChanges(array,data);
    };

    selectSort = (array,data) => {
        let [i, j, min] = data;
        if (i === -1) {
            i = 0;
            j = i+1;
            min = i;
        }
        this.clearSelectedElements();

        this.setSelected(array,i,2);
        this.setSelected(array,j,1);
        this.setSelected(array,min,3);

        if (!this.compareValues(array,j,min)) {
            min = j;
        }
        j++;

        if (j === array.length) {
            if (min !== i) {
                array = this.swapValues(array,i,min);
            }
            i ++;
            min = i;
            j = i + 1;
        }

        data = [i, j, min];
        this.saveChanges(array,data);
    }
}
