import React from 'react';
import AceModal from '../../../components/ace/AceModal';
import { Form, Input, Slider, Switch, Col, InputNumber, Row } from 'antd';
import i18n from 'i18next';

export default {
	render(canvasRef, form, data) {
		if (!data) {
			return null;
		}
		return (
			<React.Fragment>
				<Row>
					<Col span={12}>
						<Form.Item label={"文字大小"} colon={false}>
							{getFieldDecorator('font-size', {
								rules: [
									{
										type: 'number',
										required: true,
										message: 'Please input fontSize',
										min: 1,
									},
								],
								initialValue: 16,
							})(<InputNumber min={1} />)}
						</Form.Item>
					</Col>
				</Row>
				<Form.Item>
				{getFieldDecorator('code', {
					rules: [
						{
							required: true,
							message: 'Please input code',
						},
					],
					initialValue: data.code,
				})(<AceModal form={form} code={data.code} />)}
			</Form.Item>
			</React.Fragment>

		);
	},
};
