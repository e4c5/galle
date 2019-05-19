const elem = document.getElementById('root') 

class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = {tournament: {name: '', rounds: [], start_date: ''}};
		
		this.updateTournament = this.updateTournament.bind(this);
	}
	
	updateTournament(evt, tournament) {
		axios.post('/api/', tournament).then(
				response => { window.location.href=`/start/${response.data.id}/` });
	}
	
	render() {
		return <Settings tournament={this.state.tournament} updateTournament={this.updateTournament} />
	}
}

ReactDOM.render(
  <Start/>,
  elem
);