import MarkerProperty from './MarkerProperty';
import GeneralProperty from './GeneralProperty';
import StyleProperty from './StyleProperty';
import TooltipProperty from './TooltipProperty';
import ImageProperty from './ImageProperty';
import TextProperty from './TextProperty';
import ButtonProperty from './ButtonProperty';
import MapProperty from './MapProperty';
import LinkProperty from './LinkProperty';
import VideoProperty from './VideoProperty';
import ElementProperty from './ElementProperty';
import IframeProperty from './IframeProperty';
import AnimationProperty from './AnimationProperty';
import ShadowProperty from './ShadowProperty';
import UserProperty from './UserProperty';
import TriggerProperty from './TriggerProperty';
import ImageFilterProperty from './ImageFilterProperty';
import ChartProperty from './ChartProperty';

export default {
	input: {
		general: {
			title: '基础设置',
			component: "GeneralProperty",
		},
		config: {
			title: '组件配置',
			component: "InputProperty",
		},
		data: {
			title: '数据',
			component: "DataProperty",
		},
		condition: {
			title: '事件',
			component: 'ConditionProperty',
		},
	},
	button: {
		general: {
			title: '基础设置',
			component: "GeneralProperty",
		},
		config: {
			title: '组件配置',
			component: "ButtonProperty",
		},
		data: {
			title: 'Shadow',
			component: "DataProperty",
		},
		condition: {
			title: 'Image',
			component: 'ConditionProperty',
		},
	},
	map: {
		map: {
			title: '画布设置',
			component: 'MapProperty',
		},
		image: {
			title: '画布背景图设置',
			component: 'ImageProperty',
		},
	},
	group: {
		general: {
			title: 'General',
			component: "EmptyProperty",
		},
		config: {
			title: 'Shadow',
			component: "EmptyProperty",
		},
		data: {
			title: 'Shadow',
			component: "EmptyProperty",
		},
	},
	textbox: {
		general: {
			title: '基础设置',
			component: "GeneralProperty",
		},
		config: {
			title: '基础设置',
			component: 'TextProperty',
		},
		data: {
			title: 'Shadow',
			component: "DataProperty",
		},
		condition: {
			title: 'Image',
			component: 'ConditionProperty',
		},
	},
	frameImg:{
		general: {
			title: '样式',
			component: 'GeneralProperty',
		},
		config: {
			title: '基础设置',
			component: 'FrameImgProperty',
		},
		data: {
			title: '数据',
			component: "DataProperty",
		},
		condition: {
			title: '事件',
			component: 'ConditionProperty',
		},
	},
	image: {
		general: {
			title: 'General',
			component: 'GeneralProperty',
		},
		config: {
			title: 'Image',
			component: 'ImageProperty',
		},
		data: {
			title: '数据',
			component: "DataProperty",
		},
		condition: {
			title: '事件',
			component: 'ConditionProperty',
		},
	},

	chart: {
		general: {
			title: 'General',
			component: 'GeneralProperty',
		},
		config: {
			title: '设置',
			component: 'ChartProperty',
		},
	},

	// image: {
	// 	general: {
	// 		title: 'General',
	// 		component: 'GeneralProperty',
	// 	},
	// 	config: {
	// 		title: 'Image',
	// 		component: 'ImageProperty',
	// 	},
	// 	filter: {
	// 		title: 'Filter',
	// 		component: ImageFilterProperty,
	// 	},
	// 	link: {
	// 		title: 'Link',
	// 		component: LinkProperty,
	// 	},
	// 	tooltip: {
	// 		title: 'Tooltip',
	// 		component: TooltipProperty,
	// 	},
	// 	style: {
	// 		title: 'Style',
	// 		component: StyleProperty,
	// 	},
	// 	shadow: {
	// 		title: 'Shadow',
	// 		component: ShadowProperty,
	// 	},
	// 	animation: {
	// 		title: 'Animation',
	// 		component: AnimationProperty,
	// 	},
	// 	trigger: {
	// 		title: 'Trigger',
	// 		component: TriggerProperty,
	// 	},
	// 	userProperty: {
	// 		title: 'User Property',
	// 		component: UserProperty,
	// 	},
	// },
	triangle: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		link: {
			title: 'Link',
			component: LinkProperty,
		},
		tooltip: {
			title: 'Tooltip',
			component: TooltipProperty,
		},
		style: {
			title: 'Style',
			component: StyleProperty,
		},
		shadow: {
			title: 'Shadow',
			component: ShadowProperty,
		},
		animation: {
			title: 'Animation',
			component: AnimationProperty,
		},
		trigger: {
			title: 'Trigger',
			component: TriggerProperty,
		},
		userProperty: {
			title: 'User Property',
			component: UserProperty,
		},
	},
	rect: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		link: {
			title: 'Link',
			component: LinkProperty,
		},
		tooltip: {
			title: 'Tooltip',
			component: TooltipProperty,
		},
		style: {
			title: 'Style',
			component: StyleProperty,
		},
		shadow: {
			title: 'Shadow',
			component: ShadowProperty,
		},
		animation: {
			title: 'Animation',
			component: AnimationProperty,
		},
		trigger: {
			title: 'Trigger',
			component: TriggerProperty,
		},
		userProperty: {
			title: 'User Property',
			component: UserProperty,
		},
	},
	circle: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		link: {
			title: 'Link',
			component: LinkProperty,
		},
		tooltip: {
			title: 'Tooltip',
			component: TooltipProperty,
		},
		style: {
			title: 'Style',
			component: StyleProperty,
		},
		shadow: {
			title: 'Shadow',
			component: ShadowProperty,
		},
		animation: {
			title: 'Animation',
			component: AnimationProperty,
		},
		trigger: {
			title: 'Trigger',
			component: TriggerProperty,
		},
		userProperty: {
			title: 'User Property',
			component: UserProperty,
		},
	},
	polygon: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		link: {
			title: 'Link',
			component: LinkProperty,
		},
		tooltip: {
			title: 'Tooltip',
			component: TooltipProperty,
		},
		style: {
			title: 'Style',
			component: StyleProperty,
		},
		shadow: {
			title: 'Shadow',
			component: ShadowProperty,
		},
		animation: {
			title: 'Animation',
			component: AnimationProperty,
		},
		trigger: {
			title: 'Trigger',
			component: TriggerProperty,
		},
		userProperty: {
			title: 'User Property',
			component: UserProperty,
		},
	},
	line: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		link: {
			title: 'Link',
			component: LinkProperty,
		},
		tooltip: {
			title: 'Tooltip',
			component: TooltipProperty,
		},
		style: {
			title: 'Style',
			component: StyleProperty,
		},
		shadow: {
			title: 'Shadow',
			component: ShadowProperty,
		},
		animation: {
			title: 'Animation',
			component: AnimationProperty,
		},
		trigger: {
			title: 'Trigger',
			component: TriggerProperty,
		},
		userProperty: {
			title: 'User Property',
			component: UserProperty,
		},
	},
	arrow: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		link: {
			title: 'Link',
			component: LinkProperty,
		},
		tooltip: {
			title: 'Tooltip',
			component: TooltipProperty,
		},
		style: {
			title: 'Style',
			component: StyleProperty,
		},
		shadow: {
			title: 'Shadow',
			component: ShadowProperty,
		},
		animation: {
			title: 'Animation',
			component: AnimationProperty,
		},
		trigger: {
			title: 'Trigger',
			component: TriggerProperty,
		},
		userProperty: {
			title: 'User Property',
			component: UserProperty,
		},
	},
	video: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		video: {
			title: 'Video',
			component: VideoProperty,
		},
	},
	element: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		video: {
			title: 'Element',
			component: ElementProperty,
		},
	},
	iframe: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		video: {
			title: 'Iframe',
			component: IframeProperty,
		},
	},
	svg: {
		general: {
			title: 'General',
			component: GeneralProperty,
		},
		link: {
			title: 'Link',
			component: LinkProperty,
		},
		tooltip: {
			title: 'Tooltip',
			component: TooltipProperty,
		},
		style: {
			title: 'Style',
			component: StyleProperty,
		},
		shadow: {
			title: 'Shadow',
			component: ShadowProperty,
		},
		animation: {
			title: 'Animation',
			component: AnimationProperty,
		},
		trigger: {
			title: 'Trigger',
			component: TriggerProperty,
		},
		userProperty: {
			title: 'User Property',
			component: UserProperty,
		},
	},
	
};
