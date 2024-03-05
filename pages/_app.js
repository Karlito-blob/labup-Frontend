// Import Style
import '../styles/globals.css';
import Head from 'next/head';

// Imports pour redux/persist
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import patternHistory from '../reducers/patternHistory';
import user from '../reducers/user';
import { Provider } from 'react-redux';

// Import reducer persist + config
import { combineReducers, configureStore } from '@reduxjs/toolkit';
const reducers = combineReducers({ patternHistory, user });
const persistConfig = { key: 'LabUp', storage };

// Configuration du store redux/persist
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (

    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>LabUp</title>
        </Head>

        <Component {...pageProps} />
      </PersistGate>
    </Provider>

  );
}

export default App;
