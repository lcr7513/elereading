import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  KeyRound, 
  School, 
  UserCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherPassword: string;
  onLoginSuccess: () => void;
  teacherName?: string;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  teacherPassword,
  onLoginSuccess,
  teacherName = '김은빛 선생님'
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === teacherPassword) {
      setErrorMsg('');
      setInputPassword('');
      onLoginSuccess();
      onClose();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
    }
  };

  const handleQuickFill = () => {
    setInputPassword(teacherPassword);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border-2 border-amber-400 relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg shadow-amber-200">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="inline-block bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300">
            교사 전용 관리자 인증
          </span>
          <h3 className="text-2xl font-jua text-stone-900">
            선생님 모드 입장
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            학생들의 신규 등록 신청 승인, 비밀번호 확인 및 독서 통장 데이터 관리를 위해 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                교사 비밀번호 입력
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] text-amber-700 hover:underline font-semibold"
              >
                테스트 번호 자동입력 ({teacherPassword})
              </button>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className={`w-full pl-4 pr-11 py-3 text-base border-2 rounded-2xl focus:outline-none transition-all ${
                  errorMsg 
                    ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 ring-2 ring-rose-200' 
                    : 'border-stone-300 focus:border-amber-500 ring-2 ring-transparent focus:ring-amber-200 bg-stone-50/50'
                }`}
                placeholder="교사 비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          {/* Quick Notice Card */}
          <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-2xl text-stone-600 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>안내 사항</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              • 기본 설정 비밀번호는 <b className="text-amber-800 font-mono bg-amber-100 px-1 py-0.5 rounded">1234</b> 입니다.
              <br />
              • 교사 모드 입장 후 언제든지 관리자 비밀번호를 변경할 수 있습니다.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-sm rounded-2xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-amber-200 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>교사 모드 로그인</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
