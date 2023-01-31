import { fabric } from 'fabric';

import {
	Arrow,
	Gif,
	Chart,
	Element,
	Iframe,
	Video,
	Node,
	Link,
	CurvedLink,
	OrthogonalLink,
	Line,
	Cube,
	Input,
	Select,
	Button,
	GifImg,
	Img,
	FrameImg,
	Image,
} from './objects';
import { FabricObject } from './utils';
import { Code } from './objects/Element';
import Svg, { SvgOption } from './objects/Svg';

export interface ObjectSchema {
	create: (...option: any) => fabric.Object;
}

export interface CanvasObjectSchema {
	[key: string]: ObjectSchema;
}

export const createCanvasObject = (objectSchema: CanvasObjectSchema) => objectSchema;

const CanvasObject: CanvasObjectSchema = {
	input: {
		create: ({ code, ...option }: { code: Code }) => new Element(code, option),
	},
	button: {
		create: ({ code, ...option }: { code: Code }) => new Element(code, option),
	},
	select: {
		create: ({ code, ...option }: { code: Code }) => new Element(code, option),
	},
	frameImg: {
		create: ({ code, ...option }: { code: Code }) => new FrameImg(code, option),
	},
	image: {
		create: ({ code, ...option }: { code: Code }) => new Img(code, option),
	},
	polyLine: {
		create: ({ points, ...option }: { points: any }) => new Line(points, option),
		// create: ({ points, ...option }: { points: any }) =>{
		// 	debugger
		// 	return new fabric.PolyLine(points, {
		// 		...option,
		// 		perPixelTargetFind: true,
		// 	});
		// }
	},
	chart: {
		create: ({ points, ...option }: { points: any }) =>{
			return  new Chart(points, option);
		},
	},


	gifImg: {
		create: ({ code, ...option }: { code: Code }) => new GifImg(code, option),
	},
	gif: {
		create: ({ code, ...option }: { code: Code }) => new Gif(code, option),
	},
	img: {
		create: ({ code, ...option }: { code: Code }) => new Img(code, option),
	},


	group: {
		create: ({ objects, ...option }: { objects: FabricObject[] }) => {
			return new fabric.Group(objects, option)
		},
	},
	'i-text': {
		create: ({ text, ...option }: { text: string }) => new fabric.IText(text, option),
	},
	textbox: {
		create: ({ code, ...option }: { code: string }) => new Element(code, option),
	},
	triangle: {
		create: (option: any) => new fabric.Triangle(option),
	},
	circle: {
		create: (option: any) => new fabric.Circle(option),
	},
	rect: {
		create: (option: any) => new fabric.Rect(option),
	},
	cube: {
		create: (option: any) => new Cube(option),
	},

	polygon: {
		create: ({ points, ...option }: { points: any }) =>
			new fabric.Polygon(points, {
				...option,
				perPixelTargetFind: true,
			}),
	},
	line: {
		create: ({ points, ...option }: { points: any }) => new Line(points, option),
	},
	arrow: {
		create: ({ points, ...option }: { points: any }) => new Arrow(points, option),
	},

	element: {
		create: ({ code, ...option }: { code: Code }) => new Element(code, option),
	},
	iframe: {
		create: ({ src, ...option }: { src: string }) => new Iframe(src, option),
	},
	video: {
		create: ({ src, file, ...option }: { src: string; file: File }) => new Video(src || file, option),
	},
	gif: {
		create: (option: any) => new Gif(option),
	},
	node: {
		create: (option: any) => new Node(option),
	},
	link: {
		create: (fromNode, fromPort, toNode, toPort, option) => new Link(fromNode, fromPort, toNode, toPort, option),
	},
	curvedLink: {
		create: (fromNode, fromPort, toNode, toPort, option) =>
			new CurvedLink(fromNode, fromPort, toNode, toPort, option),
	},
	orthogonalLink: {
		create: (fromNode, fromPort, toNode, toPort, option) =>
			new OrthogonalLink(fromNode, fromPort, toNode, toPort, option),
	},
	svg: {
		create: (option: SvgOption) => new Svg(option),
	},
};

export default CanvasObject;
