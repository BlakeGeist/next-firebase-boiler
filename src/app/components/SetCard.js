import React from 'react'
import axios from 'axios'

class SetCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddCardToUsersCollection = this.handleAddCardToUsersCollection.bind(this);
  }

  handleChange(e) {
    this.setState({count: e.target.value})
  }

  handleAddCardToUsersCollection(e) {
    e.preventDefault();
    const { card } = this.props
    const benchMarkPrice = card.prices.usd || card.prices.usd_foil;
    axios({
      url: '/api/usersCardCollection/add',
      params: {
        id: card.id,
        qty: e.target.amount.value,
        benchMarkPrice: benchMarkPrice
      }
    }).then((res)=> {
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  }

  render() {
    return (
      <form onSubmit={this.handleAddCardToUsersCollection}>
        <input onChange={this.handleChange} name="amount" value={this.state.count} /> |
        <input type="submit" value="Add" />
      </form>
    )
  }
}

export default SetCard
