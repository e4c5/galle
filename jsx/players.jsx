class Players extends React.Component {
	constructor(props) {
		super(props)

	}
	
	componentDidMount() {
		axios.get("/api/player/").then(
			response => {
				this.setState({players: response.data});
			}
		);
	}

	playerList() {
		if(this.context.participants) {
		  return (
			 <table>
			   <thead><tr><th>Name</th><th>Rating</th><th></th></tr></thead>
			   <tbody></tbody>
		     </table>)
		}
		return null;
	}
	
	render() {
		if(this.state) {
			return (<div>
				{ this.playerList() }
				<Autocomplete suggestions={this.state.players} />
			</div>)
		}
		return null;
	}
	
}