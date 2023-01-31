import { fabric } from 'fabric';
import { FabricElement, toObject, zoomCoordLeft, zoomCoordTop, _renderElementBox } from '../utils';
export interface Code {
	html: string;
	css: string;
	js: string;
}

export interface InputObject extends FabricElement {
	setSource: (source: Code) => void;
	setCode: (code: Code) => void;
	code: Code;
}

const initialCode: Code = {
	html: '',
	css: '',
	js: '',
};

const Button = fabric.util.createClass(fabric.Rect, {
	type: 'button',
	superType: 'element',
	hasRotatingPoint: false,
	initialize(code = initialCode, options: any) {
		options = options || {};
		this.callSuper('initialize', options);
		this.set({
			condition: [],
			styles: {},
			deviceSetting: {},
			code,
			fill: 'rgba(255, 255, 255, 0)',
			stroke: 'rgba(255, 255, 255, 0)',
		});
	},
	setSource(source: any) {
		this.setCode(source);
	},
	setCode(code = initialCode) {
		this.set({
			code,
		});
		const { css, js, html } = code;
		this.styleEl.innerHTML = css;
		this.scriptEl.innerHTML = js;
		this.element.innerHTML = html;
	},
	toObject(propertiesToInclude: string[]) {
		return toObject(this, propertiesToInclude, {
			code: this.get('code'),
			container: this.get('container'),
			editable: this.get('editable'),
		});
	},
	_render(ctx: CanvasRenderingContext2D) {
		this.callSuper('_render', ctx);
		if (!this.element) {
			const { id, scaleX, scaleY, width, height, angle, editable, code  ,styles} = this;
			const zoom = this.canvas.getZoom();
			var left , top;
			if (this.group) {
				left = zoomCoordLeft(zoom, this, this.group)
				top = zoomCoordTop(zoom, this, this.group)
			} else {
				left = this.calcCoords().tl.x;
				top = this.calcCoords().tl.y;
			}
			const padLeft = (width * scaleX * zoom - width) / 2;
			const padTop = (height * scaleY * zoom - height) / 2;
			const _style =  
			`transform: ${`rotate(${angle}deg)`};
			transform-origin:left top;
			width: ${styles.width || `${width*scaleX*zoom}px`};
			height: ${styles.height || `${height*scaleY*zoom}px`};
			left: ${styles.left || `${left}px`};
			top: ${styles.top || `${top}px`};
			position: absolute;
			user-select: ${editable ? 'none' : 'auto'};
			pointer-events: ${editable ? 'none' : 'auto'};`

			this.element = fabric.util.makeElement('div', {
				id: `${id}_container`,
				style: _style,
			}) as HTMLDivElement;
			const { html, css, js } = code;
			this.styleEl = document.createElement('style');
			this.styleEl.id = `${id}_style`;
			this.styleEl.type = 'text/css';
			this.styleEl.innerHTML = css;
			document.head.appendChild(this.styleEl);

			this.scriptEl = document.createElement('script');
			this.scriptEl.id = `${id}_script`;
			this.scriptEl.type = 'text/javascript';
			this.scriptEl.innerHTML = js;
			document.head.appendChild(this.scriptEl);
			const container = document.getElementsByClassName("rde-canvas")[0]
			this.element.innerHTML = html;
			container.appendChild(this.element);
			_renderElementBox(this.element,this.styles);

		}
	},
});

Button.fromObject = (options: ElementObject, callback: (obj: ElementObject) => any) => {
	return callback(new Button(options.code, options));
};

// @ts-ignore
window.fabric.Button = Button;

export default Button;
