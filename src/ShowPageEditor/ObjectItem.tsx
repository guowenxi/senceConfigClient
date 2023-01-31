import React, { Component, useState, useEffect } from 'react';
import { Collapse, notification, Input, message, Popover, Modal, Button } from 'antd';
import classnames from 'classnames';
import { uuid } from 'uuidv4';
import styled from 'styled-components';
import { useDynamicList } from 'ahooks';

import { http } from '../http';
import { objectClick, collectUpdatePointValue, elementChange, elementListenChange } from './event';
import { getUrlParams } from '../canvas/utils';
export let selectedPageSenceId = "";

const BUTTON = styled.div`
	cursor: pointer;
	position: relative;
	&:hover{
		opacity:0.8 ;
	}
`;

const ObjectItem = (props) => {
	const { object, event$ } = props;
	useEffect(() => {
	}, [])
	event$.useSubscription(e => {
		for (var n = 0; n < e.length; n++) {
			if (e[n].id == object.deviceSetting?.selectedValue?.pointId) {

				elementChange(object, e[n]);
			}
			if (object.condition) {
				elementListenChange(object, e[n], object.condition)
			}
		}
	});

	//保存样式
	const pushStyles = (styles) => {
		styles.position = 'absolute';
		for (const key in styles) {
			if (key == 'innerHTML') {

			} else if (key.toUpperCase().indexOf('COLOR') != -1) {
				const { r, g, b, a } = styles[key];
				styles[key] =
					`rgba(${r},${g},${b},${a})`
			} else if (key === 'opacity') { } else if (Number(styles[key])) {
				styles[key] = styles[key] + 'px';
			}
		}
		return styles;
	}
	//过滤各种事件类型
	const filterEvent = (list, key, type) => {
		let _ = [];
		list.map((item, idx) => {
			try{
				if(item){
					if ( item[key] === type) {
						_.push(item)
					}
				}
			}catch(err){
				console.log(err)
			}
		})
		return _;
	}
	const renderDom = (object) => {
		let _dom = null;
		let one_click = filterEvent(object.condition, 'eventType', 0);
		switch (object.type) {
			case "image":
				_dom = <img
					id={object.id}
					src={object.styles.imageSrc}
					style={pushStyles(object.styles)}
				></img>
				break;
			case "frameImg":
				_dom = <img
					id={object.id}
					src={object.code.fixedSrc}
					style={pushStyles(object.styles)}
				></img>
				break;
			case "button":
				_dom = <BUTTON
					id={object.id}
					style={pushStyles(object.styles)}
					onClick={(e) => {
						const _dom = e.target;
						_dom.setAttribute('active', true);
						setTimeout(() => {
							_dom.removeAttribute('active')
						}, 400)
						objectClick(object, one_click)
					}}
					dangerouslySetInnerHTML={{
						__html: object.styles.innerHTML
					}}
				></BUTTON>
				// _dom =  <Button
				// id={object.id} 
				// style={pushStyles(object.styles)}
				// onClick={()=>{
				// 	objectClick(object,one_click)
				// }}
				// // dangerouslySetInnerHTML={{
				// // 	__html:object.styles.innerHTML
				// // }}
				// >{object.styles.innerHTML}</Button>
				break;
			case "textbox":
				_dom = <div
					id={object.id}
					style={pushStyles(object.styles)}
					onClick={() => {
						objectClick(object, one_click)
					}}
					dangerouslySetInnerHTML={{
						__html: object.styles.innerHTML
					}}
				></div>
				break;
			default:
				_dom = React.createElement(object.type, {
					style: pushStyles(object.styles),
					// innerHTML:object.styles.innerHTML,
					id: object.id,
				})
				break;
		}
		return _dom;
	}
	return <>
		{
			renderDom(object)
		}
	</>
}


export default ObjectItem;


