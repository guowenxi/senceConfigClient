import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse, List } from 'antd';

import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../../components/common/Scrollbar';
import { Flex } from '../../../components/flex';
import loadable from '@loadable/component';
const { Panel } = Collapse;
const GeneralProperties = (props)=>{
	const { 
		selectedItem,
		canvasRef,
		onChange,
		configName,
	}  = props;
	const [form] =  Form.useForm();
	const  renderComponent = (type)=>{
		const Dom = loadable(() => import(`./${type}`));
		form.resetFields();
		form.setFieldsValue({
			styles:{
				...selectedItem.styles,
				opacity:selectedItem.opacity || 1,
			},
			left:selectedItem.left,
			top:selectedItem.top,
			width:parseInt(selectedItem.width * selectedItem.scaleX, 10),
			height:parseInt(selectedItem.height * selectedItem.scaleY, 10),
		})
		return <Dom
		form={form}
		selectedItem={selectedItem}
		canvasRef={canvasRef}
		onChange={onChange}
		></Dom>
	}
	return (
		<>
		<Form layout="horizontal" form={form} colon={false} onValuesChange={(changedValues,allValues)=>{
			console.log(selectedItem)
			onChange(selectedItem, changedValues, allValues)
		}}
		>
			<Collapse  style={{padding:'20px 27px'}}  bordered={false}>
				{
				selectedItem && PropertyDefinition[selectedItem.type] ?
				 (
					renderComponent(PropertyDefinition[selectedItem.type].general.component)
				) : null}
			</Collapse>
		</Form>
	</>
	)
}
export default GeneralProperties;
