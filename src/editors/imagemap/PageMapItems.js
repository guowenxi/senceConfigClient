import React, { Component,useState ,useEffect } from 'react';
import PropTypes from 'prop-types';
import { Collapse, notification, Input, message , Popover  ,Modal  } from 'antd';
import classnames from 'classnames';
import i18n from 'i18next';

import { Flex } from '../../components/flex';
import Icon from '../../components/icon/Icon';
import Scrollbar from '../../components/common/Scrollbar';
import CommonButton from '../../components/common/CommonButton';
import { SVGModal } from '../../components/common';
import { uuid } from 'uuidv4';
import styled from 'styled-components';
import { useDynamicList } from 'ahooks';
import axios from 'axios';
import ImageMapList from './ImageMapList';
import { http } from '../../http';
export let selectedPageSenceId = "";
const Title = styled.div`
  width:100%;
  height:30px;
  line-height:30px ;
  padding: 0 10px;
  cursor:default ;
`;

const PopoverInnerBox = styled.div`
color:#fff;
	display:flex ;
	flex-flow:column nowrap;
	cursor: pointer;
`;

const Main = styled(Scrollbar)`
  width:100%;
  flex:1;
`;

const BIcon = styled(Icon)`
	float:right;
	line-height: inherit;
	margin-left:10px;
	cursor: pointer;
`;
const PageItem = styled.div`
width:100%;
line-height:40px ;
padding: 0 10px 0 20px;
cursor:pointer ;
.name{
	width:65%;
	display:inline-block;
}
.blockIcon{
	display:none;
}
&:hover{
	.blockIcon{
		display:block;
	}
	background:rgba(0,0,0,0.3);
}

`;

const PageMapItems = (props) => {
	const { canvasRef, selectedItem, onChange ,loadJson } = props;
	const { list, push, remove, getKey, insert, replace ,resetList } = useDynamicList([
		{ senceName: '未命名', senceId: uuid() }
	]);
	const [selectPage, setSelectPage] = useState(list[0]);
	const [selectHoverPage, setSelectHoverPage] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(()=>{
		http({
			method:'get',
			url:'/sencePage/getSencePageList',
		}).then((res)=>{
			resetList(res.data.data)
		})
	},[])
	const PopoverContent = (i)=>{
		return  <PopoverInnerBox>
			<div>复制</div>
			<div>导出</div>
			<div onClick={(e)=>{
				e.stopPropagation();
				setSelectHoverPage(i)
				setIsModalOpen(true)
			}}>删除</div>
	  </PopoverInnerBox>
	}
	return <div className='rde-editor-items'>
		<Modal title="是否删除?" 
		visible={isModalOpen}
		okText={"确定"}
		cancelText={"取消"}
		onOk={()=>{
			http({
				method:'post',
				url:'/sencePage/deleteSencePage',
				data:{
					senceId:selectPage.senceId
				}
			}).then((res)=>{
				remove(selectHoverPage)
				setIsModalOpen(false)
			})
		}}
		onCancel={()=>{
			setIsModalOpen(false)
		}}>
			是否删除?(不可恢复)
		</Modal>

		<Title className="rde-editor-title">
			<span>页面</span>
			<BIcon name="download" />
			<BIcon className name="plus" onClick={() => {
				const newItem = { senceName: "未命名", senceId: uuid() , changeNameState:true };
				http({
					method:'post',
					url:'/sencePage/setSencePage',
					data:newItem
				}).then((res)=>{
					push(newItem);
				})
			}} />
		</Title>

		<Main className="rde-editor-main" style={{ maxHeight: '300px' }}>
			{
				list.map((item,i) => {
					return <PageItem key={item.senceId}
					className={selectPage.senceId == item.senceId ? 'checkedState' : ''}
					 onClick={()=>{
						if(item.changeNameState === true ) return ;
						selectedPageSenceId=item.senceId;
						setSelectPage(item);
						//加载地址
						loadJson(item)
					}}>
						<Icon name="file" style={{ marginRight: '10px' }} />
						{
							item.changeNameState ?
								<Input style={{width:'70%'}} value={item.senceName}
								 onChange={(e)=>{
									replace(i,Object.assign(item,{
										senceName:e.target.value
									}))
								}}
								onFocus={(e)=>{
									e.stopPropagation();
								}}
								 onBlur={(e)=>{
									http({
										method:'post',
										url:'/sencePage/updateSencePage',
										data:item
									}).then((res)=>{
										replace(i,Object.assign(item,{
											changeNameState:false
										}))
									})
								}}
								></Input>
								:
								<span className="name">{item.senceName}</span>
						}
						<BIcon className="blockIcon" name="edit" onClick={(e) => {
							e.stopPropagation();
							replace(i,Object.assign(item,{
								changeNameState:true
							}))
						}} />
						<Popover
						trigger="click"
						content={PopoverContent(i)}
						>
							<BIcon onClick={(e)=>{
								e.stopPropagation();
							}} className="blockIcon" name="cog" />
						</Popover>
					</PageItem>
				})
			}
		</Main>
		<Title className="rde-editor-title">
			<span>图层</span>
		</Title>
		<Main className="rde-editor-main">
			<ImageMapList canvasRef={canvasRef} onChange={onChange} selectedItem={selectedItem} />
		</Main>
	</div>
}


export default PageMapItems;
