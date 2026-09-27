import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  Check, 
  Edit3, 
  Trash2, 
  Target, 
  Heart, 
  Sparkles,
  X,
  BookOpen,
  KeyRound,
  Eye,
  EyeOff,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { StudentProfile, GenreType } from '../types';

interface StudentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  currentStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onAddStudent: (newStudent: Omit<StudentProfile, 'id'>, isTeacher?: boolean) => void;
  onUpdateStudent: (updated: StudentProfile) => void;
  onDeleteStudent: (studentId: string) => void;
  booksByStudent: Record<string, number>;
  isTeacherLoggedIn: boolean;
  onOpenTeacherLogin: () => void;
  onOpenTeacherDashboard: () => void;
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

export const StudentManagerModal: React.FC<StudentManagerModalProps> = ({
  isOpen,
  onClose,
  students,
  currentStudentId,
  onSelectStudent,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  booksByStudent,
  isTeacherLoggedIn,
  onOpenTeacherLogin,
  onOpenTeacherDashboard
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Omit<StudentProfile, 'id'>>({
    school: '은빛초등학교',
    grade: 3,
    classRoom: 2,
    studentNumber: 1,
    name: '',
    password: '',
    status: 'pending',
    targetCount: 50,
    pledge: '매일 즐겁게 책을 읽으며 따뜻한 마음과 지혜를 키우겠습니다!',
    favoriteGenre: '동화·소설',
    motto: '책 속에 나의 꿈과 보물이 가득해요 ✨',
    startDate: new Date().toISOString().split('T')[0],
    avatar: '🌱',
  });

  // Delete confirmation state
  const [studentToDelete, setStudentToDelete] = useState<StudentProfile | null>(null);
  const [modalAlert, setModalAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  if (!isOpen) return null;

  const pendingCount = students.filter(s => s.status === 'pending').length;

  const handleOpenAdd = () => {
    setFormData({
      school: students[0]?.school || '은빛초등학교',
      grade: 3,
      classRoom: 2,
      studentNumber: students.length + 1,
      name: '',
      password: '',
      status: isTeacherLoggedIn ? 'approved' : 'pending',
      targetCount: 50,
      pledge: '매일 꾸준히 책을 읽고 생각을 넓히겠습니다!',
      favoriteGenre: '동화·소설',
      motto: '즐거운 독서가 나의 멋진 미래를 만든다 📚',
      startDate: new Date().toISOString().split('T')[0],
      avatar: AVATARS[(students.length) % AVATARS.length],
    });
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setSubmitNotice(null);
    setModalAlert(null);
    setViewMode('add');
  };

  const handleOpenEdit = (student: StudentProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingStudent(student);
    setFormData({
      school: student.school,
      grade: student.grade,
      classRoom: student.classRoom,
      studentNumber: student.studentNumber,
      name: student.name,
      password: student.password || '',
      status: student.status || 'approved',
      targetCount: student.targetCount,
      pledge: student.pledge,
      favoriteGenre: student.favoriteGenre,
      motto: student.motto,
      startDate: student.startDate,
      avatar: student.avatar,
    });
    setConfirmPassword(student.password || '');
    setShowPassword(false);
    setSubmitNotice(null);
    setModalAlert(null);
    setViewMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setModalAlert({ type: 'error', message: '학생 이름을 입력해 주세요.' });
      return;
    }

    if (viewMode === 'add') {
      if (!formData.password || formData.password.trim().length < 2) {
        setModalAlert({ type: 'error', message: '학생 비밀번호를 2자리 이상 설정해 주세요.' });
        return;
      }
      if (formData.password !== confirmPassword) {
        setModalAlert({ type: 'error', message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
        return;
      }

      onAddStudent(formData, isTeacherLoggedIn);
      if (!isTeacherLoggedIn) {
        setSubmitNotice(`'${formData.name}' 학생의 독서통장 등록 신청이 완료되었습니다! 담임 선생님의 승인 후 바로 이용하실 수 있습니다.`);
      }
      setViewMode('list');
      setModalAlert({
        type: 'success',
        message: isTeacherLoggedIn
          ? `'${formData.name}' 학생이 즉시 등록되었습니다.`
          : `'${formData.name}' 학생의 등록 신청이 접수되었습니다.`
      });
      setTimeout(() => setModalAlert(null), 3500);
    } else if (viewMode === 'edit' && editingStudent) {
      onUpdateStudent({
        ...formData,
        id: editingStudent.id,
      });
      setViewMode('list');
      setModalAlert({
        type: 'success',
        message: `'${formData.name}' 학생의 정보가 수정되었습니다.`
      });
      setTimeout(() => setModalAlert(null), 3500);
    }
  };

  const handleDelete = (student: StudentProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStudentToDelete(student);
  };

  const handleSelectStudentCard = (student: StudentProfile) => {
    if (student.status === 'pending' && !isTeacherLoggedIn) {
      setModalAlert({
        type: 'info',
        message: `'${student.name}' 학생은 현재 담임 선생님의 승인 대기 중입니다. 선생님께서 승인해 주신 후 통장을 이용할 수 있습니다.`
      });
      return;
    }
    onSelectStudent(student.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2.5 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-amber-300 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-stone-200 gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  학생 등록 & 계정 관리
                </span>
                {isTeacherLoggedIn && (
                  <span className="text-[11px] sm:text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    교사 모드
                  </span>
                )}
              </div>
              <h3 className="font-jua text-lg sm:text-xl md:text-2xl text-stone-900 mt-0.5 truncate">
                {viewMode === 'list' && '학생 선택 및 신규 등록 신청'}
                {viewMode === 'add' && (isTeacherLoggedIn ? '신규 학생 직접 등록' : '학생 신규 등록 신청')}
                {viewMode === 'edit' && '학생 정보 및 비밀번호 수정'}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            {viewMode === 'list' && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isTeacherLoggedIn ? '학생 직접 등록' : '신규 등록 신청'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-100 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Modal Alert */}
        {modalAlert && (
          <div className={`mt-3 p-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs transition-all ${
            modalAlert.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
            modalAlert.type === 'error' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
            'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{modalAlert.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setModalAlert(null)}
              className="p-1 hover:bg-black/10 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* 1. LIST MODE */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              
              {/* Teacher Mode Control Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-stone-900">
                        {isTeacherLoggedIn ? '👨‍🏫 선생님 전용 관리자 모드 활성화됨' : '선생님이신가요? 비밀번호로 관리자 로그인'}
                      </span>
                      {pendingCount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.2 rounded-full animate-pulse">
                          신청 {pendingCount}건 대기중
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {isTeacherLoggedIn
                        ? '학생들의 등록 신청 승인/반려, 비밀번호 확인 및 학생 삭제/편집을 관리할 수 있습니다.'
                        : '학생 등록 승인, 비밀번호 확인 및 편집은 교사 비밀번호로 로그인하여 진행할 수 있습니다.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isTeacherLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenTeacherDashboard();
                      }}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1"
                    >
                      <span>교사 관리센터 열기</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenTeacherLogin();
                      }}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>교사 로그인 (기본: 1234)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Students Cards */}
              <div className="grid grid-cols-1 gap-3">
                {students.map((student) => {
                  const isCurrent = student.id === currentStudentId;
                  const isPending = student.status === 'pending';
                  const isRejected = student.status === 'rejected';
                  const count = booksByStudent[student.id] || 0;

                  return (
                    <div
                      key={student.id}
                      onClick={() => handleSelectStudentCard(student)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-50/80 shadow-md ring-2 ring-amber-300'
                          : isPending
                          ? 'border-amber-200 bg-orange-50/40 hover:border-amber-300'
                          : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                      }`}
                    >
                      {/* Left: Avatar & Info */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-200 shadow-xs flex items-center justify-center text-3xl flex-shrink-0 relative">
                          {student.avatar}
                          {isPending && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-jua text-lg text-stone-900">
                              {student.name}
                            </span>

                            {/* Status Badges */}
                            {isCurrent && (
                              <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                <Check className="w-3 h-3" />
                                현재 선택됨
                              </span>
                            )}

                            {isPending && (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" />
                                교사 승인 대기중
                              </span>
                            )}

                            {isRejected && (
                              <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                반려됨
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-stone-600 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-medium text-amber-800">{student.school}</span>
                            <span>•</span>
                            <span className="font-bold text-stone-800">
                              {student.grade}학년 {student.classRoom}반 {student.studentNumber}번
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-500 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1 font-semibold text-emerald-700">
                              <BookOpen className="w-3 h-3" />
                              완독 {count}권 / 목표 {student.targetCount}권
                            </span>
                            <span>•</span>
                            <span>{student.favoriteGenre}</span>
                            
                            {/* If teacher is logged in, show student password directly */}
                            {isTeacherLoggedIn && student.password && (
                              <>
                                <span>•</span>
                                <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300 flex items-center gap-1">
                                  <KeyRound className="w-3 h-3 text-amber-700" />
                                  비밀번호: {student.password}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isTeacherLoggedIn && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => handleOpenEdit(student, e)}
                              className="p-2 text-stone-500 hover:text-amber-700 hover:bg-amber-100 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                              title="학생 정보 수정"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">수정</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDelete(student, e)}
                              className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="학생 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">삭제</span>
                            </button>
                          </>
                        )}

                        {!isCurrent && !isPending && (
                          <button
                            type="button"
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                          >
                            전환하기
                          </button>
                        )}

                        {isPending && (
                          <span className="text-[11px] text-amber-800 font-bold bg-amber-100/80 px-2.5 py-1 rounded-xl">
                            승인 대기
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Add Banner */}
              <div 
                onClick={handleOpenAdd}
                className="border-2 border-dashed border-amber-300 hover:border-amber-400 rounded-2xl p-4 text-center cursor-pointer bg-amber-50/40 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 text-amber-800 font-bold text-xs"
              >
                <UserPlus className="w-4 h-4 text-amber-600" />
                <span>+ {isTeacherLoggedIn ? '신규 학생 추가 등록하기' : '학생 독서통장 신규 등록 신청하기'}</span>
              </div>
            </div>
          )}

          {/* 2. ADD & EDIT FORM MODE */}
          {(viewMode === 'add' || viewMode === 'edit') && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 text-stone-700 font-medium leading-relaxed">
                {viewMode === 'add' ? (
                  isTeacherLoggedIn ? (
                    '✨ [교사 등록] 학생의 학교, 학년, 반, 번호, 이름 및 비밀번호를 입력하여 즉시 등록합니다.'
                  ) : (
                    '📝 [학생 등록 신청] 학교, 학년, 반, 번호, 이름 및 비밀번호를 설정하여 등록을 신청하세요. 담임 선생님 승인 후 이용 가능합니다.'
                  )
                ) : (
                  `✏️ '${editingStudent?.name}' 학생의 정보를 수정합니다.`
                )}
              </div>

              {/* School & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    학교명 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-sm"
                    placeholder="예: 은빛초등학교"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    학생 이름 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-sm font-bold"
                    placeholder="예: 최도윤"
                  />
                </div>
              </div>

              {/* Grade, Class, Student Number */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    학년 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    반 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.classRoom}
                    onChange={(e) => setFormData({ ...formData, classRoom: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    번호 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={formData.studentNumber}
                    onChange={(e) => setFormData({ ...formData, studentNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-sm"
                  />
                </div>
              </div>

              {/* Student Password & Confirm Password (Crucial Requirement) */}
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                    <KeyRound className="w-4 h-4 text-amber-600" />
                    <span>학생 비밀번호 설정 (교사 확인 가능)</span>
                  </span>
                  <span className="text-[11px] text-stone-500">
                    * 담임 선생님께서 비밀번호를 확인 및 관리할 수 있습니다.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      비밀번호 <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-3 pr-9 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 bg-white font-mono text-sm"
                        placeholder="2자리 이상 입력 (예: 1234)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {viewMode === 'add' && (
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        비밀번호 확인 <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-3 pr-9 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 bg-white font-mono text-sm"
                          placeholder="비밀번호 다시 입력"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Target & Favorite Genre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    목표 독서 권수 (권)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    required
                    value={formData.targetCount}
                    onChange={(e) => setFormData({ ...formData, targetCount: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    좋아하는 독서 분야
                  </label>
                  <select
                    value={formData.favoriteGenre}
                    onChange={(e) => setFormData({ ...formData, favoriteGenre: e.target.value as GenreType })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-sm"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Avatar selection */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  나만의 캐릭터 아이콘
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-9 h-9 rounded-xl text-lg border-2 flex items-center justify-center transition-all ${
                        formData.avatar === av
                          ? 'border-amber-500 bg-amber-100 scale-110 shadow-xs'
                          : 'border-stone-200 hover:border-amber-300 bg-stone-50'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motto */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  독서 좌우명 (한 줄)
                </label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-sm"
                  placeholder="예: 책 속에 나의 꿈과 보물이 가득해요!"
                />
              </div>

              {/* Pledge */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  나의 독서 다짐 및 약속
                </label>
                <textarea
                  rows={2}
                  value={formData.pledge}
                  onChange={(e) => setFormData({ ...formData, pledge: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white text-sm resize-none"
                  placeholder="매일 성실하게 실천할 독서 다짐을 적어보세요."
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-200">
                {viewMode === 'edit' && editingStudent && isTeacherLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingStudent)}
                    className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>이 학생 삭제</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs"
                  >
                    목록으로 돌아가기
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-200 transition-colors cursor-pointer"
                  >
                    {viewMode === 'add' ? (isTeacherLoggedIn ? '학생 직접 등록 완료' : '독서통장 등록 신청서 제출') : '수정 내용 저장'}
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* In-App Delete Confirmation Modal */}
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
                    setViewMode('list');
                  }
                  setStudentToDelete(null);
                  setModalAlert({
                    type: 'success',
                    message: `'${targetName}' 학생의 계정과 독서 기록이 삭제되었습니다.`
                  });
                  setTimeout(() => setModalAlert(null), 3500);
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
