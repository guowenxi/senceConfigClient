import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber } from 'antd';
import sortBy from 'lodash/sortBy';
import ColorSelect from './ColorSelect';
import CheckableTag from './CheckableTag';
import BoraderSetting from './BoraderSetting';

import FileUpload from '../../../components/common/FileUpload';

import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';

const fonts = Fonts.getFonts();

const AFileUpload = styled(FileUpload)`
	position:relative;
	left:50%;
	transform:translateX(-50%);
`;

const config = (props) => {
	const { canvasRef, form, selectedItem , filed } = props;
	const { styles } = selectedItem;
	function setName(name){
		return filed ? [filed.name, name] : name;
	}

	return (
		<>
			<Row style={{ marginTop: '10px' }}>

			</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={24}>
					<Form.Item name={ setName('backgroundColor') } colon={false}>
						<ColorSelect
							color={styles.backgroundColor}
							keyName={'backgroundColor'}
						></ColorSelect>
					</Form.Item>
				</Col>
			</Row>
			<Row className='rowTitle' >图片</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={24}>
					<Form.Item name={ setName('backgroundImage') }  colon={false}>
						<FileUpload></FileUpload>
					</Form.Item>
				</Col >
				<Col span={24}>
					<Form.Item name={ setName('backgroundRepeat') } label="排布方式" colon={false}>
						<Select>
							<Select.Option key='repeat' value='repeat'></Select.Option>
							<Select.Option key='no-repeat' value='no-repeat'></Select.Option>
							<Select.Option key='repeat-x' value='repeat-x'></Select.Option>
							<Select.Option key='repeat-y' value='repeat-y'></Select.Option>
						</Select>
					</Form.Item>
				</Col >
			</Row>
		</>
	);
}

export default config;
