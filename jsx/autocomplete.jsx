/**
 * Autocomplete component based on 
 * https://github.com/krissnawat/simple-react-autocomplete/
 * 
 */
class Autocomplete extends React.Component {
	static defaultProperty = {
		suggestions: []
	};
	constructor(props) {
		super(props);
		this.state = {
				activeSuggestion: 0,
				filteredSuggestions: [],
				showSuggestions: false,
				userInput: ""
		};
	}

	onChange = e => {
		const { suggestions } = this.props;
		const userInput = e.currentTarget.value;
		let filteredSuggestions = [];
		if(userInput.length > 2) {
			filteredSuggestions = suggestions.filter(
					suggestion =>
					suggestion.full_name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
			);
		}

		this.setState({
			activeSuggestion: 0,
			filteredSuggestions,
			showSuggestions: true,
			userInput: e.currentTarget.value
		});
	
	};

	onClick = e => {
		this.setState({
			activeSuggestion: 0,
			filteredSuggestions: [],
			showSuggestions: false,
			userInput: e.currentTarget.innerText
		});
	};
	onKeyDown = e => {
		const { activeSuggestion, filteredSuggestions } = this.state;

		if (e.keyCode === 13) {
			this.setState({
				activeSuggestion: 0,
				showSuggestions: false,
				userInput: filteredSuggestions[activeSuggestion]
			});
		} else if (e.keyCode === 38) {
			if (activeSuggestion === 0) {
				return;
			}

			this.setState({ activeSuggestion: activeSuggestion - 1 });
		} else if (e.keyCode === 40) {
			if (activeSuggestion - 1 === filteredSuggestions.length) {
				return;
			}

			this.setState({ activeSuggestion: activeSuggestion + 1 });
		}
	};

	render() {
		const {
			onChange,
			onClick,
			onKeyDown,
			state: {
				activeSuggestion,
				filteredSuggestions,
				showSuggestions,
				userInput
			}
		} = this;
		let suggestionsListComponent;
		
		if (showSuggestions && userInput) {
			if (filteredSuggestions.length) {
				suggestionsListComponent = (
						<table className="suggestions">
						{filteredSuggestions.map((suggestion, index) => {
							let className;

							if (index === activeSuggestion) {
								className = "suggestion-active";
							}

							return (
									<tr className={className} key={suggestion.full_name} onClick={onClick}>
									   <td>{suggestion.full_name}</td>
									   <td>{suggestion.national_rating}</td>
									</tr>
							);
						})}
						</table>
				);
			} else {
				suggestionsListComponent = null;
			}
		}

		return (
				<React.Fragment>
				<input
				type="text"
					onChange={onChange}
				onKeyDown={onKeyDown}
				value={userInput}
				/>
				{suggestionsListComponent}
				</React.Fragment>
		);
	}
}
