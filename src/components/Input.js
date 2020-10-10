import React, { useState, useEffect, useContext, forwardRef }  from "react";
import MaskedInput from 'react-text-mask'


import createNumberMask from 'text-mask-addons/dist/createNumberMask'

	const numberMask = createNumberMask({
	  prefix: '$',
  	  allowDecimal: true,
 // This will put the dollar sign at the end, with a space.
	})

	const percentMask = createNumberMask({
	  prefix: '',
	  suffix: '%',
  	  allowDecimal: true,
 // This will put the dollar sign at the end, with a space.
	})
	
const Input = forwardRef((props, ref) => {
	const labelCheck = props.label.toLowerCase()
	const type = props.type !== undefined ? props.type : labelCheck.includes('email') ? "email" : labelCheck.includes('password') ? "password" : "text"

	if(labelCheck.includes('zip')){
		return(
			<div className="flex my-4 w-full">
				<p className="my-auto pr-4 w-1/3 text-right">{props.label}:</p>
      			<MaskedInput placeholder={props.placeholder} disabled={props.disabled} mask={[/\d/, /\d/, /\d/, /\d/, /\d/]} className="border w-1/2" onChange={props.onChange} type="text" value={props.value} name={props.name} id={props.name}/>
			</div>
			)
	}
	else if(labelCheck.includes('phone')){
		return(
			<div className="flex my-4 w-full ">
				<p className="my-auto pr-4 w-1/3 text-right">{props.label}:</p>
				<MaskedInput placeholder={props.placeholder} disabled={props.disabled} mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} className="border w-1/2" onChange={props.onChange} type="text" value={props.value} name={props.name} id={props.name}/>
			</div>
			)
	}
	else if (type == "checkbox"){
		return(
			<div className="flex my-4 w-full">
				<p className="my-auto pr-4 w-1/3 text-right">{props.label}:</p>
				<input className={props.className} onFocus={props.onFocus} disabled={props.disabled} className="my-auto" onChange={props.onChange} type={type} checked={props.value} name={props.name} id={props.name}></input>
			</div>
			)
	}
	else if(props.mask == "$"){
		const dollarMask = createNumberMask({
		  prefix: '$',
	  	  allowDecimal: true,
	 // This will put the dollar sign at the end, with a space.
		})
		return(
			<div className="flex my-4 w-full ">
				<p className="my-auto pr-4 w-1/3 text-right">{props.label}:</p>
				<MaskedInput ref={ref} onClick={props.onClick} mask={dollarMask} placeholder={props.placeholder} disabled={props.disabled} className="border w-1/2" onChange={props.onChange} type="text" value={((typeof props.value == "string")) ? Number(props.value.replace('$', '')).toFixed(2) : ((props.value !== null) && (props.value !== undefined)) ? props.value.toFixed(2) : 0} name={props.name} id={props.name}/>
			</div>
			)
	}
	else if(props.mask == "%"){
		const percentMask = createNumberMask({
		  prefix: '',
		  suffix: '%',
	  	  allowDecimal: true,
	 // This will put the dollar sign at the end, with a space.
		})
		return(
			<div className="flex my-4 w-full ">
				<p className="my-auto pr-4 w-1/3 text-right">{props.label}:</p>
				<MaskedInput onClick={props.onClick} mask={percentMask} placeholder={props.placeholder} disabled={props.disabled} className="border w-1/2" onChange={props.onChange} type="text" value={props.value} name={props.name} id={props.name}/>
			</div>
			)
	}
	else if(props.mask == "creditCard"){
		return(
			<div className="flex my-4 w-full">
				<p className="my-auto pr-4 w-1/3 text-right">{props.label}:</p>
	  			<MaskedInput onClick={props.onClick} onBlur={props.onBlur} disabled={props.disabled} mask={[/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]} className="border w-1/2" onChange={props.onChange} type="text" value={props.value} name={props.name} id={props.name}/>
			</div>
			)
	}
	else{
		return(
			<div className="flex my-4 w-full">
				<p className="my-auto pr-4 w-1/3 text-right">{props.label}:</p>
				<input className={props.className} onKeyDown={props.onKeyDown} onClick={props.onClick} onBlur={props.onBlur} disabled={props.disabled} className="border w-1/2" onChange={props.onChange} type={type} value={props.value} name={props.name} id={props.name}></input>
			</div>
			)
	}
})

export default Input