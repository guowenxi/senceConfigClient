import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber, Radio } from 'antd';


import styled from 'styled-components';
import OpenNewWindow from './eventComponent/OpenNewWindow';
import SwitchWindow from './eventComponent/SwitchWindow';
import SendValue from './eventComponent/SendValue';
import StyleSetting from './eventComponent/StyleSetting';
import { eventConditionList } from '../../../settingList';


const config = (props) => {
	const { canvasRef, form, selectedItem, field ,idx ,onChange } = props;
	const { styles } = selectedItem;
	const [selValue, setSelValue] = useState(null);
	const [selPageValue, setSageSelValue] = useState(null);

	useEffect(()=>{
		const value = form.getFieldValue('condition');
		setSelValue(value[idx]?.eventCondition)
	},[])
	return (
		<>
			<Row style={{ marginTop: '10px' }}>
				<Col span={24}>
					<Form.Item name={[field.name, 'eventCondition']} label="事件行为" colon={false}>
						<Select onChange={(value) => {
							setSelValue(value)
						}}>
							{
							eventConditionList.map((item)=>{
								return <Select.Option value={item.id}>{item.name}</Select.Option>
							})
						}
						</Select>
					</Form.Item>
				</Col>
			</Row>
			{
				selValue == 0 ? <OpenNewWindow
					field={field}
					canvasRef={canvasRef}
					form={form}
					idx={idx}
					selectedItem={selectedItem}
				></OpenNewWindow> : null
			}
			{
				selValue == 1 ? <SwitchWindow
					field={field}
					canvasRef={canvasRef}
					form={form}
					idx={idx}
					selectedItem={selectedItem}
				></SwitchWindow> : null
			}
			{
				selValue == 5 ? <SendValue
					field={field}
					canvasRef={canvasRef}
					form={form}
					idx={idx}
					onChange={onChange}
					selectedItem={selectedItem}
				></SendValue> : null
			}
			{
				selValue == 6 ? <StyleSetting
					field={field}
					canvasRef={canvasRef}
					form={form}
					idx={idx}
					onChange={onChange}
					selectedItem={selectedItem}
				></StyleSetting> : null
			}

		</>


	);
}

export default config;
