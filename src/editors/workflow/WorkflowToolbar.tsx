import React, { Component } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { code } from '../../canvas/constants';
import { Canvas } from '../../canvas';
import { CommonButton } from '../../components/common';

interface IProps {
	canvasRef?: Canvas;
	zoomRatio?: number;
	debugEnabled?: boolean;
	setDebugEnabled?: any;
}

class WorkflowToolbar extends Component<IProps> {
	static propTypes = {
		canvasRef: PropTypes.any,
		selectedItem: PropTypes.object,
		zoomRatio: PropTypes.number,
	};

	state = {
		interactionMode: 'selection',
	};

	componentDidMount() {
		const { canvasRef } = this.props;
		this.waitForCanvasRender(canvasRef);
	}

	componentWillUnmount() {
		const { canvasRef } = this.props;
		this.detachEventListener(canvasRef);
	}

	handlers = {
		selection: () => {
			this.props.canvasRef.handler.interactionHandler.selection();
			this.setState({ interactionMode: 'selection' });
		},
		grab: () => {
			this.props.canvasRef.handler.interactionHandler.grab();
			this.setState({ interactionMode: 'grab' });
		},
	};

	events = {
		keydown: e => {
			if (this.props.canvasRef.canvas.wrapperEl !== document.activeElement) {
				return false;
			}
			if (e.code === code.KEY_Q) {
				this.handlers.selection();
			} else if (e.code === code.KEY_W) {
				this.handlers.grab();
			}
		},
	};

	waitForCanvasRender = canvas => {
		setTimeout(() => {
			if (canvas) {
				this.attachEventListener(canvas);
				return;
			}
			const { canvasRef } = this.props;
			this.waitForCanvasRender(canvasRef);
		}, 5);
	};

	attachEventListener = canvasRef => {
		canvasRef.canvas.wrapperEl.addEventListener('keydown', this.events.keydown, false);
	};

	detachEventListener = canvasRef => {
		canvasRef.canvas.wrapperEl.removeEventListener('keydown', this.events.keydown);
	};

	render() {
		const { canvasRef, zoomRatio, debugEnabled, setDebugEnabled } = this.props;
		const { interactionMode } = this.state;
		const { selection, grab } = this.handlers;
		const zoomValue = parseInt((zoomRatio * 100).toFixed(2), 10);
		return (
			<React.Fragment>
				<div className="rde-editor-toolbar-interaction">
					<Button.Group>
						<CommonButton
							type={interactionMode === 'selection' ? 'primary' : 'default'}
							style={{ borderBottomLeftRadius: '8px', borderTopLeftRadius: '8px' }}
							onClick={() => {
								selection();
							}}
							icon="mouse-pointer"
							tooltipTitle={"???????????? (Q)"}
						/>
						<CommonButton
							type={interactionMode === 'grab' ? 'primary' : 'default'}
							style={{ borderBottomRightRadius: '8px', borderTopRightRadius: '8px' }}
							onClick={() => {
								grab();
							}}
							tooltipTitle={"???????????? (W)"}
							icon="hand-rock"
						/>
					</Button.Group>
				</div>
				<div className="rde-editor-toolbar-zoom">
					<Button.Group>
						<CommonButton
							style={{ borderBottomLeftRadius: '8px', borderTopLeftRadius: '8px' }}
							onClick={() => {
								canvasRef.handler.zoomHandler.zoomIn();
							}}
							icon="search-plus"
							tooltipTitle={i18n.t('action.zoom-in')}
						/>
						<CommonButton
							onClick={() => {
								canvasRef.handler.zoomHandler.zoomOneToOne();
							}}
							tooltipTitle={i18n.t('action.one-to-one')}
						>
							{`${zoomValue}%`}
						</CommonButton>
						<CommonButton
							style={{ borderBottomRightRadius: '8px', borderTopRightRadius: '8px' }}
							onClick={() => {
								canvasRef.handler.zoomHandler.zoomOut();
							}}
							icon="search-minus"
							tooltipTitle={i18n.t('action.zoom-out')}
						/>
					</Button.Group>
				</div>
			</React.Fragment>
		);
	}
}

export default WorkflowToolbar;
