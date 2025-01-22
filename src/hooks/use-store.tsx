import { createContext, useContext, useReducer, useEffect } from 'react';
import { LanguageEnum } from '@/types/localization';
import { useDefaultLocale } from '@/hooks/use-default-locale';
import { useTranslation } from 'react-i18next';

interface State {
  locale: LanguageEnum;
  theme: 'light' | 'dark';
}

type Action =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOCALE'; payload: LanguageEnum };

const initialState: State = {
  locale: LanguageEnum.ENGLISH,
  theme: 'light',
};

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LOCALE':
      return { ...state, locale: action.payload };
    default:
      return state;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { defaultLocale } = useDefaultLocale();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    locale: defaultLocale,
  });
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(defaultLocale);
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
