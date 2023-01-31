import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Title from './components/layout/Title';
import FlowContainer from './containers/FlowContainer';
import { FiberEditor, FlowEditor, HexGridEditor, ImageMapEditor, WorkflowEditor } from './editors';
import axios from 'axios';
type EditorType = 'imagemap' | 'workflow' | 'flow' | 'hexgrid' | 'fiber';

interface IState {
	activeEditor?: EditorType;
}

class App extends Component<any, IState> {
	state: IState = {
		activeEditor: 'imagemap',
	};

	handleChangeEditor = ({ key }) => {
		this.setState({
			activeEditor: key,
		});
	};

	renderEditor = (activeEditor: EditorType) => {
		switch (activeEditor) {
			case 'imagemap':
				return <ImageMapEditor />;
			case 'workflow':
				return <WorkflowEditor />;
			case 'flow':
				return <FlowEditor />;
			case 'hexgrid':
				return <HexGridEditor />;
			case 'fiber':
				return <FiberEditor />;
		}
	};

	render() {
		const { activeEditor } = this.state;
		return (
			<div className="rde-main">
				{/* <div className="rde-title">
					<Title onChangeEditor={this.handleChangeEditor} currentEditor={activeEditor} />
				</div> */}
				<FlowContainer>
					<div className="rde-content">{this.renderEditor(activeEditor)}</div>
				</FlowContainer>
			</div>
		);
	}
}

export default App;
