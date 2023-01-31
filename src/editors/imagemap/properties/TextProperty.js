import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber } from 'antd';
import sortBy from 'lodash/sortBy';
import ColorSelect from '../component/ColorSelect';
import CheckableTag from '../component/CheckableTag';
import BoraderSetting from '../component/BoraderSetting';
import FontSetting from '../component/FontSetting';
import BackGroundSetting from '../component/BackGroundSetting';

import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';
const { TextArea } = Input;

const fonts = Fonts.getFonts();

const config = (props) => {
	const { canvasRef, form, selectedItem } = props;
	const { styles } = selectedItem;
	return (
		<React.Fragment>
			<Row>
				<Col span={24}>
					<Form.Item name="innerHTML"  style={{borderBottomColor:'#121c24'}} label="内容" colon={false}>
						<TextArea
						defaultValue={styles?.innerHTML}
						autoSize={{ minRows:5, maxRows: 10 }}
						></TextArea>
					</Form.Item>
				</Col>
			</Row>
			<FontSetting
			canvasRef={canvasRef}
			form={form}
			selectedItem={selectedItem}
			></FontSetting>
			<div className='subLine'></div>
			<Row className='rowTitle' >填充</Row>
			<BackGroundSetting
			canvasRef={canvasRef}
			form={form}
			selectedItem={selectedItem}>
			</BackGroundSetting>
			<div className='subLine'></div>
			<Row className='rowTitle'>边框</Row>
			<BoraderSetting
			canvasRef={canvasRef}
			form={form}
			selectedItem={selectedItem}
			></BoraderSetting>
		</React.Fragment>
	);
}

export default config;
