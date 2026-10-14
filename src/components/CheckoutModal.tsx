import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  School, 
  UserCheck, 
  KeyRound, 
  X, 
  Zap, 
  Building2, 
  FileCheck2, 
  HelpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MembershipStatus, PlanTier } from '../types';
import { activateLicense, saveMembership } from '../services/membershipService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMembership: MembershipStatus;
  onMembershipUpdated: (newStatus: MembershipStatus) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  currentMembership,
  onMembershipUpdated,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('school');
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [schoolNameInput, setSchoolNameInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'school_bill' | 'license'>('school_bill');

  if (!isOpen) return null;

  const handleApplyLicense = (e: React.FormEvent) => {
    e.preventDefault();
    setLicenseError('');
    const result = activateLicense(licenseKeyInput);
    if (result.success && result.status) {
      onMembershipUpdated(result.status);
      confetti({ particleCount: 80, spread: 70 });
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        onClose();
      }, 2000);
    } else {
      setLicenseError(result.message);
    }
  };

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const newStatus: MembershipStatus = {
        tier: selectedPlan,
        maxStudents: selectedPlan === 'school' ? 500 : 10,
        maxBooksPerStudent: 9999,
        hasAiTutor: true,
        hasSchoolBranding: selectedPlan === 'school',
        schoolName: schoolNameInput || '행복초등학교',
        activatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        licenseKey: selectedPlan === 'school' ? 'SCHOOL-PAID-2026' : 'PRO-PAID-2026',
      };
      saveMembership(newStatus);
      onMembershipUpdated(newStatus);
      confetti({ particleCount: 100, spread: 80 });
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        onClose();
      }, 2200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border-4 border-amber-300 max-h-[92vh] overflow-y-auto relative text-stone-800">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-4 border-b border-stone-200">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>상용 라이선스 & 멤버십 안내</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-jua text-stone-900">
            초등 독서기록장 프리미엄 & 학교 플랜 🏫
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            현재 상태: <strong className="text-amber-600 uppercase font-bold">{currentMembership.tier} 등급</strong> 
            {currentMembership.tier !== 'free' && ' (모든 기능이 활성화되어 있습니다!)'}
          </p>
        </div>

        {paymentSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-jua text-2xl text-emerald-800">라이선스가 성공적으로 활성화되었습니다!</h4>
            <p className="text-sm text-stone-600">무제한 학생 등록 및 AI 독서 첨삭 기능을 바로 이용하실 수 있습니다.</p>
          </div>
        ) : (
          <div className="space-y-6 pt-4">

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pro Plan (B2C) */}
              <div 
                onClick={() => setSelectedPlan('pro')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedPlan === 'pro'
                    ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400'
                    : 'border-stone-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    가정 / 과외용
                  </span>
                  <span className="text-xs text-amber-700 font-bold">월 3,900원 / 평생 19,000원</span>
                </div>
                <h4 className="font-jua text-lg text-stone-900">프로 패스 (Pro)</h4>
                <ul className="text-xs text-stone-600 space-y-1.5 mt-3">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>독서 기록 무제한 저장</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>AI 독후감 첨삭 & 맞춤법 교정</strong> 무제한</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>가정 내 다자녀 (최대 10명) 관리</span>
                  </li>
                </ul>
              </div>

              {/* School Plan (B2G/B2B) */}
              <div 
                onClick={() => setSelectedPlan('school')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedPlan === 'school'
                    ? 'border-orange-500 bg-orange-50/60 shadow-md ring-2 ring-orange-400'
                    : 'border-stone-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                  학교 추천 ⭐
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    학교 / 학원 패키지
                  </span>
                  <span className="text-xs text-orange-700 font-bold">학급당 연 30,000원</span>
                </div>
                <h4 className="font-jua text-lg text-stone-900">스쿨 라이선스 (School)</h4>
                <ul className="text-xs text-stone-600 space-y-1.5 mt-3">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>학생 정원 최대 500명</strong> 등록 & 관리</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>학급 전체 독서 포트폴리오 일괄 A4 인쇄</strong></span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>학교 로고 및 에듀테크 정산 행정 서류 제공</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Payment Method Tabs */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-stone-700 block">결제 / 등록 방식 선택</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('school_bill')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    paymentMethod === 'school_bill'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>학교 행정 정산</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>신용카드 / 페이</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('license')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    paymentMethod === 'license'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>라이선스 코드</span>
                </button>
              </div>

              {/* School Administration Payment */}
              {paymentMethod === 'school_bill' && (
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">소속 초등학교명 / 기관명</label>
                    <input
                      type="text"
                      value={schoolNameInput}
                      onChange={(e) => setSchoolNameInput(e.target.value)}
                      placeholder="예: 서울가람초등학교 3학년 2반"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1 text-stone-600">
                    <p className="font-bold text-stone-800">📋 학교장터(S2B) 및 법인카드 행정 결제 지원</p>
                    <p>• 견적서, 사업자등록증, 통장사본, 승낙사항 행정서류 즉시 출력 지원</p>
                    <p>• 학교 예산 승인 전 선사용 승인이 필요하신 경우 즉시 체험 라이선스를 적용해 드립니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isProcessingPayment}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-md hover:from-orange-600 hover:to-amber-600 transition-all active:scale-98 text-sm"
                  >
                    {isProcessingPayment ? '학교 라이선스 승인 처리 중...' : '학교 라이선스 즉시 활성화하기 (1년 무제한)'}
                  </button>
                </div>
              )}

              {/* Credit Card / Toss Payment */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-stone-600 space-y-1">
                    <p className="font-bold text-stone-800">💳 토스페이먼츠 & 간편결제 모듈</p>
                    <p>카카오페이, 네이버페이, 신용카드, 토스페이로 즉시 안전 결제됩니다.</p>
                    <p className="text-amber-700 font-bold">결제 즉시 계정 제한(정원 500명, AI 첨삭 무제한)이 자동으로 풀립니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isProcessingPayment}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-98 text-sm"
                  >
                    {isProcessingPayment ? '안전 결제 처리 중...' : `${selectedPlan === 'school' ? '30,000원 결제하기' : '19,000원 평생 소장권 결제하기'}`}
                  </button>
                </div>
              )}

              {/* License Key Redemption */}
              {paymentMethod === 'license' && (
                <form onSubmit={handleApplyLicense} className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      학교 배포용 라이선스 코드 입력
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={licenseKeyInput}
                        onChange={(e) => setLicenseKeyInput(e.target.value)}
                        placeholder="예: EDU-2026-VIP 또는 SCHOOL-2026"
                        className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-600 text-white font-bold rounded-xl shadow hover:bg-orange-700 shrink-0"
                      >
                        코드 인증
                      </button>
                    </div>
                    {licenseError && (
                      <p className="text-rose-600 mt-1 font-semibold">{licenseError}</p>
                    )}
                    <p className="text-[11px] text-stone-500 mt-1">
                      💡 테스트 체험용 코드: <code className="bg-stone-200 px-1 py-0.5 rounded font-bold text-stone-800">EDU-2026-VIP</code> 또는 <code className="bg-stone-200 px-1 py-0.5 rounded font-bold text-stone-800">PRO-2026</code>
                    </p>
                  </div>
                </form>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
