import React from 'react';
import { Form, Input, Radio, Row, Col, InputNumber } from 'antd';
import i18n from 'i18next';

export default {
	render(canvasRef, form, data) {
		if (!data) {
			return null;
		}
		const layout = data.layout || 'fixed';
		return (
			<React.Fragment>
				<Form.Item name="name" initialValue={data.name} label={i18n.t('common.name')} colon={false}>
					<Input />
				</Form.Item>
				<Form.Item name="layout" initialValue={layout} label={i18n.t('common.layout')} colon={false}>
					<Radio.Group size="small">
						<Radio.Button value="fixed">{i18n.t('common.fixed')}</Radio.Button>
						<Radio.Button value="responsive">{i18n.t('common.responsive')}</Radio.Button>
						<Radio.Button value="fullscreen">{i18n.t('common.fullscreen')}</Radio.Button>
					</Radio.Group>,
				</Form.Item>
				{layout === 'fixed' ? (
					<React.Fragment>
						<Row>
							<Col span={12}>
								<Form.Item name="width" initialValue={data.width * data.scaleX}  label={i18n.t('common.width')} colon={false}>
									<InputNumber />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name="height" initialValue={data.height * data.scaleY}  label={i18n.t('common.height')} colon={false}>
									<InputNumber />
								</Form.Item>
							</Col>
						</Row>
					</React.Fragment>
				) : null}
			</React.Fragment>
		);
	},
};
