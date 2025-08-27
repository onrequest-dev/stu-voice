import { useEffect } from "react";
import { useNotification } from "./NotificationContext";

const SWMessageHandler = () => {
  const { notifyNew } = useNotification();

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
        if (event.data?.type === 'NEW_NOTIFICATION') {
          notifyNew();
        }
      });
    }
  }, []);

  return null;
};
export default SWMessageHandler;