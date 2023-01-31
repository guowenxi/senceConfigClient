import React from 'react';
import { Form, Radio  ,Row ,Col ,InputNumber ,Select } from 'antd';
import i18n from 'i18next';

import UrlModal from '../../../components/common/UrlModal';
import FileUpload from '../../../components/common/FileUpload';
import ColorSelect from '../component/ColorSelect';
import CheckableTag from '../component/CheckableTag';
import BoraderSetting from '../component/BoraderSetting';

const config = (props) => {
	const { canvasRef, form, selectedItem } = props;
	const { styles } = selectedItem;
	return (
		<React.Fragment>
			<Row>
			<div className='subLine'></div>
			<Form.Item name="imageSrc"  label="选择图片" colon={false}>
					<FileUpload></FileUpload>
			</Form.Item>
			</Row>
			<div className='subLine'></div>
			<Row className='rowTitle' >边框</Row>
			<BoraderSetting
			canvasRef={canvasRef}
			form={form}
			selectedItem={selectedItem}
			></BoraderSetting>

			</React.Fragment>
		);
}
export default config;
