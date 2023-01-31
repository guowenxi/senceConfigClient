const pushStyle = (item)=>{
    const _dom = document.getElementById(`${item.id}_container`);
    const _styles = _dom.style;
    delete item.style;
    delete item.canvas;
    delete item.element;
    delete item.oCoords;
    delete item._cacheCanvas;
    delete item._cacheContext;
    //这里进行dom的重新赋值
    item.styles = JSON.parse(JSON.stringify(Object.assign(item.styles,{
        left:_styles.left,
        top:_styles.top,
        width:_styles.width,
        height:_styles.height,
        transform:_styles.transform,
        transformOrigin:_styles.transformOrigin,
    })))
}
const filterData = (list)=>{
    list.map(function(item,idx){
        if(item.type === 'group'){
            filterData(item._objects || item.objects)
        }else if(item.superType === 'element'){
            pushStyle(item);
        }
     })
}
const pushStyleToItem = function(data){
    filterData(data);
    return data ;
}
export default pushStyleToItem;