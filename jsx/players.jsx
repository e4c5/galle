class Players extends React.Component {
	static contextType = TournamentContext
	
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
			const participants = Object.values(this.context.participants).filter(p => {
				if(p.player.full_name == 'Bye') return false;
				return true
			})
			
			participants.sort( (a,b) => { return b.player.national_rating - a.player.national_rating })
			
			return (
			 <table>
			   <thead><tr><th>Name</th><th>Rating</th><th></th></tr></thead>
			   <tbody>
			   {this.context.participants.map(p => {
				   
			   })}
			   </tbody>
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