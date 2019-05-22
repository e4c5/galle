'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

			if (this.state.loaded) {
				return React.createElement(
					'div',
					null,
					React.createElement(
						'h1',
						null,
						this.state.current_player
					),
					React.createElement(
						'table',
						{ className: 'table table-bordered' },
						React.createElement(
							'thead',
							{ className: 'thead-light' },
							React.createElement(
								'tr',
								null,
								React.createElement(
									'th',
									null,
									'Round'
								),
								React.createElement(
									'th',
									null,
									'Opponent'
								),
								React.createElement(
									'th',
									null,
									'Score'
								),
								React.createElement(
									'th',
									null,
									'Opponent Score'
								),
								React.createElement(
									'th',
									null,
									'Spread'
								)
							)
						),
						React.createElement(
							'tbody',
							null,
							this.state.results.map(function (item) {
								return React.createElement(
									'tr',
									{ key: item.id, className: item.score_for > item.score_against ? "table-success" : "table-warning" },
									React.createElement(
										'td',
										null,
										item.round
									),
									React.createElement(
										'td',
										null,
										item.opponent
									),
									React.createElement(
										'td',
										null,
										item.score_for
									),
									React.createElement(
										'td',
										null,
										item.score_against
									),
									React.createElement(
										'td',
										null,
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
				null,
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

		var _this3 = _possibleConstructorReturn(this, (Standings.__proto__ || Object.getPrototypeOf(Standings)).call(this, props));

		_this3.state = { current_player: '', results: [] };
		return _this3;
	}

	_createClass(Standings, [{
		key: 'render',
		value: function render() {
			var _this4 = this;

			if (this.props.round) {
				return React.createElement(
					Router,
					null,
					React.createElement(
						'div',
						null,
						React.createElement(
							'table',
							{ className: 'table' },
							React.createElement(
								'thead',
								null,
								React.createElement(
									'tr',
									null,
									React.createElement(
										'th',
										null,
										'Position'
									),
									React.createElement(
										'th',
										null,
										'Player'
									),
									React.createElement(
										'th',
										null,
										'Wins'
									),
									React.createElement(
										'th',
										null,
										'Losses'
									),
									React.createElement(
										'th',
										null,
										'Spread'
									)
								)
							),
							React.createElement(
								'tbody',
								null,
								this.props.standings.map(function (item, idx) {
									return React.createElement(
										'tr',
										{ key: item.player },
										React.createElement(
											'td',
											null,
											idx + 1
										),
										React.createElement(
											'td',
											null,
											React.createElement(
												Link,
												{ to: window.location.pathname + 'player/' + item.id.toString() + '/' },
												item.player
											),
											' '
										),
										React.createElement(
											'td',
											null,
											item.wins
										),
										React.createElement(
											'td',
											null,
											item.games - item.wins
										),
										React.createElement(
											'td',
											null,
											item.spread
										)
									);
								})
							)
						)
					),
					React.createElement(Route, { path: window.location.pathname + "player/:id/",
						render: function render(props) {
							return React.createElement(PlayerStanding, _extends({}, props, { tournament_id: _this4.props.tournament_id }));
						}
					})
				);
			}
			return null;
		}
	}]);

	return Standings;
}(React.Component);