import React, { Component } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react'
import axios from 'axios';
import styled from 'styled-components';
import { withRouter } from "react-router";

const Wrapper = styled.div`
 form {
   min-width: 600px;
 }
`

class UserPage extends Component {
  state = {
    data: [],
    username: '',
    balance: null,
  }

  componentDidMount() {
    const { match } = this.props;
    console.log('componentDidMount', match.params.id);
    axios.get(`/users/${match.params.id}`, {
      headers: {
          'Content-Type': 'application/json',
      }
    }).then(res => {
        if(res.data) {
          this.setState({
            data: res.data,
            username: res.data.username,
            balance: res.data.balance,
          })
        }
    })
  }

  setValue(e, name){
    this.setState({[name]: e.target.value})
    console.log(e.target.value, name);
  }

  onSubmit(id){
    const { username, balance } = this.state;
    const { history } = this.props;
    axios.put(`/users/${id}`, {
        username,
        balance
      }).then(res => {
        if(res.data) {
          history.push('/')
        }
    })
  }

  render(){
    const { match } = this.props;
    const { data, username, balance } = this.state;
    console.log('data', data);
    console.log('===', !!data.lenght);
    if (!!data.lenght){
      return <div>Chargement..</div>
    }
    return (
      <Wrapper>
        <h1>{data.username}</h1>
        <h1>Id: {match.params.id}</h1>
        <Segment>
          <Form onSubmit={() => this.onSubmit(match.params.id)}>
            <Form.Group widths='equal'>
              <Form.Input fluid label='Username' value={username} placeholder={data.username} onChange={(e) => this.setValue(e, 'username')}/>
              <Form.Input fluid label='Balance' value={balance} placeholder={data.balance} onChange={(e) => this.setValue(e, 'balance')} />
            </Form.Group>
            <Button primary type='submit'>Update</Button>
          </Form>
        </Segment>
      </Wrapper>
    )
  }
}


export default withRouter(UserPage);
