import { useState, useEffect } from 'react';
import { ThemeProvider, Header, TabBar } from './components/Navigation';
import { SplashScreen } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { LoginScreen } from './screens/LoginScreen';
import { UserHome } from './screens/UserHome';
import { StaffDashboard } from './screens/StaffDashboard';
import { OrdersScreen } from './screens/OrdersScreen';
import { DealsScreen } from './screens/DealsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DealDetails } from './screens/DealDetails';
import { motion, AnimatePresence } from 'motion/react';
import { CartProvider } from './lib/CartContext';

type Tab = 'home' | 'orders' | 'deals' | 'profile';
type AuthState = 'splash' | 'onboarding' | 'login' | 'authenticated';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [userRole, setUserRole] = useState<'user' | 'staff' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleLogin = (role: 'user' | 'staff') => {
    setUserRole(role);
    setAuthState('authenticated');
  };

  return (
    <CartProvider>
      <ThemeProvider>
        <AnimatePresence mode="wait">
          {authState === 'splash' && (
            <SplashScreen key="splash" onComplete={() => setAuthState('onboarding')} />
          )}

          {authState === 'onboarding' && (
            <Onboarding key="onboarding" onComplete={() => setAuthState('login')} />
          )}

          {authState === 'login' && (
            <LoginScreen key="login" onLogin={handleLogin} />
          )}

          {authState === 'authenticated' && (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col min-h-screen"
            >
              <Header />
              
              <main className="flex-1 overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {activeTab === 'home' && (
                      userRole === 'staff' 
                        ? <StaffDashboard /> 
                        : <UserHome onItemClick={setSelectedItem} />
                    )}
                    {activeTab === 'orders' && <OrdersScreen />}
                    {activeTab === 'deals' && <DealsScreen />}
                    {activeTab === 'profile' && <ProfileScreen role={userRole} />}
                  </motion.div>
                </AnimatePresence>
              </main>

              <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Global Modals/Overlays */}
              <AnimatePresence>
                {selectedItem && (
                  <DealDetails 
                    item={selectedItem} 
                    onBack={() => setSelectedItem(null)} 
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </ThemeProvider>
    </CartProvider>
  );
}


