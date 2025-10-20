// Neutral authentication placeholder (no Firebase)

export const login = async (email, password) => {
  // Mock login for development — replace with real API later if needed
  console.log("Mock login:", email);
  return {
    user: {
      email,
      name: "Demo User",
    },
  };
};

export const signup = async (email, password) => {
  // Mock signup for development
  console.log("Mock signup:", email);
  return {
    user: {
      email,
      name: "New User",
    },
  };
};
