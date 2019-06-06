'use strict';

var _jsxFileName = 'pair/static/jsx/settings.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Settings = function (_React$Component) {
	_inherits(Settings, _React$Component);

	function Settings(props) {
		_classCallCheck(this, Settings);

		var _this = _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this, props));

		_this.state = { 'tournament': props.tournament, 'errors': '' };
		return _this;
	}

	_createClass(Settings, [{
		key: 'handleChange',
		value: function handleChange(evt, idx) {
			var tournament = Object.assign({}, this.state.tournament);
			tournament.rounds[idx][evt.target.name] = evt.target.value;
			this.setState({ tournament: tournament });
		}
	}, {
		key: 'titleChange',
		value: function titleChange(evt) {
			var tournament = Object.assign({}, this.state.tournament);
			tournament.name = evt.target.value;
			this.setState({ tournament: tournament });
		}

		/**
   * Event listener for the number of rounds control
   */

	}, {
		key: 'roundsChange',
		value: function roundsChange(evt) {
			var target = evt.target;
			if (target.value > 0 && target.value < 51) {
				var tournament = Object.assign({}, this.state.tournament);
				if (target.value > tournament.rounds.length) {
					for (var i = tournament.rounds.length; i < target.value; i++) {
						tournament.rounds.push({ based_on: i, round_no: i + 1,
							pairing_system: 'SWISS', spread_cap: 1000 });
					}
				} else {
					tournament.rounds = tournament.rounds.slice(target.value);
				}
				this.setState({ 'tournament': tournament });
			} else {
				this.setState({ 'errors': 'The number of rounds should be less than 50 and more than 0' });
			}
		}
	}, {
		key: 'ratedChanged',
		value: function ratedChanged(evt) {
			var tournament = Object.assign({}, this.state.tournament);
			tournament.rated = evt.target.value;
			this.setState({ 'tournament': tournament });
		}
	}, {
		key: 'dateChange',
		value: function dateChange(evt) {
			var tournament = Object.assign({}, this.state.tournament);
			tournament.start_date = evt.target.value;
			this.setState({ 'tournament': tournament });
		}
	}, {
		key: 'submitForm',
		value: function submitForm(evt) {
			evt.preventDefault();
			this.props.updateTournament(evt, this.state.tournament);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			if (this.state.tournament.rounds) {
				var button = null;
				if (this.state.tournament.rounds.length == 0 || this.state.tournament.name == '') {
					button = React.createElement('input', { type: 'submit', className: 'btn btn-primary', value: 'Submit', disabled: true, __source: {
							fileName: _jsxFileName,
							lineNumber: 63
						},
						__self: this
					});
				} else {
					button = React.createElement('input', { type: 'submit', className: 'btn btn-primary', value: 'Submit', __source: {
							fileName: _jsxFileName,
							lineNumber: 66
						},
						__self: this
					});
				}
				return React.createElement(
					'div',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 68
						},
						__self: this
					},
					this.state.errors && React.createElement(
						'div',
						{ className: 'alert alert-error', __source: {
								fileName: _jsxFileName,
								lineNumber: 69
							},
							__self: this
						},
						this.state.errors
					),
					React.createElement(
						'form',
						{ className: 'form', onSubmit: function onSubmit(evt) {
								return _this2.submitForm(evt);
							}, __source: {
								fileName: _jsxFileName,
								lineNumber: 70
							},
							__self: this
						},
						React.createElement(
							'div',
							{ className: 'row align-items-center', __source: {
									fileName: _jsxFileName,
									lineNumber: 71
								},
								__self: this
							},
							React.createElement(
								'div',
								{ className: 'col-8', __source: {
										fileName: _jsxFileName,
										lineNumber: 72
									},
									__self: this
								},
								React.createElement('input', { type: 'text', placeholder: 'Tournament name',
									value: this.state.tournament.name, onChange: function onChange(evt) {
										return _this2.titleChange(evt);
									}, className: 'form-control', __source: {
										fileName: _jsxFileName,
										lineNumber: 73
									},
									__self: this
								})
							),
							React.createElement(
								'div',
								{ className: 'col-1', __source: {
										fileName: _jsxFileName,
										lineNumber: 75
									},
									__self: this
								},
								'Date'
							),
							React.createElement(
								'div',
								{ className: 'col-2', __source: {
										fileName: _jsxFileName,
										lineNumber: 76
									},
									__self: this
								},
								React.createElement('input', { type: 'date', onChange: function onChange(evt) {
										return _this2.dateChange(evt);
									}, className: 'form-control', __source: {
										fileName: _jsxFileName,
										lineNumber: 76
									},
									__self: this
								})
							)
						),
						React.createElement(
							'div',
							{ className: 'row align-items-center', __source: {
									fileName: _jsxFileName,
									lineNumber: 79
								},
								__self: this
							},
							React.createElement(
								'div',
								{ className: 'col-2', __source: {
										fileName: _jsxFileName,
										lineNumber: 81
									},
									__self: this
								},
								'Number of rounds'
							),
							React.createElement(
								'div',
								{ className: 'col-2', __source: {
										fileName: _jsxFileName,
										lineNumber: 82
									},
									__self: this
								},
								React.createElement('input', { type: 'number', onChange: function onChange(evt) {
										return _this2.roundsChange(evt);
									}, className: 'form-control', __source: {
										fileName: _jsxFileName,
										lineNumber: 82
									},
									__self: this
								})
							),
							React.createElement(
								'div',
								{ className: 'btn-group btn-group-toggle', 'data-toggle': 'buttons', __source: {
										fileName: _jsxFileName,
										lineNumber: 83
									},
									__self: this
								},
								React.createElement(
									'label',
									{ className: 'btn btn-secondary active', __source: {
											fileName: _jsxFileName,
											lineNumber: 84
										},
										__self: this
									},
									React.createElement('input', { type: 'radio', onChange: function onChange(evt) {
											return _this2.ratedChanged(evt);
										}, name: 'rated', checked: true, __source: {
											fileName: _jsxFileName,
											lineNumber: 85
										},
										__self: this
									}),
									' Rated'
								),
								React.createElement(
									'label',
									{ className: 'btn btn-secondary', __source: {
											fileName: _jsxFileName,
											lineNumber: 87
										},
										__self: this
									},
									React.createElement('input', { type: 'radio', onChange: function onChange(evt) {
											return _this2.ratedChanged(evt);
										}, name: 'rated', __source: {
											fileName: _jsxFileName,
											lineNumber: 88
										},
										__self: this
									}),
									' Unrated'
								)
							)
						),
						this.state.tournament.rounds.map(function (item, idx) {
							return React.createElement(
								'div',
								{ className: 'row align-items-center', key: item.round_no, __source: {
										fileName: _jsxFileName,
										lineNumber: 93
									},
									__self: _this2
								},
								React.createElement(
									'div',
									{ className: 'col', __source: {
											fileName: _jsxFileName,
											lineNumber: 94
										},
										__self: _this2
									},
									React.createElement(
										'p',
										{
											__source: {
												fileName: _jsxFileName,
												lineNumber: 94
											},
											__self: _this2
										},
										'Round ',
										item.round_no
									)
								),
								React.createElement(
									'div',
									{ className: 'col', __source: {
											fileName: _jsxFileName,
											lineNumber: 95
										},
										__self: _this2
									},
									'Based on'
								),
								React.createElement(
									'div',
									{ className: 'col', __source: {
											fileName: _jsxFileName,
											lineNumber: 96
										},
										__self: _this2
									},
									React.createElement('input', { type: 'integer', value: item.based_on, onChange: function onChange(evt) {
											return _this2.handleChange(evt, idx);
										}, name: 'based_on', className: 'form-control', __source: {
											fileName: _jsxFileName,
											lineNumber: 97
										},
										__self: _this2
									})
								),
								React.createElement(
									'div',
									{ className: 'col', __source: {
											fileName: _jsxFileName,
											lineNumber: 98
										},
										__self: _this2
									},
									'Pairing System'
								),
								React.createElement(
									'div',
									{ className: 'col', __source: {
											fileName: _jsxFileName,
											lineNumber: 99
										},
										__self: _this2
									},
									React.createElement(
										'select',
										{ className: 'form-control', name: 'pairing_system', onChange: function onChange(evt) {
												return _this2.handleChange(evt, idx);
											}, __source: {
												fileName: _jsxFileName,
												lineNumber: 100
											},
											__self: _this2
										},
										React.createElement(
											'option',
											{ value: 'SWISS', __source: {
													fileName: _jsxFileName,
													lineNumber: 101
												},
												__self: _this2
											},
											'Swiss'
										),
										React.createElement(
											'option',
											{ value: 'ROUND_ROBIN', __source: {
													fileName: _jsxFileName,
													lineNumber: 102
												},
												__self: _this2
											},
											'Round Robin'
										),
										React.createElement(
											'option',
											{ value: 'KOTH', __source: {
													fileName: _jsxFileName,
													lineNumber: 103
												},
												__self: _this2
											},
											'King of the hill'
										),
										React.createElement(
											'option',
											{ value: 'Random', __source: {
													fileName: _jsxFileName,
													lineNumber: 104
												},
												__self: _this2
											},
											'Random'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'col', __source: {
											fileName: _jsxFileName,
											lineNumber: 107
										},
										__self: _this2
									},
									'Spread Cap'
								),
								React.createElement(
									'div',
									{ className: 'col', __source: {
											fileName: _jsxFileName,
											lineNumber: 108
										},
										__self: _this2
									},
									React.createElement('input', { type: 'integer', value: item.spread_cap, onChange: function onChange(evt) {
											return _this2.handleChange(evt, idx);
										}, className: 'form-control', __source: {
											fileName: _jsxFileName,
											lineNumber: 109
										},
										__self: _this2
									})
								)
							);
						}),
						button
					)
				);
			} else {
				return null;
			}
		}
	}]);

	return Settings;
}(React.Component);