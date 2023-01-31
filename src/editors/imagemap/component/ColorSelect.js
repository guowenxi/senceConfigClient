import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input } from 'antd';
import styled from 'styled-components';
import { SketchPicker, ChromePicker, BlockPicker } from 'react-color';
import { filterRGBA ,varcolorHex } from '../../../canvas/utils';
const WrapColorSelectBox = styled(Row)`
	position:relative;
	margin-top:10px;
`;
const FixedBox = styled.div`
	position:fixed;
	inset:0;
	z-index:60;
`;
const ASketchPicker = styled.div<{ position }>`
    position: absolute;
    top:  ${(props) => (props.position =='top' ? '0' : '30px')}; ;
    left: 0;
	.sketch-picker{
		width:240px !important;
		position:absolute !important;
		z-index:100;
		bottom:${(props) => (props.position =='top' ? '0' : 'none')}; ;
		top:${(props) => (props.position =='top' ? 'none' : '0')}; ;
	}
`;
const ColorSelect = ({ value, onChange , color , keyName ,defaultValue ,position}) => {
	const [displayFontColor, setDisplayFontColor] = useState(false);

	const filterA = (value)=>{
		if(value){
			const { r, g, b, a } = value;
			return `${a*100}`;
		}else{
			return 100;
		}
	}
	return (
		<WrapColorSelectBox>
			<Col span={3}>
				<div style={{
					padding: '1px',
					border: '6px solid #121c24',
					background: 'rgb(255, 255, 255)',
					borderRadius: '2px',
					boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
					display: 'inline-block',
					cursor: 'pointer',
				}} onClick={() => {
					setDisplayFontColor(!displayFontColor)
				}}>
					<div style={{
						width: '16px',
						height: '16px',
						background: filterRGBA(value)
					}} />
				</div>
			</Col>
			<Col span={1}></Col>
			<Col span={12}>
				<Input value={varcolorHex(value || defaultValue)} />
			</Col>
			<Col span={1}></Col>
			<Col span={7}>
				<Input value={filterA(value)} suffix={<span style={{ color: "#fff" }}>%</span>} />
			</Col>
			{
				displayFontColor ? <ASketchPicker position={position}>
					<FixedBox
						onClick={() => {
							setDisplayFontColor(!displayFontColor)
						}}
					></FixedBox>
					<SketchPicker
						colors={["transparent", "#ffffff", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"]}
						color={value || defaultValue}
						onChange={(color) => {
							onChange(color.rgb)
						}}
					></SketchPicker>
				</ASketchPicker> : null
			}
		</WrapColorSelectBox >
	)
}
export default ColorSelect;
