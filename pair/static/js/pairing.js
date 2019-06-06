'use strict';

var _jsxFileName = 'pair/static/jsx/pairing.jsx';

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
			var _this2 = this;

			return React.createElement(
				'table',
				{ className: 'table', __source: {
						fileName: _jsxFileName,
						lineNumber: 10
					},
					__self: this
				},
				React.createElement(
					'thead',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 11
						},
						__self: this
					},
					React.createElement(
						'tr',
						{
							__source: {
								fileName: _jsxFileName,
								lineNumber: 11
							},
							__self: this
						},
						React.createElement(
							'th',
							{
								__source: {
									fileName: _jsxFileName,
									lineNumber: 11
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
									lineNumber: 11
								},
								__self: this
							},
							'Score for'
						),
						React.createElement(
							'th',
							{
								__source: {
									fileName: _jsxFileName,
									lineNumber: 11
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
									lineNumber: 11
								},
								__self: this
							},
							'Score Against'
						)
					)
				),
				React.createElement(
					'tbody',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 12
						},
						__self: this
					},
					this.props.items.map(function (item) {
						return React.createElement(TableRow, { pairing: item, key: item.participant, __source: {
								fileName: _jsxFileName,
								lineNumber: 14
							},
							__self: _this2
						});
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

		var _this3 = _possibleConstructorReturn(this, (TableRow.__proto__ || Object.getPrototypeOf(TableRow)).call(this, props));

		_this3.state = { 'pairing': props.pairing };
		return _this3;
	}

	_createClass(TableRow, [{
		key: 'render',
		value: function render() {
			var pairing = this.state.pairing;
			return React.createElement(
				'tr',
				{
					__source: {
						fileName: _jsxFileName,
						lineNumber: 31
					},
					__self: this
				},
				React.createElement(
					'td',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 32
						},
						__self: this
					},
					pairing.participant
				),
				React.createElement(
					'td',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 33
						},
						__self: this
					},
					pairing.score_for
				),
				React.createElement(
					'td',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 34
						},
						__self: this
					},
					pairing.opponent
				),
				React.createElement(
					'td',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 35
						},
						__self: this
					},
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

		var _this4 = _possibleConstructorReturn(this, (Pairing.__proto__ || Object.getPrototypeOf(Pairing)).call(this, props));

		_this4.state = { 'current': '', 'matching': [] };
		_this4.handleSubmit = _this4.handleSubmit.bind(_this4);
		_this4.handleChange = _this4.handleChange.bind(_this4);
		return _this4;
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
			var _this5 = this;

			var matching = this.state.matching;

			return React.createElement(
				'div',
				{
					__source: {
						fileName: _jsxFileName,
						lineNumber: 85
					},
					__self: this
				},
				React.createElement(
					'div',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 86
						},
						__self: this
					},
					React.createElement(
						'form',
						{ onSubmit: function onSubmit(evt) {
								return _this5.handleSubmit(evt);
							}, __source: {
								fileName: _jsxFileName,
								lineNumber: 87
							},
							__self: this
						},
						React.createElement(
							'div',
							{ className: 'formGroup', __source: {
									fileName: _jsxFileName,
									lineNumber: 88
								},
								__self: this
							},
							React.createElement('input', { className: 'form-control', type: 'text', value: this.state.current,
								placeholder: 'name score-for score-against',
								onChange: function onChange(evt) {
									return _this5.handleChange(evt);
								}, __source: {
									fileName: _jsxFileName,
									lineNumber: 89
								},
								__self: this
							})
						)
					),
					React.createElement(
						'ul',
						{ className: 'list-group hints', __source: {
								fileName: _jsxFileName,
								lineNumber: 94
							},
							__self: this
						},
						matching.map(function (item) {
							return React.createElement(
								'li',
								{ className: matching.length == 1 ? "active list-group-item" : "list-group-item", key: item.participant, __source: {
										fileName: _jsxFileName,
										lineNumber: 96
									},
									__self: _this5
								},
								item.participant,
								' vs ',
								item.opponent,
								' '
							);
						})
					)
				),
				React.createElement(ResultTable, { items: this.props.completed, __source: {
						fileName: _jsxFileName,
						lineNumber: 100
					},
					__self: this
				}),
				React.createElement(
					'div',
					{
						__source: {
							fileName: _jsxFileName,
							lineNumber: 101
						},
						__self: this
					},
					React.createElement(
						'h3',
						{
							__source: {
								fileName: _jsxFileName,
								lineNumber: 101
							},
							__self: this
						},
						'Awaiting results...'
					)
				),
				React.createElement(ResultTable, { items: this.props.pending, __source: {
						fileName: _jsxFileName,
						lineNumber: 102
					},
					__self: this
				})
			);
		}
	}]);

	return Pairing;
}(React.Component);