import React from 'react';
import _ from 'lodash';

const cx = React.addons.classSet;

class Controls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {yearFilter: () => true};
    }

    componentDidUpdate() {
        this.props.updateDataFilter((filters => ((d) => filters.yearFilter(d)))(this.state));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }

    render() {
        var getYears = (data) => _.keys(_.groupBy(data, d => d.submit_date.getFullYear())).map(Number);

        return (
            <div>
                <ControlRow data={this.props.data} getToggleNames={getYears} updateDataFilter={this.updateYearFilter} />
            </div>
        );
    }

    updateYearFilter = (year, reset) => {
        var filter = (d) => d.submit_date.getFullYear() == year;

        if (reset || !year) {
            filter = () => true;
        }

        this.setState({yearFilter: filter});
    }
}

class ControlRow extends React.Component {
    constructor(props) {
        super(props);

        var toggles = props.getToggleNames(props.data),
            values = _.zipObject(toggles, toggles.map(() => false));

        this.state = {toggleValues: values};
    }

    makePick = (picked, newState) => {
        var values = this.state.toggleValues;
        values = _.mapValues(values, (value, key) => newState && key == picked);

        this.props.updateDataFilter(picked, !newState);

        this.setState({toggleValues: values});
    }

    render() {
        var toggles = this.props.getToggleNames(this.props.data).map((name) => <Toggle label={name} name={name} key={'toggle'+name} value={this.state.toggleValues[name]} onClick={this.makePick} />);
        return (
            <div className="row">
                <div className="col-md-12">
                    {toggles}
                </div>
            </div>
        );
    }
}

class Toggle extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {value: false};
    }

    // componentWillReceiveProps(newProps) {
    //     this.setState({value: newProps.value});
    // }

    render() {
        var classNames = cx({
            'btn': true, 
            'btn-default': !this.props.value, 
            'btn-primary': this.props.value
        });

        return (
            <button className={classNames} onClick={this.handleClick}>
                {this.props.label}
            </button>
        );
    }

    handleClick = (event) => {
        this.props.onClick(this.props.name, !this.props.value);
    }
}

export default Controls;
