import axios from 'axios';
import * as echarts from 'echarts';
import { fabric } from 'fabric';
import { union } from 'lodash';
import { uuid } from 'uuidv4';
import warning from 'warning';
import {
	AlignmentHandler,
	AnimationHandler,
	ChartHandler,
	ContextmenuHandler,
	CropHandler,
	CustomHandler,
	DrawingHandler,
	ElementHandler,
	EventHandler,
	GridHandler,
	GuidelineHandler,
	ImageHandler,
	InteractionHandler,
	LinkHandler,
	NodeHandler,
	PortHandler,
	ShortcutHandler,
	TooltipHandler,
	TransactionHandler,
	WorkareaHandler,
	ZoomHandler,
	selectDomJSON,
} from '.';
import CanvasObject from '../CanvasObject';
import { defaults } from '../constants';
import { LinkObject } from '../objects/Link';
import { NodeObject } from '../objects/Node';
import { PortObject } from '../objects/Port';
import {
	CanvasOption,
	FabricCanvas,
	FabricElement,
	FabricGroup,
	FabricImage,
	FabricObject,
	FabricObjectOption,
	FabricObjects,
	GridOption,
	GuidelineOption,
	InteractionMode,
	KeyEvent,
	WorkareaObject,
	WorkareaOption,
	findDomeById,
	setTrie,
} from '../utils';
import { LinkOption } from './LinkHandler';
import { TransactionEvent } from './TransactionHandler';

export interface HandlerCallback {
	/**
	 * When has been added object in Canvas, Called function
	 *
	 */
	onAdd?: (object: FabricObject) => void;
	/**
	 * Return contextmenu element
	 *
	 */
	onContext?: (el: HTMLDivElement, e: React.MouseEvent, target?: FabricObject) => Promise<any> | any;
	/**
	 * Return tooltip element
	 *
	 */
	onTooltip?: (el: HTMLDivElement, target?: FabricObject) => Promise<any> | any;
	/**
	 * When zoom, Called function
	 */
	onZoom?: (zoomRatio: number) => void;
	/**
	 * When clicked object, Called function
	 *
	 */
	onClick?: (canvas: FabricCanvas, target: FabricObject) => void;
	/**
	 * When double clicked object, Called function
	 *
	 */
	onDblClick?: (canvas: FabricCanvas, target: FabricObject) => void;
	/**
	 * When modified object, Called function
	 */
	onModified?: (target: FabricObject) => void;
	/**
	 * When select object, Called function
	 *
	 */
	onSelect?: (target: FabricObject) => void;
	/**
	 * When has been removed object in Canvas, Called function
	 *
	 */
	onRemove?: (target: FabricObject) => void;
	/**
	 * When has been undo or redo, Called function
	 *
	 */
	onTransaction?: (transaction: TransactionEvent) => void;
	/**
	 * When has been changed interaction mode, Called function
	 *
	 */
	onInteraction?: (interactionMode: InteractionMode) => void;
	/**
	 * When canvas has been loaded
	 *
	 */
	onLoad?: (handler: Handler, canvas?: fabric.Canvas) => void;
}

export interface HandlerOption {
	/**
	 * Canvas id
	 * @type {string}
	 */
	id?: string;
	/**
	 * Canvas object
	 * @type {FabricCanvas}
	 */
	canvas?: FabricCanvas;
	/**
	 * Canvas parent element
	 * @type {HTMLDivElement}
	 */
	container?: HTMLDivElement;
	/**
	 * Canvas editable
	 * @type {boolean}
	 */
	editable?: boolean;
	/**
	 * Canvas interaction mode
	 * @type {InteractionMode}
	 */
	interactionMode?: InteractionMode;
	/**
	 * Persist properties for object
	 * @type {string[]}
	 */
	propertiesToInclude?: string[];
	/**
	 * Minimum zoom ratio
	 * @type {number}
	 */
	minZoom?: number;
	/**
	 * Maximum zoom ratio
	 * @type {number}
	 */
	maxZoom?: number;
	/**
	 * Workarea option
	 * @type {WorkareaOption}
	 */
	workareaOption?: WorkareaOption;
	/**
	 * Canvas option
	 * @type {CanvasOption}
	 */
	canvasOption?: CanvasOption;
	/**
	 * Grid option
	 * @type {GridOption}
	 */
	gridOption?: GridOption;
	/**
	 * Default option for Fabric Object
	 * @type {FabricObjectOption}
	 */
	objectOption?: FabricObjectOption;
	/**
	 * Guideline option
	 * @type {GuidelineOption}
	 */
	guidelineOption?: GuidelineOption;
	/**
	 * Whether to use zoom
	 * @type {boolean}
	 */
	zoomEnabled?: boolean;
	/**
	 * ActiveSelection option
	 * @type {Partial<FabricObjectOption<fabric.ActiveSelection>>}
	 */
	activeSelectionOption?: Partial<FabricObjectOption<fabric.ActiveSelection>>;
	/**
	 * Canvas width
	 * @type {number}
	 */
	width?: number;
	/**
	 * Canvas height
	 * @type {number}
	 */
	height?: number;
	/**
	 * Keyboard event in Canvas
	 * @type {KeyEvent}
	 */
	keyEvent?: KeyEvent;
	/**
	 * Append custom objects
	 * @type {{ [key: string]: any }}
	 */
	fabricObjects?: FabricObjects;
	handlers?: { [key: string]: CustomHandler };
	[key: string]: any;
}

export type HandlerOptions = HandlerOption & HandlerCallback;

/**
 * Main handler for Canvas
 * @class Handler
 * @implements {HandlerOptions}
 */
class Handler implements HandlerOptions {
	public maxTier : Number ;
	public id: string;
	public canvas: FabricCanvas;
	public workarea: WorkareaObject;
	public container: HTMLDivElement;
	public editable: boolean;
	public interactionMode: InteractionMode;
	public minZoom: number;
	public maxZoom: number;
	public propertiesToInclude?: string[] = defaults.propertiesToInclude;
	public workareaOption?: WorkareaOption = defaults.workareaOption;
	public canvasOption?: CanvasOption = defaults.canvasOption;
	public gridOption?: GridOption = defaults.gridOption;
	public objectOption?: FabricObjectOption = defaults.objectOption;
	public guidelineOption?: GuidelineOption = defaults.guidelineOption;
	public keyEvent?: KeyEvent = defaults.keyEvent;
	public activeSelectionOption?: Partial<FabricObjectOption<fabric.ActiveSelection>> = defaults.activeSelectionOption;
	public fabricObjects?: FabricObjects = CanvasObject;
	public zoomEnabled?: boolean;
	public width?: number;
	public height?: number;

	public onAdd?: (object: FabricObject) => void;
	public onContext?: (el: HTMLDivElement, e: React.MouseEvent, target?: FabricObject) => Promise<any>;
	public onTooltip?: (el: HTMLDivElement, target?: FabricObject) => Promise<any>;
	public onZoom?: (zoomRatio: number) => void;
	public onClick?: (canvas: FabricCanvas, target: FabricObject) => void;
	public onDblClick?: (canvas: FabricCanvas, target: FabricObject) => void;
	public onModified?: (target: FabricObject) => void;
	public onSelect?: (target: FabricObject) => void;
	public onRemove?: (target: FabricObject) => void;
	public onTransaction?: (transaction: TransactionEvent) => void;
	public onInteraction?: (interactionMode: InteractionMode) => void;
	public onLoad?: (handler: Handler, canvas?: fabric.Canvas) => void;

	public imageHandler: ImageHandler;
	public chartHandler: ChartHandler;
	public elementHandler: ElementHandler;
	public cropHandler: CropHandler;
	public animationHandler: AnimationHandler;
	public contextmenuHandler: ContextmenuHandler;
	public tooltipHandler: TooltipHandler;
	public zoomHandler: ZoomHandler;
	public workareaHandler: WorkareaHandler;
	public interactionHandler: InteractionHandler;
	public transactionHandler: TransactionHandler;
	public gridHandler: GridHandler;
	public portHandler: PortHandler;
	public linkHandler: LinkHandler;
	public nodeHandler: NodeHandler;
	public alignmentHandler: AlignmentHandler;
	public guidelineHandler: GuidelineHandler;
	public eventHandler: EventHandler;
	public drawingHandler: DrawingHandler;
	public shortcutHandler: ShortcutHandler;
	public handlers: { [key: string]: CustomHandler } = {};

	public objectMap: Record<string, FabricObject> = {};
	public objects: FabricObject[];
	public activeLine?: any;
	public activeShape?: any;
	public zoom = 1;
	public prevTarget?: FabricObject;
	public target?: FabricObject;
	public pointArray?: any[];
	public lineArray?: any[];
	public polyLinepoints?: any[];
	public isCut = false;

	private isRequsetAnimFrame = false;
	private requestFrame: any;
	/**
	 * Copied object
	 *
	 * @private
	 * @type {*}
	 */
	private clipboard: any;

	constructor(options: HandlerOptions) {
		this.initialize(options);
	}

	/**
	 * Initialize handler
	 *
	 * @author salgum1114
	 * @param {HandlerOptions} options
	 */
	public initialize(options: HandlerOptions) {
		this.initOption(options);
		this.initCallback(options);
		this.initHandler();
	}

	/**
	 * Init class fields
	 * @param {HandlerOptions} options
	 */
	public initOption = (options: HandlerOptions) => {
		this.id = options.id;
		this.canvas = options.canvas;
		this.container = options.container;
		this.editable = options.editable;
		this.interactionMode = options.interactionMode;
		this.minZoom = options.minZoom;
		this.maxZoom = options.maxZoom;
		this.zoomEnabled = options.zoomEnabled;
		this.width = options.width;
		this.height = options.height;
		this.objects = [];
		this.setPropertiesToInclude(options.propertiesToInclude);
		// this.setWorkareaOption(options.workareaOption);
		this.setCanvasOption(options.canvasOption);
		this.setGridOption(options.gridOption);
		this.setObjectOption(options.objectOption);
		this.setFabricObjects(options.fabricObjects);
		this.setGuidelineOption(options.guidelineOption);
		this.setActiveSelectionOption(options.activeSelectionOption);
		this.setKeyEvent(options.keyEvent);
	};

	/**
	 * Initialize callback
	 * @param {HandlerOptions} options
	 */
	public initCallback = (options: HandlerOptions) => {
		this.onAdd = options.onAdd;
		this.onTooltip = options.onTooltip;
		this.onZoom = options.onZoom;
		this.onContext = options.onContext;
		this.onClick = options.onClick;
		this.onModified = options.onModified;
		this.onDblClick = options.onDblClick;
		this.onSelect = options.onSelect;
		this.onRemove = options.onRemove;
		this.onTransaction = options.onTransaction;
		this.onInteraction = options.onInteraction;
		this.onLoad = options.onLoad;
	};

	/**
	 * Initialize handlers
	 *
	 */
	public initHandler = () => {
		this.workareaHandler = new WorkareaHandler(this);
		this.imageHandler = new ImageHandler(this);
		this.chartHandler = new ChartHandler(this);
		this.elementHandler = new ElementHandler(this);
		this.cropHandler = new CropHandler(this);
		this.animationHandler = new AnimationHandler(this);
		this.contextmenuHandler = new ContextmenuHandler(this);
		this.tooltipHandler = new TooltipHandler(this);
		this.zoomHandler = new ZoomHandler(this);
		this.interactionHandler = new InteractionHandler(this);
		this.transactionHandler = new TransactionHandler(this);
		this.gridHandler = new GridHandler(this);
		this.portHandler = new PortHandler(this);
		this.linkHandler = new LinkHandler(this);
		this.nodeHandler = new NodeHandler(this);
		this.alignmentHandler = new AlignmentHandler(this);
		this.guidelineHandler = new GuidelineHandler(this);
		this.eventHandler = new EventHandler(this);
		this.drawingHandler = new DrawingHandler(this);
		this.shortcutHandler = new ShortcutHandler(this);
	};

	/**
	 * Get primary object
	 * @returns {FabricObject[]}
	 */
	public getObjects = (): FabricObject[] => {
		const objects = this.canvas.getObjects().filter((obj: FabricObject) => {
			if (obj.id === 'workarea') {
				return false;
			} else if (obj.id === 'grid') {
				return false;
			} else if (obj.superType === 'port') {
				return false;
			} else if (!obj.id) {
				return false;
			}
			return true;
		}) as FabricObject[];
		if (objects.length) {
			objects.forEach(obj => (this.objectMap[obj.id] = obj));
		} else {
			this.objectMap = {};
		}
		return objects;
	};

	public visibleDom = (obj,key,value)=>{
		obj._objects && obj._objects.map((item)=>{
			if(item._objects){
				this.visibleDom(item,key,value)
			}else{
				if (key === 'visible') {
					if (value) {
						item.element.style.display = 'block';
					} else {
						item.element.style.display = 'none';
					}
				}
			}
		})
	}
	/**
	 * Set key pair
	 * @param {keyof FabricObject} key
	 * @param {*} value
	 * @returns
	 */
	public set = (key: keyof FabricObject, value: any,obj) => {
		const activeObject = obj || this.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return;
		}
		if (activeObject.type === 'svg' && (key === 'fill' || key === 'stroke')) {
			(activeObject as FabricGroup)._objects.forEach(obj => obj.set(key, value));
		}
		activeObject.set(key, value);
		activeObject.setCoords();
		this.canvas.requestRenderAll();
		const { id, superType, type, player, width, height } = activeObject as any;
		if (superType === 'element') {
			if (key === 'visible') {
				if (value) {
					activeObject.element.style.display = 'block';
				} else {
					activeObject.element.style.display = 'none';
				}
			}
			const el = this.elementHandler.findById(id);
			// update the element
			this.elementHandler.setScaleOrAngle(el, activeObject);
			this.elementHandler.setSize(el, activeObject);
			this.elementHandler.setPosition(el, activeObject);
			console.log(value,key)
			this.elementHandler.setStyles(el,activeObject,value,key);
			console.log("Handler.ts set方法,每次变更的时候都会进这里")
			if (type === 'video' && player) {
				player.setPlayerSize(width, height);
			}
		}
		if(type === 'group'){
			this.visibleDom(activeObject,key,value)
		}
		const { onModified } = this;
		if (onModified) {
			onModified(activeObject);
		}
	};

	public setStyle = (key: keyof FabricObject, value: any) => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return;
		}
		activeObject.styles[key] = value ;
		activeObject.setCoords();
		this.canvas.requestRenderAll();
		const { id, superType, type, player, width, height } = activeObject as any;
		if (superType === 'element') {
			const el = this.elementHandler.findById(id);
			const inner_el = el.querySelector('*[dombox="element-box"]');
			// update the element
			this.elementHandler.setStyles(inner_el,activeObject,value,key);
			console.log("Handler.ts set方法,每次变更的时候都会进这里")
		}
		/**
		 * BUG 开启会导致组件块重新渲染
		 */
		// const { onModified } = this;
		// if (onModified) {
		// 	onModified(activeObject);
		// }
	};
	
	public setCondition = (key: keyof FabricObject, value: any) => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return;
		}
		activeObject[key] = value[key] ;
		activeObject.setCoords();
		this.canvas.requestRenderAll();
	};
	public setEventConditionList = (key: keyof FabricObject, value: any, idx : Number) => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return;
		}
		activeObject.condition[idx][key] = value ;
		activeObject.setCoords();
		this.canvas.requestRenderAll();
	};
	
	public setHTML = (key: keyof FabricObject, value: any) => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return;
		}
		activeObject.styles[key] = value ;
		activeObject.setCoords();
		this.canvas.requestRenderAll();
		
		const { id, superType, type, player, width, height } = activeObject as any;
		if (superType === 'element') {
			const el = this.elementHandler.findById(id);
			const inner_el = el.querySelector('*[dombox="element-box"]');
			// update the element
			inner_el.innerHTML = value;
		}
		/**
		 * BUG 开启会导致组件块重新渲染
		 */
		// const { onModified } = this;
		// if (onModified) {
		// 	onModified(activeObject);
		// }
	};

	public setSRC = (key: keyof FabricObject, value: any) => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return;
		}
		const setImg =(url,_image)=>{
			activeObject.styles[key] = url ;
			activeObject.width = _image.width  || 69;
			activeObject.height = _image.height || 69;
			activeObject.scaleX = 1;
			activeObject.scaleY = 1;
			 const { id, superType, type, player, width, height } = activeObject as any;
			 if (superType === 'element') {
				 const el = this.elementHandler.findById(id);
				 // update the element
				 this.elementHandler.setScaleOrAngle(el, activeObject);
				 this.elementHandler.setSize(el, activeObject);
				 this.elementHandler.setPosition(el, activeObject);
				 const inner_el = el.querySelector('*[dombox="element-box"]');
				 // update the element
				 inner_el.src = url == '' ? "./images/sample/transparentBg.png" : url;
			 }
			 activeObject.setCoords();
			 this.canvas.requestRenderAll();
		}
		/**
		 * 设置原图尺寸大小
		 */
		if(value ===  null){
			setImg('',{})
		}else{
			const _image = new Image();
			_image.setAttribute('crossOrigin', 'Anonymous');
			_image.src = value;
			_image.onload=()=>{
				setImg(value,_image)
			}
		}

		/**
		 * BUG 开启会导致组件块重新渲染
		 */
		// const { onModified } = this;
		// if (onModified) {
		// 	onModified(activeObject);
		// }
	};


	/**
	 * Set option
	 * @param {Partial<FabricObject>} option
	 * @returns
	 */
	public setObject = (option: Partial<FabricObject>,obj) => {
		const activeObject = obj || this.canvas.getActiveObject() as any;
		if (!activeObject) {
			return;
		}
		Object.keys(option).forEach(key => {
			if (option[key] !== activeObject[key]) {
				activeObject.set(key, option[key]);
				activeObject.setCoords();
			}
		});
		this.canvas.requestRenderAll();
		const { id, superType, type, player, width, height } = activeObject;
		if (superType === 'element') {
			if ('visible' in option) {
				if (option.visible) {
					activeObject.element.style.display = 'block';
				} else {
					activeObject.element.style.display = 'none';
				}
			}
			const el = this.elementHandler.findById(id);
			// update the element
			this.elementHandler.setScaleOrAngle(el, activeObject);
			this.elementHandler.setSize(el, activeObject);
			this.elementHandler.setPosition(el, activeObject);
			if (type === 'video' && player) {
				player.setPlayerSize(width, height);
			}
		}
		const { onModified } = this;
		if (onModified) {
			onModified(activeObject);
		}
	};

	/**
	 * Set key pair by object
	 * @param {FabricObject} obj
	 * @param {string} key
	 * @param {*} value
	 * @returns
	 */
	public setByObject = (obj: any, key: string, value: any) => {
		if (!obj) {
			return;
		}
		if (obj.type === 'svg') {
			if (key === 'fill') {
				obj.setFill(value);
			} else if (key === 'stroke') {
				obj.setStroke(value);
			}
		}
		obj.set(key, value);
		obj.setCoords();
		this.canvas.renderAll();
		const { id, superType, type, player, width, height } = obj as any;
		if (superType === 'element') {
			if (key === 'visible') {
				if (value) {
					obj.element.style.display = 'block';
				} else {
					obj.element.style.display = 'none';
				}
			}
			const el = this.elementHandler.findById(id);
			// update the element
			this.elementHandler.setScaleOrAngle(el, obj);
			this.elementHandler.setSize(el, obj);
			this.elementHandler.setPosition(el, obj);
			if (type === 'video' && player) {
				player.setPlayerSize(width, height);
			}
		}
		const { onModified } = this;
		if (onModified) {
			onModified(obj);
		}
	};

	/**
	 * Set key pair by id
	 * @param {string} id
	 * @param {string} key
	 * @param {*} value
	 */
	public setById = (id: string, key: string, value: any) => {
		const findObject = this.findById(id);
		this.setByObject(findObject, key, value);
	};

	/**
	 * Set partial by object
	 * @param {FabricObject} obj
	 * @param {FabricObjectOption} option
	 * @returns
	 */
	public setByPartial = (obj: FabricObject, option: FabricObjectOption) => {
		if (!obj) {
			return;
		}
		if (obj.type === 'svg') {
			if (option.fill) {
				obj.setFill(option.fill);
			} else if (option.stroke) {
				obj.setStroke(option.stroke);
			}
		}
		obj.set(option);
		obj.setCoords();
		this.canvas.renderAll();
		const { id, superType, type, player, width, height } = obj as any;
		if (superType === 'element') {
			if ('visible' in option) {
				if (option.visible) {
					obj.element.style.display = 'block';
				} else {
					obj.element.style.display = 'none';
				}
			}
			const el = this.elementHandler.findById(id);
			// update the element
			this.elementHandler.setScaleOrAngle(el, obj);
			this.elementHandler.setSize(el, obj);
			this.elementHandler.setPosition(el, obj);
			if (type === 'video' && player) {
				player.setPlayerSize(width, height);
			}
		}
	};

	/**
	 * Set shadow
	 * @param {fabric.Shadow} option
	 * @returns
	 */
	public setShadow = (option: fabric.IShadowOptions) => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return;
		}
		activeObject.set('shadow', new fabric.Shadow(option));
		this.canvas.requestRenderAll();
		const { onModified } = this;
		if (onModified) {
			onModified(activeObject);
		}
	};

	/**
	 * Set the image
	 * @param {FabricImage} obj
	 * @param {(File | string)} [source]
	 * @returns
	 */
	public setImage = (obj: FabricImage, source?: File | string) => {
		if (!source) {
			this.loadImage(obj, null);
			obj.set('file', null);
			obj.set('src', null);
			return;
		}
		if (source instanceof File) {
			const reader = new FileReader();
			reader.onload = () => {
				this.loadImage(obj, reader.result as string);
				obj.set('file', source);
				obj.set('src', null);
			};
			reader.readAsDataURL(source);
		} else {
			this.loadImage(obj, source);
			obj.set('file', null);
			obj.set('src', source);
		}
	};

	/**
	 * Set image by id
	 * @param {string} id
	 * @param {*} source
	 */
	public setImageById = (id: string, source: any) => {
		const findObject = this.findById(id) as FabricImage;
		this.setImage(findObject, source);
	};

	/**
	 * Set visible
	 * @param {boolean} [visible]
	 * @returns
	 */
	public setVisible = (visible?: boolean) => {
		const activeObject = this.canvas.getActiveObject() as FabricElement;
		if (!activeObject) {
			return;
		}
		if (activeObject.superType === 'element') {
			if (visible) {
				activeObject.element.style.display = 'block';
			} else {
				activeObject.element.style.display = 'none';
			}
		}
		activeObject.set({
			visible,
		});
		this.canvas.renderAll();
	};

	/**
	 * Set the position on Object
	 *
	 * @param {FabricObject} obj
	 * @param {boolean} [centered]
	 */
	public centerObject = (obj: FabricObject, centered?: boolean) => {
		if (centered) {
			this.canvas.centerObject(obj);
			obj.setCoords();
		} else {
			this.setByPartial(obj, {
				left:
					obj.left / this.canvas.getZoom() -
					obj.width / 2 -
					this.canvas.viewportTransform[4] / this.canvas.getZoom(),
				top:
					obj.top / this.canvas.getZoom() -
					obj.height / 2 -
					this.canvas.viewportTransform[5] / this.canvas.getZoom(),
			});
		}
	};

	/**
	 * Add object
	 * @param {FabricObjectOption} obj
	 * @param {boolean} [centered=true]
	 * @param {boolean} [loaded=false]
	 * @returns
	 */
	public add = (obj: FabricObjectOption, centered = true, loaded = false) => {


		//   /canvas/handlers/Handler.ts
		const { editable, onAdd, gridOption, objectOption } = this;
		let option: any = {
			hasControls: editable,
			hasBorders: editable,
			selectable: editable,
			lockMovementX: !editable,
			lockMovementY: !editable,
			hoverCursor: !editable ? 'pointer' : 'move',
		};
		/**
		 * judge parmas lock & group
		 */
		if(obj.locked != undefined){
			option.lockMovementX = obj.locked;
			option.lockMovementY = obj.locked;
			option.hasControls = obj.type === "group" ? false : !obj.locked;
			option.editable = obj.type === "group" ? false : !obj.locked;
			option.hoverCursor = obj.locked ? 'pointer' : 'move';
			option.locked = obj.locked;
		}

		if (obj.type === 'i-text') {
			option.editable = false;
		} else {
			option.editable = editable;
		}
		if (editable && this.workarea.layout === 'fullscreen') {
			option.scaleX = this.workarea.scaleX;
			option.scaleY = this.workarea.scaleY;
		}
		const newOption = Object.assign(
			{},
			objectOption,
			obj,
			{
				container: this.container.id,
				editable,
			},
			option,
		);
		// Individually create canvas object
		if (obj.superType === 'link') {
			return this.linkHandler.create(newOption, loaded);
		}
		let createdObj;

		/**
		 * HACK change image init , don`t use canvas object
		 */
		// Create canvas object
		// if (obj.type === 'image') {
		// 	createdObj = this.addImage(newOption);
		// } else 
		if (obj.type === 'group') {
			// TODO...
			/**
			 * HACK Group add function needs to be fixed
			 * **/
			// const _objects = this.addGroup(newOption._objects || newOption.objects);
			let groupOption ={} ;
			groupOption = this.setGroup(newOption,[]);
			createdObj = groupOption;
			//找到对应组件创建方法,并创建
		} else {
			createdObj = this.fabricObjects[obj.type].create(newOption);
		}
		this.canvas.add(createdObj);

		this.objects = this.getObjects();
		console.log(this.objects);

		if (!editable && !(obj.superType === 'element')) {
			createdObj.on('mousedown', this.eventHandler.object.mousedown);
		}
		if (createdObj.dblclick) {
			createdObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
		}
		if (this.objects.some(object => object.type === 'gif')) {
			this.startRequestAnimFrame();
		} else {
			this.stopRequestAnimFrame();
		}
		/**
		 * BUG 暂时注释
		 */
		// if (obj.superType !== 'drawing' && obj.superType !== 'link' && editable && !loaded) {
		// 	this.centerObject(createdObj, centered);
		// }
		if (createdObj.superType === 'node') {
			this.portHandler.create(createdObj as NodeObject);
			if (createdObj.iconButton) {
				this.canvas.add(createdObj.iconButton);
			}
		}
		if (!editable && createdObj.animation && createdObj.animation.autoplay) {
			this.animationHandler.play(createdObj.id);
		}
		if (createdObj.superType === 'node') {
			createdObj.set('shadow', {
				color: createdObj.stroke,
			} as fabric.Shadow);
		}
		if (gridOption.enabled) {
			this.gridHandler.setCoords(createdObj);
		}
		/**
		 * TIPS loaded 参数可能会导致撤回问题,目前无法复现
		 */
		if (!this.transactionHandler.active && !loaded) {
			this.transactionHandler.save('add');
		}
		if (onAdd && editable && !loaded) {
			onAdd(createdObj);
		}
		return createdObj;
	};

	/**
	 * Add group object
	 *
	 * @param {FabricGroup} obj
	 * @param {boolean} [centered=true]
	 * @param {boolean} [loaded=false]
	 * @returns
	 */
	public setGroup = (obj: FabricGroup) => {
		const _list = obj._objects || obj.objects;
		let _objs = [];
		_list.map(child => {
			if(child.type === 'group'){
				_objs.push(this.setGroup(child));
			}else{
				/**
				 * 重新给个新的id
				 */
				child.id = uuid();
				_objs.push(this.fabricObjects[child.type].create(child));
			}
		});

		return new fabric.Group(_objs,{
			left:obj.left,
			top:obj.top,
			width:obj.width,
			height:obj.height,
			name: obj.name,
			type: 'group',
			id: obj.id,
			hasControls:false,
		})
	};
	/**
	 * Add group object
	 *
	 * @param {FabricGroup} obj
	 * @param {boolean} [centered=true]
	 * @param {boolean} [loaded=false]
	 * @returns
	 */
	public addGroup = (obj: FabricGroup) => {
		return obj.map(child => {
			return this.fabricObjects[child.type].create(child);
		});
	};

	/**
	 * Add iamge object
	 * @param {FabricImage} obj
	 * @returns
	 */
	public addImage = (obj: FabricImage) => {
		const { objectOption } = this;
		const { filters = [], ...otherOption } = obj;
		const image = new Image();
		if (obj.src) {
			image.src = obj.src;
		}
		const createdObj = new fabric.Image(image, {
			...objectOption,
			...otherOption,
		}) as FabricImage;
		createdObj.set({
			filters: this.imageHandler.createFilters(filters),
		});
		this.setImage(createdObj, obj.src || obj.file);
		return createdObj;
	};

	public deleteGroup = (object)=>{
		const objs = object.getObjects();
		objs.map((obj)=>{
			if(obj.type === 'group'){
				this.deleteGroup(obj)
			}else{
				this.elementHandler.removeById(obj.id);
			}
		})
	}
	/**
	 * Remove object
	 * @param {FabricObject} target
	 * @returns {any}
	 */
	public remove = (target?: FabricObject) => {
		const activeObject = target || (this.canvas.getActiveObject() as any);
		if (this.prevTarget && this.prevTarget.superType === 'link') {
			this.linkHandler.remove(this.prevTarget as LinkObject);
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('remove');
			}
			return;
		}
		if (!activeObject) {
			return;
		}
		if (typeof activeObject.deletable !== 'undefined' && !activeObject.deletable) {
			return;
		}
		if (activeObject.type !== 'activeSelection') {
			this.canvas.discardActiveObject();
			if (activeObject.type === 'group') {
				this.deleteGroup(activeObject)
			}
			if (activeObject.superType === 'element') {
				this.elementHandler.removeById(activeObject.id);
			}
			if (activeObject.superType === 'link') {
				this.linkHandler.remove(activeObject);
			} else if (activeObject.superType === 'node') {
				if (activeObject.toPort) {
					if (activeObject.toPort.links.length) {
						activeObject.toPort.links.forEach((link: any) => {
							this.linkHandler.remove(link, 'from');
						});
					}
					this.canvas.remove(activeObject.toPort);
				}
				if (activeObject.fromPort && activeObject.fromPort.length) {
					activeObject.fromPort.forEach((port: any) => {
						if (port.links.length) {
							port.links.forEach((link: any) => {
								this.linkHandler.remove(link, 'to');
							});
						}
						this.canvas.remove(port);
					});
				}
			}
			this.canvas.remove(activeObject);
		} else {
			const { _objects: activeObjects } = activeObject;
			const existDeleted = activeObjects.some(
				(obj: any) => typeof obj.deletable !== 'undefined' && !obj.deletable,
			);
			if (existDeleted) {
				return;
			}
			this.canvas.discardActiveObject();
			activeObjects.forEach((obj: any) => {
				if (obj.type === 'group') {
					this.deleteGroup(activeObject)
				}
				if (obj.superType === 'element') {
					this.elementHandler.removeById(obj.id);
				}
				if (obj.superType === 'node') {
					if (obj.toPort) {
						if (obj.toPort.links.length) {
							obj.toPort.links.forEach((link: any) => {
								this.linkHandler.remove(link, 'from');
							});
						}
						this.canvas.remove(obj.toPort);
					}
					if (obj.fromPort && obj.fromPort.length) {
						obj.fromPort.forEach((port: any) => {
							if (port.links.length) {
								port.links.forEach((link: any) => {
									this.linkHandler.remove(link, 'to');
								});
							}
							this.canvas.remove(port);
						});
					}
				}
				this.canvas.remove(obj);
			});
		}
		if (!this.transactionHandler.active) {
			this.transactionHandler.save('remove');
		}
		this.objects = this.getObjects();
		const { onRemove } = this;
		if (onRemove) {
			onRemove(activeObject);
		}
	};

	/**
	 * Remove object
	 * @param {FabricObject} target
	 * @returns {any}
	 */
	public addBackGroundMap = (target?: FabricObject) => {
		axios.get("/0-Model.svg", {
		// axios.get("/Beef_cuts_France.svg", {
		}).then((data) => {
			echarts.registerMap('Beef_cuts_France', { svg: data.data });
			var myChart = echarts.init(document.getElementById("echarts"));
			// var myChart = echarts.init(document.getElementsByClassName("echarts")[0]);
			var options = {
				tooltip: {},
				dataZoom: [
					{
					  type: 'inside',
					}
				  ],
				visualMap: {
				  left: 'center',
				  bottom: '10%',
				  min: 5,
				  max: 100,
				  orient: 'horizontal',
				  text: ['', 'Price'],
				  realtime: true,
				  calculable: true,
				  inRange: {
					color: ['#dbac00', '#db6e00', '#cf0000']
				  }
				},
				series: [
				  {
					name: 'French Beef Cuts',
					type: 'map',
					map: 'Beef_cuts_France',
					roam: true,
					emphasis: {
					  label: {
						show: false
					  }
					},
					selectedMode: false,
					data: [
					  { name: '房间一', value: 15 },
					]
				  }
				]
			  };
			myChart.setOption(options);
			setTimeout(()=>{
				myChart.dispatchAction({
					type: 'dataZoom',
					 // 开始位置的百分比，0 - 100
					start: 1,
					// 结束位置的百分比，0 - 100
					end: 30,
					// 开始位置的数值
					startValue: 1,
					// 结束位置的数值
					endValue: 30
				});
			},3000)
		})
	};

	/**
	 * Remove object by id
	 * @param {string} id
	 */
	public removeById = (id: string) => {
		const findObject = this.findById(id);
		if (findObject) {
			this.remove(findObject);
		}
	};

	/**
	 * Delete at origin object list
	 * @param {string} id
	 */
	public removeOriginById = (id: string) => {
		const object = this.findOriginByIdWithIndex(id);
		if (object.index > 0) {
			this.objects.splice(object.index, 1);
		}
	};

	/**
	 * Duplicate object
	 * @returns
	 */
	public duplicate = () => {
		const {
			onAdd,
			propertiesToInclude,
			gridOption: { grid = 10 },
		} = this;
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (!activeObject) {
			return;
		}
		if (typeof activeObject.cloneable !== 'undefined' && !activeObject.cloneable) {
			return;
		}
		activeObject.clone((clonedObj: FabricObject) => {
			/**
			 * HACK push pirvate key to cloneObj
			 */
			this.canvas.discardActiveObject();
			clonedObj.set({
				left: clonedObj.left + grid,
				top: clonedObj.top + grid,
				evented: true,
			});
			if(clonedObj.type !== 'group'){
				clonedObj.set({
					styles:JSON.parse(JSON.stringify(activeObject.styles)),
					condition:JSON.parse(JSON.stringify(activeObject.condition)),
					deviceSetting:JSON.parse(JSON.stringify(activeObject.deviceSetting)),
				});
			}

			switch(clonedObj.type){
				case "activeSelection":
					const activeSelection = clonedObj as fabric.ActiveSelection;
					activeSelection.canvas = this.canvas;
					activeSelection.forEachObject((obj: any) => {
						obj.set('id', uuid());
						if (obj.superType === 'node') {
							obj.set('shadow', {
								color: obj.stroke,
							} as fabric.Shadow);
						}
						this.canvas.add(obj);
						this.objects = this.getObjects();
						if (obj.dblclick) {
							obj.on('mousedblclick', this.eventHandler.object.mousedblclick);
						}
					});
					if (onAdd) {
						onAdd(activeSelection);
					}
					activeSelection.setCoords();
					break;
				case "group":
					if (activeObject.id === clonedObj.id) {
						clonedObj.set('id', uuid());
					}
					this.add(clonedObj);
					//添加一次之后后续不需要添加
					return ;
					default :
					if (activeObject.id === clonedObj.id) {
						clonedObj.set('id', uuid());
						this.canvas.add(clonedObj);
					}
					break;
			}
			// if (clonedObj.type === 'activeSelection') {
				
			// } else {
			// 	if (activeObject.id === clonedObj.id) {
			// 		clonedObj.set('id', uuid());
			// 		this.canvas.add(clonedObj);
			// 	}
			// 	if (clonedObj.superType === 'node') {
			// 		clonedObj.set('shadow', {
			// 			color: clonedObj.stroke,
			// 		} as fabric.Shadow);
			// 	}
			// 	if (clonedObj.type === 'group') {
				// this.add(clonedObj)
			// 	}
			// 	if (clonedObj.dblclick) {
			// 		clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
			// 	}
			// 	if (onAdd) {
			// 		onAdd(clonedObj);
			// 	}
			// }
			this.canvas.setActiveObject(clonedObj);
			this.portHandler.create(clonedObj as NodeObject);
			this.canvas.requestRenderAll();
			this.objects = this.getObjects();
		}, propertiesToInclude);
	};

	/**
	 * Duplicate object by id
	 * @param {string} id
	 * @returns
	 */
	public duplicateById = (id: string) => {
		const {
			onAdd,
			propertiesToInclude,
			gridOption: { grid = 10 },
		} = this;
		const findObject = this.findById(id);
		if (findObject) {
			if (typeof findObject.cloneable !== 'undefined' && !findObject.cloneable) {
				return false;
			}
			findObject.clone((cloned: FabricObject) => {
				cloned.set({
					left: cloned.left + grid,
					top: cloned.top + grid,
					id: uuid(),
					evented: true,
					styles:JSON.parse(JSON.stringify(findObject.styles)),
				condition:JSON.parse(JSON.stringify(findObject.condition)),
				deviceSetting:JSON.parse(JSON.stringify(findObject.deviceSetting)),

				});
				this.canvas.add(cloned);
				this.objects = this.getObjects();
				if (onAdd) {
					onAdd(cloned);
				}
				if (cloned.dblclick) {
					cloned.on('mousedblclick', this.eventHandler.object.mousedblclick);
				}
				this.canvas.setActiveObject(cloned);
				this.portHandler.create(cloned as NodeObject);
				this.canvas.requestRenderAll();
			}, propertiesToInclude);
		}
		return true;
	};

	/**
	 * Cut object
	 *
	 */
	public cut = () => {
		this.copy();
		this.remove();
		this.isCut = true;
	};

	/**
	 * Copy to clipboard
	 *
	 * @param {*} value
	 */
	public copyToClipboard = (value: any) => {
		const textarea = document.createElement('textarea');
		document.body.appendChild(textarea);
		textarea.value = value;
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
		this.canvas.wrapperEl.focus();
	};

	/**
	 * Copy object
	 *
	 * @returns
	 */
	public copy = () => {
		const { propertiesToInclude } = this;
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject && activeObject.superType === 'link') {
			return false;
		}
		if (activeObject) {
			if (typeof activeObject.cloneable !== 'undefined' && !activeObject.cloneable) {
				return false;
			}
			if (activeObject.type === 'activeSelection') {
				const activeSelection = activeObject as fabric.ActiveSelection;
				if (activeSelection.getObjects().some((obj: any) => obj.superType === 'node')) {
					if (this.keyEvent.clipboard) {
						const links = [] as any[];
						const objects = activeSelection.getObjects().map((obj: any, index: number) => {
							if (typeof obj.cloneable !== 'undefined' && !obj.cloneable) {
								return null;
							}
							if (obj.fromPort.length) {
								obj.fromPort.forEach((port: any) => {
									if (port.links.length) {
										port.links.forEach((link: any) => {
											const linkTarget = {
												fromNodeIndex: index,
												fromPortId: port.id,
												type: 'curvedLink',
												superType: 'link',
											} as any;
											const findIndex = activeSelection
												.getObjects()
												.findIndex((compObj: any) => compObj.id === link.toNode.id);
											if (findIndex >= 0) {
												linkTarget.toNodeIndex = findIndex;
												links.push(linkTarget);
											}
										});
									}
								});
							}
							return {
								name: obj.name,
								description: obj.description,
								superType: obj.superType,
								type: obj.type,
								nodeClazz: obj.nodeClazz,
								configuration: obj.configuration,
								properties: {
									left: activeObject.left + activeObject.width / 2 + obj.left || 0,
									top: activeObject.top + activeObject.height / 2 + obj.top || 0,
									iconName: obj.descriptor.icon,
								},
							};
						});
						this.copyToClipboard(JSON.stringify(objects.concat(links), null, '\t'));
						return true;
					}
					this.clipboard = activeObject;
					return true;
				}
			}
			activeObject.clone((cloned: FabricObject) => {
				/**
				 * HACK 在这里将样式重新注入进去
				 */
				cloned.styles = activeObject.styles || {};
				if (this.keyEvent.clipboard) {
					if (cloned.superType === 'node') {
						const node = {
							name: cloned.name,
							description: cloned.description,
							superType: cloned.superType,
							type: cloned.type,
							nodeClazz: cloned.nodeClazz,
							configuration: cloned.configuration,
							properties: {
								left: cloned.left || 0,
								top: cloned.top || 0,
								iconName: cloned.descriptor.icon,
							},
						};
						const objects = [node];
						this.copyToClipboard(JSON.stringify(objects, null, '\t'));
					} else {
						this.copyToClipboard(JSON.stringify(cloned.toObject(propertiesToInclude), null, '\t'));
					}
				} else {
					this.clipboard = cloned;
				}
			}, propertiesToInclude);
		}
		return true;
	};

	/**
	 * Paste object
	 *
	 * @returns
	 */
	public paste = () => {
		const {
			onAdd,
			propertiesToInclude,
			gridOption: { grid = 10 },
			clipboard,
			isCut,
		} = this;
		const padding = isCut ? 0 : grid;
		if (!clipboard) {
			return false;
		}
		if (typeof clipboard.cloneable !== 'undefined' && !clipboard.cloneable) {
			return false;
		}
		this.isCut = false;
		if (clipboard.type === 'activeSelection') {
			if (clipboard.getObjects().some((obj: any) => obj.superType === 'node')) {
				this.canvas.discardActiveObject();
				const objects = [] as any[];
				const linkObjects = [] as LinkOption[];
				clipboard.getObjects().forEach((obj: any) => {
					if (typeof obj.cloneable !== 'undefined' && !obj.cloneable) {
						return;
					}
					const clonedObj = obj.duplicate();
					if (clonedObj.type === 'SwitchNode') {
						clonedObj.set({
							left: obj.left + padding + padding,
							top: obj.top + padding,
						});
					} else {
						clonedObj.set({
							left: obj.left + padding,
							top: obj.top + padding,
						});
					}
					if (obj.fromPort.length) {
						obj.fromPort.forEach((port: PortObject) => {
							if (port.links.length) {
								port.links.forEach((link: LinkObject) => {
									const linkTarget = {
										fromNode: clonedObj.id,
										fromPort: port.id,
									} as any;
									const findIndex = clipboard
										.getObjects()
										.findIndex((compObj: any) => compObj.id === link.toNode.id);
									if (findIndex >= 0) {
										linkTarget.toNodeIndex = findIndex;
										linkObjects.push(linkTarget);
									}
								});
							}
						});
					}
					if (clonedObj.dblclick) {
						clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
					}
					this.canvas.add(clonedObj);
					this.objects = this.getObjects();
					this.portHandler.create(clonedObj);
					objects.push(clonedObj);
				});
				if (linkObjects.length) {
					linkObjects.forEach((linkObject: any) => {
						const { fromNode, fromPort, toNodeIndex } = linkObject;
						const toNode = objects[toNodeIndex];
						const link = {
							type: 'curvedLink',
							fromNodeId: fromNode,
							fromPortId: fromPort,
							toNodeId: toNode.id,
							toPortId: toNode.toPort.id,
						};
						this.linkHandler.create(link);
					});
				}
				const activeSelection = new fabric.ActiveSelection(objects, {
					canvas: this.canvas,
					...this.activeSelectionOption,
				});
				if (isCut) {
					this.clipboard = null;
				} else {
					this.clipboard = activeSelection;
				}
				if (!this.transactionHandler.active) {
					this.transactionHandler.save('paste');
				}
				this.canvas.setActiveObject(activeSelection);
				this.canvas.renderAll();
				return true;
			}
		}
		clipboard.clone((clonedObj: any) => {
			/**
			 * HACK 在这里将样式重新注入进去
			 */
			clonedObj.styles = JSON.parse(JSON.stringify(clipboard.styles)) || {};
			this.canvas.discardActiveObject();
			clonedObj.set({
				left: clonedObj.left + padding,
				top: clonedObj.top + padding,
				id: isCut ? clipboard.id : uuid(),
				evented: true,
			});
			if (clonedObj.type === 'activeSelection') {
				clonedObj.canvas = this.canvas;
				clonedObj.forEachObject((obj: any) => {
					obj.set('id', isCut ? obj.id : uuid());
					this.canvas.add(obj);
					if (obj.dblclick) {
						obj.on('mousedblclick', this.eventHandler.object.mousedblclick);
					}
				});
			} else {
				if (clonedObj.superType === 'node') {
					clonedObj = clonedObj.duplicate();
				}
				
				if (clonedObj.type === 'group') {
					this.add(clonedObj)
				}
				if (clonedObj.dblclick) {
					clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
				}
			}
			const newClipboard = clipboard.set({
				top: clonedObj.top,
				left: clonedObj.left,
			});
			if (isCut) {
				this.clipboard = null;
			} else {
				this.clipboard = newClipboard;
			}
			if (clonedObj.superType === 'node') {
				this.portHandler.create(clonedObj);
			}
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('paste');
			}
			// TODO...
			// After toGroup svg elements not rendered.
			// HACK has done
			this.objects = this.getObjects();
		}, propertiesToInclude);
		return true;
	};

	/**
	 * Load the image
	 * @param {FabricImage} obj
	 * @param {string} src
	 */
	public loadImage = (obj: FabricImage, src: string) => {
		let url = src;
		if (!url) {
			url = './images/sample/transparentBg.png';
		}
		fabric.util.loadImage(url, source => {
			if (obj.type !== 'image') {
				obj.set(
					'fill',
					new fabric.Pattern({
						source,
						repeat: 'repeat',
					}),
				);
				obj.setCoords();
				this.canvas.renderAll();
				return;
			}
			obj.setElement(source);
			obj.setCoords();
			this.canvas.renderAll();
		});
	};

	/**
	 * Find object by object
	 * @param {FabricObject} obj
	 */
	public find = (obj: FabricObject) => this.findById(obj.id);

	/**
	 * Find object by id
	 * @param {string} id
	 * @returns {(FabricObject | null)}
	 */
	public findById = (id: string): FabricObject | null => {
		let findObject;
		const exist = this.objects.some(obj => {
			if (obj.id === id) {
				findObject = obj;
				return true;
			}
			return false;
		});
		if (!exist) {
			warning(true, 'Not found object by id.');
			return null;
		}
		return findObject;
	};

	/**
	 * Find object in origin list
	 * @param {string} id
	 * @returns
	 */
	public findOriginById = (id: string) => {
		let findObject: FabricObject;
		const exist = this.objects.some(obj => {
			if (obj.id === id) {
				findObject = obj;
				return true;
			}
			return false;
		});
		if (!exist) {
			console.warn('Not found object by id.');
			return null;
		}
		return findObject;
	};

	/**
	 * Return origin object list
	 * @param {string} id
	 * @returns
	 */
	public findOriginByIdWithIndex = (id: string) => {
		let findObject;
		let index = -1;
		const exist = this.objects.some((obj, i) => {
			if (obj.id === id) {
				findObject = obj;
				index = i;
				return true;
			}
			return false;
		});
		if (!exist) {
			console.warn('Not found object by id.');
			return {};
		}
		return {
			object: findObject,
			index,
		};
	};

	/**
	 * Select object
	 * @param {FabricObject} obj
	 * @param {boolean} [find]
	 */
	public select = (obj: FabricObject, find?: boolean) => {
		let findObject = obj;
		if (find) {
			findObject = this.find(obj);
		}
		if (findObject) {
			this.canvas.discardActiveObject();
			this.canvas.setActiveObject(findObject);
			this.canvas.requestRenderAll();
		}
	};

	/**
	 * Select by id
	 * @param {string} id
	 */
	public selectById = (id: string) => {
		const findObject = this.findById(id);
		if (findObject) {
			this.canvas.discardActiveObject();
			this.canvas.setActiveObject(findObject);
			this.canvas.requestRenderAll();
		}
	};

	/**
	 * Select all
	 * @returns
	 */
	public selectAll = () => {
		this.canvas.discardActiveObject();
		const filteredObjects = this.canvas.getObjects().filter((obj: any) => {
			if (obj.id === 'workarea') {
				return false;
			} else if (!obj.evented) {
				return false;
			} else if (obj.superType === 'link') {
				return false;
			} else if (obj.superType === 'port') {
				return false;
			} else if (obj.superType === 'element') {
				return false;
			} else if (obj.locked) {
				return false;
			}
			return true;
		});
		if (!filteredObjects.length) {
			return;
		}
		if (filteredObjects.length === 1) {
			this.canvas.setActiveObject(filteredObjects[0]);
			this.canvas.renderAll();
			return;
		}
		const activeSelection = new fabric.ActiveSelection(filteredObjects, {
			canvas: this.canvas,
			...this.activeSelectionOption,
		});
		this.canvas.setActiveObject(activeSelection);
		this.canvas.renderAll();
	};

	/**
	 * Save origin width, height
	 * @param {FabricObject} obj
	 * @param {number} width
	 * @param {number} height
	 */
	public originScaleToResize = (obj: FabricObject, width: number, height: number) => {
		if (obj.id === 'workarea') {
			this.setByPartial(obj, {
				workareaWidth: obj.width,
				workareaHeight: obj.height,
			});
		}
		this.setByPartial(obj, {
			scaleX: width / obj.width,
			scaleY: height / obj.height,
		});
	};

	/**
	 * When set the width, height, Adjust the size
	 * @param {number} width
	 * @param {number} height
	 */
	public scaleToResize = (width: number, height: number) => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		const { id } = activeObject;
		const obj = {
			id,
			scaleX: width / activeObject.width,
			scaleY: height / activeObject.height,
		};
		this.setObject(obj);
		activeObject.setCoords();
		this.canvas.requestRenderAll();
	};

	/**
	 * Import json
	 * @param {*} json
	 * @param {(canvas: FabricCanvas) => void} [callback]
	 */
	public importJSON = async (json: any, callback?: (canvas: FabricCanvas) => void) => {

		if (typeof json === 'string') {
			json = JSON.parse(json);
		}
		let prevLeft = 0;
		let prevTop = 0;
		// this.canvas.setBackgroundColor(this.canvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
		const workarea = json.find((obj: FabricObjectOption) => obj.id === 'workarea');
		if (!this.workarea) {
			this.workareaHandler.initialize();
		}
		if (workarea) {
			prevLeft = workarea.left;
			prevTop = workarea.top;
			this.workarea.set(workarea);
			await this.workareaHandler.setImage(workarea.src, true);
			this.workarea.setCoords();
		} else {
			this.canvas.centerObject(this.workarea);
			this.workarea.setCoords();
			prevLeft = this.workarea.left;
			prevTop = this.workarea.top;
		}
		json.forEach((obj: FabricObjectOption) => {
			if (obj.id === 'workarea') {
				return;
			}
			const canvasWidth = this.canvas.getWidth();
			const canvasHeight = this.canvas.getHeight();
			const { width, height, scaleX, scaleY, layout, left, top } = this.workarea;
			if (layout === 'fullscreen') {
				const leftRatio = canvasWidth / (width * scaleX);
				const topRatio = canvasHeight / (height * scaleY);
				obj.left *= leftRatio;
				obj.top *= topRatio;
				obj.scaleX *= leftRatio;
				obj.scaleY *= topRatio;
			} else {
				// const diffLeft = left - prevLeft;
				// const diffTop = top - prevTop;
				// obj.left += diffLeft;
				// obj.top += diffTop;
			}
			this.add(obj, false, true);
			this.canvas.renderAll();
		});
		this.objects = this.getObjects();
		if (callback) {
			callback(this.canvas);
		}
		return Promise.resolve(this.canvas);
	};

	/**
	 * Export json
	 */
	public _exportJSON = () => {
		console.log(this.canvas.toObject(this.propertiesToInclude).objects);
		return this.canvas.toObject(this.propertiesToInclude).objects as FabricObject[];
	}
	/**
	 * Export jsonx
	 */
	public exportJSON = () => {
		let data ,_data;
		data = this._exportJSON().filter(obj => {
			if (!obj.id) {
				return false;
			}
			return true;
		});
		_data = selectDomJSON(data);
		return _data;
	}

	/**
	 * Active selection to group
	 * 成组
	 * @returns
	 */
	public toGroup = (target?: FabricObject) => {
		const activeObject = target || (this.canvas.getActiveObject() as fabric.ActiveSelection);
		if (!activeObject) {
			return null;
		}
		if (activeObject.type !== 'activeSelection') {
			return null;
		}
		const group = activeObject.toGroup() as FabricObject<fabric.Group>;
		group.set({
			id: uuid(),
			//New group
			name: '组合',
			type: 'group',
			hasControls:false,
			...this.objectOption,
		});
		if (!this.transactionHandler.active) {
			this.transactionHandler.save('group');
		}
		if (this.onSelect) {
			this.onSelect(group);
		}
		this.canvas.renderAll();
		return group;
	};

	/**
	 * 解组
	 * Group to active selection
	 * @returns
	 */


	public _toActiveSelection = function() {
		if (!this.canvas) {
		  return;
		}
		var objects = this._objects, canvas = this.canvas;
		this._objects = [];
		var options = this.toObject();
		delete options.objects;
		var activeSelection = new fabric.ActiveSelection([]);
		activeSelection.set(options);
		activeSelection.type = 'activeSelection';
		canvas.remove(this);
		objects.forEach(function(object) {
		  object.group = activeSelection;
		  object.dirty = true;
		  canvas.add(object);
		});
		activeSelection.canvas = canvas;
		activeSelection._objects = objects;
		activeSelection.hasControls = false;
		canvas._activeObject = activeSelection;
		activeSelection.setCoords();
		return activeSelection;
	  };
	public toActiveSelection = (target?: FabricObject) => {

		const activeObject = target || (this.canvas.getActiveObject() as fabric.Group);
		if (!activeObject) {
			return;
		}
		if (activeObject.type !== 'group') {
			return;
		}
		//成组修改框功能的核心代码
		const activeSelection = this._toActiveSelection.call(activeObject);
		//放到交互历史记录里
		this.objects = this.getObjects();
		if (!this.transactionHandler.active) {
			this.transactionHandler.save('ungroup');
		}
		if (this.onSelect) {
			this.onSelect(activeSelection);
		}
		console.log(this.canvas.getObjects());
		this.canvas.getObjects().map(function(klass){
			if(klass.type === "group"){
				klass.hasControls = false;
			}
		})
		this.canvas.renderAll();
		// return activeSelection;
	};

	/**
	 * Bring forward
	 */
	public bringForward = () => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject) {
			this.canvas.bringForward(activeObject);
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('bringForward');
			}
			const { onModified } = this;
			if (onModified) {
				onModified(activeObject);
			}
		}
		//设置当前对象层级关系
		setTrie(activeObject,'forward')
	};

	/**
	 * Bring to front
	 */
	public bringToFront = () => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject) {
			this.canvas.bringToFront(activeObject);
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('bringToFront');
			}
			const { onModified } = this;
			if (onModified) {
				onModified(activeObject);
			}
		}
		//maxTier
		//设置当前对象层级关系
		setTrie(activeObject,'front')
	};

	/**
	 * Send backwards
	 * @returns
	 */
	public sendBackwards = () => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject) {	
			//暂时先注释掉,因为会印象之后的操作
			const firstObject = this.canvas.getObjects()[1] as FabricObject;
			if (firstObject.id === activeObject.id) {
				return;
			}
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('sendBackwards');
			}
			this.canvas.sendBackwards(activeObject);
			const { onModified } = this;
			if (onModified) {
				onModified(activeObject);
			}
		}
		//设置当前对象层级关系
		setTrie(activeObject,'backwards')
	};

	/**
	 * Send to back
	 */
	public sendToBack = () => {
		const activeObject = this.canvas.getActiveObject() as FabricObject;
		if (activeObject) {
			this.canvas.sendToBack(activeObject);
			this.canvas.sendToBack(this.canvas.getObjects()[1]);
			if (!this.transactionHandler.active) {
				this.transactionHandler.save('sendToBack');
			}
			const { onModified } = this;
			if (onModified) {
				onModified(activeObject);
			}
		}
		//设置当前对象层级关系
		setTrie(activeObject,'bottommost')
	};

	/**
	 * Clear canvas
	 * @param {boolean} [includeWorkarea=false]
	 */
	public clear = (includeWorkarea = false) => {
		const objects = this.canvas.getObjects();
		let ids: string[] = [];
		const filterObjects = (objects)=>{
			objects.map((item,idx)=>{
				if (item.superType === 'element') {
					ids.push(item.id);
				}else if(item.type === 'group'){
					filterObjects(item._objects || item._objects)
				}
			})
		}
		filterObjects(objects);
		this.elementHandler.removeByIds(ids);
		if (includeWorkarea) {
			this.canvas.clear();
			this.workarea = null;
		} else {
			this.canvas.discardActiveObject();
			this.canvas.getObjects().forEach((obj: any) => {
				if (obj.id === 'grid' || obj.id === 'workarea') {
					return;
				}
				this.canvas.remove(obj);
			});
		}
		this.objects = this.getObjects();
		this.canvas.renderAll();
	};

	/**
	 * Start request animation frame
	 */
	public startRequestAnimFrame = () => {
		if (!this.isRequsetAnimFrame) {
			this.isRequsetAnimFrame = true;
			const render = () => {
				this.canvas.renderAll();
				this.requestFrame = fabric.util.requestAnimFrame(render);
			};
			fabric.util.requestAnimFrame(render);
		}
	};

	/**
	 * Stop request animation frame
	 */
	public stopRequestAnimFrame = () => {
		this.isRequsetAnimFrame = false;
		const cancelRequestAnimFrame = (() =>
			window.cancelAnimationFrame ||
			// || window.webkitCancelRequestAnimationFrame
			// || window.mozCancelRequestAnimationFrame
			// || window.oCancelRequestAnimationFrame
			// || window.msCancelRequestAnimationFrame
			clearTimeout)();
		cancelRequestAnimFrame(this.requestFrame);
	};

	/**
	 * Save target object as image
	 * @param {FabricObject} targetObject
	 * @param {string} [option={ name: 'New Image', format: 'png', quality: 1 }]
	 */
	public saveImage = (targetObject: FabricObject, option = { name: 'New Image', format: 'png', quality: 1 }) => {
		let dataUrl;
		let target = targetObject;
		if (target) {
			dataUrl = target.toDataURL(option);
		} else {
			target = this.canvas.getActiveObject() as FabricObject;
			if (target) {
				dataUrl = target.toDataURL(option);
			}
		}
		if (dataUrl) {
			const anchorEl = document.createElement('a');
			anchorEl.href = dataUrl;
			anchorEl.download = `${option.name}.png`;
			document.body.appendChild(anchorEl); // required for firefox
			anchorEl.click();
			anchorEl.remove();
		}
	};

	/**
	 * Save canvas as image
	 * @param {string} [option={ name: 'New Image', format: 'png', quality: 1 }]
	 */
	public saveCanvasImage = (option = { name: 'New Image', format: 'png', quality: 1 }) => {
		const dataUrl = this.canvas.toDataURL(option);
		if (dataUrl) {
			const anchorEl = document.createElement('a');
			anchorEl.href = dataUrl;
			anchorEl.download = `${option.name}.png`;
			document.body.appendChild(anchorEl); // required for firefox
			anchorEl.click();
			anchorEl.remove();
		}
	};

	/**
	 * Sets "angle" of an instance with centered rotation
	 *
	 * @param {number} angle
	 */
	public rotate = (angle: number) => {
		const activeObject = this.canvas.getActiveObject();
		if (activeObject) {
			// TIPS activeObject.rotate() run be preferred than this.set();
			activeObject.rotate(angle);
			this.set('rotation', angle);
			this.canvas.requestRenderAll();
		}
	};

	/**
	 * Destroy canvas
	 *
	 */
	public destroy = () => {
		this.eventHandler.destroy();
		this.guidelineHandler.destroy();
		this.contextmenuHandler.destory();
		this.tooltipHandler.destroy();
		this.clear(true);
	};

	/**
	 * Set canvas option
	 *
	 * @param {CanvasOption} canvasOption
	 */
	public setCanvasOption = (canvasOption: CanvasOption) => {
		this.canvasOption = Object.assign({}, this.canvasOption, canvasOption);
		this.canvas.setBackgroundColor(canvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
		if (typeof canvasOption.width !== 'undefined' && typeof canvasOption.height !== 'undefined') {
			if (this.eventHandler) {
				this.eventHandler.resize(canvasOption.width, canvasOption.height);
			} else {
				this.canvas.setWidth(canvasOption.width).setHeight(canvasOption.height);
			}
		}
		if (typeof canvasOption.selection !== 'undefined') {
			this.canvas.selection = canvasOption.selection;
		}
		if (typeof canvasOption.hoverCursor !== 'undefined') {
			this.canvas.hoverCursor = canvasOption.hoverCursor;
		}
		if (typeof canvasOption.defaultCursor !== 'undefined') {
			this.canvas.defaultCursor = canvasOption.defaultCursor;
		}
		if (typeof canvasOption.preserveObjectStacking !== 'undefined') {
			this.canvas.preserveObjectStacking = canvasOption.preserveObjectStacking;
		}
	};

	/**
	 * Set keyboard event
	 *
	 * @param {KeyEvent} keyEvent
	 */
	public setKeyEvent = (keyEvent: KeyEvent) => {
		this.keyEvent = Object.assign({}, this.keyEvent, keyEvent);
	};

	/**
	 * Set fabric objects
	 *
	 * @param {FabricObjects} fabricObjects
	 */
	public setFabricObjects = (fabricObjects: FabricObjects) => {
		this.fabricObjects = Object.assign({}, this.fabricObjects, fabricObjects);
	};

	/**
	 * Set workarea option
	 *
	 * @param {WorkareaOption} workareaOption
	 */
	public setWorkareaOption = (workareaOption: WorkareaOption) => {
		this.workareaOption = Object.assign({}, this.workareaOption, workareaOption);
		if (this.workarea) {
			this.workarea.set({
				...workareaOption,
			});
		}
	};

	/**
	 * Set guideline option
	 *
	 * @param {GuidelineOption} guidelineOption
	 */
	public setGuidelineOption = (guidelineOption: GuidelineOption) => {
		this.guidelineOption = Object.assign({}, this.guidelineOption, guidelineOption);
		if (this.guidelineHandler) {
			this.guidelineHandler.initialize();
		}
	};

	/**
	 * Set grid option
	 *
	 * @param {GridOption} gridOption
	 */
	public setGridOption = (gridOption: GridOption) => {
		this.gridOption = Object.assign({}, this.gridOption, gridOption);
	};

	/**
	 * Set object option
	 *
	 * @param {FabricObjectOption} objectOption
	 */
	public setObjectOption = (objectOption: FabricObjectOption) => {
		this.objectOption = Object.assign({}, this.objectOption, objectOption);
	};

	/**
	 * Set activeSelection option
	 *
	 * @param {Partial<FabricObjectOption<fabric.ActiveSelection>>} activeSelectionOption
	 */
	public setActiveSelectionOption = (activeSelectionOption: Partial<FabricObjectOption<fabric.ActiveSelection>>) => {
		this.activeSelectionOption = Object.assign({}, this.activeSelectionOption, activeSelectionOption);
	};

	/**
	 * Set propertiesToInclude
	 *
	 * @param {string[]} propertiesToInclude
	 */
	public setPropertiesToInclude = (propertiesToInclude: string[]) => {
		this.propertiesToInclude = union(propertiesToInclude, this.propertiesToInclude);
	};

	/**
	 * Register custom handler
	 *
	 * @param {string} name
	 * @param {typeof CustomHandler} handler
	 */
	public registerHandler = (name: string, handler: typeof CustomHandler) => {
		this.handlers[name] = new handler(this);
		return this.handlers[name];
	};

	/**
	 * Register custom handler
	 *
	 * @param {string} name
	 * @param {typeof CustomHandler} handler
	 */
	public getObjCenterPoint = (obj:  fabric.Object ) => {
		const left = obj.left;
		const top = obj.top;
		const x = (obj.lineCoords.br.x - obj.lineCoords.tl.x)/2 ;
        const y = (obj.lineCoords.br.y - obj.lineCoords.tl.y)/2 ;
		return {
			centerLeft : left + x ,
			centerTop : top + y ,
		}
	};
}

export default Handler;
