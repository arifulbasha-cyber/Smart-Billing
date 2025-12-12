import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc } from 'firebase/firestore';
class FirebaseService {
    constructor() {
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "auth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isInitialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.tryAutoInit();
    }
    // Try to load config from localStorage
    tryAutoInit() {
        const storedConfig = localStorage.getItem('tmss_firebase_config');
        if (storedConfig) {
            try {
                const config = JSON.parse(storedConfig);
                this.initialize(config);
            }
            catch (e) {
                console.error("Failed to auto-init firebase", e);
            }
        }
    }
    initialize(config) {
        try {
            if (!getApps().length) {
                this.app = initializeApp(config);
            }
            else {
                this.app = getApps()[0];
            }
            this.auth = getAuth(this.app);
            this.db = getFirestore(this.app);
            this.isInitialized = true;
            localStorage.setItem('tmss_firebase_config', JSON.stringify(config));
        }
        catch (error) {
            console.error("Firebase Init Error:", error);
            throw error;
        }
    }
    isReady() {
        return this.isInitialized && !!this.auth && !!this.db;
    }
    async login() {
        if (!this.auth)
            throw new Error("Firebase not initialized");
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }
    async logout() {
        if (!this.auth)
            throw new Error("Firebase not initialized");
        return signOut(this.auth);
    }
    // Firestore Helpers
    // -----------------
    getUserRef(uid) {
        if (!this.db)
            throw new Error("DB not ready");
        return doc(this.db, 'users', uid);
    }
    // History
    async saveBill(uid, bill) {
        if (!this.db)
            throw new Error("DB not ready");
        const billRef = doc(this.db, 'users', uid, 'bills', bill.id);
        await setDoc(billRef, bill);
    }
    async getBills(uid) {
        if (!this.db)
            throw new Error("DB not ready");
        const billsRef = collection(this.db, 'users', uid, 'bills');
        const snapshot = await getDocs(billsRef);
        return snapshot.docs.map(d => d.data());
    }
    async deleteBill(uid, billId) {
        if (!this.db)
            throw new Error("DB not ready");
        await deleteDoc(doc(this.db, 'users', uid, 'bills', billId));
    }
    // Settings: Tariff
    async saveTariff(uid, config) {
        if (!this.db)
            throw new Error("DB not ready");
        await setDoc(doc(this.db, 'users', uid, 'settings', 'tariff'), config);
    }
    async getTariff(uid) {
        if (!this.db)
            throw new Error("DB not ready");
        const docRef = doc(this.db, 'users', uid, 'settings', 'tariff');
        const snap = await getDoc(docRef);
        return snap.exists() ? snap.data() : null;
    }
    // Settings: Tenants
    async saveTenants(uid, tenants) {
        if (!this.db)
            throw new Error("DB not ready");
        // Saving as a single document with array field for simplicity
        await setDoc(doc(this.db, 'users', uid, 'settings', 'tenants'), { list: tenants });
    }
    async getTenants(uid) {
        if (!this.db)
            throw new Error("DB not ready");
        const docRef = doc(this.db, 'users', uid, 'settings', 'tenants');
        const snap = await getDoc(docRef);
        return snap.exists() ? snap.data().list : [];
    }
    // Drafts
    async saveDraft(uid, draft) {
        if (!this.db)
            throw new Error("DB not ready");
        await setDoc(doc(this.db, 'users', uid, 'draft', 'current'), draft);
    }
    async getDraft(uid) {
        if (!this.db)
            throw new Error("DB not ready");
        const snap = await getDoc(doc(this.db, 'users', uid, 'draft', 'current'));
        return snap.exists() ? snap.data() : null;
    }
}
export const firebaseService = new FirebaseService();
