import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle, 
  Edit3, 
  Target, 
  Heart, 
  BookOpen, 
  Calendar, 
  Award, 
  Stamp, 
  Users, 
  UserPlus, 
  Trash2, 
  Check,
  ShieldCheck,
  KeyRound,
  Lock,
  Clock,
  Eye,
  EyeOff,
  UserCheck,
  UserX
} from 'lucide-react';
import { StudentProfile, GenreType } from '../types';

interface ProfileSectionProps {
  profile: StudentProfile;
  students: StudentProfile[];
  onUpdateProfile: (updated: StudentProfile) => void;
  onSelectStudent: (studentId: string) => void;
  onOpenAddStudentModal: () => void;
  onDeleteStudent: (studentId: string) => void;
  booksByStudentCount: Record<string, number>;
  totalBooksRead: number;
  isTeacherLoggedIn: boolean;
  onOpenTeacherLogin: () => void;
  onOpenTeacherDashboard: () => void;
  onApproveStudent?: (studentId: string) => void;
  onRejectStudent?: (studentId: string) => void;
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

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  students,
  onUpdateProfile,
  onSelectStudent,
  onOpenAddStudentModal,
  onDeleteStudent,
  booksByStudentCount,
  totalBooksRead,
  isTeacherLoggedIn,
  onOpenTeacherLogin,
  onOpenTeacherDashboard,
  onApproveStudent,
  onRejectStudent
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [showPassword, setShowPassword] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentProfile | null>(null);

  const pendingStudents = students.filter(s => s.status === 'pending');
  const approvedStudents = students.filter(s => s.status !== 'pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
        
        {/* Top Actions Bar (Mobile flow + Desktop absolute) */}
        <div className="flex items-center justify-between sm:justify-end gap-2 mb-3 md:mb-0 md:absolute md:top-4 md:right-4 z-10">
          {isTeacherLoggedIn && (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] sm:text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              교사 인증됨
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setFormData(profile);
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-stone-700 text-xs md:text-sm font-bold px-3 py-1.5 rounded-xl border border-amber-300 shadow-xs transition-all active:scale-95 ml-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            <span>학생 정보 수정</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
          {/* Avatar circle */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-md flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-5xl md:text-6xl shadow-inner">
              {profile.avatar}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-200/70 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{profile.school}</span>
              <span className="text-stone-500">|</span>
              <span>현재 선택된 학생</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-jua text-stone-900 tracking-wide">
              {profile.grade}학년 {profile.classRoom}반 {profile.studentNumber}번 <span className="text-amber-600">{profile.name}</span>의 독서 기록장
            </h2>

            <p className="text-sm md:text-base text-stone-600 font-medium italic">
              "{profile.motto || '책 속에서 나만의 꿈을 키워요!'}"
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs md:text-sm">
              <span className="bg-white px-3 py-1 rounded-lg border border-amber-200 text-stone-700 font-medium flex items-center gap-1.5 shadow-xs">
                <Target className="w-4 h-4 text-rose-500" />
                목표: <b className="text-stone-900">{profile.targetCount}권</b> (현재 {totalBooksRead}권 완독)
              </span>
              <span className="bg-white px-3 py-1 rounded-lg border border-amber-200 text-stone-700 font-medium flex items-center gap-1.5 shadow-xs">
                <Heart className="w-4 h-4 text-pink-500" />
                좋아하는 분야: <b className="text-stone-900">{profile.favoriteGenre}</b>
              </span>
              <span className="bg-white px-3 py-1 rounded-lg border border-amber-200 text-stone-700 font-medium flex items-center gap-1.5 shadow-xs">
                <Calendar className="w-4 h-4 text-blue-500" />
                기록 시작일: <b className="text-stone-900">{profile.startDate}</b>
              </span>
              {isTeacherLoggedIn && profile.password && (
                <span className="bg-amber-100 px-3 py-1 rounded-lg border border-amber-300 text-amber-950 font-bold flex items-center gap-1.5 shadow-xs font-mono">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  학생 비밀번호: <b className="text-amber-900">{profile.password}</b>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Action Banner or Pending Application Quick Approvals */}
      {pendingStudents.length > 0 && (
        <div className="bg-orange-50/80 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-jua text-lg text-stone-900 flex items-center gap-2">
                  <span>신규 학생 등록 신청 대기 ({pendingStudents.length}명)</span>
                  <span className="text-xs bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                    승인 필요
                  </span>
                </h3>
                <p className="text-xs text-stone-600">
                  학생들이 등록을 신청하였습니다. 담임 선생님께서 확인 후 승인해 주시면 통장이 활성화됩니다.
                </p>
              </div>
            </div>

            {!isTeacherLoggedIn ? (
              <button
                type="button"
                onClick={onOpenTeacherLogin}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-extrabold text-xs rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>교사 로그인 후 승인하기</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenTeacherDashboard}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>교사 관리센터에서 전체 확인</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingStudents.map((pst) => (
              <div key={pst.id} className="bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl flex-shrink-0">
                    {pst.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-jua text-base text-stone-900">{pst.name}</h4>
                      <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.2 rounded">
                        {pst.grade}학년 {pst.classRoom}반 {pst.studentNumber}번
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{pst.school}</p>
                    {isTeacherLoggedIn && pst.password && (
                      <span className="text-xs font-mono font-bold text-amber-800">
                        설정 PW: {pst.password}
                      </span>
                    )}
                  </div>
                </div>

                {isTeacherLoggedIn && onApproveStudent && (
                  <div className="flex items-center gap-1.5">
                    {onRejectStudent && (
                      <button
                        type="button"
                        onClick={() => onRejectStudent(pst.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                      >
                        반려
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onApproveStudent(pst.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-2xs"
                    >
                      승인
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Student Directory & Registration Management */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <h3 className="text-xl font-jua text-stone-900">학급 학생 목록 & 계정 관리 ({approvedStudents.length}명)</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              학교, 학년, 반, 번호별로 여러 명의 학생을 등록하고 각각 독립된 독서 통장과 활동지를 관리할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!isTeacherLoggedIn ? (
              <button
                type="button"
                onClick={onOpenTeacherLogin}
                className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs px-3.5 py-2.5 rounded-2xl shadow-xs transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>교사 관리 모드 입장</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenTeacherDashboard}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-2xl shadow-xs transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>교사 통합 관리센터</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAddStudentModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>새 학생 등록 신청</span>
            </button>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {approvedStudents.map((st) => {
            const isCurrent = st.id === profile.id;
            const bookCount = booksByStudentCount[st.id] || 0;
            const rate = Math.min(100, Math.round((bookCount / (st.targetCount || 50)) * 100));

            return (
              <div
                key={st.id}
                className={`p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-50/60 shadow-md ring-2 ring-amber-300'
                    : 'border-stone-200 bg-white hover:border-amber-200 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 shadow-2xs flex items-center justify-center text-3xl flex-shrink-0">
                        {st.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-jua text-lg text-stone-900">{st.name}</h4>
                          {isCurrent && (
                            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Check className="w-3 h-3" />
                              현재
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-stone-500 font-medium">
                          {st.school}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-700 bg-white/80 p-3 rounded-xl border border-stone-200/80">
                    <div className="flex items-center justify-between font-bold text-stone-900">
                      <span>학적 정보</span>
                      <span className="text-amber-800">{st.grade}학년 {st.classRoom}반 {st.studentNumber}번</span>
                    </div>

                    {isTeacherLoggedIn && st.password && (
                      <div className="flex items-center justify-between text-amber-950 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-bold">
                        <span className="flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-amber-600" />
                          학생 PW:
                        </span>
                        <span className="font-mono text-amber-900">{st.password}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">독서 진행도</span>
                      <span className="font-bold text-emerald-700">{bookCount}권 / {st.targetCount}권 ({rate}%)</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden mt-1">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${rate}%` }} 
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 italic truncate pt-1">
                      "{st.motto || st.pledge}"
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(st);
                        setIsEditing(true);
                      }}
                      className="text-stone-500 hover:text-amber-700 hover:bg-stone-100 p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                      title="정보 수정"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>수정</span>
                    </button>

                    {isTeacherLoggedIn && students.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setStudentToDelete(st)}
                        className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="학생 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {isCurrent ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-xl">
                      사용 중
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectStudent(st.id)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
                    >
                      이 학생으로 전환
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official EduTrack Reading Pledge Certificate (독서 서약서) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-stone-200 shadow-sm relative">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-block border-b-2 border-amber-500 pb-1">
            <span className="text-xs text-amber-700 font-bold uppercase tracking-widest">EduTrack Reading Pledge</span>
            <h3 className="text-xl md:text-2xl font-jua text-stone-900">나의 소중한 독서 다짐</h3>
          </div>

          <div className="bg-amber-50/70 p-5 md:p-6 rounded-2xl border border-amber-200 text-stone-800 text-sm md:text-base leading-relaxed notebook-lines">
            <p className="font-semibold text-stone-900 mb-2">
              나 <span className="underline font-bold text-amber-800">{profile.name}</span>(은)는 지혜롭고 바른 마음을 가진 어린이로 자라나기 위해 다음 독서 약속을 실천하겠습니다.
            </p>
            <p className="text-amber-950 font-medium py-1">
              "{profile.pledge}"
            </p>
          </div>

          {/* Signature & Seal Stamp */}
          <div className="pt-4 flex items-center justify-between max-w-md mx-auto border-t border-stone-200 text-xs md:text-sm text-stone-600">
            <div className="text-left">
              <p>서약 일자: {profile.startDate}</p>
              <p className="font-bold text-stone-800 mt-0.5">서약자: {profile.name} (서명)</p>
            </div>

            {/* Red Round Stamp */}
            <div className="w-16 h-16 rounded-full border-2 border-rose-600 text-rose-600 flex flex-col items-center justify-center p-1 transform -rotate-12 select-none shadow-xs font-bold">
              <span className="text-[9px] tracking-tighter">에듀트랙</span>
              <span className="text-xs font-extrabold">참 잘했어요</span>
              <span className="text-[8px]">★확인★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-2 border-amber-300 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-jua text-stone-900 mb-4 pb-2 border-b border-stone-200 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-600" />
              <span>학생 정보 및 다짐 수정</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">학교명</label>
                  <input
                    type="text"
                    required
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    placeholder="예: 서울초등학교"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">이름</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    placeholder="예: 홍길동"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    학생 비밀번호
                  </span>
                  <span className="text-[10px] text-stone-500">* 교사 확인 가능</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-3 pr-9 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono"
                    placeholder="학생 비밀번호"
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">학년</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">반</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.classRoom}
                    onChange={(e) => setFormData({ ...formData, classRoom: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">번호</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.studentNumber}
                    onChange={(e) => setFormData({ ...formData, studentNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">목표 권수</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    required
                    value={formData.targetCount}
                    onChange={(e) => setFormData({ ...formData, targetCount: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">좋아하는 분야</label>
                  <select
                    value={formData.favoriteGenre}
                    onChange={(e) => setFormData({ ...formData, favoriteGenre: e.target.value as GenreType })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">나만의 캐릭터 아이콘</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-10 h-10 rounded-xl text-xl border-2 flex items-center justify-center transition-transform ${
                        formData.avatar === av
                          ? 'border-amber-500 bg-amber-100 scale-110 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">독서 좌우명 (한 줄)</label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  placeholder="예: 책 속에 나의 꿈이 가득해요!"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">나의 독서 다짐 / 약속</label>
                <textarea
                  rows={3}
                  value={formData.pledge}
                  onChange={(e) => setFormData({ ...formData, pledge: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none"
                  placeholder="매일 꾸준히 책을 읽고 실천할 약속을 적어보세요."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-200 transition-colors"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-300 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-jua text-lg text-stone-900">학생 삭제 확인</h4>
                <p className="text-xs text-rose-600 font-bold">이 데이터를 삭제하시겠습니까?</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1">
              <p className="font-bold text-stone-900 text-sm">{studentToDelete.avatar} {studentToDelete.name}</p>
              <p className="text-stone-600">{studentToDelete.school} • {studentToDelete.grade}학년 {studentToDelete.classRoom}반 {studentToDelete.studentNumber}번</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
