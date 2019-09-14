"use strict";

var _jsxFileName = "jsx/context.js";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TournamentContext = React.createContext({});

var TournamentProvider = function (_React$Component) {
  _inherits(TournamentProvider, _React$Component);

  function TournamentProvider() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TournamentProvider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TournamentProvider.__proto__ || Object.getPrototypeOf(TournamentProvider)).call.apply(_ref, [this].concat(args))), _this), _this.setTournaments = function (tournaments) {
      _this.setState({ tournaments: tournaments });
    }, _this.state = {
      tournaments: [],
      setTournaments: _this.setTournaments
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * saves the list of tournaments
   */


  _createClass(TournamentProvider, [{
    key: "render",
    value: function render() {
      return React.createElement(
        TournamentContext.Provider,
        { value: this.state, __source: {
            fileName: _jsxFileName,
            lineNumber: 19
          },
          __self: this
        },
        this.props.children
      );
    }
  }]);

  return TournamentProvider;
}(React.Component);