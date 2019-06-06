"use strict";

var _jsxFileName = "pair/static/jsx/start.jsx";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var elem = document.getElementById('root');

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

var Start = function (_React$Component) {
	_inherits(Start, _React$Component);

	function Start(props) {
		_classCallCheck(this, Start);

		var _this = _possibleConstructorReturn(this, (Start.__proto__ || Object.getPrototypeOf(Start)).call(this, props));

		_this.state = { tournament: { name: '', rounds: [], start_date: '' } };

		_this.updateTournament = _this.updateTournament.bind(_this);
		return _this;
	}

	_createClass(Start, [{
		key: "updateTournament",
		value: function updateTournament(evt, tournament) {
			axios.post('/api/', tournament).then(function (response) {
				window.location.href = "/start/" + response.data.slug + "/";
			});
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(Settings, { tournament: this.state.tournament, updateTournament: this.updateTournament, __source: {
					fileName: _jsxFileName,
					lineNumber: 20
				},
				__self: this
			});
		}
	}]);

	return Start;
}(React.Component);

ReactDOM.render(React.createElement(Start, {
	__source: {
		fileName: _jsxFileName,
		lineNumber: 25
	},
	__self: undefined
}), elem);