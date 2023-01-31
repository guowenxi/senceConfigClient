import React, { Component } from 'react';
import { Flex } from '../../components/flex';
import styled from 'styled-components';
import ImageMapItems from './ImageMapItems_';

/**
 * 弹窗状态
 */
 let modalState = false;
 
const ComponentModal = styled.div`
position:absolute;
width:600px;
height:350px;
padding:20px;
left:-20px;
top:calc(100% + 20px);
z-index:100;
display: none;
&::after{
	content:"";
	position:absolute;
	width:100%;
	height:20px;
	background-color: transparent;
	top: -20px;
	left:0;
}
`;
const ComponentItem = styled.div`
position:relative;
flex:1;
max-width:60px;
min-width:60px;
cursor: pointer;
.title{
	display:block;
	text-align:center ;
}
img{
	margin: 0 auto;
	display:block ;
	width:20px;
	height: 20px;
}
`;
const componentList =[
{
	src:"./titleIcon/系统@2x.png",
	name:"系统组件",
},
{
	src:"./titleIcon/通用@2x.png",
	name:"通用组件",
},
{
	src:"./titleIcon/高级@2x.png",
	name:"高级组件",
},
{
	src:"./titleIcon/3D@2x.png",
	name:"3D组件",
},
{
	src:"./titleIcon/图片库@2x.png",
	name:"图片库",
},
{
	src:"./titleIcon/我的@2x.png",
	name:"我的",
},
];

class ComponentToolBar extends Component {
	render() {
		const { canvasRef ,descriptors } = this.props;
		return <React.Fragment>
		{
			componentList.map((item,idx)=>{
				return <ComponentItem
				key={item.name}
				 onMouseEnter={()=>{
					document.querySelector(".ComponentModal").style.display = 'block';
				 }}
				 onMouseLeave={()=>{
					if(modalState){
						document.querySelector(".ComponentModal").style.display = 'none';
					}
				 }}
				>
				<img src={item.src}></img>
				<span className='title'>{item.name}</span>
			</ComponentItem>
			})
		}
		<ComponentModal className="ComponentModal"
		 onMouseEnter={(e)=>{
			modalState = true ;
		 }}
		 onMouseLeave={(e)=>{
			modalState= false;
			document.querySelector(".ComponentModal").style.display = 'none';
			// e.target.style.display = 'none';
		 }}
		 >
			<ImageMapItems
			canvasRef={canvasRef}
			descriptors={descriptors}
			></ImageMapItems>
		</ComponentModal>
	</React.Fragment>
	}
}

export default ComponentToolBar;
