
import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
const [firebaseUser, setFirebaseUser] = useState(null);

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
    setFirebaseUser(user);
    });
    return () => unsubscribe();
}, []);

return { firebaseUser };
}
