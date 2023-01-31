import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber, Radio, Button } from 'antd';
import sortBy from 'lodash/sortBy';

import styled from 'styled-components';
import { getFilterObject } from '../../../../canvas/utils/index';
import SendValueSetting from '../SendValueSetting';
import FontSetting from '../FontSetting';
import BackGroundSetting from '../BackGroundSetting';
import { sendTypeList } from '../../../../settingList';

import FileUpload from '../../../../components/common/FileUpload';


const StyleSetting = (props) => {
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

	function opacityFn(opacity) {
		return opacity != null ? opacity * 100 : 100;
	}
	return (
		<>
			{/* <Row className='rowTitle' >选择图片</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={24}>
					<Form.Item name={[field.name, 'changeBackgroundImage']}  colon={false}>
						<FileUpload></FileUpload>
					</Form.Item>
				</Col >
				<Col span={24}>
					<Form.Item name={[field.name, 'changeBackgroundImage']} label="动画" colon={false}>
						<Select>
							<Select.Option key='repeat' value='repeat'></Select.Option>
							<Select.Option key='no-repeat' value='no-repeat'></Select.Option>
							<Select.Option key='repeat-x' value='repeat-x'></Select.Option>
							<Select.Option key='repeat-y' value='repeat-y'></Select.Option>
						</Select>
					</Form.Item>
				</Col >
			</Row> */}
			<div className='subLine'></div>
			<Row className='rowTitle' >不透明度</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={15}>
					<Form.Item name={['opacity']} colon={false}>
						<Slider min={0} max={100}
							defaultValue={opacityFn(styles?.opacity)}
						/>
					</Form.Item>
				</Col>
				<Col span={2}></Col>
				<Col span={7}>
					<Form.Item name="opacity" colon={false}>
						<Input
							suffix={<span style={{ color: "#fff" }}>%</span>}
							defaultValue={opacityFn(styles?.opacity)}
						/>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<FontSetting
				canvasRef={canvasRef}
				form={form}
				filed={field}
				selectedItem={selectedItem}
				></FontSetting>
			</Row>
			<div className='subLine'></div>
			<Row className='rowTitle' >填充</Row>
			<BackGroundSetting
			canvasRef={canvasRef}
			form={form}
			filed={field}
			selectedItem={selectedItem}>
			</BackGroundSetting>
		</>
	);
}

export default StyleSetting;
