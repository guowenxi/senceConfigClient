import { fabric } from 'fabric';

import Handler from './Handler';
import { VideoObject } from '../objects/Video';
import { ChartObject } from '../objects/Chart';
import { IframeObject } from '../objects/Iframe';
import { ElementObject } from '../objects/Element';
import { InputObject } from '../objects/Input';
import { filterRGBA, setDomStyle, setPoints } from '../utils';
import { includes } from 'lodash';
export type ElementType = 'container' | 'script' | 'style';

export type ElementObjectType = 
VideoObject | ChartObject | IframeObject | ElementObject | InputObject ;

export interface ElementCode {
    html?: string;
    css?: string;
    js?: string;
}

class ElementHandler {
    handler?: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
    }

    /**
     * Set element by id
     * @param {string} id
     * @param {*} source
     * @returns {void}
     */
    public setById = (id: string, source: any): void => {
        const obj = this.handler.findById(id) as ElementObjectType;
        if (!obj) {
            return;
        }
        this.set(obj, source);
    }

    /**
     * Set element
     * @param {ElementObjectType} obj
     * @param {*} source
     */
    public set = (obj: ElementObjectType, source: any) => {
        obj.setSource(source);
    }

    /**
     * Find element by id with type
     * @param {string} id
     * @param {ElementType} [type='container']
     * @returns
     */
    public findById = (id: string, type: ElementType = 'container') => {
        return document.getElementById(`${id}_${type}`);
    }

    /**
     * Remove element
     * @param {HTMLElement} el
     * @returns
     */
    public remove = (el: HTMLElement) => {
        if (!el) {
            return;
        }
        this.handler.container.removeChild(el);
    }

    /**
     * Remove element by id
     * @param {string} id
     */
    public removeById = (id: string) => {
        const el = this.findById(id);
        const scriptEl = this.findById(id, 'script');
        const styleEl = this.findById(id, 'style');
        if (el) {
            if (el.remove) {
                el.remove();
            } else {
                this.remove(el);
            }
        }
        if (scriptEl) {
            if (scriptEl.remove) {
                scriptEl.remove();
            } else {
                document.head.removeChild(scriptEl);
            }
        }
        if (styleEl) {
            if (styleEl.remove) {
                styleEl.remove();
            } else {
                document.head.removeChild(styleEl);
            }
        }
    }

    /**
     * Remove element by ids
     * @param {string[]} ids
     */
    public removeByIds = (ids: string[]) => {
        ids.forEach(id => {
            this.removeById(id);
        });
    }

    /**
     * Set position
     * @param {HTMLElement} el
     * @param {number} left
     * @param {number} top
     * @returns
     */
    public setPosition = (el: HTMLElement, obj: fabric.Object) => {
        if (!el) {
            return;
        }
        obj.setCoords && obj.setCoords();
        const zoom = this.handler.canvas.getZoom();
        //这个方法暂时用不到 会出bug
        const { scaleX, scaleY, width, height } = obj;
        const { left, top } = obj.getBoundingRect(false);
        const padLeft = ((width * scaleX * zoom) - width) / 2;
        const padTop = ((height * scaleY * zoom) - height) / 2;
        //这里在做撤回时重新定位用
        // el.style.transformOrigin = `top left`;
        //采用fabric定位方法进行定位 在zoom下准确
        el.style.left = `${obj.lineCoords.tl.x}px`;
        el.style.top = `${obj.lineCoords.tl.y}px`;
        // setPoints({
        //     left:obj.lineCoords.tl.x,
        //     top:obj.lineCoords.tl.y,
        // })
    }
    /**
     * Set position
     * @param {HTMLElement} el
     * @param {number} left
     * @param {number} top
     * @returns
     */
    public setGroupElementPosition = (el: HTMLElement, obj) => {
        if (!el) {
            return;
        }
        obj.setCoords && obj.setCoords();
        //这里在做撤回时重新定位用
        // el.style.transformOrigin = `top left`;
        //采用fabric定位方法进行定位 在zoom下准确
        el.style.left = `${obj.left}px`;
        el.style.top = `${obj.top}px`;
        // setPoints({
        //     left:obj.left + el.clientWidth/2,
        //     top:obj.top+ el.clientHeight/2,
        // })
    }
    /**
     * Set position
     * @param {HTMLElement} el
     * @param {number} left
     * @param {number} top
     * @returns
     */
    public setFlip = (el: HTMLElement, obj: fabric.Object) => {
        if (!el) {
            return;
        }
        obj.setCoords && obj.setCoords();
        const zoom = this.handler.canvas.getZoom();
        // setPoints(obj)
        //这里在做撤回时重新定位用
 
        const dom = el.querySelector('*[dombox="element-box"]');
        if(dom === null) return ;
        dom.style.transform = `scaleX(${obj.flipX ? '-1' : '1'}) scaleY(${obj.flipY ? '-1' : '1'})` ; 
    }

    /**
     * 成组拖拽时用到
     * @param el 
     * @param obj 
     * @param left 
     * @param top 
     * @returns 
     */
    public setPositionByOrigin = (el: HTMLElement, obj: fabric.Object, left: number, top: number) => {
        if (!el) {
            return;
        }
        obj.setCoords();
        const zoom = this.handler.canvas.getZoom();
        const { scaleX, scaleY, width, height } = obj;
        // setPoints({
        //     left:left,
        //     top:top,
        // })
        // const { left, top } = obj.getBoundingRect(false);
        // const padLeft = ((width * scaleX * zoom) - width) / 2;
        // const padTop = ((height * scaleY * zoom) - height) / 2;
        // el.style.left = `${left + padLeft}px`;
        // el.style.top = `${top + padTop}px`;
        // el.style.left = `${obj.lineCoords.tl.x}px`;
        // el.style.top = `${obj.lineCoords.tl.y}px`;
        el.style.left = `${left}px`;
        el.style.top = `${top }px`;
    }

    /**
     * Set size
     * @param {HTMLElement} el
     * @param {number} width
     * @param {number} height
     * @returns
     */
    public setSize = (el: HTMLElement, obj: fabric.Object) => {
        if (!el) {
            return;
        } 
        const { width, height } = obj;
        const { scaleX, scaleY, } = obj;
        const zoom = this.handler.canvas.getZoom();
        // console.log(width*scaleX, height*scaleY)
        el.style.width = `${width*scaleX*zoom}px`;
        el.style.height = `${height*scaleY*zoom}px`;
        // el.style.width = `${width}px`;
        // el.style.height = `${height}px`;
    }

    /**
     * Set scale or angle
     * @param {HTMLElement} el
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {number} angle
     * @returns
     */
    public setScaleOrAngle = (el: HTMLElement, obj: fabric.Object ) => {
        if (!el) {
            return;
        }
        const zoom = this.handler.canvas.getZoom();
        const { scaleX, scaleY, angle } = obj;
        el.style.transformOrigin = `top left`;
        el.style.transform = `rotate(${(angle || 0)}deg)`;
        // el.style.transform = `rotate(${(angle || 0)}deg) scale(${(scaleX || 1) *zoom}, ${(scaleY || 1) *zoom})`;

    }
    /**
     * Set scale or angle
     * @param {HTMLElement} el
     * @param {number} scaleX 
     * @param {number} scaleY
     * @param {number} angle
     * @returns
     */
    public setRotate = (el: HTMLElement,target  , left : number , top : number ,obj: fabric.Object) => {
        if (!el) {
            return;
        }
        const zoom = this.handler.canvas.getZoom();
        const { scaleX, scaleY, angle  ,ownMatrixCache } = target;
        //计算选中的中心点
        const { centerLeft , centerTop } = this.handler.getObjCenterPoint(target);
        // setPoints({left:centerLeft,top:centerTop});
        //最靠近框的组件定位为左上 其他的组件定位从中心点进行计算偏移
        var _width = Number(el.style.width.slice(0,-2))/2;
        var _height = Number(el.style.height.slice(0,-2))/2;
        el.style.transformOrigin = `${centerLeft - el.offsetLeft}px ${centerTop - el.offsetTop}px`;
        // setPoints({left:centerLeft - el.offsetLeft,top:centerTop - el.offsetTop});
        // el.style.transformOrigin = `top left`;
        // el.style.left = `${centerLeft - el.offsetLeft}px`;
        // el.style.top = `${centerTop - el.offsetTop}px`;
        el.style.transform = `rotate(${angle}deg)`;
    }

    public setStyles = (el: HTMLElement, obj: fabric.Object,value,key) => {
        if (!el) {
            return;
        }
        console.log("change",value)
        setDomStyle(el,key,value)
       
    }
}

export default ElementHandler;

