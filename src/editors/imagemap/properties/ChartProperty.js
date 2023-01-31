import React from 'react';
import { Form } from 'antd';

import ChartModal from '../../../components/common/ChartModal';

export default {
	render(canvasRef, form, data) {
		const { getFieldDecorator } = form;
		if (!data) {
			return null;
		}
		return (
			<Form.Item>
			</Form.Item>
		);
	},
};
