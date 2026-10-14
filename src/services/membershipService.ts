import { MembershipStatus, PlanTier } from '../types';

const MEMBERSHIP_STORAGE_KEY = 'edutrack_membership_status';

export const INITIAL_MEMBERSHIP: MembershipStatus = {
  tier: 'free',
  maxStudents: 3,
  maxBooksPerStudent: 10,
  hasAiTutor: false,
  hasSchoolBranding: false,
};

export const PLAN_LIMITS: Record<PlanTier, { maxStudents: number; maxBooks: number; aiReviewsPerMonth: number; name: string }> = {
  free: {
    maxStudents: 3,
    maxBooks: 10,
    aiReviewsPerMonth: 2, // 체험용 2회
    name: '무료 체험판 (Free)',
  },
  pro: {
    maxStudents: 10,
    maxBooks: 9999,
    aiReviewsPerMonth: 9999,
    name: '프로 가정/과외 패스 (Pro)',
  },
  school: {
    maxStudents: 500,
    maxBooks: 9999,
    aiReviewsPerMonth: 9999,
    name: '학교/학원 정기 라이선스 (School)',
  },
};

export function getMembership(): MembershipStatus {
  try {
    const saved = localStorage.getItem(MEMBERSHIP_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse membership', e);
  }
  return INITIAL_MEMBERSHIP;
}

export function saveMembership(status: MembershipStatus): void {
  try {
    localStorage.setItem(MEMBERSHIP_STORAGE_KEY, JSON.stringify(status));
  } catch (e) {
    console.error('Failed to save membership', e);
  }
}

export function activateLicense(licenseKey: string): { success: boolean; message: string; status?: MembershipStatus } {
  const cleanKey = licenseKey.trim().toUpperCase();

  // Preset demo / production license keys for schools and teachers
  if (cleanKey.startsWith('SCHOOL-') || cleanKey === 'EDU-2026-VIP' || cleanKey === 'INDISCHOOL-PRO') {
    const updated: MembershipStatus = {
      tier: 'school',
      maxStudents: 500,
      maxBooksPerStudent: 9999,
      hasAiTutor: true,
      hasSchoolBranding: true,
      licenseKey: cleanKey,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    saveMembership(updated);
    return {
      success: true,
      message: '🎉 [학교/학원 패키지 라이선스]가 성공적으로 등록되었습니다! 학생 500명 무제한 + AI 독서 첨삭 무제한 + 학급 포트폴리오 인쇄 권한이 활성화되었습니다.',
      status: updated,
    };
  }

  if (cleanKey.startsWith('PRO-') || cleanKey === 'READING-KING-PASS') {
    const updated: MembershipStatus = {
      tier: 'pro',
      maxStudents: 10,
      maxBooksPerStudent: 9999,
      hasAiTutor: true,
      hasSchoolBranding: false,
      licenseKey: cleanKey,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    saveMembership(updated);
    return {
      success: true,
      message: '✨ [프로 패스]가 등록되었습니다! 무제한 독서 기록과 AI 독서 첨삭 기능이 활성화되었습니다.',
      status: updated,
    };
  }

  return {
    success: false,
    message: '유효하지 않은 라이선스 키입니다. 학교 라이선스 키(예: EDU-2026-VIP 또는 SCHOOL-2026)를 확인해주세요.',
  };
}

export function resetToFree(): MembershipStatus {
  saveMembership(INITIAL_MEMBERSHIP);
  return INITIAL_MEMBERSHIP;
}
