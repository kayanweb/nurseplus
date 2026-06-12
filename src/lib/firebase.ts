import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import defaultFirebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(defaultFirebaseConfig);
export const db = getFirestore(app, defaultFirebaseConfig.firestoreDatabaseId);                
export const auth = getAuth(app);

// Enable robust offline capabilities globally for real-time synchronization
try {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Multiple tabs open, offline persistence runs in single tab only.");
    } else if (err.code === 'unimplemented') {
      console.warn("Browser does not support offline persistence.");
    }
  });
} catch (e) {
  // Ignore synchronous errors
}

