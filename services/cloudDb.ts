
import { User, Progress, QuizAttempt } from '../types';

/**
 * تم تحديث الرابط برابط قاعدة بياناتك الفعلي الذي زودتني به:
 * https://burgernahw-default-rtdb.firebaseio.com/
 */
const FIREBASE_URL = "https://burgernahw-default-rtdb.firebaseio.com/"; 

const isUrlConfigured = () => {
  // التحقق من أن الرابط ليس الرابط الافتراضي
  return FIREBASE_URL && FIREBASE_URL.startsWith("https://") && !FIREBASE_URL.includes("your-project-name");
};

export const cloudService = {
  // جلب كل المستخدمين للوحة المتصدرين
  async fetchAllUsers(): Promise<Record<string, any>> {
    if (!isUrlConfigured()) return {};
    try {
      const response = await fetch(`${FIREBASE_URL}users.json`);
      if (!response.ok) throw new Error("Connection failed");
      const data = await response.json();
      return data || {};
    } catch (e) {
      console.warn("Offline mode - loading local leaderboard");
      const local = localStorage.getItem("hamburger_local_cache");
      return local ? JSON.parse(local) : {};
    }
  },

  // جلب بيانات مستخدم محدد عند الدخول
  async fetchUser(username: string): Promise<any | null> {
    if (!isUrlConfigured()) return null;
    try {
      const safeName = encodeURIComponent(username.trim());
      const response = await fetch(`${FIREBASE_URL}users/${safeName}.json`);
      if (!response.ok) return null;
      return await response.json();
    } catch (e) {
      return null;
    }
  },

  // حفظ التقدم سحابياً ومحلياً
  async saveUser(username: string, userData: any): Promise<boolean> {
    const payload = {
      ...userData,
      lastSync: new Date().toISOString()
    };

    // دائماً نحفظ محلياً أولاً لضمان عدم ضياع الجهد في حالة ضعف الإنترنت
    const localCache = localStorage.getItem("hamburger_local_cache") || "{}";
    const allLocal = JSON.parse(localCache);
    allLocal[username] = payload;
    localStorage.setItem("hamburger_local_cache", JSON.stringify(allLocal));

    if (!isUrlConfigured()) return false;

    try {
      const safeName = encodeURIComponent(username.trim());
      const response = await fetch(`${FIREBASE_URL}users/${safeName}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (e) {
      console.error("Firebase Sync Error:", e);
      return false;
    }
  }
};
