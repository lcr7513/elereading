import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { StudentProfile, BookEntry, ActivityData } from '../types';

// Collection references
const STUDENTS_COLLECTION = 'students';
const BOOKS_COLLECTION = 'books';
const ACTIVITIES_COLLECTION = 'activities';
const SETTINGS_COLLECTION = 'settings';

/**
 * Real-time listener for students collection
 */
export function subscribeToStudents(
  onUpdate: (students: StudentProfile[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    return onSnapshot(
      studentsRef,
      (snapshot) => {
        const studentsList: StudentProfile[] = [];
        snapshot.forEach((docSnap) => {
          studentsList.push({ ...docSnap.data() } as StudentProfile);
        });
        // Sort by student number or name
        studentsList.sort((a, b) => a.studentNumber - b.studentNumber);
        onUpdate(studentsList);
      },
      (error) => {
        console.error('Error subscribing to students:', error);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    console.error('Failed to setup students subscriber:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Real-time listener for a student's book entries
 */
export function subscribeToStudentBooks(
  studentId: string,
  onUpdate: (books: BookEntry[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const booksRef = collection(db, STUDENTS_COLLECTION, studentId, BOOKS_COLLECTION);
    return onSnapshot(
      booksRef,
      (snapshot) => {
        const booksList: BookEntry[] = [];
        snapshot.forEach((docSnap) => {
          booksList.push({ ...docSnap.data() } as BookEntry);
        });
        // Sort by date desc
        booksList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        onUpdate(booksList);
      },
      (error) => {
        console.error(`Error subscribing to books for student ${studentId}:`, error);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    console.error('Failed to setup books subscriber:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Real-time listener for a student's reading activities
 */
export function subscribeToStudentActivities(
  studentId: string,
  onUpdate: (activities: ActivityData[]) => void,
  onError?: (error: Error) => void
) {
  try {
    const activitiesRef = collection(db, STUDENTS_COLLECTION, studentId, ACTIVITIES_COLLECTION);
    return onSnapshot(
      activitiesRef,
      (snapshot) => {
        const activitiesList: ActivityData[] = [];
        snapshot.forEach((docSnap) => {
          activitiesList.push({ ...docSnap.data() } as ActivityData);
        });
        onUpdate(activitiesList);
      },
      (error) => {
        console.error(`Error subscribing to activities for student ${studentId}:`, error);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    console.error('Failed to setup activities subscriber:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Save or update a student profile
 */
export async function saveStudentToFirebase(student: StudentProfile): Promise<void> {
  const studentRef = doc(db, STUDENTS_COLLECTION, student.id);
  await setDoc(studentRef, student, { merge: true });
}

/**
 * Delete a student and their subcollections
 */
export async function deleteStudentFromFirebase(studentId: string): Promise<void> {
  // Delete subcollection documents first
  const booksRef = collection(db, STUDENTS_COLLECTION, studentId, BOOKS_COLLECTION);
  const bookSnaps = await getDocs(booksRef);
  for (const bDoc of bookSnaps.docs) {
    await deleteDoc(bDoc.ref);
  }

  const actRef = collection(db, STUDENTS_COLLECTION, studentId, ACTIVITIES_COLLECTION);
  const actSnaps = await getDocs(actRef);
  for (const aDoc of actSnaps.docs) {
    await deleteDoc(aDoc.ref);
  }

  // Delete main student document
  const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
  await deleteDoc(studentRef);
}

/**
 * Save or update a book entry for a student
 */
export async function saveBookToFirebase(studentId: string, book: BookEntry): Promise<void> {
  const bookRef = doc(db, STUDENTS_COLLECTION, studentId, BOOKS_COLLECTION, book.id);
  await setDoc(bookRef, book, { merge: true });
}

/**
 * Delete a book entry
 */
export async function deleteBookFromFirebase(studentId: string, bookId: string): Promise<void> {
  const bookRef = doc(db, STUDENTS_COLLECTION, studentId, BOOKS_COLLECTION, bookId);
  await deleteDoc(bookRef);
}

/**
 * Save or update an activity entry for a student
 */
export async function saveActivityToFirebase(studentId: string, activity: ActivityData): Promise<void> {
  const actRef = doc(db, STUDENTS_COLLECTION, studentId, ACTIVITIES_COLLECTION, activity.id);
  await setDoc(actRef, activity, { merge: true });
}

/**
 * Delete an activity entry
 */
export async function deleteActivityFromFirebase(studentId: string, activityId: string): Promise<void> {
  const actRef = doc(db, STUDENTS_COLLECTION, studentId, ACTIVITIES_COLLECTION, activityId);
  await deleteDoc(actRef);
}

/**
 * Seed initial sample data to Firebase if the database is empty
 */
export async function seedInitialDataIfEmpty(
  initialStudents: StudentProfile[],
  initialBooksByStudent: Record<string, BookEntry[]>,
  initialActivitiesByStudent: Record<string, ActivityData[]>
): Promise<boolean> {
  try {
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    const snapshot = await getDocs(studentsRef);
    
    if (snapshot.empty) {
      console.log('Firebase database is empty. Seeding initial student sample data...');
      for (const st of initialStudents) {
        await saveStudentToFirebase(st);
        
        const books = initialBooksByStudent[st.id] || [];
        for (const bk of books) {
          await saveBookToFirebase(st.id, bk);
        }
        
        const activities = initialActivitiesByStudent[st.id] || [];
        for (const act of activities) {
          await saveActivityToFirebase(st.id, act);
        }
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error seeding initial data:', error);
    return false;
  }
}

/**
 * Reset all data in Firebase with initial data
 */
export async function resetAllFirebaseData(
  initialStudents: StudentProfile[],
  initialBooksByStudent: Record<string, BookEntry[]>,
  initialActivitiesByStudent: Record<string, ActivityData[]>
): Promise<void> {
  const studentsRef = collection(db, STUDENTS_COLLECTION);
  const snapshot = await getDocs(studentsRef);
  
  for (const stDoc of snapshot.docs) {
    await deleteStudentFromFirebase(stDoc.id);
  }

  // Reseed
  for (const st of initialStudents) {
    await saveStudentToFirebase(st);
    
    const books = initialBooksByStudent[st.id] || [];
    for (const bk of books) {
      await saveBookToFirebase(st.id, bk);
    }
    
    const activities = initialActivitiesByStudent[st.id] || [];
    for (const act of activities) {
      await saveActivityToFirebase(st.id, act);
    }
  }
}
