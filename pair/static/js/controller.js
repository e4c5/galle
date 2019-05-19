'use strict';

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

var Draw = function (_React$Component) {
	_inherits(Draw, _React$Component);

	function Draw(props) {
		_classCallCheck(this, Draw);

		console.log(props);
		return _possibleConstructorReturn(this, (Draw.__proto__ || Object.getPrototypeOf(Draw)).call(this, props));
	}

	_createClass(Draw, [{
		key: 'render',
		value: function render() {
			console.log(this.props);
			return React.createElement(
				'div',
				null,
				React.createElement(
					'table',
					{ className: 'table' },
					React.createElement(
						'tbody',
						null,
						this.props.pending.map(function (item) {
							return React.createElement(
								'tr',
								{ key: item.id },
								React.createElement(
									'td',
									null,
									item.participant
								),
								React.createElement(
									'td',
									null,
									item.first
								),
								React.createElement(
									'td',
									null,
									item.opponent
								)
							);
						}),
						this.props.completed.map(function (item) {
							return React.createElement(
								'tr',
								{ className: 'table-secondary', key: item.id },
								React.createElement(
									'td',
									null,
									item.participant
								),
								React.createElement(
									'td',
									null,
									item.first
								),
								React.createElement(
									'td',
									null,
									item.opponent
								)
							);
						})
					)
				)
			);
		}
	}]);

	return Draw;
}(React.Component);
/**
 * The controller
 */


var Controller = function (_React$Component2) {
	_inherits(Controller, _React$Component2);

	/**
  * The constructor
  */
	function Controller(props) {
		_classCallCheck(this, Controller);

		var _this2 = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, props));

		_this2.state = { 'standings': [], 'pending': [], 'completed': [],
			tournament: {}, errors: '', round: 0 };

		_this2.submitResult = _this2.submitResult.bind(_this2);
		return _this2;
	}

	/**
  * Fetch the data when the component has mounted
  */


	_createClass(Controller, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this3 = this;

			var url = '/api/standings/' + this.props.tournament_id + '/';
			axios.get(url).then(function (response) {
				var standings = [];
				response.data.map(function (item) {
					standings.push(item);
				});

				standings.sort(function (a, b) {
					if (a.wins == b.wins) {
						if (a.games == b.games) {
							return b.spread - a.spread;
						}
						return b.games - a.games;
					}
					return b.wins - a.wins;
				});
				_this3.setState({ 'standings': standings });
			});

			url = '/api/' + this.props.tournament_id + '/';
			axios.get(url).then(function (response) {
				_this3.setState({ 'tournament': response.data, 'round': response.data.current_round });

				/* on success we load the results */
				var url = '/api/results/' + _this3.props.tournament_id + '/?round=' + response.data.current_round;
				axios.get(url).then(function (response) {
					var completed = [];
					var pending = [];
					response.data.map(function (item) {
						if (item.score_for) {
							if (!completed.length) {
								completed.push(item);
							} else if (!completed.filter(function (old) {
								return old.participant == item.opponent;
							}).length) {
								completed.push(item);
							}
						} else {
							if (!pending.length) {
								pending.push(item);
							} else if (!pending.filter(function (old) {
								return old.participant == item.opponent;
							}).length) {
								pending.push(item);
							}
						}
					});

					_this3.setState({ 'completed': completed, 'pending': pending });
				});
			});
		}
	}, {
		key: 'findMatches',
		value: function findMatches(c) {
			return this.state.pending.filter(function (item) {
				return c.length > 1 && item.participant.toLowerCase().search(c) != -1;
			}).slice(0, 4);
		}
	}, {
		key: 'updateTournament',
		value: function updateTournament(evt, tournament) {
			axios('/api/tournament/');
		}
		/**
   * Handle submission of results
   * 
   * Has been lifted up from the pairing class.
   */

	}, {
		key: 'submitResult',
		value: function submitResult(evt, current) {
			var _this4 = this;

			this.setState({ 'errors': '' });

			var c = current.replace(/\d+/gi, '').trim().toLowerCase();
			var matching = this.findMatches(c);
			if (matching.length == 1) {
				try {
					var parts = current.split(" ");
					var record = Object.assign({}, matching[0]);
					var url = '/api/results/' + this.props.tournament_id + '/' + record.id + '/';
					axios.put(url, { 'score_for': parts[parts.length - 2], 'score_against': parts[parts.length - 1] }).then(function (response) {

						record.score_for = response.data.score_for;
						record.score_against = response.data.score_against;
						var pending = _this4.state.pending.filter(function (item) {
							return item.id != record.id;
						});
						var completed = _this4.state.completed.slice();
						completed.push(record);

						_this4.setState({ completed: completed, pending: pending, matching: [] });
					}).catch(function (response) {
						_this4.setState({ 'errors': 'Could not enter result for ' + current });
					});
				} catch (error) {
					this.setState({ 'errors': 'Could not enter result for ' + current });
				}
			} else if (matching.length == 0) {
				this.setState({ 'errors': 'No matches' });
			} else {
				this.setState({ 'errors': 'Multiple matches' });
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this5 = this;

			return React.createElement(
				Router,
				null,
				React.createElement(
					'div',
					null,
					React.createElement(
						'nav',
						{ className: 'navbar' },
						React.createElement(
							Link,
							{ className: 'nav-link active', to: window.location.pathname },
							'Standings'
						),
						React.createElement(
							Link,
							{ className: 'nav-link', to: window.location.pathname + 'pairing' },
							'Data Entry'
						),
						React.createElement(
							Link,
							{ className: 'nav-link', to: window.location.pathname + 'draw' },
							'Draw'
						),
						React.createElement(
							Link,
							{ className: 'nav-link', to: window.location.pathname + 'settings' },
							'Settings'
						)
					),
					React.createElement(Route, { path: window.location.pathname + '/',
						render: function render(props) {
							return React.createElement(Standings, { standings: _this5.state.standings, round: _this5.state.round, tournament_id: _this5.props.tournament_id });
						}
					}),
					React.createElement(Route, { path: window.location.pathname + 'pairing',
						render: function render(props) {
							return React.createElement(Pairing, { round: _this5.props.round, tournament_id: _this5.props.tournament_id,
								completed: _this5.state.completed, pending: _this5.state.pending, submitResult: _this5.submitResult });
						}
					}),
					React.createElement(Route, { path: window.location.pathname + "draw",
						render: function render(props) {
							return React.createElement(Draw, { completed: _this5.state.completed, pending: _this5.state.pending });
						}
					}),
					React.createElement(Route, { path: window.location.pathname + "settings",
						render: function render(props) {
							return React.createElement(Settings, { tournament: _this5.state.tournament });
						}
					})
				)
			);
		}
	}]);

	return Controller;
}(React.Component);

var elem = document.getElementById('root-settings');
ReactDOM.render(React.createElement(Controller, { tournament_id: elem.dataset.tournament }), elem);