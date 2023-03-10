import { fabric } from 'fabric';
import { FabricObject, InteractionMode, setPoints } from '../utils';
import Handler from './Handler';

type IReturnType = { selectable?: boolean; evented?: boolean } | boolean;

class InteractionHandler {
	handler: Handler;

	constructor(handler: Handler) {
		this.handler = handler;
		if (this.handler.editable) {
			this.selection();
		}
	}

	/**
	 * Change selection mode
	 * @param {(obj: FabricObject) => IReturnType} [callback]
	 */
	public selection = (callback?: (obj: FabricObject) => IReturnType) => {
		if (this.handler.interactionMode === 'selection') {
			return;
		}
		this.handler.interactionMode = 'selection';
		if (typeof this.handler.canvasOption.selection === 'undefined') {
			this.handler.canvas.selection = true;
		} else {
			this.handler.canvas.selection = this.handler.canvasOption.selection;
		}
		this.handler.canvas.defaultCursor = 'default';
		this.handler.workarea.hoverCursor = 'default';
		this.handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
				// When typeof selection is ActiveSelection, ignoring selectable, because link position left: 0, top: 0
				if (obj.superType === 'link' || obj.superType === 'port') {
					obj.selectable = false;
					obj.evented = true;
					obj.hoverCursor = 'pointer';
					return;
				}
				if (this.handler.editable) {
					obj.hoverCursor = 'move';
				} else {
					obj.hoverCursor = 'pointer';
				}
				obj.selectable = true;
				obj.evented = true;
			}
		});
		this.handler.canvas.renderAll();
	};

	/**
	 * Change grab mode
	 * @param {(obj: FabricObject) => IReturnType} [callback]
	 */
	public grab = (callback?: (obj: FabricObject) => IReturnType) => {
		if (this.handler.interactionMode === 'grab') {
			return;
		}
		this.handler.interactionMode = 'grab';
		this.handler.canvas.selection = false;
		this.handler.canvas.defaultCursor = 'grab';
		this.handler.workarea.hoverCursor = 'grab';
		this.handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
				obj.selectable = false;
				obj.evented = this.handler.editable ? false : true;
			}
		});
		this.handler.canvas.renderAll();
	};

	/**
	 * Change drawing mode
	 * @param {InteractionMode} [type]
	 * @param {(obj: FabricObject) => IReturnType} [callback]
	 */
	public drawing = (type?: InteractionMode, callback?: (obj: FabricObject) => IReturnType) => {
		if (this.isDrawingMode()) {
			return;
		}
		this.handler.interactionMode = type;
		this.handler.canvas.selection = false;
		this.handler.canvas.defaultCursor = 'pointer';
		this.handler.workarea.hoverCursor = 'pointer';
		this.handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
				obj.selectable = false;
				obj.evented = this.handler.editable ? false : true;
			}
		});
		this.handler.canvas.renderAll();
	};

	public linking = (callback?: (obj: FabricObject) => IReturnType) => {
		if (this.isDrawingMode()) {
			return;
		}
		this.handler.interactionMode = 'link';
		this.handler.canvas.selection = false;
		this.handler.canvas.defaultCursor = 'default';
		this.handler.workarea.hoverCursor = 'default';
		this.handler.getObjects().forEach(obj => {
			if (callback) {
				this.interactionCallback(obj, callback);
			} else {
				if (obj.superType === 'node' || obj.superType === 'port') {
					obj.hoverCursor = 'pointer';
					obj.selectable = false;
					obj.evented = true;
					return;
				}
				obj.selectable = false;
				obj.evented = this.handler.editable ? false : true;
			}
		});
		this.handler.canvas.renderAll();
	};

	public moveDom = (activeObject, e) => {
		activeObject.forEach(obj => {
			if (obj.superType === 'element') {
				const { id } = obj;
				const el = this.handler.elementHandler.findById(id);
				/**
				 * ????????????????????????????????????????????????
				 */
				setPoints({
					left: Number(el.style.left.split("px")[0]) + e.movementX,
					top: Number(el.style.top.split("px")[0]) + e.movementY,
				})
				//?????????relativePan???????????????????????????????????????
				// obj.left = Number(el.style.left.split("px")[0]) + e.movementX;
				// obj.top = Number(el.style.top.split("px")[0]) + e.movementY;
				//????????????????????? ????????????fabric???????????????
				obj.setCoords();
				el.style.left = `${Number(el.style.left.split("px")[0]) + e.movementX}px`;
				el.style.top = `${Number(el.style.top.split("px")[0]) + e.movementY}px`;
			}
			if (obj.type === 'group') {
				this.moveDom(obj._objects || obj.objects,e)
			}
		});


	}
	/**
	 * Moving objects in grap mode
	 * @param {MouseEvent} e
	 */
	public moving = (e: MouseEvent) => {
		if (this.isDrawingMode()) {
			return;
		}
		const delta = new fabric.Point(e.movementX, e.movementY);
		const activeObject = this.handler.canvas.getObjects();
		/**
		 *  ??????????????????????????????????????????????????? ???????????????dom,??????????????????????????????????????? 
		 *  ???????????????????????????????????? ???????????????
		 */
		this.handler.canvas.relativePan(delta);
		/**
		 * HACK fix group moving method
		 */
		this.moveDom(activeObject, e);

		this.handler.canvas.requestRenderAll();
		const { onModified } = this.handler;
		if (onModified) {
			onModified(activeObject);
		}
	};

	public moving222 = (opt: FabricEvent) => {
		console.log(opt);
		const { target } = opt as any;
		if (this.handler.interactionMode === 'crop') {
			this.handler.cropHandler.moving(opt);
		} else {
			if (this.handler.editable && this.handler.guidelineOption.enabled) {
				this.handler.guidelineHandler.movingGuidelines(target);
			}
			if (target.type === 'activeSelection') {
				const activeSelection = target as fabric.ActiveSelection;
				activeSelection.getObjects().forEach((obj: any) => {
					const left = target.left + obj.left + target.width / 2;
					const top = target.top + obj.top + target.height / 2;
					if (obj.superType === 'node') {
						this.handler.portHandler.setCoords({ ...obj, left, top });
					} else if (obj.superType === 'element') {
						const { id } = obj;
						const el = this.handler.elementHandler.findById(id);
						// TODO... Element object incorrect position
						this.handler.elementHandler.setPositionByOrigin(el, obj, left, top);
					}
				});
				return;
			}
			if (target.superType === 'node') {
				this.handler.portHandler.setCoords(target);
			} else if (target.superType === 'element') {
				const { id } = target;
				const el = this.handler.elementHandler.findById(id);
				this.handler.elementHandler.setPosition(el, target);
			}
		}
	};

	/**
	 * Whether is drawing mode
	 * @returns
	 */
	//???????????????????????????
	public isDrawingMode = () => {
		return (
			this.handler.interactionMode === 'link' ||
			this.handler.interactionMode === 'arrow' ||
			this.handler.interactionMode === 'line' ||
			this.handler.interactionMode === 'polygon' ||
			this.handler.interactionMode === 'polyLine'
		);
	};

	/**
	 * Interaction callback
	 *
	 * @param {FabricObject} obj
	 * @param {(obj: FabricObject) => void} [callback]
	 */
	private interactionCallback = (obj: FabricObject, callback?: (obj: FabricObject) => void) => {
		callback(obj);
	};
}

export default InteractionHandler;
