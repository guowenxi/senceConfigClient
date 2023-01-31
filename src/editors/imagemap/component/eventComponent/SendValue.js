import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber, Radio, Button } from 'antd';
import sortBy from 'lodash/sortBy';

import styled from 'styled-components';
import { getFilterObject } from '../../../../canvas/utils/index';
import SendValueSetting from '../SendValueSetting';
import { sendTypeList } from '../../../../settingList';



const SendValue = (props) => {
	const { canvasRef, form, selectedItem, field, idx, onChange } = props;
	const { styles } = selectedItem;
	const [state, setState] = useState(0);
	const [inputList, setInputList] = useState([]);
	const [ModalState, setModalState] = useState(false);

	useEffect(() => {
		const a = getFilterObject(canvasRef, "input");
		setInputList(a);
		const value = form.getFieldValue('condition');
		setState(value[idx]?.sendType)
	}, [])
	return (
		<Row style={{ marginTop: '10px' }}>
			<Col span={24}>
				<Form.Item labelCol={{ span: 5 }} name={[field.name, 'sendType']} label="下发方式" colon={false}>
					<Select onChange={(value) => {
						setState(value)
					}}>
						{
							sendTypeList.map((item)=>{
								return <Select.Option value={item.id}>{item.name}</Select.Option>
							})
						}
					</Select>
				</Form.Item>
			</Col>
			{
				state == 1 ?
					<Col span={24}>
						<Form.Item labelCol={{ span: 5 }} name={[field.name, 'bindInputName']} label="输入框" colon={false}>
							<Select>
								{
									inputList?.map((item) => <Select.Option value={item.id}>{item.name || '未命名'}</Select.Option>
									)
								}
							</Select>
						</Form.Item>
					</Col> : null

			}
			<Col span={24}>
				<Form.Item labelCol={{ span: 5 }} name={[field.name, 'pageLink']} label="设备参数" colon={false}>
					<Button onClick={() => {
						setModalState(true)
					}}>设置</Button>
				</Form.Item>
			</Col>
			<SendValueSetting
				visible={ModalState}
				form={form}
				multiple={false}
				onChange={onChange}
				selectedItem={selectedItem.condition[idx]?.sendLinkList}
				eventState={(bol) => {
					setModalState(false);
					if (bol) {
						selectedItem.condition[idx].sendLinkList = bol;
						onChange(selectedItem, {
							condition: selectedItem.condition
						}, {
							condition: selectedItem.condition
						},)
					}
				}}
			>
			</SendValueSetting>
		</Row>
	);
}

export default SendValue;
