import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Header, Segment, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import ListPage from './containers/ListPage';
import UserPage from './containers/UserPage';
import AddUser from './containers/AddUser';



const HeaderBar = styled(Segment)`
  border-radius: 0 !important;
  background: black;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
`

const Wrapper = styled.div`
  display: flex;
  min-width: 600px;
  justify-content: center;
`

class RenderRoute extends Component {

  render() {
    return (
      <div>
      <HeaderBar inverted>
        <Header as='h4' inverted>
          briq developers test
        </Header>
      </HeaderBar>
        <Router>
          <Wrapper>
          <Route exact path="/" component={ListPage} />
          <Route exact path="/add" component={AddUser} />
          <Route exact path="/user/:id" component={UserPage} />
          </Wrapper>
        </Router>
      </div>
    )
  }
}


export default RenderRoute;
