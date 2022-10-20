const TournamentContext = React.createContext({})

class TournamentProvider extends React.Component {
	setBasePath = (path) => {
		if(path.endswith('/')) {
			this.setState({basePath: path})
		}
		else{
			this.setState({basePath: path + "/"})
		}
	}
	
	setTournament = (tournament) => {

		this.setState({tournament: tournament, 
			 basePath: '/tournament/' + tournament.slug + '/'});
	}
	
	/*
	 * Sets the initial participants as an associative array.
	 * The default array will have the indices going from 0 sequentially
	 * but some operations are more convinient if we had the participant id
	 * as the key.
	 */
	setParticipants = (participants) => {
		const saved = {}
		participants.map(item => {
			saved[item.id] = item
			item['results'] = []
		})
		this.setState({participants: saved})
	}
	
	/**
	 * Adds a new participant to the tournament.
	 */
	addParticipant = (participant) => {
		const saved = {...this.context.participants, [player.id]: response.data}
		this.setState({participants: saved})
	}
	
	getParticipant = (participant_id) => {
		if(this.state.participants != null) {
			return this.state.participants[participant_id]
		}
	}
	
	state = {
       tournament: null,       
       participants: null,
       basePath: null,
       setTournament: this.setTournament,
       setParticipants: this.setParticipants,
       setBasePath: this.setBasePath,
       getParticipant: this.getParticipant
    };

    render() {
     return ( 
       <TournamentContext.Provider value={this.state}>
         {this.props.children}
       </TournamentContext.Provider>
    );
  }
}