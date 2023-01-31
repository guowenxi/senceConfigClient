import { fabric } from 'fabric';

import Handler from './Handler';
import { VideoObject } from '../objects/Video';
import { FabricObject ,setPoints, zoomCoordLeft, zoomCoordTop} from '../utils';
import { wrap } from 'lodash';

class ZoomHandler {
	handler?: Handler;
	chacheZoom: number;
	state: number;
	zoomNum: number;
	constructor(handler: Handler) {
		this.handler = handler;
		this.state = 1;
		this.chacheZoom = 1;
		this.zoomNum = 0;
	}
	// modify zoom rate
	public modifyZoomNum = (point,zoomRatio)=>{
		let zoomX ,zoomY;
		if(this.handler.getObjects().length>0){
			const _beforeObject = this.handler.getObjects()[0].getBoundingRect();
			this.handler.canvas.zoomToPoint(point, zoomRatio);
			const _afterObject = this.handler.getObjects()[0].getBoundingRect();
			zoomX = _afterObject.width/_beforeObject.width;
			zoomY = _afterObject.height/_beforeObject.height;
		}
		return [zoomX,zoomY];
   }

	/**
	 * Zoom to point
	 *
	 * @param {fabric.Point} point
	 * @param {number} zoom ex) 0 ~ 1. Not percentage value.
	 */
	public zoomToPoint = (point: fabric.Point, zoom: number,type:string) => {
		const { minZoom, maxZoom } = this.handler;
		let zoomRatio = zoom;
		if (zoom <= minZoom / 100) {
			zoomRatio = minZoom / 100;
		} else if (zoom >= maxZoom / 100) {
			zoomRatio = maxZoom / 100;
		}
		this.handler.canvas.zoomToPoint(point, zoomRatio);
		// const zoomNum = this.modifyZoomNum(point,zoomRatio);
		// HACK modify zoom for group & element
		const modifyElementZoom = (elements,target)=>{
			elements.forEach(obj => {
			const type = obj.superType || obj.type;
				switch(type){
					case "element" :
					// const {  obj_w, obj_h, obj_player } = obj as VideoObject;
					const {  width, height, player } = obj as VideoObject;
					const {  id } = obj as VideoObject;
					const el = this.handler.elementHandler.findById(id);
					// update the element
					if(target?.type === "group"){
					// var padLeft =  this.zoomCoordLeft(zoomRatio,obj,target,width);
					// var padTop = this.zoomCoordTop(zoomRatio,obj,target,height);
						// var left = target.left + obj.aCoords.tl.x + target.width / 2,
						// top = target.top + obj.aCoords.tl.y + target.height / 2;
						this.handler.elementHandler.setScaleOrAngle(el,obj);
						this.handler.elementHandler.setSize(el, obj);

						this.handler.elementHandler.setGroupElementPosition(el,{
							left:zoomCoordLeft(zoomRatio,obj,target),
							top:zoomCoordTop(zoomRatio,obj,target)
						});
					}else{
						var { left, top } = obj.getBoundingRect(false);
						this.handler.elementHandler.setScaleOrAngle(el,obj);
						this.handler.elementHandler.setSize(el, obj);
						this.handler.elementHandler.setPosition(el, obj);
					}
					if (player) {
						player.setPlayerSize(width, height);
					}
						break;
					case "group" :

					modifyElementZoom(obj.getObjects(),obj);
					break;
				}
				//HACK save cacheZoom for every elementObject
			});
		}
		modifyElementZoom(this.handler.getObjects(),"");

		if (this.handler.onZoom) {
			this.handler.onZoom(zoomRatio);
		}

		this.handler.canvas.requestRenderAll();
		
	};

	/**
	 * Zoom one to one
	 *
	 */
	public zoomOneToOne = () => {
		const center = this.handler.canvas.getCenter();
		this.handler.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		this.zoomToPoint(new fabric.Point(center.left, center.top), 1);
	};

	/**
	 * Zoom to fit
	 *
	 */
	public zoomToFit = () => {
		let scaleX = this.handler.canvas.getWidth() / this.handler.workarea.width;
		const scaleY = this.handler.canvas.getHeight() / this.handler.workarea.height;
		if (this.handler.workarea.height >= this.handler.workarea.width) {
			scaleX = scaleY;
			if (this.handler.canvas.getWidth() < this.handler.workarea.width * scaleX) {
				scaleX = scaleX * (this.handler.canvas.getWidth() / (this.handler.workarea.width * scaleX));
			}
		} else {
			if (this.handler.canvas.getHeight() < this.handler.workarea.height * scaleX) {
				scaleX = scaleX * (this.handler.canvas.getHeight() / (this.handler.workarea.height * scaleX));
			}
		}
		const center = this.handler.canvas.getCenter();
		this.handler.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		this.zoomToPoint(new fabric.Point(center.left, center.top), scaleX);
	};

	/**
	 * Zoom in
	 *	放大画布
	 */
	public zoomIn = () => {
		let zoomRatio = this.handler.canvas.getZoom();
		zoomRatio += 0.05;
		this.zoomNum ++;
		const center = this.handler.canvas.getCenter();
		this.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
	};

	/**
	 * Zoom out
	 *	缩小画布
	 */
	public zoomOut = () => {
		let zoomRatio = this.handler.canvas.getZoom();
		zoomRatio -= 0.05;
		this.zoomNum --;
		const center = this.handler.canvas.getCenter();
		this.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
	};

	/**
	 * Zoom to center with object
	 *
	 * @param {FabricObject} target If zoomFit true, rescaled canvas zoom.
	 */
	public zoomToCenterWithObject = (target: FabricObject, zoomFit?: boolean) => {
		const { left: canvasLeft, top: canvasTop } = this.handler.canvas.getCenter();
		const { left, top, width, height } = target;
		const diffTop = canvasTop - (top + height / 2);
		const diffLeft = canvasLeft - (left + width / 2);
		if (zoomFit) {
			let scaleX;
			let scaleY;
			scaleX = this.handler.canvas.getWidth() / width;
			scaleY = this.handler.canvas.getHeight() / height;
			if (height > width) {
				scaleX = scaleY;
				if (this.handler.canvas.getWidth() < width * scaleX) {
					scaleX = scaleX * (this.handler.canvas.getWidth() / (width * scaleX));
				}
			} else {
				scaleY = scaleX;
				if (this.handler.canvas.getHeight() < height * scaleX) {
					scaleX = scaleX * (this.handler.canvas.getHeight() / (height * scaleX));
				}
			}
			this.handler.canvas.setViewportTransform([1, 0, 0, 1, diffLeft, diffTop]);
			this.zoomToPoint(new fabric.Point(canvasLeft, canvasTop), scaleX);
		} else {
			const zoom = this.handler.canvas.getZoom();
			this.handler.canvas.setViewportTransform([1, 0, 0, 1, diffLeft, diffTop]);
			this.zoomToPoint(new fabric.Point(canvasLeft, canvasTop), zoom);
		}
	};

	/**
	 * Zoom to center with objects
	 *
	 * @param {boolean} [zoomFit] If zoomFit true, rescaled canvas zoom.
	 * @returns
	 */
	public zoomToCenter = (zoomFit?: boolean) => {
		const activeObject = this.handler.canvas.getActiveObject();
		if (!activeObject) {
			return;
		}
		this.zoomToCenterWithObject(activeObject, zoomFit);
	};
}

export default ZoomHandler;
