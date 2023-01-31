import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber, Button, Space, Collapse, Modal } from 'antd';
import { Table } from 'antd';
import sortBy from 'lodash/sortBy';
import ColorSelect from '../component/ColorSelect';
import CheckableTag from '../component/CheckableTag';

import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';
const fonts = Fonts.getFonts();
const { Panel } = Collapse;

import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useDynamicList } from 'ahooks';


const config = (props) => {
	const { canvasRef, form, selectedItem, onChange } = props;
	const { styles, condition } = selectedItem;
	const [selValue, setSelValue] = useState(null);
	const RightButton = (fields, idx) => {
		return <Button
			onClick={(event) => {
				event.stopPropagation();
				const _data = form.getFiledsValue();
				_data.splice(idx, 1)
				onChange(selectedItem, { "condition": _data }, { condition: _data });
				form.setFieldsValue({
					condition: _data
				})
			}}
		>删除</Button>
	}
	return (
		<React.Fragment>
			<Form.List name="condition">
				{(fields, { add, remove }) => {
					return <>
						<Col span={24}>
							<Button onClick={() => {
								add()
							}}>添加逻辑</Button>
						</Col>
						<Collapse>
							{
								fields.map((field, idx) => {
									return (
										<Panel header={`事件${idx + 1}`} key={idx} extra={RightButton(fields, idx)}>
											<Row>
												<Col span={24}>
													<Form.Item name={[field.name, 'eventType']} label="事件类型" colon={false}>
														<Select>
															<Select.Option value='0'>鼠标移入</Select.Option>
															<Select.Option value='1'>鼠标移出</Select.Option>
															<Select.Option value='2'>单击</Select.Option>
															<Select.Option value='3'>双击</Select.Option>
														</Select>
													</Form.Item>
												</Col>
												<Col span={24}>
													<Form.Item name={[field.name, 'eventCondition']} label="事件行为" colon={false}>
														<Select onChange={(value) => {
															setSelValue(value)
														}}>
															<Select.Option value='0'>下发</Select.Option>
															<Select.Option value='1'>更改属性</Select.Option>
														</Select>
													</Form.Item>
												</Col>
												{
													condition[idx]?.eventCondition == 0 ?
														<Col span={24}>
															<EmitList
																selectedItem={selectedItem}
																form={form}
																idx={idx}
																data={condition[idx]}
																onChange={onChange} ></EmitList>
														</Col>
														: null
												}
											</Row>
										</Panel>
									)
								})
							}
						</Collapse>
					</>
				}}
			</Form.List>
		</React.Fragment>
	);
}




export default config;
