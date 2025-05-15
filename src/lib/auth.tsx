
import { createContext, useContext, useEffect, useState } from "react";
import { getConnectedAddress, connectWallet } from "./blockchain";
import { getUser } from "./database";
import { User } from "./types";
import { USER_ROLES } from "./constants";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  connect: async () => false,
  disconnect: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const address = await getConnectedAddress();
      
      if (address) {
        const userFromDB = getUser(address);
        
        if (userFromDB) {
          setUser(userFromDB);
        } else {
          // User wallet connected but not in our system
          setUser({
            address,
            role: USER_ROLES.NONE,
          });
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const connect = async (): Promise<boolean> => {
    try {
      const address = await connectWallet();

      alert(address)
      console.log(address);
      
      
      if (address) {
        const userFromDB = getUser(address);
        
        if (userFromDB) {
          setUser(userFromDB);
        } else {
          // User wallet connected but not in our system
          setUser({
            address,
            role: USER_ROLES.NONE,
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Connection failed:", error);
      return false;
    }
  };

  const disconnect = () => {
    // For MetaMask, we cannot force disconnect, but we can clear our state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, connect, disconnect }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
