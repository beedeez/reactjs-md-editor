'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ReactMDEditor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

var _icons = require('./icons');

var _icons2 = _interopRequireDefault(_icons);

require('codemirror/mode/xml/xml');

require('codemirror/mode/markdown/markdown');

require('codemirror/addon/edit/continuelist');

var _format = require('./format.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactMDEditor = exports.ReactMDEditor = function (_Component) {
	_inherits(ReactMDEditor, _Component);

	function ReactMDEditor(props) {
		_classCallCheck(this, ReactMDEditor);

		var _this = _possibleConstructorReturn(this, (ReactMDEditor.__proto__ || Object.getPrototypeOf(ReactMDEditor)).call(this, props));

		_this.state = {
			isFocused: false,
			cs: {},
			currentCodemirrorValue: props.value
		};
		return _this;
	}

	_createClass(ReactMDEditor, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.codeMirror = _codemirror2.default.fromTextArea((0, _reactDom.findDOMNode)(this.refs.codemirror), this.getOptions());
			this.codeMirror.on('change', this.codemirrorValueChanged.bind(this));
			this.codeMirror.on('focus', this.focusChanged.bind(this, true));
			this.codeMirror.on('blur', this.focusChanged.bind(this, false));
			this.codeMirror.on('cursorActivity', this.updateCursorState.bind(this));
		}
	}, {
		key: 'getOptions',
		value: function getOptions() {
			return Object.assign({
				mode: 'markdown',
				lineNumbers: false,
				lineWrapping: true,
				indentWithTabs: true,
				tabSize: '2'
			}, this.props.options);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.codeMirror) {
				this.codeMirror.toTextArea();
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.codeMirror) {
				this.codeMirror.toTextArea();
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(newProps) {
			if (this.codeMirror && this.state.currentCodemirrorValue !== newProps.value) {
				this.codeMirror.setValue(newProps.value);
			}
		}
	}, {
		key: 'getCodeMirror',
		value: function getCodeMirror() {
			return this.codeMirror;
		}
	}, {
		key: 'focus',
		value: function focus() {
			if (this.codeMirror) {
				this.codeMirror.focus();
			}
		}
	}, {
		key: 'focusChanged',
		value: function focusChanged(focused) {
			this.setState({ isFocused: focused });
		}
	}, {
		key: 'updateCursorState',
		value: function updateCursorState() {
			this.setState({ cs: (0, _format.getCursorState)(this.codeMirror) });
		}
	}, {
		key: 'codemirrorValueChanged',
		value: function codemirrorValueChanged(doc, change) {
			var newValue = doc.getValue();
			this.setState({ currentCodemirrorValue: newValue });
			this.props.onChange && this.props.onChange(newValue);
		}
	}, {
		key: 'toggleFormat',
		value: function toggleFormat(formatKey, e, content) {
			e.preventDefault();
			//this.codeMirror.setValue(content);
			(0, _format.applyFormat)(this.codeMirror, formatKey, content);
		}
	}, {
		key: 'renderIcon',
		value: function renderIcon(icon) {
			return _react2.default.createElement('span', {
				dangerouslySetInnerHTML: { __html: icon },
				className: 'MDEditor_toolbarButton_icon'
			});
		}
	}, {
		key: 'renderButton',
		value: function renderButton(formatKey, label, action) {
			if (!action) action = this.toggleFormat.bind(this, formatKey);

			var isTextIcon = !_icons2.default[formatKey];
			var className = (0, _classnames2.default)('MDEditor_toolbarButton', {
				'MDEditor_toolbarButton--pressed': this.state.cs[formatKey]
			}, 'MDEditor_toolbarButton--' + formatKey);

			var labelClass = isTextIcon ? 'MDEditor_toolbarButton_label-icon' : 'MDEditor_toolbarButton_label';

			return _react2.default.createElement(
				'button',
				{ className: className, onClick: action, title: formatKey },
				isTextIcon ? null : this.renderIcon(_icons2.default[formatKey]),
				_react2.default.createElement(
					'span',
					{ className: labelClass },
					label
				)
			);
		}
	}, {
		key: 'renderToolbar',
		value: function renderToolbar() {
			var _this2 = this;

			return _react2.default.createElement(
				'div',
				{ className: 'MDEditor_toolbar' },
				!this.props.disableButtonH1 && this.renderButton('h1', 'h1'),
				!this.props.disableButtonH2 && this.renderButton('h2', 'h2'),
				!this.props.disableButtonH3 && this.renderButton('h3', 'h3'),
				!this.props.disableButtonBold && this.renderButton('bold', 'b'),
				!this.props.disableButtonItalic && this.renderButton('italic', 'i'),
				!this.props.disableButtonOList && this.renderButton('oList', 'ol'),
				!this.props.disableButtonUList && this.renderButton('uList', 'ul'),
				!this.props.disableButtonQuote && this.renderButton('quote', 'q'),
				!this.props.disableButtonLink && this.renderButton('link', 'a'),
				!this.props.disableButtonImage && this.renderButton('image', 'img'),
				!this.props.disableAudioButton && this.renderButton('audio', 'Audio', function (e) {
					_this2.props.onBeforeAudioClick(function (fileUrl) {
						_this2.toggleFormat('audio', e, fileUrl);
					});
				})
			);
		}
	}, {
		key: 'render',
		value: function render() {
			var editorClassName = (0, _classnames2.default)('MDEditor_editor', {
				'MDEditor_editor--focused': this.state.isFocused
			});
			return _react2.default.createElement(
				'div',
				{ className: 'MDEditor' },
				this.renderToolbar(),
				_react2.default.createElement(
					'div',
					{ className: editorClassName },
					_react2.default.createElement('textarea', {
						ref: 'codemirror',
						name: this.props.path,
						defaultValue: this.props.value,
						autoComplete: 'off'
					})
				)
			);
		}
	}]);

	return ReactMDEditor;
}(_react.Component);

ReactMDEditor.defaultProps = {
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
ReactMDEditor.propTypes = {
	onChange: _react.PropTypes.func,
	options: _react.PropTypes.object,
	path: _react.PropTypes.string,
	value: _react.PropTypes.string,
	disableButtonH1: _react.PropTypes.bool,
	disableButtonH2: _react.PropTypes.bool,
	disableButtonH3: _react.PropTypes.bool,
	disableButtonBold: _react.PropTypes.bool,
	disableButtonItalic: _react.PropTypes.bool,
	disableButtonOList: _react.PropTypes.bool,
	disableButtonUList: _react.PropTypes.bool,
	disableButtonQuote: _react.PropTypes.bool,
	disableButtonLink: _react.PropTypes.bool,
	disableButtonImage: _react.PropTypes.bool,
	disableAudioButton: _react.PropTypes.bool
};
exports.default = ReactMDEditor;