import { createContext, useCallback, useContext, ReactNode } from 'react';

// Strict type for context
interface NotificationSoundContextType {
  notify: (title?: string, options?: NotificationOptions) => void;
}

const NotificationSoundContext = createContext<NotificationSoundContextType | undefined>(undefined);

interface NotificationSoundProviderProps {
  children: ReactNode;
}

const playBeep = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  oscillator.connect(ctx.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    ctx.close();
  }, 200);
};

const notify = (title = 'Notification', options?: NotificationOptions) => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
      playBeep();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, options);
          playBeep();
        }
      });
    }
  } else {
    playBeep();
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