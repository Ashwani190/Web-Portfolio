import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from '../shared/ScrollProgress';
import TextTicker from '../home/TextTicker';
import { supabase } from '../../lib/supabaseClient';

const Layout = ({ children }) => {
  const [tickerItems, setTickerItems] = useState([]);

  useEffect(() => {
    const fetchTicker = async () => {
      const { data } = await supabase
        .from('ticker_items')
        .select('text, icon_url')
        .eq('is_active', true)
        .order('display_order');
      if (data) setTickerItems(data);
    };
    fetchTicker();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ticker sits at the very top, above everything */}
      {tickerItems.length > 0 && (
        <TextTicker items={tickerItems} speed={32} />
      )}
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
