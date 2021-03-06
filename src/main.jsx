import 'babelify/polyfill';
import React from 'react';
import _ from'lodash';
import d3 from 'd3';

import {Title, Description} from './meta';
import {Histogram} from './drawing';
import Controls from './controls';

class H1BGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {rawData: [], dataFilter: () => true};
    }
    componentWillMount() {
        this.loadRawData();
    }
    
    loadRawData() {
        var dateFormat = d3.time.format("%m/%d/%Y");
        d3.csv(this.props.url)
            .row(function(d) {
                if (!d['base salary']) {
                    return null;
                }

                return { employer: d.employer,
                    submit_date: dateFormat.parse(d['submit date']), 
                    start_date: dateFormat.parse(d['start date']), 
                    case_status: d['case status'],
                    job_title: d['job title'],
                    base_salary: Number(d['base salary']),
                    salary_to: d['salary to'] ? Number(d['salary to']) : null, 
                    city: d.city,
                    state: d.state };
            })
            .get(function(error, rows) {
                if (error) {
                    console.error(error);
                    console.error(error.stack);
                } else {
                    this.setState({rawData: rows});
                }
            }.bind(this));
    }

    render() {
        if (!this.state.rawData.length) {
            return (<h2>Loading data about 81,000 H1B visas in the software industry</h2>);
        }

        var params = {
            bins: 20,
            width: 500,
            height: 500,
            axisMargin: 83,
            topMargin: 10,
            bottomMargin: 5,
            value: function (d) { return d.base_salary; }
        }, fullWidth = 700;

        var filteredData = this.state.rawData.filter(this.state.dataFilter);

        return (
            <div>
                <Title data={filteredData} />
                <Description data={filteredData} allData={this.state.rawData} />
                <div className="row">
                    <div className="col-md-12">
                        <svg width="700" height="500">
                            <Histogram {...params} data={filteredData} />
                        </svg>
                    </div>
                </div>
                <Controls data={this.state.rawData} updateDataFilter={this.updateDataFilter} />
            </div>
        ); 
    }

    updateDataFilter = (filter) => {
        this.setState({dataFilter: filter});
    }
};

React.render(
    <H1BGraph url="data/h1bs.csv" />,
    document.querySelectorAll('.h1bgraph')[0]
);
