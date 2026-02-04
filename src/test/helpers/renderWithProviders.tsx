import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import dexReducer from '../../core/store/dex/dexSlice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: {
    dex?: ReturnType<typeof dexReducer>;
  };
  store?: EnhancedStore;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { dex: dexReducer },
      preloadedState,
    }),
    route = '/',
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
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
  {
    preloadedState = {},
    store = configureStore({
      reducer: { dex: dexReducer },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
