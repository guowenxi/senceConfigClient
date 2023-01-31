import React, { Component,useState ,useEffect } from 'react';
import { Collapse, notification, Input, message , Popover  ,Modal  } from 'antd';
import classnames from 'classnames';
import { uuid } from 'uuidv4';
import styled from 'styled-components';
import { useDynamicList, useEventEmitter } from 'ahooks';

import { http } from '../http';
import { getUrlParams } from '../canvas/utils';
export let selectedPageSenceId = "";
import ObjectItem from './ObjectItem';
import { collectUpdatePointValue } from './event';

const ShowPageWrap = styled.div`
	position: relative;
	width:100%;
	height:100%;
    left:0;
    top:0;
    right:0;
    bottom:0;
	background-color:#121c24 ;
`;
const ShowPageEditor = (props) => {
	const { importJson } = props;
    const event$ = useEventEmitter();

	useEffect(()=>{
		console.log(importJson)
        //载入动态更新数据列表,准备随时更新
		collectUpdatePointValue(importJson,event$)
	},[importJson])
	return <ShowPageWrap>
		{
			importJson.map((item)=>{
				return <ObjectItem object={item} event$={event$}></ObjectItem>
			})
		}
	</ShowPageWrap>
}


export default ShowPageEditor;
