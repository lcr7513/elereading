import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  UserPlus, 
  BookOpen, 
  Sparkles, 
  Settings, 
  Lock, 
  Copy, 
  Check, 
  X,
  AlertCircle,
  GraduationCap,
  Save,
  Users
} from 'lucide-react';
import { StudentProfile, GenreType } from '../types';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  currentStudentId: string;
  booksByStudent: Record<string, number>;
  onApproveStudent: (studentId: string) => void;
  onRejectStudent: (studentId: string, reason?: string) => void;
  onBatchApprove: () => void;
  onUpdateStudent: (student: StudentProfile) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudent: (studentId: string) => void;
  teacherPassword: string;
  onChangeTeacherPassword: (newPw: string) => void;
  onLogoutTeacher: () => void;
}

const GENRES: GenreType[] = [
  '동화·소설',
  '과학·수학',
  '위인·역사',
  '사회·문화',
  '시·동시',
  '예술·체육',
  '학습만화',
  '철학·인성',
  '기타'
];

const AVATARS = ['🌱', '📚', '🦁', '🚀', '🌟', '🎨', '🐯', '🦉', '🐬', '🏆', '🦄', '🐰', '🐼', '🦊'];

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  students,
  currentStudentId,
  booksByStudent,
  onApproveStudent,
  onRejectStudent,
  onBatchApprove,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudent,
  teacherPassword,
  onChangeTeacherPassword,
  onLogoutTeacher
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'settings'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number | 'all'>('all');
  
  // Password visibility map for each student
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Student Edit State
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<StudentProfile>>({});

  // Student Delete Confirmation State (In-app modal)
  const [studentToDelete, setStudentToDelete] = useState<StudentProfile | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Teacher Password Change State
  const [currentPwInput, setCurrentPwInput] = useState('');
  const [newPwInput, setNewPwInput] = useState('');
  const [newPwConfirm, setNewPwConfirm] = useState('');
  const [pwChangeMsg, setPwChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const pendingStudents = students.filter(s => s.status === 'pending');
  const approvedStudents = students.filter(s => s.status !== 'pending');

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyPassword = (id: string, pw?: string) => {
    if (!pw) return;
    navigator.clipboard.writeText(pw);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenEdit = (student: StudentProfile) => {
    setEditingStudent(student);
    setEditFormData({
      ...student,
      password: student.password || '123'
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editFormData.name) return;

    onUpdateStudent({
      ...editingStudent,
      ...(editFormData as StudentProfile)
    });
    setEditingStudent(null);
  };

  const handleChangeMasterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPwInput !== teacherPassword) {
      setPwChangeMsg({ type: 'error', text: '현재 교사 비밀번호가 일치하지 않습니다.' });
      return;
    }
    if (!newPwInput || newPwInput.length < 2) {
      setPwChangeMsg({ type: 'error', text: '새 비밀번호는 2자리 이상 입력해주세요.' });
      return;
    }
    if (newPwInput !== newPwConfirm) {
      setPwChangeMsg({ type: 'error', text: '새 비밀번호 확인이 일치하지 않습니다.' });
      return;
    }

    onChangeTeacherPassword(newPwInput);
    setPwChangeMsg({ type: 'success', text: '교사 관리자 비밀번호가 성공적으로 변경되었습니다!' });
    setCurrentPwInput('');
    setNewPwInput('');
    setNewPwConfirm('');
  };

  // Filtered Approved Students
  const filteredStudents = approvedStudents.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          `${st.grade}학년 ${st.classRoom}반`.includes(searchQuery);
    const matchesGrade = selectedGradeFilter === 'all' || st.grade === selectedGradeFilter;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 md:p-6 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 md:p-8 shadow-2xl border-2 border-amber-400 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  교사 관리자 센터
                </span>
                <span className="text-xs text-stone-500 font-bold">
                  선생님 로그인 상태
                </span>
              </div>
              <h3 className="font-jua text-2xl text-stone-900 mt-0.5">
                학급 학생 등록 승인 및 독서 계정 통합 관리
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => {
                onLogoutTeacher();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-stone-600 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 text-xs font-bold transition-colors"
            >
              교사 로그아웃
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className={`mt-3 p-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs transition-all ${
            notification.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
            notification.type === 'error' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
            'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-black/10 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-3 border-b border-stone-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('pending');
              setEditingStudent(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>신규 가입 승인 대기</span>
            {pendingStudents.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'pending' ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-500 text-white'
              }`}>
                {pendingStudents.length}명 대기
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              setEditingStudent(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>승인 완료 학생 목록 & 비밀번호 확인 ({approvedStudents.length}명)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setEditingStudent(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>교사 설정 & 비밀번호 변경</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* TAB 1: PENDING APPROVAL LIST */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-stone-800 text-sm">학생 신규 등록 신청 현황</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    학생이 독서 통장에 등록 신청한 내역입니다. 학생의 <b>학적 정보, 다짐, 비밀번호</b>를 확인 후 [승인] 버튼을 눌러주세요.
                  </p>
                </div>

                {pendingStudents.length > 1 && (
                  <button
                    type="button"
                    onClick={onBatchApprove}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>대기자 전체 일괄 승인 ({pendingStudents.length}명)</span>
                  </button>
                )}
              </div>

              {pendingStudents.length === 0 ? (
                <div className="py-12 text-center text-stone-400 space-y-3 bg-stone-50/50 rounded-3xl border-2 border-dashed border-stone-200">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 opacity-60" />
                  <h4 className="font-jua text-lg text-stone-700">현재 대기 중인 학생 등록 신청이 없습니다</h4>
                  <p className="text-xs text-stone-500">모든 신청이 승인되었거나 새로운 신청이 접수되면 이곳에 표시됩니다.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingStudents.map((st) => {
                    const isPwVisible = !!visiblePasswords[st.id];

                    return (
                      <div
                        key={st.id}
                        className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-xs">
                          승인 대기 중
                        </div>

                        <div>
                          {/* Student Header */}
                          <div className="flex items-center gap-3.5 mb-3.5">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-xs flex-shrink-0">
                              {st.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-jua text-xl text-stone-900">{st.name}</h4>
                                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                                  {st.grade}학년 {st.classRoom}반 {st.studentNumber}번
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 mt-0.5">{st.school}</p>
                              {st.appliedAt && (
                                <span className="text-[11px] text-stone-400">신청일: {st.appliedAt}</span>
                              )}
                            </div>
                          </div>

                          {/* Student Details & Password Card */}
                          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2 text-xs">
                            {/* Student Password Display Box */}
                            <div className="bg-amber-100/60 p-2.5 rounded-lg border border-amber-300 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-amber-700" />
                                <span className="font-bold text-amber-950">학생 설정 비밀번호:</span>
                                <span className="font-mono text-sm font-extrabold text-amber-900 bg-white px-2.5 py-0.5 rounded border border-amber-300">
                                  {isPwVisible ? st.password || '123' : '••••'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(st.id)}
                                  className="p-1 text-stone-500 hover:text-amber-800 hover:bg-amber-200/50 rounded"
                                  title={isPwVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                                >
                                  {isPwVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyPassword(st.id, st.password || '123')}
                                  className="p-1 text-stone-500 hover:text-amber-800 hover:bg-amber-200/50 rounded flex items-center gap-1"
                                  title="비밀번호 복사"
                                >
                                  {copiedId === st.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-stone-700">
                              <span className="font-semibold">목표 독서 권수:</span>
                              <span className="font-bold text-emerald-700">{st.targetCount}권</span>
                            </div>
                            <div className="flex items-center justify-between text-stone-700">
                              <span className="font-semibold">선호 분야:</span>
                              <span className="font-medium">{st.favoriteGenre}</span>
                            </div>
                            <div className="pt-1 border-t border-stone-200">
                              <span className="font-semibold text-stone-700 block mb-0.5">독서 다짐:</span>
                              <p className="text-[11px] text-stone-600 bg-white p-2 rounded border border-stone-200/80 leading-relaxed italic">
                                "{st.pledge}"
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onRejectStudent(st.id)}
                            className="flex-1 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>반려 (신청 취소)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onApproveStudent(st.id)}
                            className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-sm transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>승인 완료하기</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL APPROVED STUDENTS & PASSWORD MANAGEMENT */}
          {activeTab === 'all' && !editingStudent && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="학생 이름, 학교명, 학년/반 검색..."
                    className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-bold whitespace-nowrap flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-stone-400" />
                    학년 필터:
                  </span>
                  <select
                    value={selectedGradeFilter}
                    onChange={(e) => setSelectedGradeFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="all">전체 학년</option>
                    {[1, 2, 3, 4, 5, 6].map(g => (
                      <option key={g} value={g}>{g}학년</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Students Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((st) => {
                  const isCurrent = st.id === currentStudentId;
                  const isPwVisible = !!visiblePasswords[st.id];
                  const bookCount = booksByStudent[st.id] || 0;
                  const progressRate = Math.min(100, Math.round((bookCount / (st.targetCount || 50)) * 100));

                  return (
                    <div
                      key={st.id}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between bg-white ${
                        isCurrent
                          ? 'border-amber-400 shadow-md ring-2 ring-amber-300'
                          : 'border-stone-200 hover:border-amber-200'
                      }`}
                    >
                      <div>
                        {/* Student Name & Avatar */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-2xs flex-shrink-0">
                              {st.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-jua text-lg text-stone-900">{st.name}</h4>
                                {isCurrent && (
                                  <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                    현재 활성
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-500">{st.school}</p>
                              <p className="text-xs font-bold text-amber-800">
                                {st.grade}학년 {st.classRoom}반 {st.studentNumber}번
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Password Display Box for Teacher */}
                        <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 space-y-2 mb-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-950 flex items-center gap-1">
                              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                              학생 비밀번호:
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-extrabold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                                {isPwVisible ? st.password || '123' : '••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(st.id)}
                                className="p-1 text-stone-400 hover:text-amber-800"
                                title="비밀번호 보기"
                              >
                                {isPwVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyPassword(st.id, st.password || '123')}
                                className="p-1 text-stone-400 hover:text-amber-800"
                                title="비밀번호 복사"
                              >
                                {copiedId === st.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-stone-600 text-[11px]">
                            <span>독서 진행:</span>
                            <span className="font-bold text-emerald-700">{bookCount}권 / 목표 {st.targetCount}권 ({progressRate}%)</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            title="학생 정보 및 비밀번호 수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>수정</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setStudentToDelete(st)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            title="학생 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>삭제</span>
                          </button>
                        </div>

                        {!isCurrent ? (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectStudent(st.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-2xs transition-transform active:scale-95 cursor-pointer"
                          >
                            독서 통장 보기
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-lg">
                            선택됨
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EDIT FORM (When Teacher is editing a student) */}
          {activeTab === 'all' && editingStudent && (
            <form onSubmit={handleSaveEdit} className="bg-amber-50/50 p-6 rounded-3xl border-2 border-amber-300 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-600" />
                  <h4 className="font-jua text-lg text-stone-900">
                    '{editingStudent.name}' 학생 정보 및 비밀번호 수정
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">학교명</label>
                  <input
                    type="text"
                    required
                    value={editFormData.school || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, school: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">학생 이름</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-bold"
                  />
                </div>
                {/* Student Password Editable by Teacher */}
                <div>
                  <label className="block font-bold text-amber-900 mb-1 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>학생 비밀번호 변경</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.password || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm font-bold text-amber-950"
                    placeholder="학생 비밀번호"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">학년</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={editFormData.grade || 1}
                    onChange={(e) => setEditFormData({ ...editFormData, grade: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">반</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={editFormData.classRoom || 1}
                    onChange={(e) => setEditFormData({ ...editFormData, classRoom: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">번호</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={editFormData.studentNumber || 1}
                    onChange={(e) => setEditFormData({ ...editFormData, studentNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">목표 독서 권수 (권)</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={editFormData.targetCount || 50}
                    onChange={(e) => setEditFormData({ ...editFormData, targetCount: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">선호 분야</label>
                  <select
                    value={editFormData.favoriteGenre || '동화·소설'}
                    onChange={(e) => setEditFormData({ ...editFormData, favoriteGenre: e.target.value as GenreType })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-sm"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-stone-700 mb-1">독서 다짐</label>
                <textarea
                  rows={2}
                  value={editFormData.pledge || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, pledge: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setStudentToDelete(editingStudent)}
                  className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-100/70 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>이 학생 삭제</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>수정 내용 저장</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: TEACHER SETTINGS & MASTER PASSWORD CHANGE */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-6 py-2">
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs text-stone-700 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>교사 마스터 비밀번호 관리</span>
                </div>
                <p className="leading-relaxed">
                  교사 관리자 모드에 입장할 때 사용하는 비밀번호를 안전하게 변경할 수 있습니다.
                  학생들이 임의로 관리자 모드에 진입하지 못하도록 안전한 비밀번호를 설정해주세요.
                </p>
              </div>

              <form onSubmit={handleChangeMasterPassword} className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-xs space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    현재 교사 비밀번호 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPwInput}
                    onChange={(e) => setCurrentPwInput(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    새 교사 비밀번호 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newPwInput}
                    onChange={(e) => setNewPwInput(e.target.value)}
                    placeholder="새 비밀번호 입력 (2자리 이상)"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    새 비밀번호 확인 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newPwConfirm}
                    onChange={(e) => setNewPwConfirm(e.target.value)}
                    placeholder="새 비밀번호 다시 한 번 입력"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {pwChangeMsg && (
                  <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    pwChangeMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {pwChangeMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{pwChangeMsg.text}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-200 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all hover:scale-102 active:scale-98 flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>교사 비밀번호 변경 완료</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* In-App Student Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-7 shadow-2xl border-2 border-rose-400 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-jua text-xl text-stone-900">학생 독서 계정 삭제 확인</h4>
                <p className="text-xs text-rose-600 font-bold">삭제 후에는 복구할 수 없습니다</p>
              </div>
            </div>

            <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200 text-xs space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{studentToDelete.avatar}</span>
                <div>
                  <p className="font-bold text-stone-900 text-base">{studentToDelete.name}</p>
                  <p className="text-stone-600">
                    {studentToDelete.school} • {studentToDelete.grade}학년 {studentToDelete.classRoom}반 {studentToDelete.studentNumber}번
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-rose-200/80 text-stone-700 leading-relaxed">
                <p>
                  해당 학생의 <span className="font-bold text-rose-700">모든 독서 통장 기록({booksByStudent[studentToDelete.id] || 0}권)</span> 및 활동지 데이터가 완전히 삭제됩니다.
                </p>
                <p className="mt-1 font-bold text-stone-900">
                  정말 삭제하시겠습니까?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetName = studentToDelete.name;
                  const targetId = studentToDelete.id;
                  onDeleteStudent(targetId);
                  if (editingStudent?.id === targetId) {
                    setEditingStudent(null);
                  }
                  setStudentToDelete(null);
                  setNotification({
                    type: 'success',
                    message: `'${targetName}' 학생의 계정과 독서 기록이 성공적으로 삭제되었습니다.`
                  });
                  setTimeout(() => setNotification(null), 3500);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>네, 완전히 삭제합니다</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
