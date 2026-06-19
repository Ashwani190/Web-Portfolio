import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AnimatedBackground from './components/layout/AnimatedBackground';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AnimatedBackground />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1A1D23',
              color: '#F5F5F5',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#686B6C',
                secondary: '#0F1115',
              },
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#F5F5F5',
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

