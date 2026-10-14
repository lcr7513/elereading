import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookEntry, 
  ActivityData, 
  StudentProfile 
} from './types';
import { 
  initialStudents,
  initialBooksByStudent, 
  initialActivitiesByStudent,
  initialBooks,
  initialActivities
} from './data/initialData';
import { Header } from './components/Header';
import { ProfileSection } from './components/ProfileSection';
import { ReadingBankbook } from './components/ReadingBankbook';
import { ActivityWorksheetView } from './components/ActivityWorksheetView';
import { ActivityEditorModal } from './components/ActivityEditorModal';
import { StudentManagerModal } from './components/StudentManagerModal';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { ReadingTree } from './components/ReadingTree';
import { ReadingAnalytics } from './components/ReadingAnalytics';
import { PrintablePortfolio } from './components/PrintablePortfolio';
import { FirebaseStatusModal } from './components/FirebaseStatusModal';
import { ShareAppModal } from './components/ShareAppModal';
import { InstallPwaPrompt } from './components/InstallPwaPrompt';
import { CheckoutModal } from './components/CheckoutModal';
import { AiReviewModal } from './components/AiReviewModal';
import { BrochureModal } from './components/BrochureModal';
import { getMembership, saveMembership } from './services/membershipService';
import { MembershipStatus } from './types';
import {
  subscribeToStudents,
  subscribeToStudentBooks,
  subscribeToStudentActivities,
  saveStudentToFirebase,
  deleteStudentFromFirebase,
  saveBookToFirebase,
  deleteBookFromFirebase,
  saveActivityToFirebase,
  deleteActivityFromFirebase,
  seedInitialDataIfEmpty,
  resetAllFirebaseData
} from './services/firebaseService';
import { 
  Trash2, 
  BookOpen, 
  Sparkles, 
  TreePine, 
  PieChart, 
  GraduationCap, 
  PlusCircle, 
  Printer 
} from 'lucide-react';

export default function App() {
  // 1. Teacher Authentication & Password State
  const [teacherPassword, setTeacherPassword] = useState<string>(() => {
    return localStorage.getItem('edutrack_teacher_password') || '1234';
  });

  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('edutrack_teacher_logged_in') === 'true';
  });

  const [isTeacherLoginModalOpen, setIsTeacherLoginModalOpen] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isFirebaseStatusOpen, setIsFirebaseStatusOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [selectedAiActivity, setSelectedAiActivity] = useState<ActivityData | null>(null);

  // Membership & Commercial Tier State
  const [membership, setMembership] = useState<MembershipStatus>(() => getMembership());

  // Cloud Sync State
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // 2. Students List
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('edutrack_students_list');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return initialStudents;
  });

  // 3. Active Student ID
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    const saved = localStorage.getItem('edutrack_current_student_id');
    if (saved) return saved;
    return initialStudents[0].id;
  });

  // 4. Books & Activities per Student
  const [booksByStudent, setBooksByStudent] = useState<Record<string, BookEntry[]>>(() => {
    const saved = localStorage.getItem('edutrack_books_by_student');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialBooksByStudent;
  });

  const [activitiesByStudent, setActivitiesByStudent] = useState<Record<string, ActivityData[]>>(() => {
    const saved = localStorage.getItem('edutrack_activities_by_student');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialActivitiesByStudent;
  });

  // Setup Firebase Real-time listeners & Initial seeding
  useEffect(() => {
    let unsubscribeStudents: (() => void) | undefined;

    const initFirebase = async () => {
      try {
        setIsCloudSyncing(true);
        // Seed initial data if Firestore database is empty
        await seedInitialDataIfEmpty(initialStudents, initialBooksByStudent, initialActivitiesByStudent);

        // Subscribe to students collection in realtime
        unsubscribeStudents = subscribeToStudents(
          (cloudStudents) => {
            if (cloudStudents && cloudStudents.length > 0) {
              setStudents(cloudStudents);
              setLastSyncedAt(new Date());
              setSyncError(null);
            }
          },
          (err) => {
            console.warn('Firebase sync note:', err);
            setSyncError('클라우드 DB 동기화 대기 중');
          }
        );
      } catch (err: any) {
        console.error('Firebase init error:', err);
      } finally {
        setIsCloudSyncing(false);
      }
    };

    initFirebase();

    return () => {
      if (unsubscribeStudents) unsubscribeStudents();
    };
  }, []);

  // Real-time listener for current student's books and activities
  useEffect(() => {
    if (!currentStudentId) return;

    const unsubBooks = subscribeToStudentBooks(
      currentStudentId,
      (cloudBooks) => {
        setBooksByStudent((prev) => ({
          ...prev,
          [currentStudentId]: cloudBooks
        }));
        setLastSyncedAt(new Date());
      }
    );

    const unsubActs = subscribeToStudentActivities(
      currentStudentId,
      (cloudActs) => {
        setActivitiesByStudent((prev) => ({
          ...prev,
          [currentStudentId]: cloudActs
        }));
        setLastSyncedAt(new Date());
      }
    );

    return () => {
      unsubBooks();
      unsubActs();
    };
  }, [currentStudentId]);

  // Active student profile, books, and activities
  const currentProfile: StudentProfile = useMemo(() => {
    const found = students.find(s => s.id === currentStudentId);
    if (found) return found;
    const approved = students.find(s => s.status !== 'pending');
    return approved || students[0] || initialStudents[0];
  }, [students, currentStudentId]);

  const books: BookEntry[] = useMemo(() => {
    return booksByStudent[currentProfile.id] || [];
  }, [booksByStudent, currentProfile.id]);

  const activities: ActivityData[] = useMemo(() => {
    return activitiesByStudent[currentProfile.id] || [];
  }, [activitiesByStudent, currentProfile.id]);

  // Book counts map
  const booksCountByStudent = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach(st => {
      map[st.id] = (booksByStudent[st.id] || []).length;
    });
    return map;
  }, [students, booksByStudent]);

  // Pending students count
  const pendingStudentsCount = useMemo(() => {
    return students.filter(s => s.status === 'pending').length;
  }, [students]);

  // Tab & Modal State
  const [activeTab, setActiveTab] = useState<string>('bankbook');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isStudentManagerOpen, setIsStudentManagerOpen] = useState(false);
  const [selectedBookForActivity, setSelectedBookForActivity] = useState<BookEntry | undefined>();
  const [editingActivity, setEditingActivity] = useState<ActivityData | null>(null);

  // Sync to LocalStorage (Offline & Fast Startup Cache)
  useEffect(() => {
    localStorage.setItem('edutrack_students_list', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edutrack_current_student_id', currentStudentId);
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem('edutrack_books_by_student', JSON.stringify(booksByStudent));
  }, [booksByStudent]);

  useEffect(() => {
    localStorage.setItem('edutrack_activities_by_student', JSON.stringify(activitiesByStudent));
  }, [activitiesByStudent]);

  useEffect(() => {
    localStorage.setItem('edutrack_teacher_password', teacherPassword);
  }, [teacherPassword]);

  useEffect(() => {
    localStorage.setItem('edutrack_teacher_logged_in', isTeacherLoggedIn ? 'true' : 'false');
  }, [isTeacherLoggedIn]);

  // Teacher Auth Handlers
  const handleTeacherLoginSuccess = () => {
    setIsTeacherLoggedIn(true);
    setIsTeacherDashboardOpen(true);
  };

  const handleLogoutTeacher = () => {
    setIsTeacherLoggedIn(false);
    setIsTeacherDashboardOpen(false);
  };

  const handleChangeTeacherPassword = (newPw: string) => {
    setTeacherPassword(newPw);
  };

  // Student Approval Handlers
  const handleApproveStudent = async (studentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const target = students.find(s => s.id === studentId);
    if (target) {
      const updated: StudentProfile = {
        ...target,
        status: 'approved',
        approvedAt: today
      };
      setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
      saveStudentToFirebase(updated).catch(console.error);
    }
  };

  const handleRejectStudent = async (studentId: string, reason?: string) => {
    const target = students.find(s => s.id === studentId);
    if (target) {
      const updated: StudentProfile = {
        ...target,
        status: 'rejected',
        rejectReason: reason || '신청 정보 불일치'
      };
      setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
      saveStudentToFirebase(updated).catch(console.error);
    }
  };

  const handleBatchApprove = async () => {
    const today = new Date().toISOString().split('T')[0];
    const updatedList = students.map(s => {
      if (s.status === 'pending') {
        const up: StudentProfile = {
          ...s,
          status: 'approved',
          approvedAt: today
        };
        saveStudentToFirebase(up).catch(console.error);
        return up;
      }
      return s;
    });
    setStudents(updatedList);
  };

  // Student Management Handlers
  const handleSelectStudent = (studentId: string) => {
    setCurrentStudentId(studentId);
  };

  const handleAddStudent = async (newStudentData: Omit<StudentProfile, 'id'>, isTeacher?: boolean) => {
    const newId = `student-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newStudent: StudentProfile = {
      ...newStudentData,
      id: newId,
      status: isTeacher ? 'approved' : 'pending',
      appliedAt: today,
      approvedAt: isTeacher ? today : undefined,
    };
    
    setStudents(prev => [...prev, newStudent]);
    setBooksByStudent(prev => ({
      ...prev,
      [newId]: []
    }));
    setActivitiesByStudent(prev => ({
      ...prev,
      [newId]: []
    }));
    if (isTeacher) {
      setCurrentStudentId(newId);
    }

    // Save to Firebase
    saveStudentToFirebase(newStudent).catch(console.error);
  };

  const handleUpdateStudent = async (updatedStudent: StudentProfile) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
    saveStudentToFirebase(updatedStudent).catch(console.error);
  };

  const handleDeleteStudent = async (studentId: string) => {
    setStudents(prev => {
      const remaining = prev.filter(s => s.id !== studentId);
      if (remaining.length === 0) {
        const fallbackStudent: StudentProfile = {
          id: `student-${Date.now()}`,
          name: '새 학생',
          school: '서울초등학교',
          grade: 3,
          classRoom: 1,
          studentNumber: 1,
          avatar: '🌱',
          targetCount: 30,
          favoriteGenre: '동화·소설',
          motto: '책과 함께 꿈을 키워요!',
          pledge: '매일 즐겁게 책을 읽고 생각을 넓히겠습니다.',
          startDate: new Date().toISOString().split('T')[0],
          status: 'approved',
          password: '123'
        };
        setCurrentStudentId(fallbackStudent.id);
        saveStudentToFirebase(fallbackStudent).catch(console.error);
        return [fallbackStudent];
      } else {
        if (currentStudentId === studentId) {
          const nextApproved = remaining.find(s => s.status !== 'pending') || remaining[0];
          setCurrentStudentId(nextApproved.id);
        }
        return remaining;
      }
    });

    setBooksByStudent(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });

    setActivitiesByStudent(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });

    // Delete in Firebase
    deleteStudentFromFirebase(studentId).catch(console.error);
  };

  // Book Handlers (for current student)
  const handleAddBook = async (newBookData: Omit<BookEntry, 'id' | 'hasActivity'>) => {
    const newBook: BookEntry = {
      ...newBookData,
      id: `book-${Date.now()}`,
      hasActivity: false,
    };
    
    setBooksByStudent(prev => ({
      ...prev,
      [currentProfile.id]: [newBook, ...(prev[currentProfile.id] || [])]
    }));

    // Save to Firebase
    saveBookToFirebase(currentProfile.id, newBook).catch(console.error);
  };

  const handleUpdateBook = async (updatedBook: BookEntry) => {
    setBooksByStudent(prev => ({
      ...prev,
      [currentProfile.id]: (prev[currentProfile.id] || []).map(b => 
        b.id === updatedBook.id ? updatedBook : b
      )
    }));

    // Save to Firebase
    saveBookToFirebase(currentProfile.id, updatedBook).catch(console.error);
  };

  const handleDeleteBook = async (id: string) => {
    setBooksByStudent(prev => ({
      ...prev,
      [currentProfile.id]: (prev[currentProfile.id] || []).filter(b => b.id !== id)
    }));
    setActivitiesByStudent(prev => ({
      ...prev,
      [currentProfile.id]: (prev[currentProfile.id] || []).filter(a => a.bookId !== id)
    }));

    // Delete from Firebase
    deleteBookFromFirebase(currentProfile.id, id).catch(console.error);
  };

  // Activity Handlers (for current student)
  const handleOpenActivityForBook = (book: BookEntry) => {
    const existing = activities.find(a => a.bookId === book.id);
    if (existing) {
      setActiveTab('worksheet');
    } else {
      setSelectedBookForActivity(book);
      setEditingActivity(null);
      setIsActivityModalOpen(true);
    }
  };

  const handleOpenCreateActivity = (book?: BookEntry) => {
    setSelectedBookForActivity(book || (books.length > 0 ? books[0] : undefined));
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (activity: ActivityData) => {
    const targetBook = books.find(b => b.id === activity.bookId);
    setSelectedBookForActivity(targetBook);
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = async (activityData: ActivityData) => {
    setActivitiesByStudent(prev => {
      const currentList = prev[currentProfile.id] || [];
      const exists = currentList.some(a => a.id === activityData.id);
      const updatedList = exists 
        ? currentList.map(a => (a.id === activityData.id ? activityData : a))
        : [activityData, ...currentList];
      return {
        ...prev,
        [currentProfile.id]: updatedList
      };
    });

    // Mark corresponding book as hasActivity
    setBooksByStudent(prev => {
      const currentList = prev[currentProfile.id] || [];
      const updatedBooks = currentList.map(b => {
        if (b.id === activityData.bookId) {
          const updatedB = { ...b, hasActivity: true, activityId: activityData.id };
          saveBookToFirebase(currentProfile.id, updatedB).catch(console.error);
          return updatedB;
        }
        return b;
      });
      return {
        ...prev,
        [currentProfile.id]: updatedBooks
      };
    });

    // Save to Firebase
    saveActivityToFirebase(currentProfile.id, activityData).catch(console.error);

    setActiveTab('worksheet');
  };

  const handleDeleteActivity = async (id: string) => {
    const targetAct = activities.find(a => a.id === id);
    setActivitiesByStudent(prev => ({
      ...prev,
      [currentProfile.id]: (prev[currentProfile.id] || []).filter(a => a.id !== id)
    }));

    if (targetAct) {
      setBooksByStudent(prev => ({
        ...prev,
        [currentProfile.id]: (prev[currentProfile.id] || []).map(b => {
          if (b.id === targetAct.bookId) {
            const upB = { ...b, hasActivity: false, activityId: undefined };
            saveBookToFirebase(currentProfile.id, upB).catch(console.error);
            return upB;
          }
          return b;
        })
      }));
    }

    // Delete in Firebase
    deleteActivityFromFirebase(currentProfile.id, id).catch(console.error);
  };

  // Reset to initial sample data
  const handleResetData = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmResetData = async () => {
    setStudents(initialStudents);
    setCurrentStudentId(initialStudents[0].id);
    setBooksByStudent(initialBooksByStudent);
    setActivitiesByStudent(initialActivitiesByStudent);
    setTeacherPassword('1234');
    
    localStorage.removeItem('edutrack_students_list');
    localStorage.removeItem('edutrack_current_student_id');
    localStorage.removeItem('edutrack_books_by_student');
    localStorage.removeItem('edutrack_activities_by_student');
    localStorage.removeItem('edutrack_reading_profile');
    localStorage.removeItem('edutrack_reading_books');
    localStorage.removeItem('edutrack_reading_activities');
    localStorage.removeItem('edutrack_teacher_password');
    
    setIsResetConfirmOpen(false);

    // Reset cloud data as well
    resetAllFirebaseData(initialStudents, initialBooksByStudent, initialActivitiesByStudent).catch(console.error);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-stone-800">
      {/* Top Header & Tab Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={currentProfile}
        books={books}
        totalStudentsCount={students.length}
        pendingStudentsCount={pendingStudentsCount}
        isTeacherLoggedIn={isTeacherLoggedIn}
        onOpenAddModal={() => setIsAddBookModalOpen(true)}
        onOpenStudentManager={() => setIsStudentManagerOpen(true)}
        onOpenTeacherLogin={() => setIsTeacherLoginModalOpen(true)}
        onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        onOpenFirebaseStatus={() => setIsFirebaseStatusOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onResetData={handleResetData}
        onTriggerPrint={() => setActiveTab('print')}
        isCloudSyncing={isCloudSyncing}
        membership={membership}
        onOpenCheckout={() => setIsCheckoutModalOpen(true)}
        onOpenBrochure={() => setIsBrochureModalOpen(true)}
      />

      {/* Main Content Sections with mobile bottom navigation offset padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 md:pb-10 space-y-4 sm:space-y-6">
        {activeTab === 'bankbook' && (
          <div className="space-y-6">
            <ReadingBankbook
              profile={currentProfile}
              books={books}
              onAddBook={handleAddBook}
              onUpdateBook={handleUpdateBook}
              onDeleteBook={handleDeleteBook}
              onOpenActivityForBook={handleOpenActivityForBook}
              isAddModalOpen={isAddBookModalOpen}
              setIsAddModalOpen={setIsAddBookModalOpen}
            />
          </div>
        )}

        {activeTab === 'worksheet' && (
          <ActivityWorksheetView
            profile={currentProfile}
            books={books}
            activities={activities}
            onOpenCreate={handleOpenCreateActivity}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
            onOpenAiReview={(act) => setSelectedAiActivity(act)}
          />
        )}

        {activeTab === 'tree' && (
          <ReadingTree
            profile={currentProfile}
            books={books}
            onOpenAddModal={() => setIsAddBookModalOpen(true)}
          />
        )}

        {activeTab === 'stats' && (
          <ReadingAnalytics
            profile={currentProfile}
            books={books}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            profile={currentProfile}
            students={students}
            onUpdateProfile={handleUpdateStudent}
            onSelectStudent={handleSelectStudent}
            onOpenAddStudentModal={() => setIsStudentManagerOpen(true)}
            onDeleteStudent={handleDeleteStudent}
            booksByStudentCount={booksCountByStudent}
            totalBooksRead={books.length}
            isTeacherLoggedIn={isTeacherLoggedIn}
            onOpenTeacherLogin={() => setIsTeacherLoginModalOpen(true)}
            onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
            onApproveStudent={handleApproveStudent}
            onRejectStudent={handleRejectStudent}
          />
        )}

        {activeTab === 'print' && (
          <PrintablePortfolio
            profile={currentProfile}
            books={books}
            activities={activities}
            onBack={() => setActiveTab('bankbook')}
          />
        )}
      </main>

      {/* Student Manager Modal (Switcher & Registration) */}
      <StudentManagerModal
        isOpen={isStudentManagerOpen}
        onClose={() => setIsStudentManagerOpen(false)}
        students={students}
        currentStudentId={currentProfile.id}
        booksCountByStudent={booksCountByStudent}
        onSelectStudent={handleSelectStudent}
        onAddStudent={handleAddStudent}
        isTeacherLoggedIn={isTeacherLoggedIn}
        onOpenTeacherLogin={() => {
          setIsStudentManagerOpen(false);
          setIsTeacherLoginModalOpen(true);
        }}
        membership={membership}
        onOpenCheckout={() => {
          setIsStudentManagerOpen(false);
          setIsCheckoutModalOpen(true);
        }}
      />

      {/* Teacher Login Modal */}
      <TeacherLoginModal
        isOpen={isTeacherLoginModalOpen}
        onClose={() => setIsTeacherLoginModalOpen(false)}
        teacherPassword={teacherPassword}
        onLoginSuccess={handleTeacherLoginSuccess}
      />

      {/* Teacher Dashboard Modal */}
      <TeacherDashboardModal
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
        students={students}
        currentStudentId={currentProfile.id}
        booksByStudent={booksCountByStudent}
        onApproveStudent={handleApproveStudent}
        onRejectStudent={handleRejectStudent}
        onBatchApprove={handleBatchApprove}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
        onSelectStudent={handleSelectStudent}
        teacherPassword={teacherPassword}
        onChangeTeacherPassword={handleChangeTeacherPassword}
        onLogoutTeacher={handleLogoutTeacher}
      />

      {/* Activity Editor Modal */}
      <ActivityEditorModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        book={selectedBookForActivity}
        existingActivity={editingActivity}
        books={books}
        profile={currentProfile}
      />

      {/* Firebase Real-time DB Status Modal */}
      <FirebaseStatusModal
        isOpen={isFirebaseStatusOpen}
        onClose={() => setIsFirebaseStatusOpen(false)}
        isSyncing={isCloudSyncing}
        lastSyncedAt={lastSyncedAt}
        syncError={syncError}
      />

      {/* Footer (No Print) */}
      <footer className="bg-white border-t border-amber-200 py-6 text-center text-xs text-stone-500 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-bold text-stone-700">
            초등학생 독서 기록장 • 에듀트랙(EduTrack) 교육 표준 양식
          </p>
          <p className="text-stone-400">
            Google Cloud Firestore 실시간 연동 • 학생 신규 등록 신청 & 비밀번호 설정 • 교사 비밀번호 인증 및 관리자 모드 • 학생 신청 승인/반려 및 비밀번호 확인/편집 • 9가지 창의 독후 활동 워크시트
          </p>
        </div>
      </footer>

      {/* Data Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-300 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-jua text-lg text-stone-900">샘플 데이터로 초기화</h4>
                <p className="text-xs text-rose-600 font-bold">모든 데이터가 삭제됩니다</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
              모든 학생, 독서 기록, 활동지 데이터가 삭제되고 처음 5명의 예시 샘플 학생 데이터로 완전히 초기화됩니다.<br/><br/>
              정말 초기화하시겠습니까?
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmResetData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                초기화하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share / Open Mobile QR Modal */}
      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Commercial License / Payment Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        currentMembership={membership}
        onMembershipUpdated={(newStatus) => setMembership(newStatus)}
      />

      {/* 1-Page School Proposal Brochure (Printable A4) */}
      <BrochureModal
        isOpen={isBrochureModalOpen}
        onClose={() => setIsBrochureModalOpen(false)}
        onOpenCheckout={() => {
          setIsBrochureModalOpen(false);
          setIsCheckoutModalOpen(true);
        }}
      />

      {/* AI Tutor & Proofreading Review Modal */}
      {selectedAiActivity && (
        <AiReviewModal
          isOpen={!!selectedAiActivity}
          onClose={() => setSelectedAiActivity(null)}
          activity={selectedAiActivity}
          membership={membership}
          onOpenUpgradeModal={() => setIsCheckoutModalOpen(true)}
        />
      )}

      {/* PWA Mobile App Install Banner / Instructions */}
      <InstallPwaPrompt />

      {/* Mobile Floating Action Button (FAB) for fast book record */}
      <div className="md:hidden fixed bottom-20 right-4 z-40 no-print">
        <button
          type="button"
          onClick={() => setIsAddBookModalOpen(true)}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xl flex items-center justify-center active:scale-90 transition-transform border-2 border-white/80 cursor-pointer"
          title="새 책 기록하기"
          aria-label="새 책 기록하기"
        >
          <PlusCircle className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar (Native App Style, Thumb-friendly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200 shadow-xl safe-bottom no-print">
        <div className="grid grid-cols-5 h-15 items-center px-1">
          <button
            type="button"
            onClick={() => setActiveTab('bankbook')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'bankbook' ? 'text-orange-600 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className={`w-5 h-5 transition-transform ${activeTab === 'bankbook' ? 'scale-115 text-orange-600' : ''}`} />
            <span className="text-[10px] mt-0.5 font-medium">독서통장</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('worksheet')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'worksheet' ? 'text-orange-600 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className={`w-5 h-5 transition-transform ${activeTab === 'worksheet' ? 'scale-115 text-orange-600' : ''}`} />
            <span className="text-[10px] mt-0.5 font-medium">독후활동</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tree')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'tree' ? 'text-orange-600 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <TreePine className={`w-5 h-5 transition-transform ${activeTab === 'tree' ? 'scale-115 text-orange-600' : ''}`} />
            <span className="text-[10px] mt-0.5 font-medium">독서나무</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'stats' ? 'text-orange-600 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <PieChart className={`w-5 h-5 transition-transform ${activeTab === 'stats' ? 'scale-115 text-orange-600' : ''}`} />
            <span className="text-[10px] mt-0.5 font-medium">독서분석</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'profile' ? 'text-orange-600 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <GraduationCap className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-115 text-orange-600' : ''}`} />
            <span className="text-[10px] mt-0.5 font-medium">학생관리</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
