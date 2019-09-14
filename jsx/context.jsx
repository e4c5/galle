const TournamentContext = React.createContext({})

class TournamentProvider extends React.Component {
	setBasePath = (path) => {
		this.setState({basePath: path})
	}
	
	setTournament = (tournament) => {
		this.setState({tournament: tournament});
	}
	
	setParticipants = (participants) => {
		const saved = {}
		participants.map(item => {
			saved[item.id] = item
			item['results'] = []
		})
		this.setState({participants: saved})
	}
	state = {
       tournament: null,       
       participants: null,
       basePath: null,
       setTournament: this.setTournament,
       setBasePath: this.setBasePath
    };

    render() {
     return ( 
       <TournamentContext.Provider value={this.state}>
         {this.props.children}
       </TournamentContext.Provider>
    );
  }
}