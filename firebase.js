import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isFirebaseReady = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId,
);

let app;
let auth;
let db;

export async function setupFirebase() {
  if (!isFirebaseReady) {
    return { enabled: false };
  }

  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    await signInAnonymously(auth);
  }

  return { enabled: true, auth, db };
}

export async function saveFirebasePlayer(player) {
  if (!db) {
    return;
  }

  await setDoc(doc(db, 'players', player.id), {
    ...player,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function loadFirebaseProgress(playerId) {
  if (!db) {
    return null;
  }
  const snapshot = await getDoc(doc(db, 'progress', playerId));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function saveFirebaseProgress(playerId, progress) {
  if (!db) {
    return;
  }
  await setDoc(
    doc(db, 'progress', playerId),
    {
      ...progress,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function saveFirebaseScore(entry) {
  if (!db) {
    return;
  }

  const ref = doc(db, 'leaderboard', entry.id);
  const existing = await getDoc(ref);
  const previousScore = existing.exists() ? existing.data().score || 0 : 0;

  if (previousScore > entry.score) {
    return;
  }

  await setDoc(
    ref,
    {
      ...entry,
      createdAt: existing.exists() ? existing.data().createdAt || serverTimestamp() : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function loadFirebaseLeaderboard() {
  if (!db) {
    return [];
  }

  const results = await getDocs(
    query(collection(db, 'leaderboard'), orderBy('score', 'desc'), limit(20)),
  );

  return results.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export { isFirebaseReady };
