import React, { Component , useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';

import Icon from '../../components/icon/Icon';
import { Flex } from '../../components/flex';
import i18next from 'i18next';
import {
	DownOutlined
} from '@ant-design/icons';
const filterTitle = function(obj){
	let icon;
	let title = obj.name ||  '组件'  || obj.type ;
	switch(obj.type){
		case "i-text":
			icon = 'map-marker-alt';
			break;
		case "textbox":
			icon = 'font';
			break;
		case "image":
			icon = 'image';
			title="图片";
			break;
		case "circle":
			icon = 'circle';
			break;
		case "polygon":
			icon = 'draw-polygon';
			break;
		case "iframe":
			icon = 'window-maximize';
			break;
		case "video":
			icon = 'video';
			break;
		case "svg":
			icon = 'bezier-curve';
			break;
		case "group":
			icon = 'bezier-curve';
			// title = '组合';
			break;
		case "element":
			icon = 'html5';
			prefix = 'fab';
			break;
		case "triangle":
		case "rect":
		case "line":
			icon = 'image';
			break;
		default :
			icon = 'image';
			// title = '组件';
		break;
	}
	return {
		icon : icon,
		title : title,
	}
}
const Items = (props) => {
	const { canvasRef, item ,obj ,editState ,onChange} = props;
	const { icon, title, idCropping, prefix } = item;
	return <Flex alignItems="center" style={{padding:'5px 0 5px 10px'}}>
		<Icon
			className="rde-canvas-list-item-icon"
			name={icon}
			size={1.5}
			style={{ marginLeft:'15px'}}
			prefix={prefix}
		/>
		<div  style={{marginLeft:'10px'}} className="rde-canvas-list-item-text">{title}</div>
		<Flex className="rde-canvas-list-item-actions"
			flex="1"
			justifyContent="flex-end"
		style={{display:editState == 'true' ? 'flex' : 'none'}}>
			<Button
				className="rde-action-btn"
				shape="circle"
				disabled={idCropping}
				onClick={e => {
					e.stopPropagation();
					onChange(obj, {
						locked:!obj.locked
					}, {})
				}}
			>
				<Icon name={ obj.locked?  'lock' : 'unlock'} />
			</Button>
			<Button
				className="rde-action-btn"
				shape="circle"
				disabled={idCropping}
				onClick={e => {
					e.stopPropagation();
					onChange(obj, {
						visible:!obj.visible
					}, {})
				}}
			>
				<Icon name={ obj.visible?  'eye' : 'eye-slash'} />
			</Button>
			<Button
				className="rde-action-btn"
				shape="circle"
				disabled={idCropping}
				onClick={e => {
					e.stopPropagation();
					canvasRef.handler.duplicateById(obj.id);
				}}
			>
				<Icon name="clone" />
			</Button>
			<Button
				className="rde-action-btn"
				shape="circle"
				disabled={idCropping}
				onClick={e => {
					e.stopPropagation();
					canvasRef.handler.removeById(obj.id);
				}}
			>
				<Icon name="trash" />
			</Button>
		</Flex>
	</Flex>
}
const Groups = (props) => {
	const { canvasRef, item ,obj ,editState , onChange} = props;
	const { icon, title, idCropping, prefix } = item;
	const [showState,setShowState]=useState(false);

	return <>
	<Flex alignItems="center" key={obj.id}  style={{padding:'5px 0 5px 0'}}  onClick={()=>{
		setShowState(!showState)
	}}>
		<DownOutlined style={{marginLeft:'10px'}}></DownOutlined>
		<Icon
			name="folder"
			size={1.5}
			style={{marginLeft:'5px'}}
			prefix={prefix}
		/>
		<div  style={{marginLeft:'10px'}} className="rde-canvas-list-item-text">{title}</div>
		<Flex className="rde-canvas-list-item-actions" flex="1" justifyContent="flex-end"
		style={{display:editState == 'true' ? 'flex' : 'none'}}>
			<Button
				className="rde-action-btn"
				shape="circle"
				disabled={idCropping}
				onClick={e => {
					e.stopPropagation();
					onChange(obj, {
						locked:!obj.locked
					}, {})
				}}
			>
				<Icon name={ obj.locked?  'lock' : 'unlock'} />
			</Button>
			<Button
				className="rde-action-btn"
				shape="circle"
				disabled={idCropping}
				onClick={e => {
					e.stopPropagation();
					onChange(obj, {
						visible:!obj.visible
					}, {})
				}}
			>
				<Icon name={ obj.visible?  'eye' : 'eye-slash'} />
			</Button>
			<Button
				className="rde-action-btn"
				shape="circle"
				disabled={idCropping}
				onClick={e => {
					e.stopPropagation();
					canvasRef.handler.duplicateById(obj.id);
				}}
			>
				<Icon name="clone" />
			</Button>
			<Button
				className="rde-action-btn"
				shape="circle"
				disabled={idCropping}
				onClick={e => {
					e.stopPropagation();
					canvasRef.handler.removeById(obj.id);
				}}
			>
				<Icon name="trash" />
			</Button>
		</Flex>
	</Flex>
	<div style={{marginLeft:'28px',display:showState ? 'block' : 'none'}}>
	{
		obj._objects ? obj._objects.map((item)=>{
			const {icon , title } = filterTitle(item);
			return <Objects
				obj={item}
				key={item.id}
				item={{
					icon: icon,
					title: title,
					idCropping: idCropping,
					prefix: prefix,
				}}
				editState={'false'}
				canvasRef={canvasRef}
			></Objects>;
		}) : null
	}
	</div>
	</>
}
const Objects = (props)=>{
	const { canvasRef, item ,obj ,editState ,onChange} = props;
	const { icon, title, idCropping, prefix } = item;
	return <>
		{
		obj._objects ? <Groups
			obj={obj}
			item={{
				icon: icon,
				title: title,
				idCropping: idCropping,
				prefix: prefix,
			}}
			editState={editState}
			canvasRef={canvasRef}
			onChange={onChange}
		/> :
			<Items
				obj={obj}
				item={{
					icon: icon,
					title: title,
					idCropping: idCropping,
					prefix: prefix,
				}}
				editState={editState}
				canvasRef={canvasRef}
				onChange={onChange}
			></Items>
	}
	</>
}
class ImageMapList extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
		selectedItem: PropTypes.object,
		onChange: PropTypes.function,
	};

	renderActions = () => {
		const { canvasRef } = this.props;
		const idCropping = canvasRef ? canvasRef.handler?.interactionMode === 'crop' : false;
		return (
			<Flex.Item className="rde-canvas-list-actions" flex="0 1 auto">
				<Flex>
					<Input.Search placeholder={i18next.t('placeholder.search-node')} />
				</Flex>
				<Flex justifyContent="space-between" alignItems="center">
					<Flex flex="1" justifyContent="center">
						<Button
							className="rde-action-btn"
							style={{ width: '100%', height: 30 }}
							disabled={idCropping}
							onClick={e => canvasRef.handler.bringForward()}
						>
							<Icon name="arrow-up" />
						</Button>
					</Flex>
					<Flex flex="1" justifyContent="center">
						<Button
							className="rde-action-btn"
							style={{ width: '100%', height: 30 }}
							disabled={idCropping}
							onClick={e => canvasRef.handler.sendBackwards()}
						>
							<Icon name="arrow-down" />
						</Button>
					</Flex>
				</Flex>
			</Flex.Item>
		);
	};

	renderItem = () => {
		const { canvasRef, selectedItem ,onChange } = this.props;
		const idCropping = canvasRef ? canvasRef.handler?.interactionMode === 'crop' : false;
		return canvasRef
			? canvasRef.canvas
				.getObjects()
				.filter(obj => {
					if (obj.id === 'workarea') {
						return false;
					}
					if (obj.id) {
						return true;
					}
					return false;
				})
				.reverse()
				.map(obj => {
					let prefix = 'fas';
					/**
					 * TIPS 在这里判断组件样式
					 */
					const {icon , title } = filterTitle(obj)
					let className = 'rde-canvas-list-item';
					if (selectedItem && selectedItem.id === obj.id) {
						className += ' selected-item';
					}
					return (
						<Flex.Item
							key={obj.id}
							className={className}
							flex="1"
							style={{ cursor: 'pointer' }}
							onClick={() => canvasRef.handler.select(obj)}
							onMouseDown={e => e.preventDefault()}
							onDoubleClick={e => {
								canvasRef.handler.zoomHandler.zoomToCenter();
							}}
						>
							<Objects
								onChange={onChange}
								obj={obj}
								item={{
									icon: icon,
									title: title,
									idCropping: idCropping,
									prefix: prefix,
								}}
								editState="true"
								canvasRef={canvasRef}
							></Objects>
						</Flex.Item>
					);
				})
			: null;
	};

	render() {
		return (
			<Flex style={{ height: '100%' }} flexDirection="column">
				{/* {this.renderActions()} */}
				<div className="rde-canvas-list-items">{this.renderItem()}</div>
			</Flex>
		);
	}
}

export default ImageMapList;
