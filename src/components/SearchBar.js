import React, { useState, useEffect, useContext }  from "react";

import SearchIcon from '@material-ui/icons/Search';
import { grey } from '@material-ui/core/colors';

import Select from 'react-select'
import Highlighter from 'react-highlight-words';


const filterOption = (option, inputValue) => {
    const { label, value } = option;
    // looking if other options with same label are matching inputValue

    if(value.includes(inputValue) > 0){
    	return value.includes(inputValue)
    }
    else{
    	return label.includes(inputValue)[0]
    }
  };

const SearchBar = (props) => {
	
	const Search = () => {return(<SearchIcon style={{ color: grey[400]}} />)}

	const [inputValue, setInputValue] = useState("")
	//let inputValue

	const optionRenderer = (option) => {
	  return (
	    <Highlighter
	      searchWords={[inputValue]}
	      textToHighlight={option.label}
	    />
	  );
	}

	const customStyles = {
	  option: (provided, state) => ({
	    ...provided,
	    padding: 6,
	    textTransform: 'uppercase',
	    fontSize: 11,
	    letterSpacing: 1.2
	  }),
	  control: () => ({
	    // none of react-select's styles are passed to <Control />
	    display: 'flex'
	  }),
		container: (base) => ({
		    ...base,
		    flex: 1
		  })
		,
		placeholder: (provided) => ({
		    ...provided,
		    padding: 6,
		    textTransform: 'uppercase',
		    fontSize: 11,
		    letterSpacing: 1.2,
		    marginY: 'auto'
		}),
		indicatorsContainer: () => ({
			border: 'none',
			alignItems: 'center',
  			alignSelf: 'stretch',
  			display: 'flex'
		}),
		indicatorSeparator: () => ({
			width: 4
		}),
	    singleValue: (provided, state) => {
	    const opacity = state.isDisabled ? 0.5 : 1;
	    const transition = 'opacity 300ms';

	    return { ...provided,
	    		 opacity,
	    		  transition,
	    		   textTransform: 'uppercase',
	    		   fontSize: 11,
	    			letterSpacing: 1.2,
	    			display: 'inline'
	    		    };
	  }
	}
	return(
		<Select formatOptionLabel={optionRenderer} filterOption={filterOption} options={inputValue.length == 0 ? [] : props.options} onInputChange={(value) => {setInputValue(value)}} onChange={props.onChange} components={{ DropdownIndicator: Search}} styles={customStyles} placeholder={props.placeholder == undefined ? "Search" : props.placeholder} />
		)
}

export default SearchBar