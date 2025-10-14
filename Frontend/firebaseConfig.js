// Neutral Firebase Config Replacement
// This mock preserves structure without any Firebase dependency.

export const auth = {
  currentUser: null,
  // Mock sign-in, sign-out, and user state handlers for future integration
  signIn: async () => {
    console.warn("Firebase Auth removed — replace with your API auth logic.");
  },
  signOut: async () => {
    console.warn("Firebase Auth removed — replace with your API auth logic.");
  },
  onAuthStateChanged: (callback) => {
    console.warn("Firebase listener removed — implement custom user session tracking.");
    callback(null);
    return () => {};
  },
};

export default {
  initialize: () => console.log("Firebase removed — ready for custom backend integration."),
};
