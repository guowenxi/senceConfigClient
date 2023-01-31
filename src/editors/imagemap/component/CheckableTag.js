import React , { useState  ,useReducer ,useEffect}  from 'react';
import { Form, Slider, Col, Select, Tag ,Row ,Input} from 'antd';
import styled from 'styled-components';
import { SketchPicker ,ChromePicker ,BlockPicker  } from 'react-color';
import Icon from '../../../components/icon/Icon';

const WrapColorSelectBox = styled.div`
	position:relative;
	.block-picker {
		position:absolute !important;
		z-index:100 ;
	}
`;
const CheckableTag = ({ value, onChange ,name ,check ,color}) => {
	return (<Tag.CheckableTag checked={value === check[0]} onChange={(checked)=>{
		onChange(checked ? check[0] : check[1] )
	}} className="rde-action-tag">
		<Icon color={color} name={name} />
	</Tag.CheckableTag>
	   )
}
export default CheckableTag ;
