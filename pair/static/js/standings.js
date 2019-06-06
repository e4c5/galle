'use strict';

var _jsxFileName = 'pair/static/jsx/standings.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Router = window.ReactRouterDOM.BrowserRouter;
var Route = window.ReactRouterDOM.Route;
var Link = window.ReactRouterDOM.Link;
var Prompt = window.ReactRouterDOM.Prompt;
var Switch = window.ReactRouterDOM.Switch;
var Redirect = window.ReactRouterDOM.Redirect;

var PlayerStanding = function (_React$Component) {
	_inherits(PlayerStanding, _React$Component);

	function PlayerStanding(props) {
		_classCallCheck(this, PlayerStanding);

		var _this = _possibleConstructorReturn(this, (PlayerStanding.__proto__ || Object.getPrototypeOf(PlayerStanding)).call(this, props));

		_this.state = { loaded: false };
		return _this;
	}
	/**
  * Fetch the data when the component has mounted
  */


	_createClass(PlayerStanding, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			axios.get('/api/results/' + this.props.tournament_id + '/?player=' + this.props.match.params.id).then(function (response) {
				_this2.setState({ 'results': response.data, 'loaded': true });
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			if (this.state.loaded) {
				return React.createElement(
					'div',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 26
						},
						__self: this
					},
					React.createElement(
						'h1',
						{
							__source: {
								fileName: _jsxFileName,
								lineNumber: 26
							},
							__self: this
						},
						this.state.current_player
					),
					React.createElement(
						'table',
						{ className: 'table table-bordered', __source: {
								fileName: _jsxFileName,
								lineNumber: 27
							},
							__self: this
						},
						React.createElement(
							'thead',
							{ className: 'thead-light', __source: {
									fileName: _jsxFileName,
									lineNumber: 28
								},
								__self: this
							},
							React.createElement(
								'tr',
								{
									__source: {
										fileName: _jsxFileName,
										lineNumber: 28
									},
									__self: this
								},
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 28
										},
										__self: this
									},
									'Round'
								),
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 28
										},
										__self: this
									},
									'Opponent'
								),
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 28
										},
										__self: this
									},
									'Score'
								),
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 28
										},
										__self: this
									},
									'Opponent Score'
								),
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 28
										},
										__self: this
									},
									'Spread'
								)
							)
						),
						React.createElement(
							'tbody',
							{
								__source: {
									fileName: _jsxFileName,
									lineNumber: 29
								},
								__self: this
							},
							this.state.results.map(function (item) {
								return React.createElement(
									'tr',
									{ key: item.id, className: item.score_for > item.score_against ? "table-success" : "table-warning", __source: {
											fileName: _jsxFileName,
											lineNumber: 31
										},
										__self: _this3
									},
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 32
											},
											__self: _this3
										},
										item.round
									),
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 32
											},
											__self: _this3
										},
										item.opponent
									),
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 33
											},
											__self: _this3
										},
										item.score_for
									),
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 33
											},
											__self: _this3
										},
										item.score_against
									),
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 34
											},
											__self: _this3
										},
										item.spread
									)
								);
							})
						)
					)
				);
			}
			return React.createElement(
				'div',
				{
					__source: {
						fileName: _jsxFileName,
						lineNumber: 40
					},
					__self: this
				},
				'Loading....'
			);
		}
	}]);

	return PlayerStanding;
}(React.Component);
/**
 * Displays the standings
 */


var Standings = function (_React$Component2) {
	_inherits(Standings, _React$Component2);

	function Standings(props) {
		_classCallCheck(this, Standings);

		var _this4 = _possibleConstructorReturn(this, (Standings.__proto__ || Object.getPrototypeOf(Standings)).call(this, props));

		_this4.state = { current_player: '', results: [] };
		return _this4;
	}

	_createClass(Standings, [{
		key: 'render',
		value: function render() {
			var _this5 = this;

			if (this.props.round) {
				return React.createElement(
					'div',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 57
						},
						__self: this
					},
					React.createElement(
						'table',
						{ className: 'table', __source: {
								fileName: _jsxFileName,
								lineNumber: 60
							},
							__self: this
						},
						React.createElement(
							'thead',
							{
								__source: {
									fileName: _jsxFileName,
									lineNumber: 61
								},
								__self: this
							},
							React.createElement(
								'tr',
								{
									__source: {
										fileName: _jsxFileName,
										lineNumber: 61
									},
									__self: this
								},
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 61
										},
										__self: this
									},
									'Position'
								),
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 61
										},
										__self: this
									},
									'Player'
								),
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 61
										},
										__self: this
									},
									'Wins'
								),
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 61
										},
										__self: this
									},
									'Losses'
								),
								React.createElement(
									'th',
									{
										__source: {
											fileName: _jsxFileName,
											lineNumber: 61
										},
										__self: this
									},
									'Spread'
								)
							)
						),
						React.createElement(
							'tbody',
							{
								__source: {
									fileName: _jsxFileName,
									lineNumber: 62
								},
								__self: this
							},
							this.props.standings.map(function (item, idx) {
								return React.createElement(
									'tr',
									{ key: item.player, __source: {
											fileName: _jsxFileName,
											lineNumber: 64
										},
										__self: _this5
									},
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 65
											},
											__self: _this5
										},
										idx + 1
									),
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 66
											},
											__self: _this5
										},
										React.createElement(
											Link,
											{ to: window.location.pathname + 'player/' + item.id.toString() + '/', __source: {
													fileName: _jsxFileName,
													lineNumber: 66
												},
												__self: _this5
											},
											item.player
										),
										' '
									),
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 67
											},
											__self: _this5
										},
										item.wins
									),
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 68
											},
											__self: _this5
										},
										item.games - item.wins
									),
									React.createElement(
										'td',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 69
											},
											__self: _this5
										},
										item.spread
									)
								);
							})
						)
					)
				);
			}
			return null;
		}
	}]);

	return Standings;
}(React.Component);