class Players extends React.Component {
	static contextType = TournamentContext
	
	constructor(props) {
		super(props)
		this.state = {players:[], userInput: '', rating: '', message:''}
		this.onChange = this.onChange.bind(this);
		this.onSelect = this.onSelect.bind(this);
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
			  <table className='table table-striped'>
			    <thead><tr><th>Name</th><th>Rating</th><th>On/Off</th></tr></thead>
			    <tbody>
			     {participants.map(p => {
				  return <tr key={p.id}><td>{p.player.full_name}</td>
				    <td>{p.player.national_rating}</td>
					    <td><button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
					    On
					    </button>
					</td>
				  </tr>
			    })}
			    </tbody>
		      </table>
		     ) 
		}
		return null;
	}
	
	onChange(e) {
		if(e.target.name == 'rating') {
			this.setState({rating: e.target.value})
		}
		else {
			this.setState({userInput: e.target.value, message: ''})
		}
	}
	
	onSelect(player) {
		const participants = this.context.participants;
		if(Object.values(participants).some(p => { p.player.id = player.id})) {
			this.setState({'message': 'Already added'})
		}
		else {
			axios.post(`/api/${this.context.tournament.id}/participant/`, {player_id: player.id}).then(
					response => { 
						this.setState({message: '', userInput: '', rating: ''});
						this.context.addParticipant(response.data)
					});
		}
	}
	
	render() {
		if(this.state) {
			return (
			 <React.Fragment>
			  <div className='row'>
			    <div className='col-md-2'>Add players</div>
				<div className='col-md-2'><Autocomplete suggestions={this.state.players} userInput={this.state.userInput} 
					onSelect={ this.onSelect }  onChange={this.onChange }/>
				</div>
				<div className='col-md-2'><input type='number' name='rating' className='form-control' onChange={this.onChange}
					  value={this.state.rating} autoComplete='Rating'/>
			    </div>
				<div className='col-md-2'><button onClick={e => addPlayer()} className='btn' >New player</button></div>
				<div className='col-md-2'>{ this.state.message }</div>
			  </div>
				{ this.playerList() }
		     </React.Fragment>)
		}
		return null;
	}
	
}