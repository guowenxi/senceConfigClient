const style = [
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
const renderDom = function(data){
    const _wrap_dom = document.getElementsByClassName("rde-canvas")[0];
    const _list = _wrap_dom.querySelectorAll(".show-element");
    if(_list.length > 0){
        for(let item of _list){
            _wrap_dom.removeChild(item)
        }
    }
    data.map(function(item,idx){
        var _dom = document.createElement("div");
        var _inner = document.createElement(item.domAttr);
        style.map(function(key){
            _dom.style[key] = item.style[key];
        });
        for(let key in item){
            if(key === 'style') continue;
            _dom[key] = item[key]
        }
        _dom.className= "show-element";
        _inner.style.transform = `scaleX(${item.flipX ? '-1' : '1'}) scaleY(${item.flipY ? '-1' : '1'})` ;
        _inner.src = item.src;
        _dom.appendChild(_inner);
        _wrap_dom.appendChild(_dom);
    })
}
export default renderDom;