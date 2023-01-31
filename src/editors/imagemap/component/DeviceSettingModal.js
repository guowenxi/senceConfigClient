import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber ,Modal } from 'antd';
import sortBy from 'lodash/sortBy';
import ColorSelect from './ColorSelect';
import CheckableTag from './CheckableTag';
import BoraderSetting from './BoraderSetting';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';
import { Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { http ,getTreeDeviceGroupList } from '../../../http';
const { Search } = Input;
const { TreeNode } = Tree;

const data = [
   {
     name: 'parent',
     id: '0-0',
     children: [
       {
         name: 'parent1',
         id: '0-0-0',
         children: [
           {
               name: 'leaf1',
               id: '0-0-0-0',
           },
           {
            name: 'leaf2',
            id: '0-0-0-1',
           },
           {
            name: 'leaf3',
            id: '0-0-0-2',
           },
         ],
       },
     ],
   },
 ];

const filterData =(data,key)=>{
  data.length && data.map(function(item,i){
    item.key = key != undefined ? `${key}-${item.id}` : item.name;
    if(item.children){
      item.selectable = false;
      filterData(item.children,item.key)
    }
  })
}
const DeviceSettingModal = (props) => {
	const { canvasRef, form, selectedItem ,visible ,multiple  ,eventState} = props;
	const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchValue, setSearchValue] = useState('');
   const [expandedKeys, setExpandedKeys] = useState([]);
   const [treeData, setTreeData] = useState([]);
   const [autoExpandParent, setAutoExpandParent] = useState(true);

   useEffect(()=>{
      setIsModalOpen(visible)
   },[visible])

   useEffect(()=>{
    //获取多有设备点位
    http({
      method:'get',
      url:getTreeDeviceGroupList,
    }).then((res)=>{
      filterData(res.data.data);
      setTreeData(res.data.data);
    })
   },[])

   useEffect(()=>{
    setExpandedKeys(selectedItem);
   },[selectedItem])


   const onSelect = (selectedKeys, info) => {
      console.log('selected', selectedKeys, info);
    };

    const onChange = (e) => {
      const { value } = e.target;
      const newExpandedKeys = treeData
        .map(item => {
          if (item.key.indexOf(value) > -1) {
            return getParentKey(item.key, treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      setExpandedKeys(newExpandedKeys);
      setSearchValue(value);
      setAutoExpandParent(true);
    };
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
		<Modal title="设备参数"
    className='DeviceSettingModal'
      visible={isModalOpen}
      okText={"确定"}
      cancelText={"取消"}
         onOk={()=>{
            eventState(searchValue)
            setIsModalOpen(false)
        }}
         onCancel={()=>{
            eventState(null)
            setIsModalOpen(false)
         }}>
            <Search style={{ marginBottom: 8 }} placeholder="查询" onChange={onChange} />
            <Tree
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  multiple={multiple}
                  treeData={treeData}
                  selectedKeys={expandedKeys}
                  fieldNames={{
                    title:'name',
                    key:'id',
                    children:'children'
                  }}
                  onSelect={(data, label, extra) => {
                    setSearchValue(label.selectedNodes)
                    let _keys = [];
                    label.selectedNodes.map((item)=>{
                      _keys.push(item.id)
                    })
                    setExpandedKeys(_keys)
                  }}
                >

                </Tree>
		</Modal>
	);
}

export default DeviceSettingModal;
