import { fabric } from 'fabric';
import { uuid } from 'uuidv4';
import { Arrow, Line } from '../objects';
import { FabricEvent, FabricObject } from '../utils';
import Handler from './Handler';

class DrawingHandler {
	handler: Handler;
	constructor(handler: Handler) {
		this.handler = handler;
	}

	polyLine = {
		init: () => {
			this.handler.interactionHandler.drawing('polyLine');
			this.handler.pointArray = [];
			this.handler.lineArray = [];
			this.handler.polyLinepoints = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
		},
		reset : () => {
			this.handler.pointArray.forEach(point => {
				this.handler.canvas.remove(point);
			});
			this.handler.lineArray.forEach(line => {
				this.handler.canvas.remove(line);
			});
			this.handler.canvas.remove(this.handler.activeLine);
			this.handler.canvas.remove(this.handler.activeShape);
			this.handler.pointArray = [];
			this.handler.lineArray = [];
			this.handler.polyLinepoints = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
			this.handler.canvas.renderAll();
		},
		finish: () => {
			let _points: { x: any; y: any; }[] = [];
			this.handler.pointArray.forEach(point => {
				_points.push({
					x:point.left,
					y:point.top
				})
			});
			//完成的时候放入一个新的折线
			const Polyline = new fabric.Polyline(_points, {
				strokeWidth: 15,
				fill: 'rgba(0,0,0,0)',
				stroke: '#777777',
				centeredRotation:true,
				originX: 'center',
				originY: 'center',
				selectable: false,
				hasBorders: false,
				hasControls: false,
				evented: false,
				// hasControls:true,
				strokeLineJoin:"round", //折线拐角配置
				// cornerStyle:"rect" //拐角样式
				cornerStrokeColor:"#f70808a6",
				cornerSize:30,
				strokeUniform:true,
				// strokeLineCap:"round",
			}) as FabricObject<fabric.Polyline>;
			Polyline.set({
				id: uuid(),
			});
			this.handler.canvas.add(Polyline);
			// this.polyLine.generate(this.handler.pointArray)
			//清空操作
			this.polyLine.reset();
			this.handler.canvas.renderAll();
			this.handler.interactionHandler.selection();

		},
		addPoint: (opt: FabricEvent) => {
			/**
			 * 目前这个实现方式有一定问题 需要改写
			 */

			const { e, absolutePointer } = opt;
			const { x, y } = absolutePointer;

			const circle = new fabric.Circle({
				radius: 4,
				fill: '#000000',
				stroke: '#000000',
				strokeWidth: 0,
				left: x,
				top: y,
				selectable: false,
				hasBorders: false,
				hasControls: false,
				originX: 'center',
				originY: 'center',
				hoverCursor: 'pointer',
			}) as FabricObject<fabric.Circle>;
			circle.set({
				id: uuid(),
			});
			if (!this.handler.pointArray.length) {
				circle.set({
					fill: 'red',
				});
			}
			const points = [x, y, x, y];
			const line = new fabric.Line(points, {
				strokeWidth: 1,
				// fill: '#999999',
				stroke: '#999999',
				originX: 'center',
				originY: 'center',
				selectable: false,
				hasBorders: false,
				hasControls: false,
				evented: false,
			}) as FabricObject<fabric.Line>;
			line.set({
				class: 'line',
			});
			console.log(this.handler.activeShape);
			if (this.handler.activeShape) {
				const position = this.handler.canvas.getPointer(e);
				const activeShapePoints = this.handler.activeShape.get('points') as Array<{ x: number; y: number }>;
				activeShapePoints.push({
					x: position.x,
					y: position.y,
				});
				this.handler.canvas.remove(this.handler.activeShape);
				this.handler.canvas.renderAll();
			} else {
				const polyPoint = [{ x, y }];
				const polygon = new fabric.Polygon(polyPoint, {
					strokeWidth: 10,
					selectable: false,
					hasBorders: false,
					hasControls: false,
					evented: false,
				});
				this.handler.activeShape = polygon;
				this.handler.canvas.add(polygon);
			}
			this.handler.activeLine = line;
			this.handler.pointArray.push(circle);
			this.handler.lineArray.push(line);
			this.handler.canvas.add(line);
			this.handler.canvas.add(circle);
		},
		generate: (pointArray: FabricObject<fabric.Circle>[]) => {
			const points = [] as any[];
			const id = uuid();
			pointArray.forEach(point => {
				points.push({
					x: point.left,
					y: point.top,
				});
				this.handler.canvas.remove(point);
			});
			this.handler.lineArray.forEach(line => {
				this.handler.canvas.remove(line);
			});
			this.handler.canvas.remove(this.handler.activeShape).remove(this.handler.activeLine);
			const option = {
				id,
				points,
				type: 'polyLine',
				stroke: '#ffffff',
				strokeWidth: 1,
				fill: 'rgba(0, 0, 0, 0.25)',
				opacity: 1,
				objectCaching: !this.handler.editable,
				name: 'New polyLine',
				superType: 'drawing',
			};
			this.handler.add(option, false);
			this.handler.pointArray = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
			this.handler.interactionHandler.selection();
		},
	};

	polygon = {
		init: () => {
			this.handler.interactionHandler.drawing('polygon');
			this.handler.pointArray = [];
			this.handler.lineArray = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
		},
		finish: () => {
			let _points: { x: any; y: any; }[] = [];
			this.handler.pointArray.forEach(point => {
				_points.push({
					x:point.left,
					y:point.top
				})
			});
			_points.push({
				x:this.handler.pointArray[0].left,
				y:this.handler.pointArray[0].top,
			})
			//完成的时候放入一个新的折线
			const polygon = new fabric.Polygon(_points, {
				strokeWidth: 15,
				fill: 'rgba(0,0,0,0.1)',
				stroke: '#777777',
				centeredRotation:true,
				originX: 'center',
				originY: 'center',
				selectable: false,
				hasBorders: false,
				hasControls: false,
				evented: false,
				// hasControls:true,
				strokeLineJoin:"round", //折线拐角配置
				// cornerStyle:"rect" //拐角样式
				cornerStrokeColor:"#f70808a6",
				cornerSize:30,
				strokeUniform:true,
				// strokeLineCap:"round",
			}) as FabricObject<fabric.Polyline>;
			polygon.set({
				id: uuid(),
			});
			this.handler.canvas.add(polygon);
			// this.polyLine.generate(this.handler.pointArray)
			//清空操作
			this.polygon.reset();
			this.handler.canvas.renderAll();
			this.handler.interactionHandler.selection();
		},
		addEndPoint : () =>{
			const { x , y } = this.handler.pointArray[0];
			const circle = new fabric.Circle({
				radius: 4,
				fill: '#000000',
				strokeWidth: 0,
				left: x,
				top: y,
				selectable: false,
				hasBorders: false,
				hasControls: false,
				originX: 'center',
				originY: 'center',
				hoverCursor: 'pointer',
			}) as FabricObject<fabric.Circle>;
			circle.set({
				id: uuid(),
			});
			if (!this.handler.pointArray.length) {
				circle.set({
					fill: 'red',
				});
			}
			const points = [x, y, x, y];
			const line = new fabric.Line(points, {
				strokeWidth: 1,
				fill: '#999999',
				stroke: '#999999',
				originX: 'center',
				originY: 'center',
				selectable: false,
				hasBorders: false,
				hasControls: false,
				evented: false,
			}) as FabricObject<fabric.Line>;
			line.set({
				class: 'line',
			});
			this.handler.activeLine = line;
			this.handler.pointArray.push(circle);
			this.handler.lineArray.push(line);
			this.handler.canvas.add(line);
		},
		addPoint: (opt: FabricEvent) => {
			const { e, absolutePointer } = opt;
			const { x, y } = absolutePointer;
			const circle = new fabric.Circle({
				radius: 1,
				fill: '#ffffff',
				stroke: '#333333',
				strokeWidth: 0.5,
				left: x,
				top: y,
				selectable: false,
				hasBorders: false,
				hasControls: false,
				originX: 'center',
				originY: 'center',
				hoverCursor: 'pointer',
			}) as FabricObject<fabric.Circle>;
			circle.set({
				id: uuid(),
			});
			if (!this.handler.pointArray.length) {
				circle.set({
					fill: 'red',
				});
			}
			const points = [x, y, x, y];
			const line = new fabric.Line(points, {
				strokeWidth: 1,
				fill: '#999999',
				stroke: '#999999',
				originX: 'center',
				originY: 'center',
				selectable: false,
				hasBorders: false,
				hasControls: false,
				evented: false,
			}) as FabricObject<fabric.Line>;
			line.set({
				class: 'line',
			});
			if (this.handler.activeShape) {
				const position = this.handler.canvas.getPointer(e);
				const activeShapePoints = this.handler.activeShape.get('points') as Array<{ x: number; y: number }>;
				activeShapePoints.push({
					x: position.x,
					y: position.y,
				});
				const polygon = new fabric.Polygon(activeShapePoints, {
					stroke: '#333333',
					strokeWidth: 1,
					fill: '#cccccc',
					opacity: 0.1,
					selectable: false,
					hasBorders: false,
					hasControls: false,
					evented: false,
				});
				this.handler.canvas.remove(this.handler.activeShape);
				this.handler.canvas.add(polygon);
				this.handler.activeShape = polygon;
				this.handler.canvas.renderAll();
			} else {
				const polyPoint = [{ x, y }];
				const polygon = new fabric.Polygon(polyPoint, {
					stroke: '#333333',
					strokeWidth: 1,
					fill: '#cccccc',
					opacity: 0.1,
					selectable: false,
					hasBorders: false,
					hasControls: false,
					evented: false,
				});
				this.handler.activeShape = polygon;
				this.handler.canvas.add(polygon);
			}
			this.handler.activeLine = line;
			this.handler.pointArray.push(circle);
			this.handler.lineArray.push(line);
			this.handler.canvas.add(line);
			this.handler.canvas.add(circle);
		},
		generate: (pointArray: FabricObject<fabric.Circle>[]) => {
			const points = [] as any[];
			const id = uuid();
			pointArray.forEach(point => {
				points.push({
					x: point.left,
					y: point.top,
				});
				this.handler.canvas.remove(point);
			});
			this.handler.lineArray.forEach(line => {
				this.handler.canvas.remove(line);
			});
			this.handler.canvas.remove(this.handler.activeShape).remove(this.handler.activeLine);
			const option = {
				id,
				points,
				type: 'polygon',
				stroke: 'rgba(0, 0, 0, 1)',
				strokeWidth: 1,
				fill: 'rgba(0, 0, 0, 0.25)',
				opacity: 1,
				objectCaching: !this.handler.editable,
				name: 'New polygon',
				superType: 'drawing',
			};
			this.handler.add(option, false);
			this.handler.pointArray = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
			this.handler.interactionHandler.selection();
		},
		
		reset : () => {
			this.handler.pointArray.forEach(point => {
				this.handler.canvas.remove(point);
			});
			this.handler.lineArray.forEach(line => {
				this.handler.canvas.remove(line);
			});
			this.handler.canvas.remove(this.handler.activeLine);
			this.handler.canvas.remove(this.handler.activeShape);
			this.handler.pointArray = [];
			this.handler.lineArray = [];
			this.handler.polyLinepoints = [];
			this.handler.activeLine = null;
			this.handler.activeShape = null;
			this.handler.canvas.renderAll();
		},
	};

	line = {
		init: () => {
			this.handler.interactionHandler.drawing('line');
			this.handler.pointArray = [];
			this.handler.activeLine = null;
		},
		finish: () => {
			this.handler.pointArray.forEach(point => {
				this.handler.canvas.remove(point);
			});
			this.handler.canvas.remove(this.handler.activeLine);
			this.handler.pointArray = [];
			this.handler.activeLine = null;
			this.handler.canvas.renderAll();
			this.handler.interactionHandler.selection();
		},
		addPoint: (opt: FabricEvent) => {
			const { absolutePointer } = opt;
			const { x, y } = absolutePointer;
			const circle = new fabric.Circle({
				radius: 3,
				fill: '#ffffff',
				stroke: '#333333',
				strokeWidth: 0.5,
				left: x,
				top: y,
				selectable: false,
				hasBorders: false,
				hasControls: false,
				originX: 'center',
				originY: 'center',
				hoverCursor: 'pointer',
			});
			if (!this.handler.pointArray.length) {
				circle.set({
					fill: 'red',
				});
			}
			const points = [x, y, x, y];
			this.handler.activeLine = new Line(points, {
				strokeWidth: 2,
				fill: '#999999',
				stroke: '#999999',
				originX: 'center',
				originY: 'center',
				selectable: false,
				hasBorders: false,
				hasControls: false,
				evented: false,
			});
			this.handler.activeLine.set({
				class: 'line',
			});
			this.handler.pointArray.push(circle);
			this.handler.canvas.add(this.handler.activeLine);
			this.handler.canvas.add(circle);
		},
		generate: (opt: FabricEvent) => {
			const { absolutePointer } = opt;
			const { x, y } = absolutePointer;
			let points = [] as number[];
			const id = uuid();
			this.handler.pointArray.forEach(point => {
				points = points.concat(point.left, point.top, x, y);
				this.handler.canvas.remove(point);
			});
			this.handler.canvas.remove(this.handler.activeLine);
			const option = {
				id,
				points,
				type: 'line',
				stroke: 'rgba(0, 0, 0, 1)',
				strokeWidth: 3,
				opacity: 1,
				objectCaching: !this.handler.editable,
				name: 'New line',
				superType: 'drawing',
			};
			this.handler.add(option, false);
			this.handler.pointArray = [];
			this.handler.activeLine = null;
			this.handler.interactionHandler.selection();
		},
	};

	arrow = {
		init: () => {
			this.handler.interactionHandler.drawing('arrow');
			this.handler.pointArray = [];
			this.handler.activeLine = null;
		},
		finish: () => {
			this.handler.pointArray.forEach(point => {
				this.handler.canvas.remove(point);
			});
			this.handler.canvas.remove(this.handler.activeLine);
			this.handler.pointArray = [];
			this.handler.activeLine = null;
			this.handler.canvas.renderAll();
			this.handler.interactionHandler.selection();
		},
		addPoint: (opt: FabricEvent) => {
			const { absolutePointer } = opt;
			const { x, y } = absolutePointer;
			const circle = new fabric.Circle({
				radius: 3,
				fill: '#ffffff',
				stroke: '#333333',
				strokeWidth: 0.5,
				left: x,
				top: y,
				selectable: false,
				hasBorders: false,
				hasControls: false,
				originX: 'center',
				originY: 'center',
				hoverCursor: 'pointer',
			});
			if (!this.handler.pointArray.length) {
				circle.set({
					fill: 'red',
				});
			}
			const points = [x, y, x, y];
			this.handler.activeLine = new Arrow(points, {
				strokeWidth: 2,
				fill: '#999999',
				stroke: '#999999',
				class: 'line',
				originX: 'center',
				originY: 'center',
				selectable: false,
				hasBorders: false,
				hasControls: false,
				evented: false,
			});
			this.handler.pointArray.push(circle);
			this.handler.canvas.add(this.handler.activeLine);
			this.handler.canvas.add(circle);
		},
		generate: (opt: FabricEvent) => {
			const { absolutePointer } = opt;
			const { x, y } = absolutePointer;
			let points = [] as number[];
			this.handler.pointArray.forEach(point => {
				points = points.concat(point.left, point.top, x, y);
				this.handler.canvas.remove(point);
			});
			this.handler.canvas.remove(this.handler.activeLine);
			const option = {
				id: uuid(),
				points,
				type: 'arrow',
				stroke: 'rgba(0, 0, 0, 1)',
				strokeWidth: 3,
				opacity: 1,
				objectCaching: !this.handler.editable,
				name: 'New line',
				superType: 'drawing',
			};
			this.handler.add(option, false);
			this.handler.pointArray = [];
			this.handler.activeLine = null;
			this.handler.interactionHandler.selection();
		},
	};

	orthogonal = {};

	curve = {};
}

export default DrawingHandler;
