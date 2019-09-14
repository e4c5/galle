const TournamentContext = React.createContext({})

class TournamentProvider extends React.Component {
	/**
	 * saves the list of tournaments
	 */
	setTournaments = (tournaments) => {
		this.setState({tournaments: tournaments});
	}
	
	state = {
       tournaments: [],       
       setTournaments: this.setTournaments
    };


    render() {
     return ( 
       <TournamentContext.Provider value={this.state}>
         {this.props.children}
       </TournamentContext.Provider>
    );
  }
}