import React, { useState, useEffect, useContext }  from "react";

import { Link } from "react-router-dom";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';

import SavedAlert from './SavedAlert'

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

const Table = (props) => {

	console.log(props.values)

	const [nValues, setNValues] = useState(props.values)
	console.log(nValues)

	function makeComparator(key, order='desc') {
	  return (a, b) => {
	    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0; 

	    const aVal = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
	    const bVal = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

	    let comparison = 0;
	    if (aVal > bVal) comparison = 1;
	    if (aVal < bVal) comparison = -1;

	    return order === 'desc' ? (comparison * -1) : comparison
	  };
	}

	const addRowCount = (values) => {
		let newValuesList = []
		let newValue
		let rowCount = 1
	  	for(let i=0; i<values.length; i++){
			newValue = {...values[i], rowId: rowCount}
			newValuesList.push(newValue)
			rowCount = rowCount + 1
		}

		//values = newValuesList
		return newValuesList
	}

	const [sortField, setSortField] = useState(props.sortField)
	const [sortOrder, setSortOrder] = useState(props.sortOrder)

	let customComponents = props.customComponents
	//let values = props.values != undefined ? sortOrder == "asc" ? props.values.sort(makeComparator(sortField, 'asc')) : props.values.sort(makeComparator(sortField, 'desc')) : []
	const [values, setValues] = useState(addRowCount(props.values.sort(makeComparator(sortField, sortOrder))))

	let numCols = props.columns.length
	let pathSuffix
	if((props.pathSuffix != null) && (props.pathSuffix != undefined)){
		pathSuffix = props.pathSuffix
	}
	else{
		pathSuffix = ""
	}

	const handleChangeSort = (col) => {
		let newSortOrder
		if(sortField == col){
			newSortOrder = sortOrder == 'desc' ? 'asc' : 'desc'
			setSortOrder(newSortOrder)
		}
		else{
			newSortOrder = sortOrder
		}
		setSortField(col)

		setValues(addRowCount(values.sort(makeComparator(col, newSortOrder))))
	}


	let listHeaders = props.columns.map(column => {
		return(
			<th key={column.value} id={column.value} className={`w-1/${numCols} px-4 pb-4 table-h`}><button onClick={() =>handleChangeSort(column.value)}>{column.column} {sortField == column.value ? sortOrder == 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon /> : <UnfoldMoreIcon />}</button></th>
			)
	})

	listHeaders.push(<th key="" className={`w-1/${numCols} px-4 pb-4 table-h text-center`}></th>)



	const listRows = values.map(row =>{
		const background = row.rowId % 2 == 1 ? "bg-gray-100" : ""

		let records = []
		let record
		let recordCount = 0
		let newValue
		if(props.fields == null){
			for(record in row){
				
				newValue = record.toLowerCase().includes('pay') ? row[record].toFixed(2) : row[record]

				if(((record == 'createdAt') || (record == 'updatedAt') || (record.toLowerCase().includes('date'))) && ((row[record] != null) && (row[record] != undefined))){
					newValue = row[record].split(':').splice(0,2).join(':').replace('T', ' ')
					//newValue = row[record].split('T')[0]
				}

				if((record != 'id') && (record != 'rowId')){
					records.push({name: record, value: newValue, link: ((recordCount == 0) && props.edit)})
				}
				recordCount++
			}
		}
		else{
			for(let i = 0; i < props.fields.length; i++){

				record = props.fields[i]

				newValue = record.toLowerCase().includes('pay') ? row[record].toFixed(2) : row[record]


				if(((record == 'createdAt') || (record == 'updatedAt') || (record.toLowerCase().includes('date'))) && ((row[record] != null) && (row[record] != undefined))){
					newValue = row[record].split(':').splice(0,2).join(':').replace('T', ' ')
					//newValue = row[record].split('T')[0]
				}
				if((record != 'id') && (record != 'rowId')){
					if(customComponents != undefined){
						if(customComponents[record] != undefined){
							records.push({name: record, value: customComponents[record](row[record]), link: ((recordCount == 0) && props.edit)})
						}
						else{
							records.push({name: record, value: newValue, link: ((recordCount == 0) && props.edit)})
						}
					}
					else{
						records.push({name: record, value: newValue, link: ((recordCount == 0) && props.edit)})
					} 
				}
				recordCount++
			}	
		}

		let listRecords = records.map(record => {
			if(typeof record.value == "boolean"){
				return(
					<td key={record.name} className="p-4 text-left"><input onChange={props.handlers[record['name']]} type="checkbox" name={row.name} id={row.id} checked={record.value ? true : false}></input></td>
					)
			}
			else if(record.link){
				return(
					<td key={record.name} className={`w-1/${numCols} p-4 text-left`}>
						<span className="text-right ">
							<Link className="text-blue-700" to={`/${props.pathPrefix}/${row.id}/${pathSuffix}`}>
								{record.value}
							</Link>
						</span>
					</td>
					)
			}
			else{
				return(
					<td key={record.name} className={`w-1/${numCols} p-4 text-left`}>{record.value}</td>
					)
			}
		})

		listRecords.push(
			<td key={""} className={`w-1/${numCols} p-4 text-left`}>
				<span className="text-right  flex">
					{props.edit ? <Link to={`/${props.pathPrefix}/${row.id}/${pathSuffix}`}>
						<CreateIcon className="table-icon"/>
					</Link> : null}
					{props.delete ? <button className="text-right" onClick={() => props.handleDelete(row.id)}><DeleteIcon className="table-icon"/></button> : null}

				</span>
			</td>
			)


		return(
			<tr key={row.id} className={background}>
				{listRecords}
			</tr>
		)

	})

	return(
        <div className="card text-left">
			<SavedAlert saved={props.saved} label={props.savedLabel} />
			<table className="w-full bg-white rounded-sm table-border">	
				<thead>
					<tr>
						{listHeaders}
					</tr>
				</thead>
			<tbody>
				{listRows}
			</tbody>
			{props.children}
		</table>
		</div>
		)
	}

export default Table 
