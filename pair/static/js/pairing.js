'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Displays the list of results for the given round.
 */
var ResultTable = function (_React$Component) {
	_inherits(ResultTable, _React$Component);

	function ResultTable(props) {
		_classCallCheck(this, ResultTable);

		return _possibleConstructorReturn(this, (ResultTable.__proto__ || Object.getPrototypeOf(ResultTable)).call(this, props));
	}

	_createClass(ResultTable, [{
		key: 'render',
		value: function render() {
			return React.createElement(
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
							'Player'
						),
						React.createElement(
							'th',
							null,
							'Score for'
						),
						React.createElement(
							'th',
							null,
							'Opponent'
						),
						React.createElement(
							'th',
							null,
							'Score Against'
						)
					)
				),
				React.createElement(
					'tbody',
					null,
					this.props.items.map(function (item) {
						return React.createElement(TableRow, { pairing: item, key: item.participant });
					})
				)
			);
		}
	}]);

	return ResultTable;
}(React.Component);

/**
 * A single row, rendered as a row in an HTML table.
 */


var TableRow = function (_React$Component2) {
	_inherits(TableRow, _React$Component2);

	function TableRow(props) {
		_classCallCheck(this, TableRow);

		var _this2 = _possibleConstructorReturn(this, (TableRow.__proto__ || Object.getPrototypeOf(TableRow)).call(this, props));

		_this2.state = { 'pairing': props.pairing };
		return _this2;
	}

	_createClass(TableRow, [{
		key: 'render',
		value: function render() {
			var pairing = this.state.pairing;
			return React.createElement(
				'tr',
				null,
				React.createElement(
					'td',
					null,
					pairing.participant
				),
				React.createElement(
					'td',
					null,
					pairing.score_for
				),
				React.createElement(
					'td',
					null,
					pairing.opponent
				),
				React.createElement(
					'td',
					null,
					pairing.score_against
				)
			);
		}
	}]);

	return TableRow;
}(React.Component);

/**
 * The top level component.
 */


var Pairing = function (_React$Component3) {
	_inherits(Pairing, _React$Component3);

	function Pairing(props) {
		_classCallCheck(this, Pairing);

		var _this3 = _possibleConstructorReturn(this, (Pairing.__proto__ || Object.getPrototypeOf(Pairing)).call(this, props));

		_this3.state = { 'current': '', 'matching': [] };
		_this3.handleSubmit = _this3.handleSubmit.bind(_this3);
		_this3.handleChange = _this3.handleChange.bind(_this3);
		return _this3;
	}

	_createClass(Pairing, [{
		key: 'findMatches',
		value: function findMatches(c) {
			return this.props.pending.filter(function (item) {
				return c.length > 1 && item.participant.toLowerCase().search(c) != -1;
			}).slice(0, 4);
		}

		/**
   * Handle form submit.
   * Will be lifted to the parent.
   */

	}, {
		key: 'handleSubmit',
		value: function handleSubmit(evt) {
			evt.preventDefault();
			this.props.submitResult(evt, this.state.current);
			this.setState({ 'current': '', 'matching': [] });
		}

		/**
   * Handling changes to the result input
   * will be sent upto the parent
   * 
   * @TODO : list state up
   */

	}, {
		key: 'handleChange',
		value: function handleChange(evt) {
			var value = evt.target.value;
			this.setState({ 'current': value });
			var c = value.replace(/\d+/gi, '').trim().toLowerCase();

			var matching = this.findMatches(c);
			this.setState({ 'matching': matching });
		}
	}, {
		key: 'render',
		value: function render() {
			var _this4 = this;

			var matching = this.state.matching;

			return React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					null,
					React.createElement(
						'form',
						{ onSubmit: function onSubmit(evt) {
								return _this4.handleSubmit(evt);
							} },
						React.createElement(
							'div',
							{ className: 'formGroup' },
							React.createElement('input', { className: 'form-control', type: 'text', value: this.state.current,
								placeholder: 'name score-for score-against',
								onChange: function onChange(evt) {
									return _this4.handleChange(evt);
								} })
						)
					),
					React.createElement(
						'ul',
						{ className: 'list-group hints' },
						matching.map(function (item) {
							return React.createElement(
								'li',
								{ className: matching.length == 1 ? "active list-group-item" : "list-group-item", key: item.participant },
								item.participant,
								' vs ',
								item.opponent,
								' '
							);
						})
					)
				),
				React.createElement(ResultTable, { items: this.props.completed }),
				React.createElement(
					'div',
					null,
					React.createElement(
						'h3',
						null,
						'Awaiting results...'
					)
				),
				React.createElement(ResultTable, { items: this.props.pending })
			);
		}
	}]);

	return Pairing;
}(React.Component);