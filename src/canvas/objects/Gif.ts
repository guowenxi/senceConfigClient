import { fabric } from 'fabric';
import 'gifler';

const Gif = fabric.util.createClass(fabric.Object, {
	type: 'gif',
	superType: 'image',
	gifCanvas: null,
	isStarted: false,
	initialize(options: any) {
		options = options || {};
		this.callSuper('initialize', options);
		this.gifCanvas = document.createElement('canvas');
	},
	drawFrame(ctx: CanvasRenderingContext2D, frame: any) {
		// update canvas size
		this.gifCanvas.width = this.width;
		this.gifCanvas.height = this.height;
		// update canvas that we are using for fabric.js
		ctx.drawImage(frame.buffer, -this.width / 2, -this.height / 2, this.width, this.height);
	},
	_render(ctx: CanvasRenderingContext2D) {
		this.callSuper('_render', ctx);
		if (!this.isStarted) {
			this.isStarted = true;
			window
				// @ts-ignore
				.gifler('./images/gif.gif')
				.frames(this.gifCanvas, (_c: CanvasRenderingContext2D, frame: any) => {
					this.isStarted = true;
					this.drawFrame(ctx, frame);
				});
		}
	},
});

Gif.fromObject = (options: any, callback: (obj: any) => any) => {
	return callback(new Gif(options));
};

// @ts-ignore
window.fabric.Gif = Gif;

export default Gif;
