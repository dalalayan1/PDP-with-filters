/**
*
* FilterTypeBox
*
*/

import React from 'react';
import { browserHistory } from 'react-router';
// import styled from 'styled-components';


class FilterTypeBox extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      dropdown: this.props.dropdown,
      filterURL: {},
      checkForValues: []
    };
  }
  handleOnMouseEnter = () => {
    this.setState({ display: true })
  }
  handleOnMouseLeave = () => {
    this.setState({ display: false })
  }
  handleFilterOnChange(index, evt) {
    let dropdown = this.state.dropdown;
    if (dropdown[index].checked) {
      dropdown[index].checked = false
      if (dropdown[index].subFilter && dropdown[index].subFilter.length > 0) {
        dropdown[index].subFilter.map((val, ind) => {
          dropdown[index].subFilter[ind].checked =
            this.props.removeApiUrlNode(this.props.filterHeadingValue, dropdown[index].subFilter[ind].value)
        })
      }
      this.props.removeApiUrlNode(this.props.filterHeadingValue, dropdown[index].value)
    } else {
      dropdown[index].checked = true
      if (dropdown[index].subFilter && dropdown[index].subFilter.length > 0) {
        var subfilterVal = []
        this.state.filterURL[this.props.filterHeadingValue] = {}
        dropdown[index].subFilter.map((val, ind) => {
          dropdown[index].subFilter[ind].checked = true
          subfilterVal.push(dropdown[index].subFilter[ind].value)
          this.props.addApiUrlNode(this.props.filterHeadingValue, dropdown[index].subFilter[ind].value)
        })

        // this.props.addApiUrlNode(this.props.filterHeadingValue, dropdown[index].value, subfilterVal)
      } else {
        this.props.addApiUrlNode(this.props.filterHeadingValue, dropdown[index].value)
      }
    }
    this.setState({
      dropdown: dropdown
    }, this.props.handleFetchFilterData())
  }
  handleSubFilterOnChange = (index, ind, evt) => {
    let dropdown = this.state.dropdown;
    if (dropdown[index]["subFilter"][ind] && dropdown[index]["subFilter"][ind].checked) {
      dropdown[index]["subFilter"][ind].checked = false
      dropdown[index].checked = false
      this.props.removeApiUrlNode(this.props.filterHeadingValue, dropdown[index]["subFilter"][ind].value)
    } else {
      this.props.addApiUrlNode(this.props.filterHeadingValue, dropdown[index]["subFilter"][ind].value)
      dropdown[index]["subFilter"][ind].checked = true
      var allSubFilter = false
      for (var i = 0; i < dropdown[index]["subFilter"].length; i++) {
        if (!dropdown[index]["subFilter"][i].checked) {
          allSubFilter = false
        } else {
          allSubFilter = true
        }
      }
      if (allSubFilter) {
        dropdown[index].checked = true
      }

    }
    this.setState({
      dropdown: dropdown
    }, this.props.handleFetchFilterData())
    // dropdown[index].subFilter[ind] = false
    // if (evt.target.checked) {

    // } else {
    //   dropdown[index].checked = false
    //   this.setState({
    //     dropdown: dropdown
    //   })
    // }
  }
  componentWillMount() {
    if (this.props.filtersFromUrl && this.props.filtersFromUrl[this.props.boxHeading] && this.props.filtersFromUrl[this.props.boxHeading].length) {
      this.setState({
        checkForValues: this.props.filtersFromUrl[this.props.boxHeading]
      });
    }
  }
  componentDidMount() {
  }
  componentWillReceiveProps(newProps) {
    // if (newProps && newProps.allFilterData && newProps.allFilterData.data && newProps.allFilterData.data.filterList) {
    //   const filterList = newProps.allFilterData.data.filterList;
    //   var dropdown = [];
    //   for (var i = 0; i < filterList.length; i++) {
    //     if (filterList[i].type !== "range") {
    //       var data = {};
    //       data.label = filterList[i].label
    //       dropdown.push(data)
    //     }
    //   }
    // }
  }
  render() {
    const { boxHeading } = this.props;
    const { dropdown, checkForValues, display } = this.state;
    // console.log(this.state)
    // console.log(this.props)
    return (
      <li className="box-filter-wrapper" onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}>
        <a>{boxHeading}</a>
        {display && <ul className="box-filter-dropdown">
          {
            dropdown && dropdown.map((value, index) => {
              const matchForSelf = checkForValues
                &&
                checkForValues.length
                &&
                checkForValues.filter((eachValue) => eachValue === value.value)[0];
              const subFiltersArray = checkForValues
                &&
                checkForValues.length
                &&
                value.subFilter
                &&
                value.subFilter.length
                &&
                checkForValues.filter((eachValue, i) => eachValue === value.subFilter[i].value);
              const matched = matchForSelf || (subFiltersArray && value.subFilter && subFiltersArray.length === value.subFilter.length);
              const checkCheckedFilter = matched ? "checked" : (value.checked ? "checked" : "");
              return (
                <li key={index} className="cursorPointer">
                  <a className="cursorPointer">
                    <input className="cursorPointer" type="checkbox" id={"filter-" + index} onChange={this.handleFilterOnChange.bind(this, index)} checked={checkCheckedFilter} />
                    <label className="cursorPointer" htmlFor={"filter-" + index}>{value.label}</label>
                    {value.subFilter && value.subFilter.length > 0 &&
                      value.subFilter.map((val, ind) => {
                        let matchedInner = this.state.checkForValues && this.state.checkForValues.length && this.state.checkForValues.filter((value) => value === val.value)[0];
                        let checkChecked = matchedInner ? "checked" : (val.checked ? "checked" : "");
                        return (
                          <div key={"subfilter" + ind} className="cursorPointer subfilter-dropdown">
                            <span className="cursorPointer">
                              <input className="cursorPointer" type="checkbox" id={"subfilter-" + ind} onChange={this.handleSubFilterOnChange.bind(this, index, ind)} checked={checkChecked} />
                              <label className="cursorPointer" htmlFor={"subfilter-" + ind}>{val.text}</label>
                            </span>
                          </div>
                        )
                      })
                    }
                  </a>
                </li>
              )
            })
          }
        </ul>}
      </li>
    );
  }
}

FilterTypeBox.propTypes = {

};

export default FilterTypeBox;
