import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Button,  } from 'antd';
import { Flex } from '../../components/flex';
import ImageMapList from './ImageMapList';
import { CommonButton } from '../../components/common';
import Icon from '../../components/icon/Icon';

class ImageMapHeaderToolbar extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
		selectedItem: PropTypes.object,
	};
	state = {
		rdeCanvas:false,
	};

	render() {
		const { canvasRef, selectedItem } = this.props;
		const { rdeCanvas } = this.state;
		const isCropping = canvasRef ? canvasRef.handler?.interactionMode === 'crop' : false;
		return (
			<Flex className="rde-editor-header-toolbar-container" flex="1">
		
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-list">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						onClick={() => this.setState({"rdeCanvas":!rdeCanvas})}
						icon="layer-group"
						tooltipTitle={"图层"}
					/>
					<div className="rde-canvas-list" style={{display:rdeCanvas ? 'block' : 'none'}}>
						<ImageMapList 
						canvasRef={canvasRef} 
						selectedItem={selectedItem} />
					</div>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.bringForward()}
						icon="angle-up"
						tooltipTitle={"置上图层"}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.sendBackwards()}
						icon="angle-down"
						tooltipTitle={"置下图层"}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.bringToFront()}
						icon="angle-double-up"
						tooltipTitle={"置顶图层"}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.sendToBack()}
						icon="angle-double-down"
						tooltipTitle={"置底图层"}
					/>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-alignment">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.alignmentHandler.left()}
						icon="align-left"
						tooltipTitle={"左对齐"}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.alignmentHandler.center()}
						icon="align-center"
						tooltipTitle={"居中"}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.alignmentHandler.right()}
						icon="align-right"
						tooltipTitle={"右对齐"}
					/>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-group">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.toGroup()}
						icon="object-group"
						tooltipTitle={"成组"}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.toActiveSelection()}
						icon="object-ungroup"
						tooltipTitle={"解组"}
					/>
				</Flex.Item>
				{/* <Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-crop">
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={canvasRef ? !canvasRef.handler?.cropHandler.validType() : true}
						onClick={() => canvasRef.handler?.cropHandler.start()}
						icon="crop"
						tooltipTitle={i18n.t('action.crop')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={canvasRef ? !canvasRef.handler?.cropHandler.cropRect : true}
						onClick={() => canvasRef.handler?.cropHandler.finish()}
						icon="check"
						tooltipTitle={i18n.t('action.crop-save')}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={canvasRef ? !canvasRef.handler?.cropHandler.cropRect : true}
						onClick={() => canvasRef.handler?.cropHandler.cancel()}
						icon="times"
						tooltipTitle={i18n.t('action.crop-cancel')}
					/>
				</Flex.Item> */}
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-operation">
					{/* <CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.saveImage()}
						icon="image"
						tooltipTitle={i18n.t('action.image-save')}
					/> */}
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.duplicate()}
						icon="clone"
						tooltipTitle={"复制"}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.remove()}
						icon="trash"
						tooltipTitle={"删除"}
					/>
					<CommonButton
						className="rde-action-btn"
						shape="circle"
						disabled={isCropping}
						onClick={() => canvasRef.handler?.addBackGroundMap()}
						icon="trash"
						tooltipTitle={"添加背景地图"}
					/>
				</Flex.Item>
				<Flex.Item className="rde-canvas-toolbar rde-canvas-toolbar-history">
					<CommonButton
						className="rde-action-btn"
						disabled={isCropping || (canvasRef && !canvasRef.handler?.transactionHandler.undos.length)}
						onClick={() => canvasRef.handler?.transactionHandler.undo()}
					>
						<Icon name="undo-alt" style={{ marginRight: 8 }} />
						撤销
					</CommonButton>
					<CommonButton
						className="rde-action-btn"
						disabled={isCropping || (canvasRef && !canvasRef.handler?.transactionHandler.redos.length)}
						onClick={() => canvasRef.handler?.transactionHandler.redo()}
					>
						重做
						<Icon name="redo-alt" style={{ marginLeft: 8 }} />
					</CommonButton>
				</Flex.Item>
			</Flex>
		);
	}
}

export default ImageMapHeaderToolbar;
