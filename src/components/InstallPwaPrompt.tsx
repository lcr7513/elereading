import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalledSuccess, setIsInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed app)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem('edutrack_pwa_dismissed');
    const isDismissedRecently = dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 1000 * 60 * 60 * 24 * 3;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!checkStandalone && !isDismissedRecently) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (isIosDevice && !checkStandalone && !isDismissedRecently) {
      const timer = setTimeout(() => setShowBanner(true), 2500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalledSuccess(true);
        setShowBanner(false);
        setTimeout(() => setIsInstalledSuccess(false), 4000);
      }
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('edutrack_pwa_dismissed', Date.now().toString());
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* 1. Mobile Bottom Install Alert Banner */}
      {showBanner && (
        <div className="fixed bottom-20 left-3 right-3 md:bottom-5 md:left-auto md:right-5 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border-2 border-white/40 flex items-center gap-3 backdrop-blur-md">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white shadow-md p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img src="/pwa-192x192.png" alt="앱 아이콘" className="w-full h-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold bg-amber-400 text-stone-900 px-1.5 py-0.2 rounded-full">모바일 앱</span>
                <span className="text-[11px] text-orange-100">홈 화면에 바로 설치</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">초등 독서기록장 어플</h4>
              <p className="text-[11px] text-orange-100/90 line-clamp-1">전체화면 앱으로 더 넓고 편하게 이용하세요!</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="bg-white text-orange-600 hover:bg-orange-50 active:scale-95 font-bold text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow transition-all flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>설치</span>
              </button>
              <button
                type="button"
                onClick={handleDismissBanner}
                className="text-orange-200 hover:text-white p-1 rounded-lg active:scale-90 transition-transform"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {isInstalledSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">홈 화면에 독서기록장 어플이 설치되었습니다! 🎉</span>
        </div>
      )}

      {/* 2. Manual Mobile Install Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-200 relative text-stone-800">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-2 rounded-2xl shadow-md border-2 border-orange-200 overflow-hidden bg-orange-50 flex items-center justify-center">
                <img src="/pwa-192x192.png" alt="앱 아이콘" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-stone-900 font-jua">
                핸드폰 앱으로 설치하기
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                앱스토어 검색 없이 스마트폰 홈 화면에 바로 앱 아이콘이 추가됩니다!
              </p>
            </div>

            {isIOS ? (
              <div className="space-y-2.5 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 text-xs">
                <div className="font-bold text-orange-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-orange-600" />
                  아이폰 (Safari) 설치 방법:
                </div>
                <div className="space-y-1.5 text-stone-700">
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-amber-100">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">1</span>
                    <div>사파리 하단의 <strong className="text-orange-600">[공유]</strong> 버튼 터치</div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-amber-100">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">2</span>
                    <div><strong className="text-orange-600">[홈 화면에 추가]</strong> 터치</div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-amber-100">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">3</span>
                    <div>우측 상단 <strong>[추가]</strong> 터치 완료!</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 bg-orange-50/70 p-3.5 rounded-2xl border border-orange-200 text-xs">
                <div className="font-bold text-orange-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-orange-600" />
                  갤럭시 / 안드로이드 설치 방법:
                </div>
                <div className="space-y-1.5 text-stone-700">
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-orange-100">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">1</span>
                    <div>브라우저 우측 상단 <strong>[메뉴 (⋮)]</strong> 터치</div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-orange-100">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">2</span>
                    <div><strong className="text-orange-600">[홈 화면에 추가]</strong> 또는 <strong>[앱 설치]</strong> 선택</div>
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-orange-100">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">3</span>
                    <div>스마트폰 바탕화면에 생성된 어플 아이콘으로 바로 실행!</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-md text-sm active:scale-98 transition-transform"
              >
                확인했어요
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function InstallAppButton({ className = '' }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-xs hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all ${className}`}
        title="핸드폰에 앱으로 설치하기"
      >
        <Smartphone className="w-3 h-3" />
        <span>폰에 앱 설치</span>
      </button>

      {showModal && (
        <InstallGuideModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function InstallGuideModal({ onClose }: { onClose: () => void }) {
  const isIOS = typeof window !== 'undefined' && /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-200 relative text-stone-800">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl shadow-md border-2 border-orange-200 overflow-hidden bg-orange-50 flex items-center justify-center">
            <img src="/pwa-192x192.png" alt="앱 아이콘" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-stone-900 font-jua">
            핸드폰 앱으로 설치하기
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            홈 화면에 앱 아이콘을 추가하여 전체화면 앱으로 이용하세요!
          </p>
        </div>

        {isIOS ? (
          <div className="space-y-2 bg-amber-50/70 p-3 rounded-2xl border border-amber-200 text-xs">
            <div className="font-bold text-orange-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-orange-600" />
              아이폰 (Safari) 추가 방법:
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-amber-100">
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">1</span>
              <div>하단 사파리 메뉴에서 <strong className="text-orange-600">[공유]</strong> 터치</div>
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-amber-100">
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">2</span>
              <div>목록에서 <strong className="text-orange-600">[홈 화면에 추가]</strong> 터치</div>
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-amber-100">
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">3</span>
              <div>우측 상단 <strong>[추가]</strong> 터치 완료!</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 bg-orange-50/70 p-3 rounded-2xl border border-orange-200 text-xs">
            <div className="font-bold text-orange-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-orange-600" />
              갤럭시 / 안드로이드 추가 방법:
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-orange-100">
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">1</span>
              <div>브라우저 우측 상단 <strong>[메뉴 (⋮)]</strong> 터치</div>
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-orange-100">
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">2</span>
              <div><strong className="text-orange-600">[홈 화면에 추가]</strong> 또는 <strong>[앱 설치]</strong> 선택</div>
            </div>
            <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-orange-100">
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">3</span>
              <div>바탕화면에 생성된 어플 아이콘으로 바로 실행!</div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow hover:bg-orange-600 text-sm active:scale-98"
        >
          확인
        </button>
      </div>
    </div>
  );
}
