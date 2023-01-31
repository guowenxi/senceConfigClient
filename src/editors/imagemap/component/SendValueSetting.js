import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber ,Modal } from 'antd';
import sortBy from 'lodash/sortBy';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ColorSelect from './ColorSelect';
import CheckableTag from './CheckableTag';
import BoraderSetting from './BoraderSetting';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';
import { useDynamicList } from 'ahooks';
import { Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
const { Search } = Input;
const { TreeNode } = Tree;
import DeviceSettingModal from '../component/DeviceSettingModal';

const filterData =(data,key)=>{
  data.length && data.map(function(item,i){
    item.key = key != undefined ? `${key}-${item.name}` : item.name;
    if(item.children){
      item.selectable = false;
      filterData(item.children,item.key)
    }
  })
}
const SendValueSetting = (props) => {
	const { canvasRef, form, selectedItem ,visible ,multiple ,onChange  ,eventState} = props;
  const { list, remove, getKey, insert, replace ,resetList } = useDynamicList([
    { id:"",sendName:"",sendValue:"",pointId:"" },
  ]);

	const [modalState, setModalState] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchValue, setSearchValue] = useState('');
   const [slectItem, setSlectItem] = useState({});
   const [selectIdx, setSelectIdx] = useState(0);

   useEffect(()=>{
      setIsModalOpen(visible)
   },[visible])

   useEffect(()=>{
    resetList(selectedItem || [
      { id:"",sendName:"",sendValue:"",pointId:"" },
    ])
    console.log(selectedItem)
   },[selectedItem])
   const SelValueItem = (props)=>{
    const { item , idx } = props;
      return <Row style={{marginTop:'10px'}} key={idx}>
        <Col span={14}>
          <Input onClick={()=>{
            setModalState(true);
            setSelectIdx(idx)
            setSlectItem(item)
          }} defaultValue={item.sendName}></Input>
        </Col>
        <Col span={2} style={{textAlign:'center'}}> = </Col>
        <Col span={3}>
          <Input onBlur={(e)=>{
             replace(idx,Object.assign(item,{
              sendValue:e.target.value,
            }))
          }}  defaultValue={item.sendValue}></Input>
        </Col>
        <Col span={3}>
        {idx> 0 && (
        <MinusCircleOutlined
          style={{ marginLeft: 8 }}
          onClick={() => {
            remove(idx);
          }}
        />
      )}
      <PlusCircleOutlined
        style={{ marginLeft: 8 }}
        onClick={() => {
          insert(idx + 1, []);
        }}
      />
				</Col>
      </Row>
   }

    const getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.id === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    };
	return (
		<Modal title="设置设备参数"
    className='SendValueSettingModal'
      visible={isModalOpen}
      okText={"确定"}
      cancelText={"取消"}
         onOk={()=>{
            eventState(list)
            setIsModalOpen(false)
        }}
         onCancel={()=>{
            eventState(null)
            setIsModalOpen(false)
         }}>
          {
            list.map((item,idx)=>{
              return <SelValueItem
              item={item}
              idx={idx}
              >
              </SelValueItem>
            })
          }
         <DeviceSettingModal
			visible={modalState}
			form={form}
			multiple={false}
			selectedItem={[slectItem.id || '']}
			eventState={(bol)=>{
				setModalState(false)
				if(bol){
          replace(selectIdx,Object.assign(slectItem,{
            sendName:bol[0].name,
            id:bol[0].id,
            pointId:bol[0].pointId
          }))
				}
			}}
			></DeviceSettingModal>
		</Modal>
	);
}

export default SendValueSetting;
