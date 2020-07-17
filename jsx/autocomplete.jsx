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
	
			this.setState({
				activeSuggestion: 0,
				filteredSuggestions,
				showSuggestions: true,
			});
		}
		
		this.props.onChange(e);
	};

	onClick(e, player) {
		this.setState({
			activeSuggestion: 0,
			filteredSuggestions: [],
			showSuggestions: false,
		});
		this.props.onSelect(player)
	};
	
	onKeyDown = e => {
		const { activeSuggestion, filteredSuggestions } = this.state;

		if (e.keyCode === 13) {
			this.setState({
				activeSuggestion: 0,
				showSuggestions: false,
			});
			this.props.onSelect(filteredSuggestions[activeSuggestion])
			
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
				showSuggestions
			}
		} = this;
		
		let suggestionsListComponent;
		let userInput = this.props.userInput
		
		if (showSuggestions && userInput) {
			if (filteredSuggestions.length) {
				suggestionsListComponent = (
						<table className="suggestions">
						  <thead><tr><th>Player Name</th><th>Rating</th></tr></thead>
						  <tbody>
							{filteredSuggestions.map((suggestion, index) => {
								let className;
								if (index === activeSuggestion) {
									className = "suggestion-active";
								}
	
								return (
										<tr className={className} key={suggestion.full_name} onClick={e => this.onClick(e, suggestion)}>
										   <td>{suggestion.full_name}</td>
										   <td>{suggestion.national_rating}</td>
										</tr>
								);
							})}
						  </tbody>	
						</table>
				);
			} else {
				suggestionsListComponent = null;
			}
		}

		return (
				<React.Fragment>
					<input 	type="text"	onChange={onChange}	onKeyDown={onKeyDown} value={this.props.userInput} />
				    {suggestionsListComponent}
				</React.Fragment>
		);
	}
}
