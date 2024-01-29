import React from 'react';
import Navbar from '../components/Navbar';
import { Provider } from 'react-redux';
import store from './store';
import WardList from './WardList';
const App = () => {
  return (
    <Provider store={store}>
        <div>
          <Navbar />
          <WardList />
        </div>
    </Provider>
  );
};

export default App;