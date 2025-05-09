import { createContext, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';

// Strict type for context
interface NotificationSoundContextType {
  notify: (title?: string, options?: NotificationOptions) => void;
}

const NotificationSoundContext = createContext<NotificationSoundContextType | undefined>(undefined);

interface NotificationSoundProviderProps {
  children: ReactNode;
}

const playNotificationSound = () => {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play();
};

const notify = (title = 'Notification', options?: NotificationOptions) => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
      playNotificationSound();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, options);
          playNotificationSound();
        }
      });
    }
  } else {
    playNotificationSound();
  }
};

export const NotificationSoundProvider = ({ children }: NotificationSoundProviderProps) => {
  const notifyCallback = useCallback(notify, []);
  return (
    <NotificationSoundContext.Provider value={{ notify: notifyCallback }}>
      {children}
    </NotificationSoundContext.Provider>
  );
};

export const useNotificationSound = (): NotificationSoundContextType => {
  const context = useContext(NotificationSoundContext);
  if (!context) {
    throw new Error('useNotificationSound must be used within a NotificationSoundProvider');
  }
  return context;
}; 