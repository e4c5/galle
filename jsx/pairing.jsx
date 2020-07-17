/**
 * Displays the list of results for the given round.
 */
class ResultTable extends React.Component {
	constructor(props) {
        super(props);
    }
    render() {
         return (
            <table className='table'>
             <thead><tr><th>Player</th><th>Score for</th><th>Opponent</th><th>Score Against</th></tr></thead>
             <tbody>
				{this.props.items.map(item => 
				   (<TableRow pairing={item} key={item.participant} />))
				}
            </tbody></table>
         );
    }
}

/**
 * A single row, rendered as a row in an HTML table.
 */
class TableRow extends React.Component {
	constructor (props) {
		super(props);
		this.state = {'pairing' : props.pairing};
	}
	render() {
		const pairing = this.state.pairing;
		return (<tr>
		<td>{pairing.participant}</td>
		<td>{pairing.score_for}</td>
		<td>{pairing.opponent}</td>
		<td>{pairing.score_against}</td>
		</tr>);
	}
}


/**
 * The top level component.
 */
class Pairing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {current: '', matching: []}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	findMatches(c) {
		return this.props.pending.filter(item => c.length > 1 && item.participant.toLowerCase().search(c) != -1).slice(0, 4);
	}	

	/**
	 * Handle form submit.
	 * Will be lifted to the parent.
	 */
	handleSubmit(evt) {
		evt.preventDefault();
		this.props.submitResult(evt, this.state.current);
		this.setState({'current': '', 'matching': []})
	}
	
	/**
	 * Handling changes to the result input
	 * will be sent upto the parent
	 * 
	 * @TODO : list state up
	 */

	handleChange(evt) {
		const value = evt.target.value;
		this.setState({'current': value});
		const c = value.replace(/\d+/gi,'').trim().toLowerCase();

		const matching = this.findMatches(c);
		this.setState({'matching': matching});
	}

	render() {
		const matching = this.state.matching;

		return(<div>
					<div>
					    <form onSubmit={evt => this.handleSubmit(evt) } >
				     		 <div className="formGroup">
				     		    <input className="form-control" type="text" value={this.state.current}
				     		     placeholder="name score-for score-against"
				     		     onChange={evt => this.handleChange(evt)}	/>
				     		 </div>
				    	</form>
					    <ul className="list-group hints">
								{ matching.map(item => (
								     <li className={ matching.length == 1 ? "active list-group-item" : "list-group-item"} key={item.participant}>
								         {item.participant} vs {item.opponent} </li>)) }
					    </ul>
				    </div>
				    <ResultTable items={this.props.completed} />
				    <div><h3>Awaiting results...</h3></div>
				    <ResultTable items={this.props.pending} />
			   </div>);
	}
}

   