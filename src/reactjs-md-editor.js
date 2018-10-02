import React, { Component } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import classNames from "classnames";
import CM from "codemirror";
import Icons from "./icons";

import "codemirror/mode/xml/xml";
import "codemirror/mode/markdown/markdown";
import "codemirror/addon/edit/continuelist";

import { getCursorState, applyFormat } from "./format.js";

export class ReactMDEditor extends Component {
  static defaultProps = {
    disableButtonH1: false,
    disableButtonH2: false,
    disableButtonH3: false,
    disableButtonBold: false,
    disableButtonItalic: false,
    disableButtonOList: false,
    disableButtonUList: false,
    disableButtonQuote: false,
    disableButtonLink: false,
    disableButtonImage: false,
    disableAudioButton: false
  };
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.object,
    path: PropTypes.string,
    value: PropTypes.string,
    disableButtonH1: PropTypes.bool,
    disableButtonH2: PropTypes.bool,
    disableButtonH3: PropTypes.bool,
    disableButtonBold: PropTypes.bool,
    disableButtonItalic: PropTypes.bool,
    disableButtonOList: PropTypes.bool,
    disableButtonUList: PropTypes.bool,
    disableButtonQuote: PropTypes.bool,
    disableButtonLink: PropTypes.bool,
    disableButtonImage: PropTypes.bool,
    disableAudioButton: PropTypes.bool
  };
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      cs: {},
      currentCodemirrorValue: props.value
    };
  }
  componentDidMount() {
    this.codeMirror = CM.fromTextArea(
      findDOMNode(this.refs.codemirror),
      this.getOptions()
    );
    this.codeMirror.on("change", this.codemirrorValueChanged.bind(this));
    this.codeMirror.on("focus", this.focusChanged.bind(this, true));
    this.codeMirror.on("blur", this.focusChanged.bind(this, false));
    this.codeMirror.on("cursorActivity", this.updateCursorState.bind(this));
  }
  getOptions() {
    return Object.assign(
      {
        mode: "markdown",
        lineNumbers: false,
        lineWrapping: true,
        indentWithTabs: true,
        tabSize: "2"
      },
      this.props.options
    );
  }
  componentWillUnmount() {
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
    }
  }
  componentWillUnmount() {
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
    }
  }
  componentWillReceiveProps(newProps) {
    if (
      this.codeMirror &&
      this.state.currentCodemirrorValue !== newProps.value
    ) {
      this.codeMirror.setValue(newProps.value);
    }
  }
  getCodeMirror() {
    return this.codeMirror;
  }
  focus() {
    if (this.codeMirror) {
      this.codeMirror.focus();
    }
  }
  focusChanged(focused) {
    this.setState({ isFocused: focused });
  }
  updateCursorState() {
    this.setState({ cs: getCursorState(this.codeMirror) });
  }
  codemirrorValueChanged(doc, change) {
    var newValue = doc.getValue();
    this.setState({ currentCodemirrorValue: newValue });
    this.props.onChange && this.props.onChange(newValue);
  }
  toggleFormat(formatKey, e, content) {
    e.preventDefault();
    //this.codeMirror.setValue(content);
    applyFormat(this.codeMirror, formatKey, content);
  }
  renderIcon(icon) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: icon }}
        className="MDEditor_toolbarButton_icon"
      />
    );
  }
  renderButton(formatKey, label, action) {
    if (!action) action = this.toggleFormat.bind(this, formatKey);

    var isTextIcon = !Icons[formatKey];
    var className = classNames(
      "MDEditor_toolbarButton",
      {
        "MDEditor_toolbarButton--pressed": this.state.cs[formatKey]
      },
      "MDEditor_toolbarButton--" + formatKey
    );

    var labelClass = isTextIcon
      ? "MDEditor_toolbarButton_label-icon"
      : "MDEditor_toolbarButton_label";

    return (
      <button className={className} onClick={action} title={formatKey}>
        {isTextIcon ? null : this.renderIcon(Icons[formatKey])}
        <span className={labelClass}>{label}</span>
      </button>
    );
  }
  renderToolbar() {
    return (
      <div className="MDEditor_toolbar">
        {!this.props.disableButtonH1 && this.renderButton("h1", "h1")}
        {!this.props.disableButtonH2 && this.renderButton("h2", "h2")}
        {!this.props.disableButtonH3 && this.renderButton("h3", "h3")}
        {!this.props.disableButtonBold && this.renderButton("bold", "b")}
        {!this.props.disableButtonItalic && this.renderButton("italic", "i")}
        {!this.props.disableButtonOList && this.renderButton("oList", "ol")}
        {!this.props.disableButtonUList && this.renderButton("uList", "ul")}
        {!this.props.disableButtonQuote && this.renderButton("quote", "q")}
        {!this.props.disableButtonLink && this.renderButton("link", "a")}
        {/* {!this.props.disableButtonImage && this.renderButton('image', 'img')} */}
        {!this.props.disableAudioButton &&
          this.renderButton("audio", "Audio", e => {
            this.props.onBeforeAudioClick(fileUrl => {
              this.toggleFormat("audio", e, fileUrl);
            });
          })}
      </div>
    );
  }
  render() {
    var editorClassName = classNames("MDEditor_editor", {
      "MDEditor_editor--focused": this.state.isFocused
    });
    return (
      <div className="MDEditor">
        {this.renderToolbar()}
        <div className={editorClassName}>
          <textarea
            ref="codemirror"
            name={this.props.path}
            defaultValue={this.props.value}
            autoComplete="off"
          />
        </div>
      </div>
    );
  }
}

export default ReactMDEditor;
