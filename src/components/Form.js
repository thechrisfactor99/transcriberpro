import React, { useState, useEffect, useContext }  from "react";

import SavedAlert from './SavedAlert'

const Form = (props) => {
	return(
		<form onSubmit={props.onSubmit} className={props.className !== undefined ? props.className : "my-8 p-8 bg-white w-5/6 mx-auto "}>
			<h1 className="text-2xl">{props.title}</h1>
			<div className="flex">
				{props.children}
			</div>
			<SavedAlert saved={props.saved} label={props.savedLabel} />
			{props.hideButton ? null : <button className="gradient-btn">{props.buttonTitle}</button>}
		</form>
	)
}

export default Form
