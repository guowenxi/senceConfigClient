import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber, Radio } from 'antd';
import sortBy from 'lodash/sortBy';

import styled from 'styled-components';


const SwitchWindow = (props) => {
	const { canvasRef, form, selectedItem, field } = props;
	const { styles } = selectedItem;
	const [state, setState] = useState(0);

	return (
		<Row style={{ marginTop: '10px' }}>
			<Col span={24}>
				<Form.Item name={[field.name, 'pageLink']} label="选择页面" colon={false}>
						<Select onChange={(value) => {
						setState(value)
					}}>
						<Select.Option value='0'>打开新窗口</Select.Option>
					</Select>
				</Form.Item>
			</Col>
		</Row>
	);
}

export default SwitchWindow;
