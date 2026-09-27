export type GenreType = 
  | '동화·소설'
  | '과학·수학'
  | '위인·역사'
  | '사회·문화'
  | '시·동시'
  | '예술·체육'
  | '학습만화'
  | '철학·인성'
  | '기타';

export type StampType = 
  | '참 잘했어요'
  | '독서왕'
  | '대단해요!'
  | '최고예요!'
  | '노력상'
  | '반짝별'
  | '하트뿜뿜'
  | '미확인';

export interface StudentProfile {
  id: string;
  school: string;
  grade: number;
  classRoom: number;
  studentNumber: number;
  name: string;
  password?: string; // Student password set during registration
  status?: 'approved' | 'pending' | 'rejected'; // Registration status
  appliedAt?: string;
  approvedAt?: string;
  rejectReason?: string;
  targetCount: number;
  pledge: string;
  favoriteGenre: GenreType;
  motto: string;
  startDate: string;
  avatar: string;
}

export interface TeacherInfo {
  name: string;
  school: string;
  grade: number;
  classRoom: number;
  isLoggedIn: boolean;
}

export interface BookEntry {
  id: string;
  date: string;
  title: string;
  author: string;
  illustrator?: string;
  publisher: string;
  pages: number;
  genre: GenreType;
  rating: number; // 1 to 5
  oneLineReview: string;
  stamp: StampType;
  hasActivity: boolean;
  activityId?: string;
}

export type ActivityType = 
  | 'summary_impression'   // 1. 기본 독서 감상문 (줄거리 + 느낀점)
  | 'character_letter'     // 2. 주인공에게 편지 쓰기
  | 'rewrite_ending'       // 3. 만약 내가 작가라면 (결말 바꾸기)
  | 'scene_drawing'        // 4. 독서 감상화 / 4컷 만화 그리기
  | 'book_quiz'            // 5. 내가 만드는 독서 퀴즈 3문항
  | 'golden_words'         // 6. 마음을 울린 명문장 & 낱말 사전
  | 'character_interview'  // 7. 가상 독서 인터뷰 (기자 vs 인물)
  | 'book_ad'              // 8. 책 추천 광고지 & 표지 만들기
  | 'mind_map';            // 9. 생각 그물 & 인물 관계도

export interface ActivityData {
  id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  type: ActivityType;
  date: string;
  content: {
    // Summary & Impression
    motivation?: string;
    summary?: string;
    impressiveScene?: string;
    impression?: string;
    
    // Character Letter
    receiver?: string;
    letterGreeting?: string;
    letterBody?: string;
    letterSender?: string;

    // Rewrite Ending
    originalEnding?: string;
    imaginedEnding?: string;
    reasonForChange?: string;

    // Scene Drawing
    drawingImageData?: string;
    drawingTitle?: string;
    drawingExplanation?: string;
    comicType?: 'single' | 'four_cut';
    comicPanels?: Array<{ caption: string; image?: string }>;

    // Book Quiz
    quizzes?: Array<{
      question: string;
      type: 'ox' | 'choice' | 'short';
      options?: string[];
      answer: string;
      hint?: string;
    }>;

    // Golden Words & Vocabulary
    favoriteQuotes?: Array<{ quote: string; page?: string; reason: string }>;
    vocabularies?: Array<{ word: string; meaning: string; mySentence: string }>;

    // Character Interview
    intervieweeName?: string;
    qaList?: Array<{ question: string; answer: string }>;

    // Book Ad
    catchphrase?: string;
    targetReader?: string;
    reasonsToRead?: string[];
    adIllustrationData?: string;

    // Mind Map
    coreTheme?: string;
    branches?: Array<{ title: string; items: string[] }>;
  };
  teacherStamp?: StampType;
  teacherComment?: string;
}

export interface ReadingMilestone {
  level: number;
  requiredBooks: number;
  title: string;
  badge: string;
  color: string;
  description: string;
}
