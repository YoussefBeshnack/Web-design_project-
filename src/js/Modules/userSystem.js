// User System module:
// register, login, logout, getRole, helpers

const STORAGE_KEY_USERS = "cp_users_v1";
const STORAGE_KEY_CURRENT = "cp_current_user_v1";

/**
 * Loads a value from LocalStorage and parses it as JSON.
 * @param {string} key - The LocalStorage key to load.
 * @returns {any|null} - Parsed data or null if not found/invalid.
 */
function loadFromStorage(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}

// Load users from LocalStorage
let users = loadFromStorage(STORAGE_KEY_USERS);
if (!users || users.length === 0) {
  // Only add default user if storage is empty
  users = [
    { id: 1, name: "Beshnack", email: "Beshbesh@test.com", password: "1234", role: "admin" },
    { id: 2, name: "Mazen", email: "Mazenhany@test.com", password: "12345", role: "admin" },
    { id: 3, name: "Eltony", email: "gigachad@teste.com", password: "1234", role: "admin" },
  ];
  saveUsers();
}

// Load current user
let currentUser = loadFromStorage(STORAGE_KEY_CURRENT) || null;

/**
 * Saves the users list to LocalStorage.
 * @returns {void}
 */
function saveUsers() {
  try { localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users)); } catch (e) {}
}

/**
 * Saves the currently logged user to LocalStorage.
 * @returns {void}
 */
function saveCurrent() {
  try { localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentUser)); } catch (e) {}
}

/**
 * Validates user registration data.
 * @param {object} userData - Data for the new user.
 * @param {string} userData.name - User's name.
 * @param {string} userData.email - User's email.
 * @param {string} userData.password - User's password.
 * @returns {string|null} - Error message if invalid, otherwise null.
 */
function _validateUserData(userData) {
  if (!userData) return "User data is required.";
  if (!userData.name) return "Name is required.";
  if (!userData.email) return "Email is required.";
  if (!userData.password) return "Password is required.";
  return null;
}

/**
 * Registers a new user and saves them to storage.
 *
 * @param {object} userData - New user details.
 * @param {string} userData.name - The user's name.
 * @param {string} userData.email - The user's email.
 * @param {string} userData.password - The user's password.
 * @param {string} [userData.role="student"] - Optional role.
 * @returns {{ok: boolean, user?: object, error?: string}}
 */
export function register(userData) {
  const v = _validateUserData(userData);
  if (v) return { ok: false, error: v };

  if (users.find(u => u.email === userData.email)) {
    return { ok: false, error: "Email already exists" };
  }

  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = {
    id,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || "student",
    enrolledCourses: [],
    lastActive: new Date()
  };

  users.push(newUser);
  saveUsers();

  return { ok: true, user: newUser };
}

/**
 * Logs a user into the system.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {boolean} - True if login successful.
 */
export function login(email, password) {
  if (!email || !password) return false;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return false;

  currentUser = { ...user };
  saveCurrent();
  return true;
}

/**
 * Logs out the currently logged in user.
 * @returns {void}
 */
export function logout() {
  if (!currentUser) return;
  currentUser = null;
  saveCurrent();
}

/**
 * Returns the role of the currently logged-in user.
 * @returns {string|null} - User role or null if no user logged in.
 */
export function getRole() {
  return currentUser?.role || null;
}

/**
 * Returns the currently logged-in user object.
 * @returns {object|null} - Current user or null.
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Gets a user object by ID.
 *
 * @param {number|string} userID - The user's ID.
 * @returns {object|undefined} - The user if found.
 */
export function getUser(userID) {
  return users.find(v => v.id == parseInt(userID));
}

/**
 * Returns the full list of users (for admin panel).
 * @returns {object[]} - Array of all users.
 */
export function listUsers() {
  return users;
}

/**
 * Updates user information both in the users array and in currentUser.
 *
 * @param {object} userToUpdate - Existing user object.
 * @param {object} newData - Updated fields to apply.
 * @returns {{ok: boolean, user?: object, error?: string}}
 */
export function updateUser(userToUpdate, newData) {
  if (!userToUpdate || !newData) {
    return { ok: false, error: "Missing user or new data." };
  }

  if (Object.keys(newData).length === 0) {
    return { ok: false, error: "New data object is empty" };
  }

  const userIndex = users.findIndex(u => u.id === userToUpdate.id);
  if (userIndex === -1) return { ok: false, error: "User not found." };

  const updatedUser = {
    ...users[userIndex],
    ...newData
  };

  users[userIndex] = updatedUser;
  saveUsers();

  if (currentUser?.role === "student") {
    currentUser = { ...updatedUser };
    saveCurrent();
  }

  return { ok: true, user: currentUser };
}

/**
 * Removes a deleted course ID from all user enrollment lists.
 *
 * @param {number} courseId - The ID of the deleted course.
 * @returns {void}
 */
export function cleanupUserEnrollments(courseId) {
  let updated = false;

  users.forEach(user => {
    user.enrolledCourses = user.enrolledCourses || [];

    const initialLength = user.enrolledCourses.length;
    user.enrolledCourses = user.enrolledCourses.filter(id => id !== courseId);

    if (user.enrolledCourses.length < initialLength) {
      updated = true;
    }
  });

  if (updated) saveUsers();
}
