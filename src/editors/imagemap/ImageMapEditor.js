import { Badge, Button, Menu, Popconfirm ,message } from 'antd';
import i18n from 'i18next';
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import Canvas from '../../canvas/Canvas';
import CommonButton from '../../components/common/CommonButton';
import { Content } from '../../components/layout';
import SandBox from '../../components/sandbox/SandBox';
import '../../libs/fontawesome-6.1.2/css/all.css';
import '../../libs/fontawesome-6.1.2/css/all.css';
import '../../styles/index.less';
import ImageMapConfigurations from './ImageMapConfigurations';
import ImageMapFooterToolbar from './ImageMapFooterToolbar';
import ImageMapHeaderToolbar from './ImageMapHeaderToolbar';
import ComponentToolBar from './ComponentToolBar';
import ImageMapItems from './ImageMapItems_';
import ImageMapPreview from './ImageMapPreview';
import ImageMapTitle from './ImageMapTitle';
import PageMapItems from './PageMapItems';
import { selectedPageSenceId } from './PageMapItems';
import selectDomJSON from './selectDomJSON';
import renderDom from './renderDom';
import pushStyleToItem from './pushStyleToItem';
import Icon from '../../components/icon/Icon';
import axios from "axios"
import { http ,baseUrl ,root } from '../../http';
/**
 * TIPS 设置保留字段
 */
const propertiesToInclude = [
	'id',
	'name',
	'locked',
	'file',
	'src',
	'link',
	'tooltip',
	'animation',
	'layout',
	'workareaWidth',
	'workareaHeight',
	'videoLoadType',
	'autoplay',
	'shadow',
	'muted',
	'loop',
	'code',
	'icon',
	'userProperty',
	'trigger',
	'configuration',
	'superType',
	'points',
	'svg',
	'loadType',
	'styles',
	'condition',
	'deviceSetting',
];

const defaultOption = {
	stroke: 'rgba(255, 255, 255, 0)',
	strokeUniform: true,
	resource: {},
	link: {
		enabled: false,
		type: 'resource',
		state: 'new',
		dashboard: {},
	},
	tooltip: {
		enabled: true,
		type: 'resource',
		template: '<div>{{message.name}}</div>',
	},
	animation: {
		type: 'none',
		loop: true,
		autoplay: true,
		duration: 1000,
	},
	userProperty: {},
	trigger: {
		enabled: false,
		type: 'alarm',
		script: 'return message.value > 0;',
		effect: 'style',
	},
};

class ImageMapEditor extends Component {
	state = {
		selectedItem: null,
		zoomRatio: 1,
		preview: false,
		loading: false,
		progress: 0,
		animations: [],
		styles: [],
		dataSources: [],
		editing: false,
		descriptors: {},
		objects: undefined,
	};

	componentDidMount() {
		//默认加载组件json
		import('./Descriptors_.json').then(descriptors => {
			this.setState(
				{ 
					descriptors: descriptors,
				},
				() => {
					this.showLoading(false);
				},
			);
		});
		this.setState({
			selectedItem: null,
		});
	}

	canvasHandlers = {
		onAdd: target => {
			const { editing } = this.state;
			this.forceUpdate();
			if (!editing) {
				this.changeEditing(true);
			}
			if (target.type === 'activeSelection') {
				this.canvasHandlers.onSelect(null);
				return;
			}
			this.canvasRef.handler.select(target);
		},
		onSelect: target => {
			const { selectedItem } = this.state;
			if (target && target.id && target.id !== 'workarea' && target.type !== 'activeSelection') {
				if (selectedItem && target.id === selectedItem.id) {
					return;
				}
				this.canvasRef.handler.getObjects().forEach(obj => {
					if (obj) {
						this.canvasRef.handler.animationHandler.resetAnimation(obj, true);
					}
				});
				/**
				 * TIPS 在这里进行赋值
				 */
				console.log(target)
				this.setState({
					selectedItem: target,
				});
				return;
			}
			this.canvasRef.handler.getObjects().forEach(obj => {
				if (obj) {
					this.canvasRef.handler.animationHandler.resetAnimation(obj, true);
				}
			});
			this.setState({
				selectedItem: null,
			});
		},
		onRemove: () => {
			const { editing } = this.state;
			if (!editing) {
				this.changeEditing(true);
			}
			this.canvasHandlers.onSelect(null);
		},
		onModified: debounce(() => {
			const { editing } = this.state;
			this.forceUpdate();
			if (!editing) {
				this.changeEditing(true);
			}
		}, 300),
		onZoom: zoom => {
			this.setState({
				zoomRatio: zoom,
			});
		},
		onChange: (selectedItem, changedValues, allValues,idx) => {
			console.log("ImageMapEditor.js--- ")
			const { editing } = this.state;
			if (!editing) {
				this.changeEditing(true);
			}
			const changedKey = Object.keys(changedValues)[0];
			const changedValue = changedValues[changedKey];
			if (allValues.workarea) {
				this.canvasHandlers.onChangeWokarea(changedKey, changedValue, allValues.workarea);
				return;
			}

			if (changedKey === 'width' || changedKey === 'height') {
				this.canvasRef.handler.scaleToResize(allValues.width, allValues.height);
				return;
			}
			if (changedKey === 'angle') {
				this.canvasRef.handler.rotate(allValues.angle);
				return;
			}
			if (changedKey === 'locked') {
				// HACK if group compnent locked ,disabel contrl;
				this.canvasRef.handler.setObject({
					lockMovementX: changedValue,
					lockMovementY: changedValue,
					hasControls: selectedItem.type === "group" ? false : !changedValue,
					hoverCursor: changedValue ? 'pointer' : 'move',
					editable: selectedItem.type === "group" ? false : !changedValue,
					locked: changedValue,
				},selectedItem);
				return;
			}
			if (changedKey === 'file' || changedKey === 'src' || changedKey === 'code') {
				if (selectedItem.type === 'image') {
					this.canvasRef.handler.setImageById(selectedItem.id, changedValue);
				} else if (selectedItem.superType === 'element') {
					this.canvasRef.handler.elementHandler.setById(selectedItem.id, changedValue);
				}
				return;
			}
			if (changedKey === 'link') {
				const link = Object.assign({}, defaultOption.link, allValues.link);
				this.canvasRef.handler.set(changedKey, link);
				return;
			}
			if (changedKey === 'tooltip') {
				const tooltip = Object.assign({}, defaultOption.tooltip, allValues.tooltip);
				this.canvasRef.handler.set(changedKey, tooltip);
				return;
			}
			if (changedKey === 'animation') {
				const animation = Object.assign({}, defaultOption.animation, allValues.animation);
				this.canvasRef.handler.set(changedKey, animation);
				return;
			}
			if (changedKey === 'icon') {
				const { unicode, styles } = changedValue[Object.keys(changedValue)[0]];
				const uni = parseInt(unicode, 16);
				if (styles[0] === 'brands') {
					this.canvasRef.handler.set('fontFamily', 'Font Awesome 5 Brands');
				} else if (styles[0] === 'regular') {
					this.canvasRef.handler.set('fontFamily', 'Font Awesome 5 Regular');
				} else {
					this.canvasRef.handler.set('fontFamily', 'Font Awesome 5 Free');
				}
				this.canvasRef.handler.set('text', String.fromCodePoint(uni));
				this.canvasRef.handler.set('icon', changedValue);
				return;
			}
			if (changedKey === 'shadow') {
				if (allValues.shadow.enabled) {
					if ('blur' in allValues.shadow) {
						this.canvasRef.handler.setShadow(allValues.shadow);
					} else {
						this.canvasRef.handler.setShadow({
							enabled: true,
							blur: 15,
							offsetX: 10,
							offsetY: 10,
						});
					}
				} else {
					this.canvasRef.handler.setShadow(null);
				}
				return;
			}
			if (changedKey === 'fontFamily') {
				this.canvasRef.handler.setStyle("fontFamily", changedValue );
				return;
			}
			if (changedKey === 'fontWeight') {
				this.canvasRef.handler.setStyle("fontWeight", changedValue );
				return;
			}
			if (changedKey === 'lineHeight') {
				this.canvasRef.handler.setStyle("lineHeight", changedValue);
				return;
			}
			if (changedKey === 'fontStyle') {
				this.canvasRef.handler.setStyle(changedKey, changedValue);
				return;
			}
			if (changedKey === 'fontSize') {
				this.canvasRef.handler.setStyle("fontSize", changedValue || '16');
				return;
			}
			if (changedKey === 'strikethrough') {
				this.canvasRef.handler.setStyle('textDecoration', changedValue );
				return;
			}
			if (changedKey === 'textDecoration') {
				this.canvasRef.handler.setStyle(changedKey, changedValue );
				return;
			}
			if (changedKey === 'textAlign') {
				this.canvasRef.handler.setStyle('textAlign', changedValue);
				return;
			}
			if (changedKey === 'letterSpacing') {
				this.canvasRef.handler.setStyle('letterSpacing', changedValue);
				return;
			}
			if (changedKey === 'backgroundColor') {
				this.canvasRef.handler.setStyle('backgroundColor', changedValue );
				return;
			}
			if (changedKey === 'color') {
				this.canvasRef.handler.setStyle('color', changedValue );
				return;
			}
			if (changedKey === 'borderRadius') {
				this.canvasRef.handler.setStyle('borderRadius', changedValue );
				return;
			}
			if (changedKey === 'borderWidth') {
				this.canvasRef.handler.setStyle('borderWidth', changedValue );
				return;
			}
			if (changedKey === 'borderStyle') {
				this.canvasRef.handler.setStyle('borderStyle', changedValue );
				return;
			}
			if (changedKey === 'borderColor') {
				this.canvasRef.handler.setStyle('borderColor', changedValue );
				return;
			}
			if (changedKey === 'trigger') {
				const trigger = Object.assign({}, defaultOption.trigger, allValues.trigger);
				this.canvasRef.handler.set(changedKey, trigger);
				return;
			}
			if (changedKey === 'innerHTML') {
				this.canvasRef.handler.setHTML('innerHTML', changedValue || "" );
				return;
			}
			if (changedKey === 'backgroundImage') {
				this.canvasRef.handler.setStyle('backgroundImage', changedValue || "" );
				return;
			}
			if (changedKey === 'backgroundRepeat') {
				this.canvasRef.handler.setStyle('backgroundRepeat', changedValue || "" );
				return;
			}
			if (changedKey === 'opacity') {
				this.canvasRef.handler.setStyle('opacity', changedValue/100 );
				return;
			}
			if (changedKey === 'imageSrc') {
				this.canvasRef.handler.setSRC('imageSrc', changedValue );
				return;
			}
			if (changedKey === 'filters') {
				const filterKey = Object.keys(changedValue)[0];
				const filterValue = allValues.filters[filterKey];
				if (filterKey === 'gamma') {
					const rgb = [filterValue.r, filterValue.g, filterValue.b];
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						gamma: rgb,
					});
					return;
				}
				if (filterKey === 'brightness') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						brightness: filterValue.brightness,
					});
					return;
				}
				if (filterKey === 'contrast') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						contrast: filterValue.contrast,
					});
					return;
				}
				if (filterKey === 'saturation') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						saturation: filterValue.saturation,
					});
					return;
				}
				if (filterKey === 'hue') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						rotation: filterValue.rotation,
					});
					return;
				}
				if (filterKey === 'noise') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						noise: filterValue.noise,
					});
					return;
				}
				if (filterKey === 'pixelate') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						blocksize: filterValue.blocksize,
					});
					return;
				}
				if (filterKey === 'blur') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						value: filterValue.value,
					});
					return;
				}
				this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey]);
				return;
			}
			//如果是设置
			if (changedKey === 'condition') {
				try {
					this.canvasRef.handler.setCondition('condition', allValues || [] );
				} catch (error) {
					console.error(error);
				}
				return;
			}
			if (changedKey === 'eventConditionList') {
				try {
					this.canvasRef.handler.setEventConditionList('eventConditionList', changedValue || [] ,idx || 0);
				} catch (error) {
					console.error(error);
				}
				return;
			}

			if (changedKey === 'chartOption') {
				try {
					const sandbox = new SandBox();
					const compiled = sandbox.compile(changedValue);
					const { animations, styles } = this.state;
					const chartOption = compiled(3, animations, styles, selectedItem.userProperty);
					selectedItem.setChartOptionStr(changedValue);
					this.canvasRef.handler.elementHandler.setById(selectedItem.id, chartOption);
				} catch (error) {
					console.error(error);
				}
				return;
			}

			this.canvasRef.handler.set(changedKey, changedValue,selectedItem);
		},
		onChangeWokarea: (changedKey, changedValue, allValues) => {
			if (changedKey === 'layout') {
				this.canvasRef.handler.workareaHandler.setLayout(changedValue);
				return;
			}
			if (changedKey === 'file' || changedKey === 'src') {
				this.canvasRef.handler.workareaHandler.setImage(changedValue);
				return;
			}
			if (changedKey === 'width' || changedKey === 'height') {
				this.canvasRef.handler.originScaleToResize(
					this.canvasRef.handler.workarea,
					allValues.width,
					allValues.height,
				);
				this.canvasRef.canvas.centerObject(this.canvasRef.handler.workarea);
				return;
			}
			this.canvasRef.handler.workarea.set(changedKey, changedValue);
			this.canvasRef.canvas.requestRenderAll();
		},
		onTooltip: (ref, target) => {
			const value = Math.random() * 10 + 1;
			const { animations, styles } = this.state;
			// const { code } = target.trigger;
			// const compile = SandBox.compile(code);
			// const result = compile(value, animations, styles, target.userProperty);
			// console.log(result);
			return (
				<div>
					<div>
						<div>
							<Button>{target.id}</Button>
						</div>
						<Badge count={value} />
					</div>
				</div>
			);
		},
		onClick: (canvas, target) => {
			const { link } = target;
			if (link.state === 'current') {
				document.location.href = link.url;
				return;
			}
			window.open(link.url);
		},
		onContext: (ref, event, target) => {
			if ((target && target.id === 'workarea') || !target) {
				const { layerX: left, layerY: top } = event;
				return (
					<Menu>
						<Menu.SubMenu key="add" style={{ width: 120 }} title={i18n.t('action.add')}>
							{this.transformList().map(item => {
								const option = Object.assign({}, item.option, { left, top });
								const newItem = Object.assign({}, item, { option });
								return (
									<Menu.Item style={{ padding: 0 }} key={item.name}>
										{this.itemsRef.renderItem(newItem, false)}
									</Menu.Item>
								);
							})}
						</Menu.SubMenu>
					</Menu>
				);
			}
			if (target.type === 'activeSelection') {
				return (
					<Menu>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.toGroup();
							}}
						>
							{i18n.t('action.object-group')}
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.duplicate();
							}}
						>
							{i18n.t('action.clone')}
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.remove();
							}}
						>
							{i18n.t('action.delete')}
						</Menu.Item>
					</Menu>
				);
			}
			if (target.type === 'group') {
				return (
					<Menu>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.toActiveSelection();
							}}
						>
							{i18n.t('action.object-ungroup')}
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.duplicate();
							}}
						>
							{i18n.t('action.clone')}
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.remove();
							}}
						>
							{i18n.t('action.delete')}
						</Menu.Item>
					</Menu>
				);
			}
			return (
				<Menu>
					<Menu.Item
						onClick={() => {
							this.canvasRef.handler.duplicateById(target.id);
						}}
					>
						{i18n.t('action.clone')}
					</Menu.Item>
					<Menu.Item
						onClick={() => {
							this.canvasRef.handler.removeById(target.id);
						}}
					>
						{i18n.t('action.delete')}
					</Menu.Item>
				</Menu>
			);
		},
		onTransaction: transaction => {
			this.forceUpdate();
		},
	};

	settingSize = (data) => {
		const _data = data.map(function (item) {
			if (item.id !== 'workarea') {
				item.width = item.width * item.scaleX;
				item.height = item.height * item.scaleY;
				item.scaleX = 1;
				item.scaleY = 1;
			}
			return item;
		})
		return _data;
	}
	handlers = {
		loadJson: (item)=>{
			this.showLoading(true);
			http({
				method:'get',
				url:'/sencePage/getSencePageInfo',
				data:{
					senceId:item.senceId
				}
			}).then((res)=>{
				console.log(JSON.parse(res.data.data.json));
				this.handlers.onImportJson(res.data.data.json);
			})
			//是否默认加载
		},
		//预览
		onChangePreview: checked => {
			console.log("ImageMapEditor.js --495 onChangePreview 操作dom展示");
			//开启新的路由页面进行渲染
			// http://localhost:4000/#/showPage?senceId=
			
			window.open(`${root}:8881/sence_config/#/showPage?senceId=${selectedPageSenceId}`)
			//这个步骤是在fabric内进行渲染,所以dom渲染有一些操作是无法实现的,首先需要加入dom的一些配置到json里去,然后通过react直接渲染组件的方式进行渲染
			let data;
			// this.canvas.toObject(this.propertiesToInclude).objects
			if (this.canvasRef) {
				data = this.canvasRef.handler.exportJSON();
				console.log(data)
				data.shift();
				renderDom(data)
			}
			axios.post("http://192.168.2.92:9000/control-module/deviceModule/addDevice", {
				deviceJson: JSON.stringify(data)
			}).then((data) => {
				window.open("http://localhost:8001/#/./Gateways_sceneControlShow?anchor=true")
			})
			// console.log(JSON.stringify(data));
			// console.log(data);
			this.setState({
				// preview: typeof checked === 'object' ? false : checked,
				// objects: selectDomJSON(_data),
				// objects: this.settingSize(_data),
			});
		},
		onProgress: progress => {
			this.setState({
				progress,
			});
		},
		onImport: files => {
			if (files) {
				this.showLoading(true);
				setTimeout(() => {
					const reader = new FileReader();
					reader.onprogress = e => {
						if (e.lengthComputable) {
							const progress = parseInt((e.loaded / e.total) * 100, 10);
							this.handlers.onProgress(progress);
						}
					};
					reader.onload = e => {
						const { objects, animations, styles, dataSources } = JSON.parse(e.target.result);
						this.setState({
							animations,
							styles,
							dataSources,
						});
						if (objects) {
							this.canvasRef.handler.clear(true);
							const data = objects.filter(obj => {
								if (!obj.id) {
									return false;
								}
								return true;
							});
							this.canvasRef.handler.importJSON(data);
						}
					};
					reader.onloadend = () => {
						this.showLoading(false);
					};
					reader.onerror = () => {
						this.showLoading(false);
					};
					reader.readAsText(files[0]);
				}, 500);
			}
		},
		onImportJson: res => {
			if (res) {
				this.showLoading(true);
				setTimeout(() => {
					const objects = JSON.parse(res);
					if (objects) {
						this.canvasRef.handler.clear(true);
						const data = objects.filter(obj => {
							if (!obj.id) {
								return false;
							}
							return true;
						});
						this.canvasRef.handler.importJSON(data);
					}
					/**
					 * 暂时注释
					 */
					// this.canvasRef.handler.zoomHandler.zoomToFit();
					this.showLoading(false);
					/**
					 * ??? 在加载本地文件时使用 暂时注释
					 */
					// reader.readAsText(files[0]);
				}, 500);
			}
		},
		onUpload: () => {
			console.log("上传配置");
			let data;
			/**
			 * save data to sever
			 */
			if (this.canvasRef) {
				data =  pushStyleToItem(this.canvasRef.handler.exportJSON());
				data.shift();
			}
			message.loading({ content: '上传中...', key:'uploadConfig' });
			http({
				method:'post',
				url:'/sencePage/setSencePageInfo',
				data:{
					senceId:selectedPageSenceId,
					json:data
				}
			}).then((res)=>{
				message.success({ content: '上传配置成功,可通过预览查看', key:'uploadConfig' });
			})
			return ;
			const inputEl = document.createElement('input');
			inputEl.accept = '.json';
			inputEl.type = 'file';
			inputEl.hidden = true;
			inputEl.onchange = e => {
				this.handlers.onImport(e.target.files);
			};
			document.body.appendChild(inputEl); // required for firefox
			inputEl.click();
			inputEl.remove();
		},
		onDownload: () => {
			this.showLoading(true);
			const objects = this.canvasRef.handler.exportJSON().filter(obj => {
				if (!obj.id) {
					return false;
				}
				return true;
			});
			const { animations, styles, dataSources } = this.state;
			const exportDatas = {
				objects,
				animations,
				styles,
				dataSources,
			};
			const anchorEl = document.createElement('a');
			anchorEl.href = `data:text/json;charset=utf-8,${encodeURIComponent(
				JSON.stringify(exportDatas, null, '\t'),
			)}`;
			anchorEl.download = `${this.canvasRef.handler.workarea.name || 'sample'}.json`;
			document.body.appendChild(anchorEl); // required for firefox
			anchorEl.click();
			anchorEl.remove();
			this.showLoading(false);
		},
		onChangeAnimations: animations => {
			if (!this.state.editing) {
				this.changeEditing(true);
			}
			this.setState({
				animations,
			});
		},
		onChangeStyles: styles => {
			if (!this.state.editing) {
				this.changeEditing(true);
			}
			this.setState({
				styles,
			});
		},
		onChangeDataSources: dataSources => {
			if (!this.state.editing) {
				this.changeEditing(true);
			}
			this.setState({
				dataSources,
			});
		},
		onSaveImage: () => {
			this.canvasRef.handler.saveCanvasImage();
		},
	};

	transformList = () => {
		return Object.values(this.state.descriptors).reduce((prev, curr) => prev.concat(curr), []);
	};

	showLoading = loading => {
		this.setState({
			loading,
		});
	};

	changeEditing = editing => {
		this.setState({
			editing,
		});
	};

	render() {
		const {
			preview,
			selectedItem,
			zoomRatio,
			loading,
			progress,
			animations,
			styles,
			dataSources,
			editing,
			descriptors,
			objects,
			
		} = this.state;
		const {
			onAdd,
			onRemove,
			onSelect,
			onModified,
			onChange,
			onZoom,
			onTooltip,
			onClick,
			onContext,
			onTransaction,
		} = this.canvasHandlers;
		const {
			loadJson,
			onChangePreview,
			onDownload,
			onUpload,
			onImportJson,
			onChangeAnimations,
			onChangeStyles,
			onChangeDataSources,
			onSaveImage,
		} = this.handlers;
		const action = (
			<React.Fragment>
				<CommonButton
					className="rde-action-btn"
					shape="circle"
					icon="file-download"
					disabled={!editing}
					tooltipTitle={"下载配置"}
					onClick={onDownload}
					tooltipPlacement="bottomRight"
				/>
				{editing ? (
					<Popconfirm
						// title={i18n.t('imagemap.imagemap-editing-confirm')}
						// okText={i18n.t('action.ok')}
						// cancelText={i18n.t('action.cancel')}
						title={'场景已修改,是否保存?'}
						okText={'是'}
						cancelText={'否'}
						onConfirm={onUpload}
						placement="bottomRight"
					>
						<CommonButton
							className="rde-action-btn"
							shape="circle"
							icon="file-upload"
							tooltipTitle={"上传配置"}
							tooltipPlacement="bottomRight"
						/>
					</Popconfirm>
				) : (
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						icon="file-upload"
						tooltipTitle={"上传配置"}
						tooltipPlacement="bottomRight"
						onClick={onUpload}
					/>
				)}
				<CommonButton
					className="rde-action-btn"
					shape="circle"
					icon="image"
					tooltipTitle={"保存图片"}
					onClick={onSaveImage}
					tooltipPlacement="bottomRight"
				/>
			</React.Fragment>
		);
		const titleContent = (
			<React.Fragment>
				<Icon size="1.5" name="bars" />
				<div  style={{marginLeft:'20px'}} >{"项目1"}</div>
				<Icon size="1.5" style={{marginLeft:'20px'}}  name="columns" />
				<Button style={{marginLeft:'20px'}}  type="primary">模板库</Button>
			</React.Fragment>
		);
		const HeaderToolbar = <ImageMapHeaderToolbar
		canvasRef={this.canvasRef}
		selectedItem={selectedItem}
		onSelect={onSelect}
		/>
		const ComponentBar = <ComponentToolBar
		canvasRef={this.canvasRef}
		descriptors={this.state.descriptors}
		selectedItem={selectedItem}
		></ComponentToolBar>
		const title = <ImageMapTitle
		title={titleContent}
		content={HeaderToolbar}
		action={action}
		component={ComponentBar}
		    />;
		const content = (
			<div className="rde-editor">
				<PageMapItems
				canvasRef={this.canvasRef}
				onChange={onChange}
				selectedItem={selectedItem}
				loadJson={loadJson}
				>
				</PageMapItems>
				<div className="rde-editor-canvas-container">
					<div
						ref={c => {
							this.container = c;
						}}
						className="rde-editor-canvas"
					>
						<Canvas
							ref={c => {
								this.canvasRef = c;
							}}
							className="rde-canvas"
							minZoom={30}
							maxZoom={500}
							objectOption={defaultOption}
							propertiesToInclude={propertiesToInclude}
							onModified={onModified}
							onAdd={onAdd}
							onRemove={onRemove}
							onSelect={onSelect}
							onZoom={onZoom}
							onTooltip={onTooltip}
							onClick={onClick}
							onContext={onContext}
							onTransaction={onTransaction}
							keyEvent={{
								transaction: true,
							}}
							canvasOption={{
								// backgroundColor:"#121c24",
								selectionColor: 'rgba(8, 151, 156, 0.3)',
							}}
						/>
					</div>
					<div className="rde-editor-footer-toolbar">
						<ImageMapFooterToolbar
							canvasRef={this.canvasRef}
							preview={preview}
							onChangePreview={onChangePreview}
							zoomRatio={zoomRatio}
						/>
					</div>
				</div>
				<ImageMapConfigurations
					canvasRef={this.canvasRef}
					onChange={onChange}
					selectedItem={selectedItem}
					onChangeAnimations={onChangeAnimations}
					onChangeStyles={onChangeStyles}
					onChangeDataSources={onChangeDataSources}
					animations={animations}
					styles={styles}
					dataSources={dataSources}
				/>
				<ImageMapPreview
					preview={preview}
					onChangePreview={onChangePreview}
					onTooltip={onTooltip}
					onClick={onClick}
					objects={objects}
				/>
			</div>
		);
		return <Content title={title} content={content} loading={loading} className="" />;
	}
}

export default ImageMapEditor;
