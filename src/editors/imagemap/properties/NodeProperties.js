import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse, List } from 'antd';

import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../../components/common/Scrollbar';
import { Flex } from '../../../components/flex';
import loadable from '@loadable/component';
const { Panel } = Collapse;
const NodeProperties = (props) => {
	const {
		selectedItem,
		canvasRef,
		onChange,
		configName,
	} = props;
	const [form] = Form.useForm();
	useEffect(() => {
	}, [])
	const renderComponent = (type) => {
		const Dom = loadable(() => import(`./${type}`));
		form.resetFields();
		form.setFieldsValue(selectedItem.styles)
		return <Dom
			form={form}
			selectedItem={selectedItem}
			canvasRef={canvasRef}
			onChange={onChange}
		></Dom>
	}
	return (
		<>
			<Form layout="horizontal" form={form} colon={false} onValuesChange={(changedValues, allValues) => {
				console.log(selectedItem,changedValues)
				onChange(selectedItem, changedValues, allValues)
			}}
			>
				<Collapse  style={{padding:'20px 27px'}} bordered={false}>
					{
						selectedItem && PropertyDefinition[selectedItem.type] ?
							renderComponent(PropertyDefinition[selectedItem.type].config.component) :
							null
					}
				</Collapse>
			</Form>
		</>
	)
}
export default NodeProperties;
