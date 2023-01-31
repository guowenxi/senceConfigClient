
import { message } from 'antd';
import { filterRGBA, setDomStyle } from '../canvas/utils';
import { http, sendValueUrl, rbacToken } from '../http';
import { event$, subscription } from '../websokect';
//事件类型选择
export const objectClick = (object, event) => {
    event.map((item, idx) => {
        setAction(object, item, {state:true})
    })
}

//事件类型选择
export const setAction = (object, action, other) => {
    switch (Number(action.eventCondition)) {
        //数值下发
        case 5:
            sendTypeAction(object, action, other)
            break;
        //值变化
        case 6:
            setStyleAction(object, action, other)
            break;
    }
}
//发送类型选择
export const sendTypeAction = (object, action, other) => {
    let sendList = [], _value;
    const state = Number(action.sendType);
    //通过输入框下发
    if (state === 1) {
        _value = document.getElementById(action.bindInputName).value || '';
    }
    //可以集成所有下发数据一起下发
    action.sendLinkList.map((item, idx) => {
        http({
            method: 'post',
            url: sendValueUrl,
            data: {
                rbacToken: rbacToken,
                pointId: item.pointId,
                value: state === 1 ? _value : item.sendValue,
            }
        }).then((res) => {
            if(res.data.success != 1){
                message.open({
                    type: 'error',
                    content: res.data?.message,
                  });
            }else{
                message.open({
                    type: 'success',
                    content: '下发成功',
                  });
            }
        })
    })

}
//更换外观选择
export const setStyleAction = (object, action, other) => {
    const { state } = other;
    const dom = document.getElementById(object.id);
    if (state) {
        for(const key in action){
            setDomStyle(dom,key,action[key]);
        }
    }
}
//发送类型选择
export let updatePointList = [];
export const collectUpdatePointValue = (json, event$) => {
    json.map((item, idx) => {
        if (item.deviceSetting.selectedValue) {
            updatePointList.push({
                domId: item.id,
                pointId: item.deviceSetting.selectedValue.pointId,
            })
        }
    })
    subscription.save(updatePointList, event$)
}


export const elementChange = (obj, data) => {
    switch (obj.type) {
        case "image":
            // obj.condition
            break;
        case "frameImg":

            break;
        case "button":

            break;
        case "textbox":
            document.getElementById(obj.id).innerHTML = data.value || '';
            break;
        default:

            break;
    }
}

export const elementListenChange = (obj, data, list) => {
    //根据值改变去修改组件
    list.map((item, idx) => {
        let state = false;
        if (item.eventType === 3 && item.listenedCondition.pointId === data.id) {
            //判断逻辑是否成立
            switch (item.judgeListenedType) {
                case 0:
                    state = Number(data.value) == Number(item.judgeListenedValue) ? true : false;
                    break;
                case 1:
                    state = Number(data.value) != Number(item.judgeListenedValue) ? true : false;
                    break;
                case 2:
                    state = Number(data.value) > Number(item.judgeListenedValue) ? true : false;
                    break;
                case 3:
                    state = Number(data.value) < Number(item.judgeListenedValue) ? true : false;
                    break;
                case 4:
                    state = Number(data.value) >= Number(item.judgeListenedValue) ? true : false;
                    break;
                case 5:
                    state = Number(data.value) <= Number(item.judgeListenedValue) ? true : false;
                    break;
            }
            setAction(obj, item, {
                state: state
            })
        }

    })
}