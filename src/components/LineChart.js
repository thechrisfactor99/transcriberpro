import React, { useState, useEffect, useContext }  from "react";

import {MarkSeries, makeWidthFlexible, FlexibleXYPlot, FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, Hint} from 'react-vis';
//import '../node_modules/react-vis/dist/style.css';

export default function LineChart(props){

	const [currentPlot, setCurrentPlot] = useState(null)
	const [showNav, setShowNav] = useState(props.showNav)

	const handleMouseLeave = () =>{
		setCurrentPlot(null)
	}

	  useEffect(() => {
	  }, [props.showNav])

	return(
		<div className="w-full h-full">
			{props.showNav ?
			<FlexibleWidthXYPlot xType='ordinal' 
                height={300}
                margin={{bottom: 100}}>
                <MarkSeries data={[{ x: 0, y: 0 }]} style={{ display: 'none' }} />
                <XAxis tickLabelAngle={-45}/>
                <LineSeries animation
					onNearestX={(datapoint, event)=>{
					setCurrentPlot(datapoint)
					}}
					onMouseLeave={handleMouseLeave}
                	style={{stroke: 'lightblue', strokeWidth: 4}}
                    data={props.coordinates}/>
						{currentPlot && (
						<Hint value={currentPlot}>
						    <div className="px-4 py-2 text-white bg-blue-500 shadow-xl rounded-full">
						    	<div>{props.unit}{props.unit == "$" ? currentPlot.y.toFixed(2) : currentPlot.y}</div>
						    </div>
						</Hint>
						)}
            </FlexibleWidthXYPlot>
            : 
			<FlexibleWidthXYPlot xType='ordinal' 
                height={300}
                margin={{bottom: 100}}>
                <XAxis tickLabelAngle={-45}/>
                <LineSeries animation
					onNearestX={(datapoint, event)=>{
					setCurrentPlot(datapoint)
					}}
					onMouseLeave={handleMouseLeave}
                	style={{stroke: 'lightblue', strokeWidth: 4}}
                    data={props.coordinates}/>
						{currentPlot && (
						<Hint value={currentPlot}>
						    <div className="px-4 py-2 text-white bg-blue-500 shadow-xl rounded-full">
						    	<div>{props.unit}{currentPlot.y}</div>
						    </div>
						</Hint>
						)}
            </FlexibleWidthXYPlot>}
        </div>
		)
}
