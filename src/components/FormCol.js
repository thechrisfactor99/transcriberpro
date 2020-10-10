import React, { useState, useEffect, useContext }  from "react";

const FormCol = (props) => {
	return(
		<div className="w-1/2 flex flex-col">
			{props.children}
		</div>
	)
}

export default FormCol