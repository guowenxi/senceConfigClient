import React, { Component ,useEffect  } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse } from 'antd';
import loadable from '@loadable/component';

import PropertyDefinition from './PropertyDefinition';
import Scrollbar from '../../../components/common/Scrollbar';

const { Panel } = Collapse;
const MapProperties = (props) => {
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
		form.setFieldsValue(selectedItem?.WrapSenceSetting || {})
		return <Dom
			form={form}
			selectedItem={selectedItem}
			canvasRef={canvasRef}
			onChange={onChange}
		></Dom>
	}
	return (
		<Scrollbar>
			<Form layout="horizontal">
				<Collapse bordered={false}>
					{Object.keys(PropertyDefinition.map).map(key => {
						return  PropertyDefinition['map'][key] ?
						renderComponent(PropertyDefinition['map'][key]?.component) : null
					})}
				</Collapse>
			</Form>
		</Scrollbar>
	);
}

export default MapProperties;

