import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NativeRouter,Route,Routes } from 'react-router-native';

import AccountPage from './src/account';
import MainPage from './src/mainPage';

export default function App() {
  return (
    <>  
      <StatusBar backgroundColor={'#7A73E7'}></StatusBar>
      <NativeRouter>
        <Routes>
          <Route path="/" element={<AccountPage/>} />
          <Route path="/Main" element={<MainPage/>} />
        </Routes>
      </NativeRouter>
    </>
  );
}
