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
		form.setFieldsValue({
			condition:selectedItem.condition,
		})
		return <Dom
			form={form}
			selectedItem={selectedItem}
			canvasRef={canvasRef}
			onChange={onChange}
		></Dom>
	}
	return (
		<Scrollbar>
			<Form layout="horizontal" form={form} colon={false} onValuesChange={(changedValues, allValues) => {
				console.log(selectedItem,allValues)
				onChange(selectedItem, changedValues, allValues)
			}}
			>
				<Collapse style={{ padding: '10px' }} bordered={false}>
					{
						selectedItem && PropertyDefinition[selectedItem.type]?.condition ?
							renderComponent("ConditionProperty") : null
					}
				</Collapse>
			</Form>
		</Scrollbar>
	)
}
export default NodeProperties;
