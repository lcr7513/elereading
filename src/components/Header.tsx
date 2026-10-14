import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  TreePine, 
  PieChart, 
  Printer, 
  PlusCircle, 
  RotateCcw,
  GraduationCap,
  BookmarkCheck,
  Users,
  ChevronDown,
  ShieldCheck,
  Lock,
  Clock,
  Share2,
  Smartphone,
  Cloud
} from 'lucide-react';
import { StudentProfile, BookEntry } from '../types';
import { InstallAppButton } from './InstallPwaPrompt';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
  books: BookEntry[];
  totalStudentsCount?: number;
  pendingStudentsCount?: number;
  isTeacherLoggedIn: boolean;
  onOpenAddModal: () => void;
  onOpenStudentManager: () => void;
  onOpenTeacherLogin: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenFirebaseStatus?: () => void;
  onOpenShareModal?: () => void;
  onResetData: () => void;
  onTriggerPrint: () => void;
  isCloudSyncing?: boolean;
  membership?: { tier: 'free' | 'pro' | 'school' };
  onOpenCheckout?: () => void;
  onOpenBrochure?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  books,
  totalStudentsCount = 1,
  pendingStudentsCount = 0,
  isTeacherLoggedIn,
  onOpenAddModal,
  onOpenStudentManager,
  onOpenTeacherLogin,
  onOpenTeacherDashboard,
  onOpenFirebaseStatus,
  onOpenShareModal,
  onResetData,
  onTriggerPrint,
  isCloudSyncing,
  membership = { tier: 'free' },
  onOpenCheckout,
  onOpenBrochure,
}) => {
  const totalBooks = books.length;
  const progressPercent = Math.min(100, Math.round((totalBooks / (profile.targetCount || 50)) * 100));

  const navItems = [
    { id: 'bankbook', label: '독서 통장', icon: BookOpen, tag: `${totalBooks}권` },
    { id: 'worksheet', label: '독후 활동장', icon: Sparkles, tag: '9종' },
    { id: 'tree', label: '독서 나무', icon: TreePine, tag: `${progressPercent}%` },
    { id: 'stats', label: '독서 분석', icon: PieChart, tag: '통계' },
    { id: 'profile', label: '학생 관리 & 다짐', icon: GraduationCap, tag: `${totalStudentsCount}명` },
    { id: 'print', label: '제출용 인쇄', icon: Printer, tag: 'A4' },
  ];

  return (
    <header className="bg-white border-b-2 border-amber-200 shadow-sm sticky top-0 z-30 no-print safe-top">
      {/* 1. Mobile Header View (Compact, 1-row, thumb-friendly) */}
      <div className="md:hidden px-3.5 py-2.5 flex items-center justify-between gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white">
        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="truncate">
            <h1 className="font-jua text-base tracking-wide text-white leading-tight">초등 독서기록장</h1>
            <p className="text-[10px] text-amber-100 truncate">에듀트랙 양식</p>
          </div>
        </div>

        {/* Mobile Right Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Share / Open Mobile Modal Button */}
          {onOpenShareModal && (
            <button
              type="button"
              onClick={onOpenShareModal}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white active:scale-95 transition-transform"
              title="QR코드 / 공유"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Cloud DB Status */}
          {onOpenFirebaseStatus && (
            <button
              type="button"
              onClick={onOpenFirebaseStatus}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white active:scale-95 transition-transform"
              title="클라우드 동기화 상태"
            >
              <Cloud className={`w-4 h-4 ${isCloudSyncing ? 'text-amber-200 animate-pulse' : 'text-emerald-300'}`} />
            </button>
          )}

          {/* Teacher Login / Admin Center Button */}
          {isTeacherLoggedIn ? (
            <button
              type="button"
              onClick={onOpenTeacherDashboard}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>교사</span>
              {pendingStudentsCount > 0 && (
                <span className="bg-rose-500 text-white text-[9px] px-1 rounded-full font-extrabold">
                  {pendingStudentsCount}
                </span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenTeacherLogin}
              className="bg-stone-900/40 hover:bg-stone-900/60 text-amber-200 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 border border-white/20"
            >
              <Lock className="w-3 h-3 text-amber-300" />
              <span>선생님</span>
              {pendingStudentsCount > 0 && (
                <span className="bg-rose-500 text-white text-[9px] px-1 rounded-full font-extrabold">
                  {pendingStudentsCount}
                </span>
              )}
            </button>
          )}

          {/* Student Avatar / Quick Switch Button */}
          <button
            type="button"
            onClick={onOpenStudentManager}
            className="flex items-center gap-1 bg-white text-stone-900 px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            <span className="text-sm">{profile.avatar}</span>
            <span className="max-w-[48px] truncate">{profile.name}</span>
          </button>
        </div>
      </div>

      {/* Mobile Goal Progress Strip */}
      <div className="md:hidden px-3.5 py-1.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-stone-600">
          <span className="font-bold text-amber-900">{profile.name}</span>
          <span className="text-stone-400">·</span>
          <span>{totalBooks}/{profile.targetCount || 50}권 완독</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 bg-amber-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-jua text-amber-900 text-xs">{progressPercent}%</span>
        </div>
      </div>

      {/* Mobile Quick Tab Bar & Quick Tools (Always Visible and Active on Mobile) */}
      <div className="md:hidden bg-amber-100/70 border-b border-amber-200 px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-600'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
        {onOpenBrochure && (
          <button
            type="button"
            onClick={onOpenBrochure}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap bg-amber-500 text-white shadow-xs cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-yellow-200" />
            <span>소개서</span>
          </button>
        )}
        {onOpenCheckout && (
          <button
            type="button"
            onClick={onOpenCheckout}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap bg-purple-600 text-white shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>라이선스</span>
          </button>
        )}
      </div>

      {/* 2. Desktop Header View (Full ribbon and tabs) */}
      <div className="hidden md:block">
        {/* Top Banner Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5" />
                에듀트랙 표준 양식
              </span>
              <h1 className="font-jua text-lg tracking-wide flex items-center gap-1.5">
                <span>초등학생 독서 기록장</span>
                <span className="text-amber-200 text-sm font-normal">| 즐거운 책 읽기 습관</span>
              </h1>
            </div>

            {/* Teacher Login / Admin Badge & Student Badge */}
            <div className="flex items-center gap-2.5 text-xs">
              {/* App Install Button */}
              <InstallAppButton />

              {/* Brochure Modal Button */}
              {onOpenBrochure && (
                <button
                  type="button"
                  onClick={onOpenBrochure}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/30 flex items-center gap-1 font-bold text-white transition-all hover:scale-102 active:scale-98 shadow-xs cursor-pointer"
                  title="학교/교장선생님 제출용 1장 소개서"
                >
                  <Award className="w-3 h-3 text-yellow-300" />
                  <span>소개서(브로슈어)</span>
                </button>
              )}

              {/* Membership / License Button */}
              {onOpenCheckout && (
                <button
                  type="button"
                  onClick={onOpenCheckout}
                  className={`px-3 py-1 rounded-full border flex items-center gap-1.5 font-bold transition-all hover:scale-102 active:scale-98 shadow-xs cursor-pointer ${
                    membership.tier === 'free'
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-900 border-yellow-200'
                      : 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white border-purple-400/50'
                  }`}
                  title="학교/학원 정기 라이선스 등록 및 결제"
                >
                  <Sparkles className="w-3 h-3 text-amber-900" />
                  <span>
                    {membership.tier === 'free' ? '라이선스/유료화 안내' : `라이선스: ${membership.tier.toUpperCase()}`}
                  </span>
                </button>
              )}

              {/* Share / QR Modal Button */}
              {onOpenShareModal && (
                <button
                  type="button"
                  onClick={onOpenShareModal}
                  className="bg-black/20 hover:bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/30 flex items-center gap-1 font-bold text-white transition-all hover:scale-102 active:scale-98 shadow-xs cursor-pointer"
                  title="스마트폰으로 앱 열기 (QR 코드)"
                >
                  <Share2 className="w-3 h-3 text-amber-200" />
                  <span>폰으로 열기</span>
                </button>
              )}

              {/* Teacher Auth / Admin Center Button */}
              {isTeacherLoggedIn ? (
                <button
                  type="button"
                  onClick={onOpenTeacherDashboard}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 rounded-full border border-emerald-400/50 flex items-center gap-1.5 font-bold transition-all hover:scale-102 active:scale-98 shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                  <span>교사 관리센터</span>
                  {pendingStudentsCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold animate-pulse">
                      {pendingStudentsCount}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenTeacherLogin}
                  className="bg-stone-900/40 hover:bg-stone-900/60 backdrop-blur-sm text-amber-200 hover:text-white px-3 py-1 rounded-full border border-amber-300/40 flex items-center gap-1.5 font-bold transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>선생님 로그인</span>
                  {pendingStudentsCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold animate-bounce">
                      신청 {pendingStudentsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Cloud DB Status Indicator Button */}
              {onOpenFirebaseStatus && (
                <button
                  type="button"
                  onClick={onOpenFirebaseStatus}
                  className="bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 hover:text-white px-2.5 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1 font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                  <span className="text-[11px]">클라우드 DB</span>
                </button>
              )}

              {/* Student Profile Quick Switcher Button */}
              <div 
                onClick={onOpenStudentManager}
                className="bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98 shadow-sm group"
              >
                <span className="font-semibold">{profile.school}</span>
                <span className="text-amber-200 font-bold">{profile.grade}학년 {profile.classRoom}반 {profile.studentNumber}번</span>
                <span className="font-bold underline underline-offset-2 flex items-center gap-1">
                  <span>{profile.name}</span>
                  <span className="text-[11px]">{profile.avatar}</span>
                </span>
                <div className="flex items-center gap-1 pl-1 border-l border-white/20 text-amber-200 text-[11px] font-bold">
                  <Users className="w-3 h-3" />
                  <span>학생 관리</span>
                  <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>

              <button
                type="button"
                onClick={onResetData}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1"
                title="예시 데이터 다시 불러오기"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">예시 초기화</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Bar with Desktop Navigation & Stats */}
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Notebook Navigation Tabs */}
            <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-200 -translate-y-0.5'
                        : 'bg-stone-100 text-stone-700 hover:bg-amber-100/60 hover:text-amber-900 border border-stone-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                    <span>{item.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                      isActive ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {item.tag}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Action Buttons & Goal Progress */}
            <div className="flex items-center justify-end gap-3 flex-shrink-0">
              {/* Reading Mini Progress bar */}
              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                <div className="flex flex-col text-left">
                  <span className="text-[11px] text-amber-800 font-medium">목표 달성률 ({totalBooks}/{profile.targetCount || 50}권)</span>
                  <div className="w-28 sm:w-32 bg-amber-200 rounded-full h-2 mt-0.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <span className="font-jua text-amber-900 text-base">{progressPercent}%</span>
              </div>

              {/* Add Book Button */}
              <button
                id="header-add-book-btn"
                type="button"
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-emerald-200 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>새 책 기록하기</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
