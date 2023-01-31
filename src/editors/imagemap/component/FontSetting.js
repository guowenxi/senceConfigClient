import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber } from 'antd';
import sortBy from 'lodash/sortBy';
import ColorSelect from './ColorSelect';
import CheckableTag from './CheckableTag';
import BoraderSetting from './BoraderSetting';

import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';
import FontSizes from '../../../components/font/fontSizes';

const fonts = Fonts.getFonts();
const fontSizes = FontSizes.getFontSize();

const config = (props) => {
	const { canvasRef, form, selectedItem ,filed } = props;
	const { styles } = selectedItem;
	function setName(name){
		return filed ? [filed.name, name] : name;
	}
	return (
		<>
			<Row className='rowTitle' >文本</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={11}>
					<Form.Item name={setName('lineHeight')} label={<Icon name="text-height" />} colon={false}>
						<Input
							defaultValue={styles?.lineHeight}
							suffix={<span style={{ color: "#fff" }}>px</span>} />
					</Form.Item>
				</Col>
				<Col span={2}></Col>
				<Col span={11}>
					<Form.Item name={setName('letterSpacing')} label={<Icon name="text-width" />} colon={false}>
						<Input
							defaultValue={styles?.letterSpacing}
							suffix={<span style={{ color: "#fff" }}>px</span>} />
					</Form.Item>
				</Col>
			</Row>
			<Row style={{ marginTop: '10px',width:'100%' }}>
				<Col span={4}>
					<Form.Item name= {setName('fontWeight')} >
						<CheckableTag name="bold" color="#fff" check={['bold', 'normal']}></CheckableTag>
					</Form.Item>
				</Col>
				<Col span={4}>
					<Form.Item name={setName('fontStyle')}  >
						<CheckableTag name="italic" color="#fff" check={['italic', 'normal']}></CheckableTag>
					</Form.Item>
				</Col>
				<Col span={4}>
					<Form.Item name={setName('strikethrough')} >
						<CheckableTag name="strikethrough" color="#fff" check={['line-through', 'none']}></CheckableTag>
					</Form.Item>
				</Col>
				<Col span={4}>
					<Form.Item name= {setName('textDecoration')}  >
						<CheckableTag name="underline" color="#fff" check={['underline', 'none']}></CheckableTag>
					</Form.Item>
				</Col>
			</Row>
			<Row style={{ marginTop: '10px',width:'100%' }}>
				<Col span={4}>
					<Form.Item name={setName('textAlign')} >
						<CheckableTag name="align-left" color="#fff" check={['left', 'initial']}></CheckableTag>
					</Form.Item>
				</Col>
				<Col span={4}>
					<Form.Item name={setName('textAlign')}>
						<CheckableTag name="align-center" color="#fff" check={['center', 'initial']}></CheckableTag>
					</Form.Item>
				</Col>
				<Col span={4}>
					<Form.Item name={setName('textAlign')}>
						<CheckableTag name="align-right" color="#fff" check={['right', 'initial']}></CheckableTag>
					</Form.Item>
				</Col>
				<Col span={4}>
					<Form.Item name={setName('textAlign')} >
						<CheckableTag name="align-justify" color="#fff" check={['justify', 'initial']}></CheckableTag>
					</Form.Item>
				</Col>
			</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={16}>
					<Form.Item name= {setName('fontFamily')}
						labelCol={{ span: 4 }}
						label={<Icon name="font" />} colon={false}>
						<Select defaultValue={'Arial'} maxTagTextLength={7}>
							{Object.keys(fonts).map(font => {
								return (
									<Select.OptGroup key={font} label={font.toUpperCase()}>
										{sortBy(fonts[font], ['name']).map(f => (
											<Select.Option key={f.name} value={f.name}>
												{f.name}
											</Select.Option>
										))}
									</Select.OptGroup>
								);
							})}
						</Select>
					</Form.Item>
				</Col>
				<Col span={2}></Col>
				<Col span={6}>
					<Form.Item name={setName('fontSize')}  colon={false}>
						<Select defaultValue={'12'} suffixIcon={<span style={{ color: "#fff" }}>px</span>}>
							{fontSizes['px'].map(f => {
								return (
									<Select.Option key={f.name} value={f.name}>
										{f.name}
									</Select.Option>
								);
							})}
						</Select>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name={setName('color')} colon={false}>
						<ColorSelect
							defaultValue={styles.color}
							selectedItem={selectedItem}
							keyName={'color'}
						></ColorSelect>
					</Form.Item>
				</Col>

			</Row>
			
		</>
	);
}

export default config;
