import React from 'react';
import { Select } from 'antd';
import jsonp from 'fetch-jsonp';
import qs from 'qs';

const { Option } = Select;

let timeout : any;
let currentValue : any;

function fetch(value:any, callback:any) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    const str = qs.stringify({
      code: 'utf-8',
      q: value,
    });
    jsonp(`https://suggest.taobao.com/sug?${str}`)
      .then(response => response.json())
      .then(d => {
        if (currentValue === value) {
          const { result } = d;
          const data:any[] = [];
          result.forEach((r: any[]) => {
            data.push({
              value: r[0],
              text: r[0],
            });
          });
          callback(data);
        }
      });
  }

  timeout = setTimeout(fake, 300);
}

export class SearchInput extends React.Component <any> {
  state = {
    data: [],
    value: undefined,
  };

  handleSearch = (value: any) => {
    if (value) {
      fetch(value, (data: any) => this.setState({ data }));
    } else {
      this.setState({ data: [] });
    }
  };

  handleChange = (value: any) => {
    this.setState({ value });
  };

  render() {
    const options = this.state.data.map((d :any) => <Option key={d.value} value={d.value}>{d.text}</Option>);
    return (
      <Select
        showSearch
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
  }
}

