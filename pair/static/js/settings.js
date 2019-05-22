'use strict';

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
					button = React.createElement('input', { type: 'submit', className: 'btn btn-primary', value: 'Submit', disabled: true });
				} else {
					button = React.createElement('input', { type: 'submit', className: 'btn btn-primary', value: 'Submit' });
				}
				return React.createElement(
					'div',
					null,
					this.state.errors && React.createElement(
						'div',
						{ className: 'alert alert-error' },
						this.state.errors
					),
					React.createElement(
						'form',
						{ className: 'form', onSubmit: function onSubmit(evt) {
								return _this2.submitForm(evt);
							} },
						React.createElement(
							'div',
							{ className: 'row align-items-center' },
							React.createElement(
								'div',
								{ className: 'col-8' },
								React.createElement('input', { type: 'text', placeholder: 'Tournament name',
									value: this.state.tournament.name, onChange: function onChange(evt) {
										return _this2.titleChange(evt);
									}, className: 'form-control' })
							),
							React.createElement(
								'div',
								{ className: 'col-1' },
								'Date'
							),
							React.createElement(
								'div',
								{ className: 'col-2' },
								React.createElement('input', { type: 'date', onChange: function onChange(evt) {
										return _this2.dateChange(evt);
									}, className: 'form-control' })
							)
						),
						React.createElement(
							'div',
							{ className: 'row align-items-center' },
							React.createElement(
								'div',
								{ className: 'col-2' },
								'Number of rounds'
							),
							React.createElement(
								'div',
								{ className: 'col-2' },
								React.createElement('input', { type: 'number', onChange: function onChange(evt) {
										return _this2.roundsChange(evt);
									}, className: 'form-control' })
							),
							React.createElement(
								'div',
								{ className: 'btn-group btn-group-toggle', 'data-toggle': 'buttons' },
								React.createElement(
									'label',
									{ className: 'btn btn-secondary active' },
									React.createElement('input', { type: 'radio', onChange: function onChange(evt) {
											return _this2.ratedChanged(evt);
										}, name: 'rated', checked: true }),
									' Rated'
								),
								React.createElement(
									'label',
									{ className: 'btn btn-secondary' },
									React.createElement('input', { type: 'radio', onChange: function onChange(evt) {
											return _this2.ratedChanged(evt);
										}, name: 'rated' }),
									' Unrated'
								)
							)
						),
						this.state.tournament.rounds.map(function (item, idx) {
							return React.createElement(
								'div',
								{ className: 'row align-items-center', key: item.round_no },
								React.createElement(
									'div',
									{ className: 'col' },
									React.createElement(
										'p',
										null,
										'Round ',
										item.round_no
									)
								),
								React.createElement(
									'div',
									{ className: 'col' },
									'Based on'
								),
								React.createElement(
									'div',
									{ className: 'col' },
									React.createElement('input', { type: 'integer', value: item.based_on, onChange: function onChange(evt) {
											return _this2.handleChange(evt, idx);
										}, name: 'based_on', className: 'form-control' })
								),
								React.createElement(
									'div',
									{ className: 'col' },
									'Pairing System'
								),
								React.createElement(
									'div',
									{ className: 'col' },
									React.createElement(
										'select',
										{ className: 'form-control', name: 'pairing_system', onChange: function onChange(evt) {
												return _this2.handleChange(evt, idx);
											} },
										React.createElement(
											'option',
											{ value: 'SWISS' },
											'Swiss'
										),
										React.createElement(
											'option',
											{ value: 'ROUND_ROBIN' },
											'Round Robin'
										),
										React.createElement(
											'option',
											{ value: 'KOTH' },
											'King of the hill'
										),
										React.createElement(
											'option',
											{ value: 'Random' },
											'Random'
										)
									)
								),
								React.createElement(
									'div',
									{ className: 'col' },
									'Spread Cap'
								),
								React.createElement(
									'div',
									{ className: 'col' },
									React.createElement('input', { type: 'integer', value: item.spread_cap, onChange: function onChange(evt) {
											return _this2.handleChange(evt, idx);
										}, className: 'form-control' })
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