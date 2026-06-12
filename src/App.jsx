import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import ErrorBoundary from './components/shared/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A3A5C',
              color: '#FBF9E4',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#5B88B2',
                secondary: '#FBF9E4',
              },
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#FBF9E4',
              },
            },
          }}
        />
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

