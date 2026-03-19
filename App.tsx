import { NavigationContainer } from '@react-navigation/native';
import Jokesonicemasstck from './Jokesonicematfishinglog/[MatelogRouting]/Jokesonicemasstck';
import { MateLogProvider } from './Jokesonicematfishinglog/Matelogstore/mateLogContxt';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <NavigationContainer>
      <MateLogProvider>
        <Jokesonicemasstck />
        <Toast position="top" topOffset={40} />
      </MateLogProvider>
    </NavigationContainer>
  );
};

export default App;
