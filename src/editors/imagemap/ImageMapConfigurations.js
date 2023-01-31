import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import classnames from 'classnames';

import NodeProperties from './properties/NodeProperties';
import GeneralProperties from './properties/GeneralProperties';
import DataProperties from './properties/DataProperties';
import ConditionProperties from './properties/ConditionProperties';
import AnimateProperties from './properties/AnimateProperties';
import MapProperties from './properties/MapProperties';
import Animations from './animations/Animations';
import Styles from './styles/Styles';
import DataSources from './datasources/DataSources';
import Icon from '../../components/icon/Icon';
import CommonButton from '../../components/common/CommonButton';

class ImageMapConfigurations extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
		selectedItem: PropTypes.object,
		onChange: PropTypes.func,
		onChangeAnimations: PropTypes.func,
		onChangeStyles: PropTypes.func,
		onChangeDataSources: PropTypes.func,
		animations: PropTypes.array,
		styles: PropTypes.array,
		dataSources: PropTypes.array,
	};

	state = {
		activeKey: 'general',
	};

	handlers = {
		onChangeTab: activeKey => {
			this.setState({
				activeKey,
			});
		},
		onCollapse: () => {
			this.setState({
				collapse: !this.state.collapse,
			});
		},
	};

	render() {
		const {
			onChange,
			selectedItem,
			canvasRef,
			animations,
			styles,
			dataSources,
			onChangeAnimations,
			onChangeStyles,
			onChangeDataSources,
		} = this.props;
		const { collapse, activeKey } = this.state;
		const { onChangeTab, onCollapse } = this.handlers;
		const className = classnames('rde-editor-configurations', {
			minimize: collapse,
		});
		return (
			<div className={className}>
				{/* <CommonButton
					className="rde-action-btn"
					shape="circle"
					icon={collapse ? 'angle-double-left' : 'angle-double-right'}
					onClick={onCollapse}
					style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}
				/> */}
				<Tabs
					tabPosition="top"
					activeKey={activeKey}
					onChange={onChangeTab}
					centered={true}
					style={{ width:'100%',height:'100%' }}
				>
					{/* 全局画布配置 */}
					{/* <Tabs.TabPane tab={"全局样式"} key="map">
						<MapProperties 
						onChange={onChange}
						selectedItem={selectedItem}
						canvasRef={canvasRef} />
					</Tabs.TabPane> */}
					{/* 选中组件配置 */}
					{/* 通用配置 */}
					<Tabs.TabPane tab={"样式"} key="general">
						<GeneralProperties onChange={onChange} selectedItem={selectedItem} canvasRef={canvasRef} />
						<NodeProperties onChange={onChange} selectedItem={selectedItem} canvasRef={canvasRef} />
					</Tabs.TabPane>
					{/* 定制配置 */}
					<Tabs.TabPane tab={"数据"} key="data">
						<DataProperties onChange={onChange} selectedItem={selectedItem} canvasRef={canvasRef} />
					</Tabs.TabPane>
					{/* 交互事件配置 */}
					<Tabs.TabPane tab={"事件"} key="condition">
						<ConditionProperties onChange={onChange} selectedItem={selectedItem} canvasRef={canvasRef} />
					</Tabs.TabPane>
					{/* 组件效果配置 */}
					{/* <Tabs.TabPane tab={<Icon name="table" />} key="animate">
						<AnimateProperties onChange={onChange} selectedItem={selectedItem} canvasRef={canvasRef} />
					</Tabs.TabPane> */}
					{/* 未知 */}
					{/* <Tabs.TabPane tab={<Icon name="vine" prefix="fab" />} key="animations">
						<Animations animations={animations} onChangeAnimations={onChangeAnimations} />
					</Tabs.TabPane> */}
					{/* 未知 */}
					{/* <Tabs.TabPane tab={<Icon name="star-half-alt" />} key="styles">
						<Styles styles={styles} onChangeStyles={onChangeStyles} />
					</Tabs.TabPane> */}
					{/* <Tabs.TabPane tab={<Icon name="table" />} key="datasources">
                        <DataSources ref={(c) => { this.dataSourcesRef = c; }} dataSources={dataSources} onChangeDataSources={onChangeDataSources} />
                    </Tabs.TabPane> */}
				</Tabs>
			</div>
		);
	}
}

export default ImageMapConfigurations;
