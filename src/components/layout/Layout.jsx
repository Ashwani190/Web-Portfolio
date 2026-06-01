import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from '../shared/ScrollProgress';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
