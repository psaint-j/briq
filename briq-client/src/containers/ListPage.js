import React, { Component } from 'react';
import { Header, Table, Button } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';


export default class ListPage extends Component {
  state = {
    data: []
  }

  componentDidMount() {
    axios.get('/users', {
      headers: {
          'Content-Type': 'application/json',
      }
    }).then(res => {
        if(res.data) {
          this.setState({data: res.data})
        }
    })
  }

  showMore(id){
    const { history } = this.props;
    history.push(`/user/${id}`);
  }

  deleteUser(id){
    const { data } = this.state;
    axios.delete(`/users/${id}`, {
      headers: {
          'Content-Type': 'application/json',
      }
    }).then(res => {
        if(res.data) {
          const newData = data.filter((item) => {
              return item.id !== id
            }
          )
          this.setState({data: newData});
        }
    })
  }

  goTo(url){
    const { history } = this.props;
    history.push(url);
  }

  render(){
    const { data } = this.state
    if (!!data.lenght){
      return <div>Chargement..</div>
    }
    return (
      <Table basic='very' celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Balance</Table.HeaderCell>
            <Table.HeaderCell>create at</Table.HeaderCell>
            <Table.HeaderCell>update at</Table.HeaderCell>
            <Table.HeaderCell><Button color='green' onClick={() => this.goTo('/add')}>Add user</Button></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((item) => {
            return (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Header as='h4' image>
                    <Header.Content>
                      {item.username}
                      <Header.Subheader>{item.id}</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>{item.balance}</Table.Cell>
                <Table.Cell>{moment(item.createdAt).format('L')}</Table.Cell>
                <Table.Cell>{moment(item.updatedAt).format('L')}</Table.Cell>
                <Table.Cell><Button primary onClick={() => this.showMore(item.id)}>Show</Button></Table.Cell>
                <Table.Cell><Button onClick={() => this.deleteUser(item.id)} color="red">Deleted</Button></Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }
}
