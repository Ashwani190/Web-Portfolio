import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#360800',
            color: '#feeee1',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#80370c',
              secondary: '#feeee1',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#feeee1',
            },
          },
        }}
      />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
