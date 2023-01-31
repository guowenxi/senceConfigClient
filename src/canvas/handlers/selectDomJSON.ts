
import { findDomId  } from "../utils"
const style = [
    "data",
    "src",
    "width",
    "height",
    "position",
    "transformOrigin",
    "fontSize",
    "left",
    "top",
    "transform",
    "zIndex"
]
const selectDomJSON = function (data) {
    // rde-canvas
    let doms = {};
    let _ = []; 
    const _wrap_dom = document.getElementsByClassName("rde-canvas")[0];
    const _list = _wrap_dom.querySelectorAll(".container-element");
    for (let dom of _list) {
        const id = findDomId(dom)
        let __style = {};
        let _style = getComputedStyle(dom, null);
        style.map(function (key, idx) {
            __style[key] = _style[key];
        })
        doms[id] = __style;
    }
    data.map(function (item, idx) {
        _.push({
            ...filterDom(item),
            style:Object.assign(item, doms[item.id])
        });
    })
    return _;
}
export default selectDomJSON;
//一些需要定制的字段在这里进行添加
const filterDom = function (dom) {
    switch (dom.type) {
        case "frameImg":
            dom.domAttr = "img";
            dom.src = dom.code.fixedSrc;
            dom.fixedSrc = dom.code.fixedSrc;
            dom.animateSrc = dom.code.animateSrc;
            break;
        default:
            dom.domAttr = "div";
            break;
    }
    return dom;
}
