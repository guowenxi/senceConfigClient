import React ,{ useState } from 'react';
import { Form, Input, Slider, Switch, Col, InputNumber, Row } from 'antd';
import i18n from 'i18next';
import Icon from '../../../components/icon/Icon';
const config = (props) => {
	const { canvasRef, form, selectedItem } = props;
	const { styles } = selectedItem;
	const [name, setName] = useState(selectedItem.name);
	function opacityFn(opacity) {
		return opacity != null ? opacity * 100 : 100;
	}
	return (
		<React.Fragment>
			<Input placeholder='(元件名称)' 
			value={name} 
			onChange={(e)=>{
				selectedItem.name = e.target.value;
				setName(e.target.value);
			}}/>
			<Row className='rowTitle'>位置尺寸</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={11}>
					<Form.Item labelCol={{ span: 4 }} name="width" label={"W"} colon={false}>
						<InputNumber controls={false} min={1} />
					</Form.Item>
				</Col>
				<Col span={2}></Col>
				<Col span={11}>
					<Form.Item labelCol={{ span: 4 }} name="height" label={"H"} colon={false}>
						<InputNumber controls={false} min={1} />
					</Form.Item>
				</Col>
			</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={11}>
					<Form.Item labelCol={{ span: 4 }} name="left" label={"X"} colon={false}>
						<InputNumber controls={false} />
					</Form.Item>
				</Col>
				<Col span={2}></Col>
				<Col span={11}>
					<Form.Item labelCol={{ span: 4 }} name="top" label={"Y"} colon={false}>
						<InputNumber controls={false} />
					</Form.Item>
				</Col>
			</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={11}>
					<Form.Item name="angle"
						labelCol={{ span: 4 }}
						label={<Icon name="font" />} colon={false} >
						<Input
							suffix={<span style={{ color: "#fff" }}>°</span>} />
					</Form.Item>
				</Col>
				<Col span={2}></Col>
				<Col span={11}>
					<Form.Item name="borderRadius"
						labelCol={{ span: 4 }}
						label={<Icon name="font" />} colon={false}>
						<Input
							defaultValue={styles?.borderRadius}
							suffix={<span style={{ color: "#fff" }}>px</span>} />
					</Form.Item>
				</Col>
			</Row>
			<div className='subLine'></div>
			<Row className='rowTitle' >不透明度</Row>
			<Row style={{ marginTop: '10px' }}>
				<Col span={15}>
					<Form.Item name="opacity" colon={false}>
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
			{/*
			<Row  style={{marginTop:'10px'}}>
				<Col span={12}>
					<Form.Item name="locked" label={"锁定"} colon={false}>
						<Switch  checked={selectedItem.locked}/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name="visible"  label={"是否可见"} colon={false}>
						<Switch  checked={selectedItem.visible}/>
					</Form.Item>
				</Col>
			</Row> */}


		</React.Fragment>
	);
}
export default config;
