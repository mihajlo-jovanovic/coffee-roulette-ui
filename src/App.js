import React from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import './App.css';

class AutoComplete extends React.Component {
    state = {
	value: '',
	suggestions: []
    }

    renderSuggestion = suggestion => {
	return (
	    <div className="result">
		<div className="line">{suggestion.first_name}</div>
	</div>)
	
    }

    onChange = (event, { newValue }) => {
	this.setState ({ value: newValue })
    }

    onSuggestionsFetchRequested = ({value}) => {
	axios.post('http://localhost:9200/people/_search', {
	    query: {
		match: {
		    'first_name': value
		}
	    },
	    sort: ['_score']
	})
	    .then (res => {
		const results = res.data.hits.hits.map (h => h._source)
		this.setState ({ suggestions: results })
	    })}

    onSuggestionsClearRequested = () => {
	this.setState ({suggestions: []})
    }

    render() {
	const {value, suggestions} = this.state

	const inputProps = {
	    placeholder: 'person name',
	    value,
	    onChange: this.onChange
	}
	return (
	<div className="App">
	<h1>Search by persons name</h1>
		<Autosuggest
	    suggestions={suggestions}
	    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
	    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
	    getSuggestionValue={suggestion => suggestion.first_name + ' ' + suggestion.last_name + ' ' + suggestion.skill + ' ' + suggestion.phone}
	    renderSuggestion={this.renderSuggestion}
	    inputProps={inputProps}
		/>
    </div>
  );
}

}

export default AutoComplete;
