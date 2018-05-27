'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = {
  swatches: {
    backgroundColor: '#fff',
    textAlign: 'center',
    padding: '0',
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-block',
    width: '175px',
    verticalAlign: 'top',
    wordWrap: 'break-word'
  },
  swatch: {
    height: '80px',
    borderRadius: '4px 4px 0 0',
    transition: 'opacity 0.25s ease-in-out',
    borderBottom: '1px solid rgba(0,0,0,0.1)'
  },
  listStyle: { listStyle: 'none' },
  pushBottom: { marginBottom: '10px' },
  pushLeft: { marginLeft: '10px' },
  soft: { paddingLeft: '10px', paddingRight: '10px' },
  hard: { padding: '0' },
  flush: { margin: '0' },
  font: {
    fontFamily: "-apple-system, '.SFNSText-Regular', 'San Francisco', Roboto, 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif",
    fontSize: '14px',
    wordBreak: 'break-word'
  }
};

var Swatch = function Swatch(_ref) {
  var name = _ref.name,
      value = _ref.value,
      setBackground = _ref.setBackground;
  return _react2.default.createElement(
    'button',
    {
      style: (0, _assign2.default)({}, style.swatches, style.listStyle, style.hard),
      onClick: function onClick() {
        return setBackground(value);
      }
      // Prevent focusing on mousedown
      , onMouseDown: function onMouseDown(event) {
        return event.preventDefault();
      }
    },
    _react2.default.createElement('div', {
      style: (0, _assign2.default)({}, style.swatch, {
        background: value,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      })
    }),
    _react2.default.createElement(
      'div',
      { style: (0, _assign2.default)({}, style.listStyle, style.soft) },
      _react2.default.createElement(
        'h4',
        { style: (0, _assign2.default)({ float: 'left', fontWeight: 'bold' }, style.font) },
        name,
        ':'
      ),
      _react2.default.createElement(
        'h4',
        { style: (0, _assign2.default)({ float: 'right', fontWeight: 'normal' }, style.font) },
        _react2.default.createElement(
          'em',
          null,
          value
        )
      )
    )
  );
};
Swatch.propTypes = {
  name: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.string.isRequired,
  setBackground: _propTypes2.default.func.isRequired
};

exports.default = Swatch;