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

const Img = fabric.util.createClass(fabric.Rect, {
	type: 'element',
	superType: 'element',
	hasRotatingPoint: false,
	initialize(code = initialCode, options: any) {
		options = options || {};
		this.callSuper('initialize', options);
		this.set({
			condition: options.condition  || [],
			styles: options.styles || {},
			deviceSetting: options.deviceSetting || {},
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
		// return ;
		this.callSuper('_render', ctx);
		if (!this.element) {
			const { id, scaleX, scaleY, width, height, angle, editable, code ,styles  } = this;
			const { imageSrc  } = styles;
			const { html} = code;
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
			`transform: ${styles.transform || `rotate(${angle}deg) scale(${scaleX * zoom}, ${scaleY * zoom})`};
			transform-origin:left top;
			width: ${styles.width || `${width}px`};
			height: ${styles.height || `${height}px`};
			left: ${styles.left || `${left + padLeft}px`};
			top: ${styles.top || `${top + padTop}px`};
			position: absolute;
			user-select: ${editable ? 'none' : 'auto'};
			pointer-events: ${editable ? 'none' : 'auto'};`
			this.element = fabric.util.makeElement('div', {
				id: `${id}_container`,
				class: "container-element",
				style: _style,
			}) as HTMLDivElement;
			//rde-canvas
			const container = document.getElementsByClassName("rde-canvas")[0];
			this.element.innerHTML = html;
			const _innerHTML = this.element.getElementsByClassName("image")[0];
			//???????????????????????????????????????,?????????????????????
			_innerHTML.src = imageSrc || './images/sample/transparentBg.png';
			_innerHTML.style.transform = `scaleX(${this.flipX ? '-1' : '1'}) scaleY(${this.flipY ? '-1' : '1'})`;
			container.appendChild(this.element);
			_renderElementBox(this.element,this.styles);
		}
	},


});

Img.fromObject = (options: ElementObject, callback: (obj: ElementObject) => any) => {
	return callback(new Img(options.code, options));
};

// @ts-ignore
window.fabric.Img = Img;

export default Img;
