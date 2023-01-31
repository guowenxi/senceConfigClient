import React, { useState, useReducer, useEffect } from 'react';
import { Form, Slider, Col, Select, Tag, Row, Input, InputNumber, Button, Modal } from 'antd';
import sortBy from 'lodash/sortBy';
import ColorSelect from '../component/ColorSelect';
import CheckableTag from '../component/CheckableTag';
import BoraderSetting from '../component/BoraderSetting';
import FontSetting from '../component/FontSetting';
import BackGroundSetting from '../component/BackGroundSetting';
import DeviceSettingModal from '../component/DeviceSettingModal';
import { judgeListenedTypeList } from '../../../settingList';

import styled from 'styled-components';
import Icon from '../../../components/icon/Icon';
import Fonts from '../../../components/font/fonts';
const { TextArea } = Input;

const fonts = Fonts.getFonts();

const SetChangeValue = (props) => {
  const { canvasRef, form, selectedItem, onChange, field, idx } = props;
  const { condition } = selectedItem;
  const [ModalState, setModalState] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <React.Fragment>
      <Row style={{ marginTop: '10px' }}>
        <Col span={24}>
          <Form.Item name={[field.name, 'listenedCondition','name']}
            label='设备参数'
            labelCol={{ span: 5 }}
            colon={false}>
            <Input
              defaultValue={condition[idx]?.listenedCondition?.name}
              prefix={<Icon onClick={() => {
                setModalState(true)
              }} name="link" color="#fff"></Icon>}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <Col span={12}>
          <Form.Item name={[field.name, 'judgeListenedType']}
            label='判定值'
            labelCol={{ span: 10 }}
            colon={false}>
            <Select>
              {
                judgeListenedTypeList.map((item) => {
                  return <Select.Option
                    value={item.id}>{item.name}</Select.Option>
                })
              }
            </Select>
          </Form.Item>
        </Col>
				<Col span={1}></Col>
        <Col span={11}>
          <Form.Item name={[field.name, 'judgeListenedValue']}
            colon={false}>
            <Input
            />
          </Form.Item>
        </Col>
      </Row>
      <DeviceSettingModal
        visible={ModalState}
        form={form}
        multiple={false}
        eventState={(bol) => {
          setModalState(false)
          if (bol) {
            if (bol) {
              selectedItem.condition[idx].listenedCondition = {
                name:bol[0].name,
                id:bol[0].id,
                pointId:bol[0].pointId,
              };
              onChange(selectedItem, {
                condition: selectedItem.condition
              }, {
                condition: selectedItem.condition
              },)
            }
          }
        }}
      ></DeviceSettingModal>
    </React.Fragment>
  );
}

export default SetChangeValue;
