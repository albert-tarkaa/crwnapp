import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import './App.css';
import Header from './components/header';
import { auth, createUserProfileDocument } from './firebase/firebase.util';
import Homepage from './pages/homepage';
import ShopPage from './pages/shop';
import SignInUp from './pages/signinup';
import setCurrentUser from './redux/user/action';

class App extends Component {
  unSubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unSubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      }
      setCurrentUser(userAuth);
    });
  }

  componentWillUnmount() {
    this.unSubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={Homepage} />
          <Route path='/shop' component={ShopPage} />
          <Route exact path='/signin' render={() => this.props.currentUser ? (<Redirect to='/' />) :( <SignInUp />)} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

const mapDispatchToProps = (dispatch) => ({ setCurrentUser: (user) => dispatch(setCurrentUser(user)) });

export default connect(mapStateToProps, mapDispatchToProps)(App);
