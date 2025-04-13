export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }

      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      }

      // Register for periodic sync if supported
      if ('periodicSync' in registration) {
        try {
          await (registration as any).periodicSync.register('sync-data', {
            minInterval: 24 * 60 * 60 * 1000 // 1 day
          });
        } catch (error) {
          console.log('Periodic sync could not be registered:', error);
        }
      }

    } catch (error) {
      console.error('Error registering service worker:', error);
    }
  }
};
