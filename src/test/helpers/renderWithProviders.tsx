import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import dexReducer from '../../core/store/dex/dexSlice';

const rootReducer = combineReducers({
  dex: dexReducer,
});

type RootState = ReturnType<typeof rootReducer>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
    route = '/',
    ...renderOptions
  } = extendedRenderOptions;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export function renderWithRouter(
  ui: ReactElement,
  { route = '/', ...renderOptions }: { route?: string } & RenderOptions = {}
) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>, renderOptions);
}

export function renderWithRedux(
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
    ...renderOptions
  } = extendedRenderOptions;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
