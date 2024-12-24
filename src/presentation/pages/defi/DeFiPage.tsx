import { Provider } from 'react-redux';
import { store } from '../../../core/store';
import { DexContainer } from '../../components';

export const DeFiPage = () => {
  return (
    <Provider store={store}>
      <DexContainer />
    </Provider>
  );
};
