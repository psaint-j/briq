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
    username: '',
    balance: 0,
  }

  setValue(e, name){
    this.setState({[name]: e.target.value})
    console.log(e.target.value, name);
  }

  onSubmit(){
    const { username, balance } = this.state;
    const { history } = this.props;
    axios.post('/users', {
        username,
        balance
      }).then(res => {
        if(res.data) {
          history.push('/')
        }
    })
  }

  render(){
    const { username, balance } = this.state;
    return (
      <Wrapper>
      <Segment>
        <Form onSubmit={() => this.onSubmit()}>
          <Form.Group widths='equal'>
            <Form.Input fluid label='Username' value={username} placeholder="username" onChange={(e) => this.setValue(e, 'username')}/>
            <Form.Input fluid label='Balance' value={balance} placeholder="0" onChange={(e) => this.setValue(e, 'balance')} />
          </Form.Group>
          <Button primary type='submit'>Add</Button>
        </Form>
      </Segment>
      </Wrapper>
    )
  }
}


export default withRouter(UserPage);
