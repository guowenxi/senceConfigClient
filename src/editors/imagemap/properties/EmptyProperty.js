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
			</React.Fragment>
		);
}
export default config;
