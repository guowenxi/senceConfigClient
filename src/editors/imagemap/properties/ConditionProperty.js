import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber, Button, Space, Collapse, Modal } from 'antd';
import { Table } from 'antd';
import sortBy from 'lodash/sortBy';
import ColorSelect from '../component/ColorSelect';
import CheckableTag from '../component/CheckableTag';
import SetChangeValue from '../component/SetChangeValue';
import ConditionSetting from '../component/ConditionSetting';
import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';
const fonts = Fonts.getFonts();
const { Panel } = Collapse;

import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useDynamicList } from 'ahooks';
import { eventTypeList } from '../../../settingList';


const EmitList = (props) => {
	const { data, form, onChange, selectedItem, idx } = props;
	const { eventConditionList } = data;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { list, remove, getKey, insert, replace } = useDynamicList(eventConditionList || [{ name: "", value: "" }]);
	const RowList = (index, item) => {
		return <Row span={24} key={getKey(index)} style={{ marginBottom: 16 }}>
			<Col span={10}>
				<Select
					style={{ width: '100%' }}
					onChange={(e) => {
						replace(index, { name: e, value: item.value })
					}}
					placeholder="选择点位名"
					value={item.name}
				>
					<Select.Option value='0'>鼠标移入</Select.Option>
					<Select.Option value='1'>鼠标移出</Select.Option>
					<Select.Option value='2'>单击</Select.Option>
					<Select.Option value='3'>双击</Select.Option>
				</Select>
			</Col>
			<Col span={10}>
				<Input
					placeholder="值"
					onChange={(e) => {
						replace(index, { name: item.name, value: e.target.value })

					}}
					value={item.value}
				/>
			</Col>
			<Col span={4}>
				{list.length > 1 && (
					<MinusCircleOutlined
						style={{ marginLeft: 8 }}
						onClick={() => {
							remove(index);
						}}
					/>
				)}
				<PlusCircleOutlined
					style={{ marginLeft: 8 }}
					onClick={() => {
						insert(index + 1, '');
					}}
				/>
			</Col>
		</Row>
	};
	return <>
		<Button onClick={() => {
			setIsModalOpen(true)
		}}>编辑</Button>
		<Modal
			title="下发设置"
			visible={isModalOpen}
			okText="确定"
			okType=""
			cancelText="取消"
			onOk={() => {
				onChange(selectedItem, { "eventConditionList": list }, {}, idx);
				form.setFieldsValue({ eventConditionList: list })
				setIsModalOpen(false)
			}}
			onCancel={() => {
				setIsModalOpen(false)
			}}
		>
			<div>
				{list.map((ele, index) => RowList(index, ele))}
			</div>
		</Modal>
	</>
}



const config = (props) => {
	const { canvasRef, form, selectedItem, onChange } = props;
	const { styles, condition } = selectedItem;
	const [eventType, setEventType] = useState(0);
	const RightButton = (fields, idx, remove) => {
		return <Button
			onClick={(event) => {
				event.stopPropagation();
				remove(idx);
			}}
		>删除</Button>
	}
	return (
		<React.Fragment>
			<Form.List name="condition">
				{(fields, { add, remove }) => {
					return <div className='conditionBox'>
						<Col span={24}>
							<Button className='addBtn' onClick={() => {
								add({})
							}}>添加事件</Button>
						</Col>
						<Collapse defaultActiveKey={0}>
							{
								fields.map((field, idx) => {
									return (
										<Panel header={`事件${idx + 1}`} key={idx} extra={RightButton(fields, idx, remove)}>
											<Row>
												<Col span={24}>
													<Form.Item name={[field.name, 'eventType']} label="事件类型" colon={false}
													labelCol={{ span: 5 }}>
														<Select onChange={(e) => {
															setEventType(e)
														}}>
															{
																eventTypeList.map((item) => {
																	return <Select.Option

																		value={item.id}>{item.name}</Select.Option>
																})
															}
														</Select>
													</Form.Item>
												</Col>
												{
													condition[idx]?.eventType === 3 ?
														<SetChangeValue
															field={field}
															canvasRef={canvasRef}
															form={form}
															idx={idx}
															onChange={onChange}
															selectedItem={selectedItem}
														></SetChangeValue> : null
												}

												<Col span={24}>
													<ConditionSetting
														field={field}
														canvasRef={canvasRef}
														form={form}
														idx={idx}
														onChange={onChange}
														selectedItem={selectedItem}></ConditionSetting>
													{/* <EmitList
																selectedItem={selectedItem}
																form={form}
																idx={idx}
																data={condition[idx]}
																onChange={onChange} ></EmitList> */}
												</Col>
											</Row>
										</Panel>
									)
								})
							}
						</Collapse>
					</div>
				}}
			</Form.List>
		</React.Fragment>
	);
}




export default config;
