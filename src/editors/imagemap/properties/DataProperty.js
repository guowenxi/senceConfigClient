import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber ,Button  ,Modal } from 'antd';
import sortBy from 'lodash/sortBy';
import ColorSelect from '../component/ColorSelect';
import CheckableTag from '../component/CheckableTag';
import BoraderSetting from '../component/BoraderSetting';
import FontSetting from '../component/FontSetting';
import BackGroundSetting from '../component/BackGroundSetting';
import DeviceSettingModal from '../component/DeviceSettingModal';

import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';
const { TextArea } = Input;

const fonts = Fonts.getFonts();

const config = (props) => {
	const { canvasRef, form, selectedItem  ,onChange} = props;
	const { deviceSetting } = selectedItem;
	const [ModalState, setModalState] = useState(false);
	const [open, setOpen] = useState(false);
	return (
		<React.Fragment>
			<Row  style={{ marginTop: '10px' }}>
				<Col span={24}>
					<Form.Item 
					labelCol={{span:6}}
					label='数据类型' colon={false}>
						<Select maxTagTextLength={7} 
						onChange={(e,tar)=>{
							onChange(selectedItem, {
								deviceSetting:Object.assign(deviceSetting,{
									dataType:e
								})
							}, {})
						}}
						defaultValue={deviceSetting?.dataType}>
							<Select.Option key='0' value='0'>设备参数</Select.Option>
							<Select.Option key='1' value='1'>系统接口</Select.Option>
							<Select.Option key='2' value='2'>第三方接口</Select.Option>
							<Select.Option key='3' value='3'>api接口</Select.Option>
						</Select>
					</Form.Item>
				</Col>
			</Row>
			<div className='subLine'></div>
			<Row className='rowTitle'>选中参数</Row>
			<Row  style={{ marginTop: '10px' }}>
				<Col span={24}>
					<Form.Item name="name"
					labelCol={{span:6}}
					colon={false}>
						<Input
							defaultValue={deviceSetting?.selectedValue?.name}
							prefix={<Icon onClick={()=>{
								setModalState(true)
							}} name="link" color="#fff"></Icon>}
							/>
					</Form.Item>
				</Col>
			</Row>

			<DeviceSettingModal
			visible={ModalState}
			form={form}
			multiple={false}
			eventState={(bol)=>{
				setModalState(false)
				if(bol){
					onChange(selectedItem, {
						deviceSetting:Object.assign(deviceSetting,{
							selectedValue:{
								name:bol[0].name,
								id:bol[0].id,
								pointId:bol[0].pointId,
							}
						})
					}, {})
				}
			}}
			></DeviceSettingModal>
		</React.Fragment>
	);
}

export default config;
