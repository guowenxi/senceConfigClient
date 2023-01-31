import * as echarts from 'echarts';
import { fabric } from 'fabric';
import { FabricElement, toObject } from '../utils';

export interface ChartObject extends FabricElement {
	setSource: (source: echarts.EChartOption) => void;
	setChartOption: (chartOption: echarts.EChartOption) => void;
	chartOption: echarts.EChartOption;
	instance: echarts.ECharts;
}

const Chart = fabric.util.createClass(fabric.Rect, {
	type: 'chart',
	superType: 'element',
	hasRotatingPoint: false,
	initialize(chartOption: echarts.EChartOption, options: any) {
		options = options || {};
		this.callSuper('initialize', options);
		this.set({
			condition: options.condition  || [],
			styles: options.styles || {},
			deviceSetting: options.deviceSetting || {},
			chartOption,
			fill: 'rgba(255, 255, 255, 0)',
			stroke: 'rgba(255, 255, 255, 0)',
		});
	},
	setSource(source: echarts.EChartOption | string) {
		if (typeof source === 'string') {
			this.setChartOptionStr(source);
		} else {
			this.setChartOption(source);
		}
	},
	setChartOptionStr(chartOptionStr: string) {
		this.set({
			chartOptionStr,
		});
	},
	setChartOption(chartOption: echarts.EChartOption) {
		this.set({
			chartOption,
		});
		this.distroyChart();
		this.createChart(chartOption);
	},
	createChart(chartOption: echarts.EChartOption) {
		this.instance = echarts.init(this.element);
		if (!chartOption) {
			this.instance.setOption({
				xAxis: {},
				yAxis: {},
				series: [
					{
						type: 'line',
						data: [
							[0, 1],
							[1, 2],
							[2, 3],
							[3, 4],
						],
					},
				],
			});
		} else {
			this.instance.setOption(chartOption);
		}
	},
	distroyChart() {
		if (this.instance) {
			this.instance.dispose();
		}
	},
	toObject(propertiesToInclude: string[]) {
		return toObject(this, propertiesToInclude, {
			chartOption: this.get('chartOption'),
			container: this.get('container'),
			editable: this.get('editable'),
		});
	},
	_render(ctx: CanvasRenderingContext2D) {
		this.callSuper('_render', ctx);
		if (!this.instance) {
			const { id, scaleX, scaleY, width, height, angle, editable, chartOption,styles } = this;
			const zoom = this.canvas.getZoom();
			const left = this.calcCoords().tl.x;
			const top = this.calcCoords().tl.y;
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
			this.createChart(chartOption);
			const container = document.getElementsByClassName("rde-canvas")[0];
			container.appendChild(this.element);
		}
	},
});

Chart.fromObject = (options: ChartObject, callback: (obj: ChartObject) => any) => {
	return callback(new Chart(options.chartOption, options));
};

// @ts-ignore
window.fabric.Chart = Chart;

export default Chart;
