
import { VideoObject } from '../objects/Video';


// 获取数组的params字段默认用来获取rbacToken;
export const getUrlParams = function (name: string) {
    const url2 = window.location.href;
    const temp2 = url2.split('?')[1];
    const pram2 = new URLSearchParams(`?${temp2}`);
    let data = pram2.get(name);
    if (!data) return '';
    if (data.indexOf('#/') >= 0) {
        data = data.split('#/')[0];
    }
    return data;
};
export * from './ObjectUtil';
export function setPoints(opt) {
    document.getElementById("points").style.left = opt.left + 'px';
    document.getElementById("points").style.top = opt.top + 'px';
}
export const fixedPointer = (mouse, point2) => {
    let point = mouse;
    if (point2 && point2.length > 0) {
        const { x, y } = point2[point2.length - 2];
        const l_x = Math.abs(mouse.x - x);
        const l_y = Math.abs(mouse.y - y);
        if (
            l_x / 2 > 40
        ) {
            point = {
                x: mouse.x,
                y: y
            }
        } else if (
            l_y / 2 > 40
        ) {
            point = {
                x: x,
                y: mouse.y
            }
        }

    }
    return point;
}
export const findDomId = (dom) => {
    return dom.id.split("_container")[0];
}
export const findDomById = (id, fn) => {
    const _wrap_dom = document.getElementsByClassName("rde-canvas")[0];
    const _list = _wrap_dom.querySelectorAll(".container-element");
    for (let dom of _list) {
        const _id = findDomId(dom);
        if (id == _id) {
            return dom;
        }
    }
}

export const setTrie = (dom, state) => {
    const _wrap_dom = document.getElementsByClassName("rde-canvas")[0];
    const _list = _wrap_dom.querySelectorAll(".container-element");
    let _domIndex = 0;
    let _dom;
    if(dom.type === 'group'){

    }else{
        for (var i = 0; i < _list.length; i++) {
            if (findDomId(_list[i]) == dom['id']) {
                _domIndex = i;
                _dom = _list[i];
                break;
            }
        }
    }
    debugger
    /**
     * TIPS 通过控制dom展示层级
     */
    switch (state) {
        case "forward":
            if (!_list[_domIndex + 1]) return;
            _wrap_dom.removeChild(_dom);
            _wrap_dom.insertBefore(_dom, _list[_domIndex + 1].nextSibling);
            break;
        case "backwards":
            if (_domIndex == 0) return;
            _wrap_dom.removeChild(_dom);
            _wrap_dom.insertBefore(_dom, _list[_domIndex - 1]);

            break;
        case "front":
            if (!_list[_domIndex + 1]) return;
            _wrap_dom.removeChild(_dom);
            _wrap_dom.insertBefore(_dom, null);
            break;
        case "bottommost":
            if (_domIndex == 0) return;
            _wrap_dom.removeChild(_dom);
            _wrap_dom.insertBefore(_dom, _list[0]);
            break;
    }
}

export const getRootLeft = (target, zoomRatio, num) => {
    let left = num;
    const wrapDom = target.getBoundingRect();
    if (target.group) {
        const wrapLeft = getRootLeft(target.group, zoomRatio, left);
        left = wrapLeft + (wrapDom.left + wrapDom.width / 2) * zoomRatio;
    } else {
        return wrapDom.left + wrapDom.width / 2
    }
    return left;
}
export const getRootTop = (target, zoomRatio, num) => {
    let top = num;
    const wrapDom = target.getBoundingRect();
    if (target.group) {
        const wrapTop = getRootTop(target.group, zoomRatio, top);
        top = wrapTop + (wrapDom.top + wrapDom.height / 2) * zoomRatio;
    } else {
        return wrapDom.top + wrapDom.height / 2
    }
    return top;
}
export const zoomCoordLeft = (zoomRatio: number, obj: VideoObject, target: VideoObject) => {
    /**
     * HACK be done
     */
    const left = getRootLeft(target, zoomRatio, 0);
    const zoom_num = (left + obj.left * zoomRatio);
    return zoom_num;
}
export const zoomCoordTop = (zoomRatio: number, obj: VideoObject, target: VideoObject) => {
    const top = getRootTop(target, zoomRatio, 0);
    const zoom_num = (top + obj.top * zoomRatio);
    return zoom_num;
}

// export const zoomCoordTop = (zoomRatio: number,obj:VideoObject,target:VideoObject)=>{
//     const wrapDom = target.getBoundingRect();
//     const zoom_num = (target.top+target.height/2+obj.top*zoomRatio);
//       return zoom_num;
// }
export const includesRGBA = (key)=>{
    var includeList = [
        'color',
        'borderColor',
        'backgroundColor',
    ];
    return includeList.includes(key) ? true : false;
}
//设置样式
export const filterRGBA = (value) => {
    if (value) {
        const { r, g, b, a } = value;
        return `rgba(${r},${g},${b},${a})`;
    } else {
        return 'rgba(0,0,0,0)';
    }
}
//设置样式
export const excludes = (key)=>{
    var excludeList = [
        "opacity"
    ];
    return excludeList.includes(key) ? false : true;
}

export const setDomStyle = (el,key,value) => {
    if(key === 'backgroundImage'){
        // el.style[key] = `url(${value})`;
        el['src'] = `${value}`;
    }else if(includesRGBA(key)){
        el.style[key] = filterRGBA(value);
    }else if(Number(value) && excludes(key)){
        el.style[key] = value + 'px';
    }else{
        el.style[key] = value ;
    }
}

/**
 * HACK 将内部的dom样式赋值
 */
export const _renderElementBox = function(element, styles){
    if (styles) {
        delete styles.width;
        delete styles.height;
        delete styles.left;
        delete styles.top;
        const dom = element.querySelector('*[dombox="element-box"]');
        Object.keys(styles).map((key) => {
            //在这里赋值
            if(key === 'transform'){

            }else if(key === 'innerHTML'){
                dom.innerHTML = styles[key];
            }else if (Number(styles[key])) {
                dom.style[key] = styles[key] + 'px';
            } else if (key.toUpperCase().indexOf('COLOR') != -1) {
                dom.style[key] = filterRGBA(styles[key])
            } else {
                dom.style[key] = styles[key];
            }
        })
    }
};

export const varcolorHex = function(color) {
    if (!color) {
        return '';
    }
    var values = filterRGBA(color)
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
    var a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
    return "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);
};
//找到指定组件对象
export const getFilterObject = (canvans, objectName, fn) => {
    const objects = canvans.handler.getObjects();
    let _list: any[] = [];
    const filterObject = (list, fn) => {
        list.length && list.map((item) => {
            if (item._objects) {
                filterObject(item._objects, fn)
            } else {
                if (item.type === objectName) {
                    _list.push(item)
                }
            }
        })
    }
    filterObject(objects, fn)
    return _list;
}