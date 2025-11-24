  // Course System module:
//  createCourse, editCourse, deleteCourse, getCourse, listCourses, getAnalytics, enrollUser, searchCoursesByCategory, incrementVisits
import { cleanupCourseData } from './progressSystem.js'; // Function to remove user related data (progress/certificates)
import { listUsers, updateUser } from "./userSystem.js"
const STORAGE_KEY_COURSES = "cp_courses_v1";

export let courseList = loadCourses() || [
  {
    id: 1,
    title: "Multimedia Basics",
    description: "Intro to multimedia",
    instructor: "Jana",
    students: [],
    categories: ["multimedia", "basics"], // replaced tags → categories
    visits: 0,
    price: 200,
    duration: "3 Weeks"
  },
  {
    id: 2,
    title: "Graphic Design",
    description: "Basics of GD",
    instructor: "Sama",
    students: [],
    categories: ["graphic", "design"], 
    visits: 0,
    price: 250,
    duration: "4 Weeks"
  }
];

function loadCourses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_COURSES)) || []; } catch (e) { return []; }
}

function saveCourses() {
  try { localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courseList)); } catch (e) { /*ignore*/ }
}

function _findCourseIndex(id) {
  return courseList.findIndex(c => c.id === id);
}

// NEW Helper Function: Generates the next available unique ID 
function _generateUniqueCourseId() {
  if (courseList.length === 0) {
    return 1;
  }
  // Find the max ID currently in the list and add 1
  const maxId = Math.max(...courseList.map(c => c.id));
  return maxId + 1;
}

// Create new course (MODIFIED)
export function createCourse(course) {
  // Removed the check for course.id in the incoming data
  if (!course || !course.title) {
    return null;
  }
  
  // No longer checking for existing ID, since we generate a unique one
  const newId = _generateUniqueCourseId(); 

  const newCourse = {
    ...course,
    id: newId, // Use the newly generated ID
    students: course.students || [],
    categories: course.categories || [],
    visits: course.visits || 0,
    price: course.price || 0,
    duration: course.duration || "N/A"
  };
  
  courseList.push(newCourse);
  saveCourses();
  return newCourse;
}

// Edit course
export function editCourse(id, data) {
  const idx = _findCourseIndex(id);
  if (idx === -1) {
    return null;
  }

  if (data.categories) {
    data.categories = Array.isArray(data.categories) ? data.categories : [];
    const oldCategories = courseList[idx].categories || [];
    data.categories = [...new Set([...oldCategories, ...data.categories])];
  }

  courseList[idx] = { ...courseList[idx], ...data };
  saveCourses();
  return courseList[idx];
}

// Delete course
export function deleteCourse(id) {
  const idx = _findCourseIndex(id);
  if (idx === -1) {
    return false;
  }
  const removed = courseList.splice(idx, 1)[0];
  saveCourses();
  return true;
}

// Get course
export function getCourse(id) {
  return courseList.find(c => c.id === id) || null;
}

//  List all courses
export function listCourses() {
  return courseList;
}

// Increment course visits
export function incrementVisits(courseId) {
  const c = getCourse(courseId);
  if (!c) {
    return null;
  }
  c.visits = (c.visits || 0) + 1;
  saveCourses();
  return c.visits;
}

//  Analytics: total courses, total enrollments, top visited
export function getAnalytics() {
  const totalCourses = courseList.length;
  const totalEnrollments = courseList.reduce((acc, c) => acc + (c.students?.length || 0), 0);
  const topCourses = [...courseList]
    .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
    .slice(0, 3);

  const topVisited = [...courseList]
    .sort((a, b) => (b.visits || 0) - (a.visits || 0))
    .slice(0, 3);

  const result = { totalCourses, totalEnrollments, topCourses, topVisited };
  return result;
}

// Enroll user
export function enrollUser(userId, courseId) {
  const c = getCourse(courseId);
  if (!c) {
    return false;
  }
  c.students = c.students || [];
  if (c.students.some(s => s[0] === userId)) { // Changed check to handle the array structure [userId, date]
    return false;
  }
  c.students.push([userId, new Date().toISOString()]); // Added ISOString for better format
  saveCourses();
  return true;
}

// Search courses by category
export function searchCoursesByCategory(category) {
  if (!category || typeof category !== "string") return [];
  return courseList.filter(c => c.categories && c.categories.includes(category));
}

//  Helper for testing/cleanup 
export function resetAllCourses() {
    courseList = [];
    localStorage.removeItem(STORAGE_KEY_COURSES);
}

/**
 * Handles the complete deletion of a course ensuring it's removed from both the 
 * course list and all associated user progress records
 * @param {number} courseId 
 * @returns {boolean} 
 */
export function courseDeletion(courseId) {
    const courseDeleted = deleteCourse(courseId); 

    if (!courseDeleted) return false;

    cleanupCourseData(courseId);

    const students = listUsers().filter(user => user.role === "student");
    console.log("Students to update:", students);

    students.forEach(student => {
        console.log(`Student ${student.id} courses:`, student.enrolledCourses);

        const remainingCourses = student.enrolledCourses.filter(course => String(course) !== String(courseId));

        updateUser(student, { enrolledCourses: remainingCourses });
        console.log(`Remaining courses for student ${student.id}:`, remainingCourses);
    });

    console.log(`Course ${courseId} is gone everywhere`);
    return true;
}


