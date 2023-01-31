import anime from 'animejs';
import { fabric } from 'fabric';
import { code } from '../constants';
import { NodeObject } from '../objects/Node';
import { VideoObject } from '../objects/Video';
import { FabricEvent, FabricObject ,fixedPointer,setPoints } from '../utils';
import Handler from './Handler';
/**
 * Event Handler Class
 * @author salgum1114
 * @class EventHandler
 */
class EventHandler {
	handler: Handler;
	code: string;
	panning: boolean;

	constructor(handler: Handler) {
		this.handler = handler;
		this.initialize();
	}

	/**
	 * Attch event on document
	 *
	 */
	public initialize() {
		if (this.handler.editable) {
			// @ts-ignore
			this.handler.canvas.on({
				'object:modified': this.modified,
				'object:scaling': this.scaling,
				'object:scaled': this.scaled,
				'object:moving': this.moving,
				'object:moved': this.moved,
				'object:rotating': this.rotating,
				'object:rotated': this.rotated,
				'mouse:wheel': this.mousewheel,
				'mouse:down': this.mousedown,
				'mouse:move': this.mousemove,
				'mouse:up': this.mouseup,
				'selection:cleared': this.selection,
				'selection:created': this.selection,
				'selection:updated': this.selection,
			});
		} else {
			// @ts-ignore
			this.handler.canvas.on({
				'mouse:down': this.mousedown,
				'mouse:move': this.mousemove,
				'mouse:out': this.mouseout,
				'mouse:up': this.mouseup,
				'mouse:wheel': this.mousewheel,
			});
		}
		this.handler.canvas.wrapperEl.tabIndex = 1000;
		this.handler.canvas.wrapperEl.addEventListener('keydown', this.keydown, false);
		this.handler.canvas.wrapperEl.addEventListener('keyup', this.keyup, false);
		this.handler.canvas.wrapperEl.addEventListener('mousedown', this.onmousedown, false);
		this.handler.canvas.wrapperEl.addEventListener('contextmenu', this.contextmenu, false);
		if (this.handler.keyEvent.clipboard) {
			document.addEventListener('paste', this.paste, false);
		}
	}

	/**
	 * Detach event on document
	 *
	 */
	public destroy = () => {
		if (this.handler.editable) {
			this.handler.canvas.off({
				'object:modified': this.modified,
				'object:scaling': this.scaling,
				'object:moving': this.moving,
				'object:moved': this.moved,
				'object:rotating': this.rotating,
				'mouse:wheel': this.mousewheel,
				'mouse:down': this.mousedown,
				'mouse:move': this.mousemove,
				'mouse:up': this.mouseup,
				'selection:cleared': this.selection,
				'selection:created': this.selection,
				'selection:updated': this.selection,
			});
		} else {
			this.handler.canvas.off({
				'mouse:down': this.mousedown,
				'mouse:move': this.mousemove,
				'mouse:out': this.mouseout,
				'mouse:up': this.mouseup,
				'mouse:wheel': this.mousewheel,
			});
			this.handler.getObjects().forEach(object => {
				object.off('mousedown', this.handler.eventHandler.object.mousedown);
				if (object.anime) {
					anime.remove(object);
				}
			});
		}
		this.handler.canvas.wrapperEl.removeEventListener('keydown', this.keydown);
		this.handler.canvas.wrapperEl.removeEventListener('keyup', this.keyup);
		this.handler.canvas.wrapperEl.removeEventListener('mousedown', this.onmousedown);
		this.handler.canvas.wrapperEl.removeEventListener('contextmenu', this.contextmenu);
		if (this.handler.keyEvent.clipboard) {
			this.handler.canvas.wrapperEl.removeEventListener('paste', this.paste);
		}
	};

	/**
	 * Individual object event
	 *
	 */
	public object = {
		/**
		 * Mouse down event on object
		 * @param {FabricEvent} opt
		 */
		mousedown: (opt: FabricEvent) => {
			const { target } = opt;
			if (target && target.link && target.link.enabled) {
				const { onClick } = this.handler;
				if (onClick) {
					onClick(this.handler.canvas, target);
				}
			}
		},
		/**
		 * Mouse double click event on object
		 * @param {FabricEvent} opt
		 */
		mousedblclick: (opt: FabricEvent) => {
			const { target } = opt;
			if (target) {
				const { onDblClick } = this.handler;
				if (onDblClick) {
					onDblClick(this.handler.canvas, target);
				}
			}
		},
	};

	/**
	 * Modified event object
	 *
	 * @param {FabricEvent} opt
	 * @returns
	 */
	public modified = (opt: FabricEvent) => {
		const { target } = opt;
		if (!target) {
			return;
		}
		if (target.type === 'circle' && target.parentId) {
			return;
		}
		const { onModified } = this.handler;
		if (onModified) {
			onModified(target);
		}
	};

	/**
	 * Moving event object
	 *
	 * @param {FabricEvent} opt
	 * @returns
	 */
	public moving = (opt: FabricEvent) => {
		const { target  ,e} = opt as any;
		if (this.handler.interactionMode === 'crop') {
			this.handler.cropHandler.moving(opt);
		} else {
			if (this.handler.editable && this.handler.guidelineOption.enabled) {
				this.handler.guidelineHandler.movingGuidelines(target);
			}
			const moveTypeAction = (target)=>{
				const activeSelection = target as fabric.ActiveSelection;

				activeSelection.getObjects().forEach((obj: any,idx:number) => {
					let  el ,
					left = target.left + obj.left + target.width / 2,
					top = target.top + obj.top + target.height / 2;
					const { id } = obj;
					const type = obj.superType || obj.type;
					switch(type){
						case "node":
							this.handler.portHandler.setCoords({ ...obj, left, top });
							break;
						case "element":
							 el = this.handler.elementHandler.findById(id);
							//因为框选的element移动有bug,通过movement去修复
							 left = Number(el.style.left.split("px")[0]) + e.movementX;
							 top = Number(el.style.top.split("px")[0]) + e.movementY;
							// TODO... Element object incorrect position
							this.handler.elementHandler.setPositionByOrigin(el, obj, left, top);
							break;
						case "group":
							//HACK find root element to move
							moveTypeAction(obj)
							break;
					}
				});
			}
			// HACK  fixed group and selection move
			if (target.type === 'activeSelection' || target.type === 'group') {
				moveTypeAction(target)
				return;
			}
			if (target.superType === 'node') {
				this.handler.portHandler.setCoords(target);
			} else if (target.superType === 'element') {
				const { id } = target;
				const el = this.handler.elementHandler.findById(id);
				this.handler.elementHandler.setPosition(el, target);
				this.handler.elementHandler.setSize(el, target);
				this.handler.elementHandler.setScaleOrAngle(el, target);
				this.handler.elementHandler.setFlip(el, target);
			}
		}
	};

	/**
	 * Moved event object
	 *
	 * @param {FabricEvent} opt
	 */
	public moved = (opt: FabricEvent) => {
		const { target } = opt;
		this.handler.gridHandler.setCoords(target);
		if (!this.handler.transactionHandler.active) {
			this.handler.transactionHandler.save('moved');
		}
		if (target.superType === 'element') {
			const { id } = target;
			const el = this.handler.elementHandler.findById(id);
			this.handler.elementHandler.setPosition(el, target);
		}
	};

	/**
	 * Scaling event object
	 *
	 * @param {FabricEvent} opt
	 */
	public scaling = (opt: FabricEvent) => {
		const { target } = opt as any;
		if (this.handler.interactionMode === 'crop') {
			this.handler.cropHandler.resize(opt);
		}
		// TODO...this.handler.guidelineHandler.scalingGuidelines(target);
		if (target.superType === 'element') {
			const { id, width, height } = target;
			const el = this.handler.elementHandler.findById(id);
			// update the element
			this.handler.elementHandler.setScaleOrAngle(el, target);
			this.handler.elementHandler.setSize(el, target);
			this.handler.elementHandler.setPosition(el, target);
			this.handler.elementHandler.setFlip(el, target);
			const video = target as VideoObject;
			if (video.type === 'video' && video.player) {
				video.player.setPlayerSize(width, height);
			}
		}
	};

	/**
	 * Scaled event object
	 *
	 * @param {FabricEvent} opt
	 */
	public scaled = (_opt: FabricEvent) => {
		if (!this.handler.transactionHandler.active) {
			this.handler.transactionHandler.save('scaled');
		}
	};

	/**
	 * Rotating event object
	 *
	 * @param {FabricEvent} opt
	 */
	public rotating = (opt: FabricEvent) => {
		const { target } = opt as any;
		if (target.superType === 'element') {
			const { id } = target;
			const el = this.handler.elementHandler.findById(id);
			// update the element
			this.handler.elementHandler.setPosition(el, target);
			this.handler.elementHandler.setScaleOrAngle(el, target);
			return ;
		}
		//如果是成组旋转用下面的方法
		if (target.type === 'activeSelection') {
			const activeSelection = target as fabric.ActiveSelection;
			activeSelection.getObjects().forEach((obj: any,idx) => {
				const left = target.left + obj.left + target.width / 2;
				const top = target.top + obj.top + target.height / 2;
				if (obj.superType === 'node') {
					this.handler.portHandler.setCoords({ ...obj, left, top });
				} else if (obj.superType === 'element') {
					const { id } = obj;
					const el = this.handler.elementHandler.findById(id);
					// TODO... Element object incorrect position
					// this.handler.elementHandler.setScaleOrAngle(el, obj);
					// this.handler.elementHandler.setSize(el, obj);
					// this.handler.elementHandler.setPosition(el, target);
					// this.handler.elementHandler.setPositionByOrigin(el, obj, left, top);
					// this.handler.elementHandler.setPositionByRotate(el, target ,left , top);
					this.handler.elementHandler.setRotate(el, target ,left , top ,obj);
				}
			});
			return;
		}
	};

	/**
	 * Rotated event object
	 *
	 * @param {FabricEvent} opt
	 */
	public rotated = (_opt: FabricEvent) => {
		if (!this.handler.transactionHandler.active) {
			this.handler.transactionHandler.save('rotated');
		}
	};

	/**
	 * Moing object at keyboard arrow key down event
	 *
	 * @param {KeyboardEvent} e
	 * @returns
	 */
	public arrowmoving = (e: KeyboardEvent) => {
		//只有fabric对象才能获取到
		const activeObject = this.handler.canvas.getActiveObject() as FabricObject;

		if (!activeObject) {
			return false;
		}
		if (activeObject.id === 'workarea') {
			return false;
		}
		if(activeObject.superType === "element"){
			switch(e.code){
				case code.ARROW_UP:
					activeObject.element.style['top'] =
					Number(activeObject.element.style['top'].slice(0,-2)) -2 +'px';
				break;
				case code.ARROW_DOWN:
					activeObject.element.style['top'] =
					 Number(activeObject.element.style['top'].slice(0,-2)) +2 +'px';
				break;
				case code.ARROW_LEFT:
					activeObject.element.style['left'] =
					Number(activeObject.element.style['left'].slice(0,-2)) -2 +'px';
				break;
				case code.ARROW_RIGHT:
					activeObject.element.style['left'] =
					Number(activeObject.element.style['left'].slice(0,-2)) +2 +'px';
				break;
			}
		}
		if (e.code === code.ARROW_UP) {
			activeObject.set('top', activeObject.top - 2);
			activeObject.setCoords();
			this.handler.canvas.renderAll();
			return true;
		} else if (e.code === code.ARROW_DOWN) {
			activeObject.set('top', activeObject.top + 2);
			activeObject.setCoords();
			this.handler.canvas.renderAll();
			return true;
		} else if (e.code === code.ARROW_LEFT) {
			activeObject.set('left', activeObject.left - 2);
			activeObject.setCoords();
			this.handler.canvas.renderAll();
			return true;
		} else if (e.code === code.ARROW_RIGHT) {
			activeObject.set('left', activeObject.left + 2);
			activeObject.setCoords();
			this.handler.canvas.renderAll();
			return true;
		}
		if (this.handler.onModified) {
			this.handler.onModified(activeObject);
		}
		return true;
	};

	/**
	 * Zoom at mouse wheel event
	 *
	 * @param {FabricEvent<WheelEvent>} opt
	 * @returns
	 */
	public mousewheel = (opt: FabricEvent) => {
		const event = opt as FabricEvent<WheelEvent>;
		const { zoomEnabled } = this.handler;
		if (!zoomEnabled) {
			return;
		}
		const delta = event.e.deltaY;
		let zoomRatio = this.handler.canvas.getZoom();
		if (delta > 0) {
			zoomRatio -= 0.05;
		} else {
			zoomRatio += 0.05;
		}
		this.handler.zoomHandler.zoomToPoint(
			new fabric.Point(this.handler.canvas.getWidth() / 2, this.handler.canvas.getHeight() / 2),
			zoomRatio,
		);
		event.e.preventDefault();
		event.e.stopPropagation();
	};

	/**
	 * Mouse down event on object
	 *
	 * @param {FabricEvent<MouseEvent>} opt
	 * @returns
	 */
	public mousedown = (opt: FabricEvent) => {
		const event = opt as FabricEvent<MouseEvent>;
		const { e, target } = event;
		const { editable } = this.handler;
		// if (event.e.altKey && editable && !this.handler.interactionHandler.isDrawingMode()) {
		// 	this.handler.interactionHandler.grab();
		// 	this.panning = true;
		// 	return;
		// }
		if (this.handler.interactionMode === 'grab') {
			this.panning = true;
			return;
		}
		if (editable) {
			if (this.handler.prevTarget && this.handler.prevTarget.superType === 'link') {
				this.handler.prevTarget.set({
					stroke: this.handler.prevTarget.originStroke || this.handler.prevTarget.stroke,
				});
			}
			if (target && target.type === 'fromPort') {
				this.handler.linkHandler.init(target);
				return;
			}
			if (
				target &&
				this.handler.interactionMode === 'link' &&
				(target.type === 'toPort' || target.superType === 'node')
			) {
				let toPort;
				if (target.superType === 'node') {
					toPort = target.toPort;
				} else {
					toPort = target;
				}
				this.handler.linkHandler.generate(toPort);
				return;
			}
			this.handler.guidelineHandler.viewportTransform = this.handler.canvas.viewportTransform;
			this.handler.guidelineHandler.zoom = this.handler.canvas.getZoom();
			if (this.handler.interactionMode === 'selection') {
				if (target && target.superType === 'link') {
					target.set({
						stroke: target.selectedStroke || 'green',
					});
				}
				this.handler.prevTarget = target;
				return;
			}
			if (this.handler.interactionMode === 'polygon') {
				if (target && this.handler.pointArray.length && target.id === this.handler.pointArray[0].id) {
					this.handler.drawingHandler.polygon.generate(this.handler.pointArray);
				} else {
					let pointer ;
					if(target && e.shiftKey){
						pointer = fixedPointer(this.handler.canvas.getPointer(event.e),points)
					}else{
						pointer = this.handler.canvas.getPointer(event.e)
					}

					this.handler.drawingHandler.polygon.addPoint(event);
				}
			} else if (this.handler.interactionMode === 'polyLine') {
				//如果找到对应点位则添加
				//这个步骤暂时用不到

				if (target && this.handler.pointArray.length && target.id === this.handler.pointArray[0].id) {
					this.handler.drawingHandler.polyLine.generate(this.handler.pointArray);
				} else {
					//如果是按住shift的话,则垂直水平定位
					if(target && e.shiftKey && this.handler.pointArray.length>0){
						Object.assign(event.absolutePointer,{
							x:this.handler.activeLine.x2,
							y:this.handler.activeLine.y2,
						})
					}
					this.handler.drawingHandler.polyLine.addPoint(event);
				}
			}  else if (this.handler.interactionMode === 'line') {
				if (this.handler.pointArray.length && this.handler.activeLine) {
					this.handler.drawingHandler.line.generate(event);
				} else {
					this.handler.drawingHandler.line.addPoint(event);
				}
			} else if (this.handler.interactionMode === 'arrow') {
				if (this.handler.pointArray.length && this.handler.activeLine) {
					this.handler.drawingHandler.arrow.generate(event);
				} else {
					this.handler.drawingHandler.arrow.addPoint(event);
				}
			}
		}
	};

	/**
	 * Mouse move event on canvas
	 *
	 * @param {FabricEvent<MouseEvent>} opt
	 * @returns
	 */
	public mousemove = (opt: FabricEvent) => {
		const event = opt as FabricEvent<MouseEvent>;
		const { e, target } = event;
		if (this.handler.interactionMode === 'grab' && this.panning) {
			this.handler.interactionHandler.moving(event.e);
			this.handler.canvas.requestRenderAll();
		}
		if (!this.handler.editable && event.target) {
			if (event.target.superType === 'element') {
				return;
			}
			if (event.target.id !== 'workarea') {
				if (event.target !== this.handler.target) {
					this.handler.tooltipHandler.show(event.target);
				}
			} else {
				this.handler.tooltipHandler.hide(event.target);
			}
		}
		if (this.handler.interactionMode === 'polygon') {
			if (this.handler.activeLine && this.handler.activeLine.class === 'line') {
				const pointer = this.handler.canvas.getPointer(event.e);
				this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
				const points = this.handler.activeShape.get('points');
				points[this.handler.pointArray.length] = {
					x: pointer.x,
					y: pointer.y,
				};
				this.handler.activeShape.set({
					points,
				});
				this.handler.canvas.requestRenderAll();
			}
		} else if (this.handler.interactionMode === 'polyLine') {

			if (this.handler.activeLine && this.handler.activeLine.class === 'line') {
				let pointer = {};
				const points = this.handler.activeShape.get('points');
				//如果是按住shift的话,则垂直水平定位
				if(target && e.shiftKey){
					pointer = fixedPointer(this.handler.canvas.getPointer(event.e),points)
				}else{
					pointer = this.handler.canvas.getPointer(event.e)
				}
				this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
				points[this.handler.pointArray.length] = {
					x: pointer.x,
					y: pointer.y,
				};
				this.handler.activeShape.set({
					pointer,
				});
				this.handler.canvas.requestRenderAll();
			}
		} else if (this.handler.interactionMode === 'line') {
			if (this.handler.activeLine && this.handler.activeLine.class === 'line') {
				const pointer = this.handler.canvas.getPointer(event.e);
				this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
			}
			this.handler.canvas.requestRenderAll();
		} else if (this.handler.interactionMode === 'arrow') {
			if (this.handler.activeLine && this.handler.activeLine.class === 'line') {
				const pointer = this.handler.canvas.getPointer(event.e);
				this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
			}
			this.handler.canvas.requestRenderAll();
		} else if (this.handler.interactionMode === 'link') {
			if (this.handler.activeLine && this.handler.activeLine.class === 'line') {
				const pointer = this.handler.canvas.getPointer(event.e);
				this.handler.activeLine.set({ x2: pointer.x, y2: pointer.y });
			}
			this.handler.canvas.requestRenderAll();
		}
		return;
	};

	/**
	 * Mouse up event on canvas
	 *
	 * @param {FabricEvent<MouseEvent>} opt
	 * @returns
	 */
	public mouseup = (opt: FabricEvent) => {
		const event = opt as FabricEvent<MouseEvent>;
		if (this.handler.interactionMode === 'grab') {
			this.panning = false;
			return;
		}
		const { target, e } = event;
		if (this.handler.interactionMode === 'selection') {
			if (target && e.shiftKey && target.superType === 'node') {
				const node = target as NodeObject;
				this.handler.canvas.discardActiveObject();
				const nodes = [] as NodeObject[];
				this.handler.nodeHandler.getNodePath(node, nodes);
				const activeSelection = new fabric.ActiveSelection(nodes, {
					canvas: this.handler.canvas,
					...this.handler.activeSelectionOption,
				});
				this.handler.canvas.setActiveObject(activeSelection);
				this.handler.canvas.requestRenderAll();
			}
		}
		if (this.handler.editable && this.handler.guidelineOption.enabled) {
			this.handler.guidelineHandler.verticalLines.length = 0;
			this.handler.guidelineHandler.horizontalLines.length = 0;
		}
		// console.log(this.handler.canvas);
		const _canvas = this.handler.canvas;
		this.handler.canvas.item(0).hasControls = false;
		this.handler.canvas.renderAll();
	};

	/**
	 * Mouse out event on canvas
	 *
	 * @param {FabricEvent<MouseEvent>} opt
	 */
	public mouseout = (opt: FabricEvent) => {
		const event = opt as FabricEvent<MouseEvent>;
		if (!event.target) {
			this.handler.tooltipHandler.hide();
		}
	};

	/**
	 * Selection event event on canvas
	 *	这个方法用于鼠标框选 框选出选中的块
	 * @param {FabricEvent} opt
	 */
	public selection = (opt: FabricEvent) => {
		const { onSelect, activeSelectionOption } = this.handler;
		//框选后外框的核心修改代码
		activeSelectionOption.hasControls = false;
		const target = opt.target as FabricObject<fabric.ActiveSelection>;
		if (target && target.type === 'activeSelection') {
			target.set({
				...activeSelectionOption,
			});
		}
		if (onSelect) {
			onSelect(target);
		}
	};

	/**
	 * Called resize event on canvas
	 *
	 * @param {number} nextWidth
	 * @param {number} nextHeight
	 * @returns
	 */
	public resize = (nextWidth: number, nextHeight: number) => {
		this.handler.canvas.setWidth(nextWidth).setHeight(nextHeight);
		this.handler.canvas.setBackgroundColor(
			this.handler.canvasOption.backgroundColor,
			this.handler.canvas.renderAll.bind(this.handler.canvas),
		);
		if (!this.handler.workarea) {
			return;
		}
		const diffWidth = nextWidth / 2 - this.handler.width / 2;
		const diffHeight = nextHeight / 2 - this.handler.height / 2;
		this.handler.width = nextWidth;
		this.handler.height = nextHeight;
		if (this.handler.workarea.layout === 'fixed') {
			this.handler.canvas.centerObject(this.handler.workarea);
			this.handler.workarea.setCoords();
			if (this.handler.gridOption.enabled) {
				return;
			}
			this.handler.canvas.getObjects().forEach((obj: FabricObject) => {
				if (obj.id !== 'workarea') {
					const left = obj.left + diffWidth;
					const top = obj.top + diffHeight;
					obj.set({
						left,
						top,
					});
					obj.setCoords();
					if (obj.superType === 'element') {
						const { id } = obj;
						const el = this.handler.elementHandler.findById(id);
						// update the element
						this.handler.elementHandler.setPosition(el, obj);
					}
				}
			});
			this.handler.canvas.requestRenderAll();
			return;
		}
		if (this.handler.workarea.layout === 'responsive') {
			const { scaleX } = this.handler.workareaHandler.calculateScale();
			const center = this.handler.canvas.getCenter();
			const deltaPoint = new fabric.Point(diffWidth, diffHeight);
			this.handler.canvas.relativePan(deltaPoint);
			this.handler.zoomHandler.zoomToPoint(new fabric.Point(center.left, center.top), scaleX);
			return;
		}
		const scaleX = nextWidth / this.handler.workarea.width;
		const scaleY = nextHeight / this.handler.workarea.height;
		const diffScaleX = nextWidth / (this.handler.workarea.width * this.handler.workarea.scaleX);
		const diffScaleY = nextHeight / (this.handler.workarea.height * this.handler.workarea.scaleY);
		this.handler.workarea.set({
			scaleX,
			scaleY,
		});
		this.handler.canvas.getObjects().forEach((obj: any) => {
			const { id } = obj;
			if (obj.id !== 'workarea') {
				const left = obj.left * diffScaleX;
				const top = obj.top * diffScaleY;
				const newScaleX = obj.scaleX * diffScaleX;
				const newScaleY = obj.scaleY * diffScaleY;
				obj.set({
					scaleX: newScaleX,
					scaleY: newScaleY,
					left,
					top,
				});
				obj.setCoords();
				if (obj.superType === 'element') {
					const video = obj as VideoObject;
					const { width, height } = obj;
					const el = this.handler.elementHandler.findById(id);
					this.handler.elementHandler.setSize(el, obj);
					if (video.player) {
						video.player.setPlayerSize(width, height);
					}
					this.handler.elementHandler.setPosition(el, obj);
				}
			}
		});
		this.handler.canvas.renderAll();
	};

	/**
	 * Paste event on canvas
	 *
	 * @param {ClipboardEvent} e
	 * @returns
	 */
	public paste = async (e: ClipboardEvent) => {
		if (this.handler.canvas.wrapperEl !== document.activeElement) {
			return false;
		}
		if (e.preventDefault) {
			e.preventDefault();
		}
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		const clipboardData = e.clipboardData;
		if (clipboardData.types.length) {
			clipboardData.types.forEach((clipboardType: string) => {
				if (clipboardType === 'text/plain') {
					const textPlain = clipboardData.getData('text/plain');
					try {
						const objects = JSON.parse(textPlain);
						const {
							gridOption: { grid = 10 },
							isCut,
						} = this.handler;
						const padding = isCut ? 0 : grid;
						if (objects && Array.isArray(objects)) {
							const filteredObjects = objects.filter(obj => obj !== null);
							if (filteredObjects.length === 1) {
								const obj = filteredObjects[0];
								if (typeof obj.cloneable !== 'undefined' && !obj.cloneable) {
									return;
								}
								obj.left = obj.properties.left + padding;
								obj.top = obj.properties.top + padding;
								const createdObj = this.handler.add(obj, false, true);
								this.handler.canvas.setActiveObject(createdObj as FabricObject);
								this.handler.canvas.requestRenderAll();
							} else {
								const nodes = [] as any[];
								const targets = [] as any[];
								objects.forEach(obj => {
									if (!obj) {
										return;
									}
									if (obj.superType === 'link') {
										obj.fromNodeId = nodes[obj.fromNodeIndex].id;
										obj.toNodeId = nodes[obj.toNodeIndex].id;
									} else {
										obj.left = obj.properties.left + padding;
										obj.top = obj.properties.top + padding;
									}
									const createdObj = this.handler.add(obj, false, true);
									if (obj.superType === 'node') {
										nodes.push(createdObj);
									} else {
										targets.push(createdObj);
									}
								});
								const activeSelection = new fabric.ActiveSelection(nodes.length ? nodes : targets, {
									canvas: this.handler.canvas,
									...this.handler.activeSelectionOption,
								});
								this.handler.canvas.setActiveObject(activeSelection);
								this.handler.canvas.requestRenderAll();
							}
							if (!this.handler.transactionHandler.active) {
								this.handler.transactionHandler.save('paste');
							}
							this.handler.isCut = false;
							this.handler.copy();
						}
					} catch (error) {
						console.error(error);
						// const item = {
						//     id: uuv4id(),
						//     type: 'textbox',
						//     text: textPlain,
						// };
						// this.handler.add(item, true);
					}
				} else if (clipboardType === 'text/html') {
					// Todo ...
					// const textHtml = clipboardData.getData('text/html');
					// console.log(textHtml);
				} else if (clipboardType === 'Files') {
					// Array.from(clipboardData.files).forEach((file) => {
					//     const { type } = file;
					//     if (type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg') {
					//         const item = {
					//             id: uuid(),
					//             type: 'image',
					//             file,
					//             superType: 'image',
					//         };
					//         this.handler.add(item, true);
					//     } else {
					//         console.error('Not supported file type');
					//     }
					// });
				}
			});
		}
		return true;
	};

	/**
	 * Keydown event on document
	 *
	 * @param {KeyboardEvent} e
	 */
	public keydown = (e: KeyboardEvent) => {
		const { keyEvent, editable } = this.handler;
		if (!Object.keys(keyEvent).length) {
			return;
		}
		const { clipboard, grab } = keyEvent;
		if (this.handler.interactionHandler.isDrawingMode()) {
			if (this.handler.shortcutHandler.isEscape(e)) {
				if (this.handler.interactionMode === 'polygon') {
					this.handler.drawingHandler.polygon.reset();
				} else if (this.handler.interactionMode === 'polyLine') {
					this.handler.drawingHandler.polyLine.reset();
				} else if (this.handler.interactionMode === 'line') {
					this.handler.drawingHandler.line.finish();
				} else if (this.handler.interactionMode === 'arrow') {
					this.handler.drawingHandler.arrow.finish();
				} else if (this.handler.interactionMode === 'link') {
					this.handler.linkHandler.finish();
				}
			}
			if(this.handler.shortcutHandler.isScape(e)){
				if(this.handler.interactionMode === 'polygon'){
					this.handler.drawingHandler.polygon.finish();
				}else if(this.handler.interactionMode === 'polyLine'){
					this.handler.drawingHandler.polyLine.finish();
				}
			}
			return;
		}
		if (this.handler.shortcutHandler.isW(e) && grab) {
			this.code = e.code;
			this.handler.interactionHandler.grab();
			return;
		}
		// if (e.altKey && editable && grab) {
		// 	this.handler.interactionHandler.grab();
		// 	return;
		// }
		if (this.handler.shortcutHandler.isEscape(e)) {
			if (this.handler.interactionMode === 'selection') {
				this.handler.canvas.discardActiveObject();
				this.handler.canvas.renderAll();
			}
			this.handler.tooltipHandler.hide();
		}
		if (this.handler.canvas.wrapperEl !== document.activeElement) {
			return;
		}
		if (editable) {
			if (this.handler.shortcutHandler.isQ(e)) {
				this.code = e.code;
			} else if (this.handler.shortcutHandler.isDelete(e)) {
				this.handler.remove();
			} else if (this.handler.shortcutHandler.isArrow(e)) {
				this.arrowmoving(e);
			} else if (this.handler.shortcutHandler.isCtrlA(e)) {
				e.preventDefault();
				this.handler.selectAll();
			} else if (this.handler.shortcutHandler.isCtrlC(e)) {
				e.preventDefault();
				this.handler.copy();
			} else if (this.handler.shortcutHandler.isCtrlV(e) && !clipboard) {
				e.preventDefault();
				this.handler.paste();
			} else if (this.handler.shortcutHandler.isCtrlX(e)) {
				e.preventDefault();
				this.handler.cut();
			} else if (this.handler.shortcutHandler.isCtrlZ(e)) {
				e.preventDefault();
				this.handler.transactionHandler.undo();
			} else if (this.handler.shortcutHandler.isCtrlY(e)) {
				e.preventDefault();
				this.handler.transactionHandler.redo();
			} else if (this.handler.shortcutHandler.isPlus(e)) {
				e.preventDefault();
				this.handler.zoomHandler.zoomIn();
			} else if (this.handler.shortcutHandler.isMinus(e)) {
				e.preventDefault();
				this.handler.zoomHandler.zoomOut();
			} else if (this.handler.shortcutHandler.isO(e)) {
				e.preventDefault();
				this.handler.zoomHandler.zoomOneToOne();
			} else if (this.handler.shortcutHandler.isP(e)) {
				e.preventDefault();
				this.handler.zoomHandler.zoomToFit();
			}
			return;
		}
		return;
	};

	/**
	 * Key up event on canvas
	 *
	 * @param {KeyboardEvent} _e
	 */
	public keyup = (e: KeyboardEvent) => {
		if (this.handler.interactionHandler.isDrawingMode()) {
			return;
		}
		if (!this.handler.shortcutHandler.isW(e)) {
			this.handler.interactionHandler.selection();
		}
	};

	/**
	 * Context menu event on canvas
	 *
	 * @param {MouseEvent} e
	 */
	public contextmenu = (e: MouseEvent) => {
		e.preventDefault();
		const { editable, onContext } = this.handler;
		if (editable && onContext) {
			const target = this.handler.canvas.findTarget(e, false) as FabricObject;
			if (target && target.type !== 'activeSelection') {
				this.handler.select(target);
			}
			this.handler.contextmenuHandler.show(e, target);
		}
	};

	/**
	 * Mouse down event on canvas
	 *
	 * @param {MouseEvent} _e
	 */
	public onmousedown = (_e: MouseEvent) => {
		this.handler.contextmenuHandler.hide();
	};
}

export default EventHandler;


