import React, { Component,useState ,useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, notification, Input, message , Popover  ,Modal  } from 'antd';
import classnames from 'classnames';
import i18n from 'i18next';


import { uuid } from 'uuidv4';
import styled from 'styled-components';
import { useDynamicList } from 'ahooks';
import axios from 'axios';

import { http } from './http';
import { getUrlParams } from './canvas/utils';
import ShowPageEditor from './ShowPageEditor';
export let selectedPageSenceId = "";


const PageMapItems = (props) => {
	const { canvasRef, selectedItem, onChange ,loadJson } = props;
	const [importJson, setImportJson] = useState([]);
	let _data = [];
	const filterData = (list)=>{
		list.map(function(item,idx){
			if(item.type === 'group'){
				filterData(item._objects || item.objects)
			}else if(item.superType === 'element'){
				_data.push(item)
			}
		 })
	}
	useEffect(()=>{
		http({
			method:'get',
			url:'/sencePage/getSencePageInfo',
			data:{
				senceId:getUrlParams('senceId')
			}
		}).then((res)=>{
			const json = JSON.parse(res.data.data.json);
			filterData(json)
			setImportJson(_data);
		})
	},[])
	return <ShowPageEditor
	importJson={importJson}
	>
	</ShowPageEditor>
}


export default PageMapItems;
