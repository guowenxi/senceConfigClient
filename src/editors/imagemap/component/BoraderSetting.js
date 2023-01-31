import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber } from 'antd';
import sortBy from 'lodash/sortBy';
import ColorSelect from './ColorSelect';
import CheckableTag from './CheckableTag';
import BoraderSetting from './BoraderSetting';

import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';

const fonts = Fonts.getFonts();

const config = (props) => {
	const { canvasRef, form, selectedItem } = props;
	const { styles } = selectedItem;
	return (
		<>
			<Row style={{marginTop:'10px'}}>
				<Col span={11}>
					<Form.Item name="borderWidth" colon={false}>
						<Input
						suffix={<span style={{color:"#fff"}}>px</span>}
						/>
					</Form.Item>
				</Col>
				<Col span={2}></Col>
				<Col span={11}>
					<Form.Item name="borderStyle" colon={false}>
						<Select>
							<Select.Option key='none' value='none'>无</Select.Option>
							<Select.Option key='solid' value='solid'>实线</Select.Option>
							<Select.Option key='dashed' value='dashed'>点划线</Select.Option>
							<Select.Option key='dotted' value='dotted'>点线</Select.Option>
							<Select.Option key='double' value='double'>双实线</Select.Option>
							{/* <Select.Option key='groove' value='groove'></Select.Option> */}
						</Select>
					</Form.Item>
				</Col>
			</Row>
			<Row >
				<Col span={24}>
					<Form.Item name="borderColor" colon={false}>
						<ColorSelect
							position="top"
							selectedItem={selectedItem}
							keyName={'borderColor'}
						></ColorSelect>
					</Form.Item>
				</Col>
			</Row>
		</>


	);
}

export default config;
