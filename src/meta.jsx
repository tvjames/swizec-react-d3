import React from 'react';
import d3 from 'd3';
import _ from 'lodash';
// import States from './states';

const MetaEnhancer = (Component) => class extends React.Component {
    constructor(props) {
        super(props);
    }

    getYears = (data) => {
        data || (data = this.props.data);

        return _.keys(_.groupBy(data, d => d.submit_date.getFullYear()));
    }

    getFormatter = (data) => {
        data || (data = this.props.data);

        return d3.scale.linear()
            .domain(d3.extent(data, d => d.base_salary))
            .tickFormat();
    }

    getAllDataByYear = (year, data) => {
        data || (data = this.props.allData);

        return data.filter(d => d.submit_date.getFullYear() == year);
    }

    render() {
        return (<Component {...this.props} getYears={this.getYears} getFormatter={this.getFormatter} getAllDataByYear={this.getAllDataByYear} />);
    }
}

class Title extends React.Component {
    constructor(props) {
        super(props);
    }

    getYearFragment() {
        var years = this.props.getYears();

        if (years.length == 1) {
            return `in ${years[0]}`;
        }
        return '';
    }

    render() {
        var mean = d3.mean(this.props.data, d => d.base_salary), 
            format = this.props.getFormatter(),
            fragment = this.getYearFragment();

        return (
            <h2>H1B workers in the software industry {fragment.length ? 'made' : 'make'} ${format(mean)}/year {fragment}</h2>
        );
    }
}

class Description extends React.Component {
    constructor(props) {
        super(props);
    }

    getYearFragment() {
        var years = this.props.getYears();

        if (years.length == 1) {
            return `In ${years[0]}`;
        }
        return '';
    }

    getPreviousYearFragment() {
        var years = this.props.getYears().map(Number);

        if (years.length == 1 && years[0] != 2012) {
            let year = years[0];
            let previous = this.props.getAllDataByYear(year-1);
            let percent = ((1-previous.length/this.props.data.length)*100).toFixed();

            return `, ${Math.abs(percent)}% ${percent > 0 ? 'more' : 'less'} than the year before`;
        }
        return '';
    }

    render() {
        var mean = d3.mean(this.props.data, d => d.base_salary), 
            deviation = d3.deviation(this.props.data, d => d.base_salary),
            formatter = this.props.getFormatter(),
            fragment = this.getYearFragment();

        return (
            <p className="lead">
                {fragment.length ? fragment : "Since 2012"} the US software industry {fragment.length ? "gave" : "has given"} jobs to {formatter(this.props.data.length)} foreign nationals{this.getPreviousYearFragment()}. Most of them made between ${formatter(mean-deviation)} and ${formatter(mean+deviation)} per year.</p>
        );
    }
}

const EnhancedTitle = MetaEnhancer(Title);
const EnhancedDescription = MetaEnhancer(Description);

export {
    EnhancedTitle as Title,
    EnhancedDescription as Description,
};
