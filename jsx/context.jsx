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
	
	setParticipants = (participants) => {
		const saved = {}
		participants.map(item => {
			saved[item.id] = item
			item['results'] = []
		})
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