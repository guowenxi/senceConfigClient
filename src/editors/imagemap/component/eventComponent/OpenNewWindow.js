import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber, Radio } from 'antd';
import sortBy from 'lodash/sortBy';

import styled from 'styled-components';
import { windowTypeList } from '../../../../settingList';


const OpenNewWindow = (props) => {
	const { canvasRef, form, selectedItem, field } = props;
	const { styles } = selectedItem;
	const [state, setState] = useState(0);

	return (
		<Row style={{ marginTop: '10px' }}>
			<Col span={24}>
				<Form.Item name={[field.name, 'windowType']} label="内容" colon={false} onChange={(e) => {
					setState(e.target.value)
				}}>
					<Radio.Group name="windowType" defaultValue={0}>
						{
							windowTypeList.map((item) => {
								return <Radio value={item.id}>{item.name}</Radio>
							})
						}
					</Radio.Group>
				</Form.Item>
			</Col>
			{
				state == 0 ?
					<Col span={24}>
						<Form.Item name={[field.name, 'pageLink']} label="选择页面" colon={false}>
							<Select onChange={(value) => {
								setSelValue(value)
							}}>
								<Select.Option value='0'>打开新窗口</Select.Option>
							</Select>
						</Form.Item>
					</Col> :
					<Col span={24}>
						<Form.Item name={[field.name, 'pageLink']} label="链接地址" colon={false}>
							<Input
								defaultValue={styles?.pageLink} />
						</Form.Item>
					</Col>
			}
		</Row>
	);
}

export default OpenNewWindow;
