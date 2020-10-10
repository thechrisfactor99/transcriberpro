import React, { useState, useEffect, useContext }  from "react";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { green } from '@material-ui/core/colors';

const SavedAlert = (props) => {
	return props.saved ? <div className=" my-4 text-green-700 flex content-center"><div className="px-2">{props.label}</div> <CheckCircleOutlineIcon style={{ color: green[600]}} /></div> : null
}

export default SavedAlert