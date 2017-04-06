import MDEditor from '../../lib/reactjs-md-editor';
import MDViewer from 'reactjs-md-viewer';
import marked from 'marked';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class MyHeading extends Component {
	render() {
		return (<h1 style={{color: 'red'}}>{this.props.text || "test"}</h1>);
	}
}

class Example extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: 'Hello world'
		};
	}
	updateCode (newCode) {
		this.setState({
			code: newCode
		});
	}
	render () {
		var preview = marked(this.state.code);
		return (
			<div className="example">
				<div className="hint">The editor is below, with default options. This example also uses marked to generate the preview on the right as you type.</div>
				<div className="editor">
					<MDEditor value={this.state.code} onChange={this.updateCode.bind(this)}/>
				</div>
				<div className="preview">
					<MDViewer text={this.state.code} heading={MyHeading} />
				</div>
			</div>
		);
	}
}

export default Example;
