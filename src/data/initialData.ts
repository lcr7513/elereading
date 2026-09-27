import { StudentProfile, BookEntry, ActivityData, ReadingMilestone } from '../types';

export const initialStudents: StudentProfile[] = [
  {
    id: 'student-1',
    school: '은빛초등학교',
    grade: 3,
    classRoom: 2,
    studentNumber: 15,
    name: '이지우',
    password: '123',
    status: 'approved',
    appliedAt: '2026-03-01',
    approvedAt: '2026-03-02',
    targetCount: 50,
    pledge: '매일 잠들기 전 20분씩 책을 읽고, 새로운 단어를 배우며 고운 마음을 키우겠습니다!',
    favoriteGenre: '동화·소설',
    motto: '책 속에 나의 꿈과 보물이 가득해요 ✨',
    startDate: '2026-03-02',
    avatar: '🌱',
  },
  {
    id: 'student-2',
    school: '꿈나무초등학교',
    grade: 4,
    classRoom: 1,
    studentNumber: 8,
    name: '김민준',
    password: '123',
    status: 'approved',
    appliedAt: '2026-03-02',
    approvedAt: '2026-03-03',
    targetCount: 40,
    pledge: '우주와 과학 책을 많이 읽어서 미래의 멋진 과학자가 되겠습니다!',
    favoriteGenre: '과학·수학',
    motto: '호기심과 상상력으로 세상을 탐험하자 🚀',
    startDate: '2026-03-03',
    avatar: '🚀',
  },
  {
    id: 'student-3',
    school: '늘푸른초등학교',
    grade: 2,
    classRoom: 3,
    studentNumber: 21,
    name: '박서아',
    password: '123',
    status: 'approved',
    appliedAt: '2026-03-04',
    approvedAt: '2026-03-05',
    targetCount: 30,
    pledge: '재미있는 동화와 그림책을 즐겁게 읽고 친구들에게 이야기해 줄래요!',
    favoriteGenre: '동화·소설',
    motto: '따뜻한 마음을 나누는 이야기 요정 🌟',
    startDate: '2026-03-05',
    avatar: '🌟',
  },
  {
    id: 'student-4',
    school: '은빛초등학교',
    grade: 3,
    classRoom: 2,
    studentNumber: 7,
    name: '최도윤',
    password: '456',
    status: 'pending',
    appliedAt: '2026-04-10',
    targetCount: 35,
    pledge: '역사와 모험 책을 재미있게 읽고 용기를 기르고 싶어요!',
    favoriteGenre: '위인·역사',
    motto: '오늘의 한 줄이 내일의 지혜가 된다 📖',
    startDate: '2026-04-10',
    avatar: '🦁',
  },
  {
    id: 'student-5',
    school: '은빛초등학교',
    grade: 3,
    classRoom: 2,
    studentNumber: 23,
    name: '한예은',
    password: '789',
    status: 'pending',
    appliedAt: '2026-04-11',
    targetCount: 45,
    pledge: '다양한 동시와 예술 도서를 읽고 그림을 그릴래요!',
    favoriteGenre: '예술·체육',
    motto: '상상력으로 가득 찬 세상 만들기 🎨',
    startDate: '2026-04-11',
    avatar: '🎨',
  }
];

export const initialProfile: StudentProfile = initialStudents[0];

export const initialBooks: BookEntry[] = [
  {
    id: 'book-1',
    date: '2026-03-04',
    title: '아홉 살 마음 사전',
    author: '박성우',
    illustrator: '김효은',
    publisher: '창비',
    pages: 168,
    genre: '철학·인성',
    rating: 5,
    oneLineReview: '마음을 표현하는 예쁜 낱말들을 배우고 내 감정을 솔직히 말할 수 있게 되었어요.',
    stamp: '참 잘했어요',
    hasActivity: true,
    activityId: 'act-1',
  },
  {
    id: 'book-2',
    date: '2026-03-08',
    title: '만복이네 떡집',
    author: '김리리',
    illustrator: '이승현',
    publisher: '비룡소',
    pages: 80,
    genre: '동화·소설',
    rating: 5,
    oneLineReview: '따뜻한 말 한마디가 친구의 마음을 활짝 열어준다는 것을 배웠어요.',
    stamp: '독서왕',
    hasActivity: true,
    activityId: 'act-2',
  },
  {
    id: 'book-3',
    date: '2026-03-12',
    title: '지각대장 존',
    author: '존 버닝햄',
    publisher: '비룡소',
    pages: 36,
    genre: '동화·소설',
    rating: 4,
    oneLineReview: '선생님이 존의 말을 믿어주지 않아서 답답했지만, 마지막 반전이 너무 재미있었어요.',
    stamp: '대단해요!',
    hasActivity: true,
    activityId: 'act-3',
  },
  {
    id: 'book-4',
    date: '2026-03-17',
    title: '마당을 나온 암탉',
    author: '황선미',
    illustrator: '김환영',
    publisher: '사계절',
    pages: 200,
    genre: '동화·소설',
    rating: 5,
    oneLineReview: '잎싹의 위대한 모성애와 용기 있는 도전이 가슴 깊이 감동을 주었어요.',
    stamp: '최고예요!',
    hasActivity: true,
    activityId: 'act-4',
  },
  {
    id: 'book-5',
    date: '2026-03-22',
    title: '신기한 스쿨버스: 태양계 탐험',
    author: '조애너 콜',
    illustrator: '브루스 데건',
    publisher: '비룡소',
    pages: 48,
    genre: '과학·수학',
    rating: 5,
    oneLineReview: '프리즈 선생님과 함께 행성들을 직접 여행하는 기분이 들어서 신기했어요.',
    stamp: '참 잘했어요',
    hasActivity: true,
    activityId: 'act-5',
  },
  {
    id: 'book-6',
    date: '2026-03-28',
    title: '세종대왕: 한글을 만든 어진 임금',
    author: '강민숙',
    publisher: '아이세움',
    pages: 140,
    genre: '위인·역사',
    rating: 5,
    oneLineReview: '백성을 사랑하는 마음으로 훈민정음을 만드신 세종대왕님이 정말 존경스러워요.',
    stamp: '독서왕',
    hasActivity: true,
    activityId: 'act-6',
  },
  {
    id: 'book-7',
    date: '2026-04-03',
    title: '동시 먹는 달팽이',
    author: '김용택',
    publisher: '창비',
    pages: 96,
    genre: '시·동시',
    rating: 4,
    oneLineReview: '시 구절마다 자연의 냄새와 시골 마을의 따스함이 묻어났어요.',
    stamp: '반짝별',
    hasActivity: false,
  },
  {
    id: 'book-8',
    date: '2026-04-09',
    title: '푸른 사자 와니니',
    author: '이현',
    illustrator: '오윤화',
    publisher: '창비',
    pages: 216,
    genre: '동화·소설',
    rating: 5,
    oneLineReview: '약하지만 포기하지 않고 당당한 사자로 성장한 와니니가 너무 멋졌어요!',
    stamp: '최고예요!',
    hasActivity: true,
    activityId: 'act-7',
  },
  {
    id: 'book-9',
    date: '2026-04-14',
    title: 'Why? 드론과 자율주행차',
    author: '예림당 편집부',
    publisher: '예림당',
    pages: 160,
    genre: '학습만화',
    rating: 4,
    oneLineReview: '미래에 하늘을 날아다닐 드론 택시를 빨리 타보고 싶어요.',
    stamp: '참 잘했어요',
    hasActivity: false,
  },
  {
    id: 'book-10',
    date: '2026-04-20',
    title: '어린 왕자',
    author: '생텍쥐페리',
    publisher: '시공주니어',
    pages: 136,
    genre: '철학·인성',
    rating: 5,
    oneLineReview: '가장 소중한 것은 눈에 보이지 않고 마음으로 보아야 한다는 말이 잊혀지지 않아요.',
    stamp: '독서왕',
    hasActivity: false,
  },
  {
    id: 'book-11',
    date: '2026-04-26',
    title: '한국사 탐험 만화 역사상식 1',
    author: '곰돌이 co.',
    publisher: '아이세움',
    pages: 180,
    genre: '위인·역사',
    rating: 4,
    oneLineReview: '고조선 건국 이야기와 단군 신화를 흥미진진하게 이해할 수 있었어요.',
    stamp: '대단해요!',
    hasActivity: false,
  },
  {
    id: 'book-12',
    date: '2026-05-02',
    title: '찰리와 초콜릿 공장',
    author: '로알드 달',
    illustrator: '퀸틴 블레이크',
    publisher: '시공주니어',
    pages: 232,
    genre: '동화·소설',
    rating: 5,
    oneLineReview: '정직하고 착한 찰리가 결국 공장을 물려받게 되어 통쾌하고 감동적이었어요.',
    stamp: '하트뿜뿜',
    hasActivity: false,
  }
];

export const initialActivities: ActivityData[] = [
  {
    id: 'act-1',
    bookId: 'book-1',
    bookTitle: '아홉 살 마음 사전',
    author: '박성우',
    type: 'golden_words',
    date: '2026-03-05',
    content: {
      favoriteQuotes: [
        {
          quote: '뿌듯하다 : 내가 한 일이 스스로 자랑스럽고 기쁠 때 드는 마음.',
          page: '42쪽',
          reason: '내가 스스로 숙제를 끝내고 방 청소를 했을 때의 기분이 딱 이 단어 같았기 때문입니다.'
        },
        {
          quote: '설레다 : 좋은 일이 생길 것 같아 가슴이 두근거릴 때.',
          page: '88쪽',
          reason: '새 학년에 올라가서 새 짝꿍을 만날 때 내 마음과 똑같아서 기억에 남습니다.'
        }
      ],
      vocabularies: [
        {
          word: '서운하다',
          meaning: '기대에 미치지 못하여 아쉽고 섭섭하다.',
          mySentence: '친구와 헤어질 때 많이 서운했지만 내일 또 보기로 약속했다.'
        },
        {
          word: '벅차다',
          meaning: '어떤 감정이 가슴에 넘칠 정도로 가득하다.',
          mySentence: '줄넘기 100개를 성공했을 때 가슴이 벅차올랐다.'
        },
        {
          word: '너그럽다',
          meaning: '마음이 넓고 남을 잘 이해해 주다.',
          mySentence: '실수한 동생을 너그럽게 안아주었다.'
        }
      ]
    },
    teacherStamp: '참 잘했어요',
    teacherComment: '자신의 감정을 풍부한 우리말 단어로 섬세하게 연결 지어 잘 표현했네요!'
  },
  {
    id: 'act-2',
    bookId: 'book-2',
    bookTitle: '만복이네 떡집',
    author: '김리리',
    type: 'character_letter',
    date: '2026-03-09',
    content: {
      receiver: '마음이 따뜻해진 만복이에게',
      letterGreeting: '안녕 만복아! 나는 은빛초등학교에 다니는 지우라고 해.',
      letterBody: '처음에는 네가 친구들에게 심술궂게 굴고 욕을 해서 조금 미웠어. 하지만 네 마음속 진짜 마음은 친구들과 친해지고 싶은 것이었다는 걸 알고 마음이 짠했단다. 신기한 떡을 먹고 달콤한 칭찬의 말을 건넬 때, 환하게 웃는 친구들의 얼굴을 보며 네가 얼마나 기뻤을지 상상이 돼! 나도 앞으로 친구들에게 예쁜 말과 칭찬을 많이 전할게. 너도 계속 다정한 만복이가 되어줘!',
      letterSender: '2026년 3월 9일, 너의 친구 지우가 📮'
    },
    teacherStamp: '최고예요!',
    teacherComment: '만복이의 변화된 마음에 깊이 공감하고 자신의 다짐까지 훌륭하게 적었어요.'
  },
  {
    id: 'act-3',
    bookId: 'book-3',
    bookTitle: '지각대장 존',
    author: '존 버닝햄',
    type: 'rewrite_ending',
    date: '2026-03-13',
    content: {
      originalEnding: '선생님이 털복숭이 고릴라에게 붙잡혀 천장에 매달려 계셨는데, 존은 선생님의 말을 흉내 내며 "이 동네에는 고릴라가 살지 않아요"라고 말하며 무심하게 지나간다.',
      imaginedEnding: '존은 배낭에서 신비한 호루라기를 꺼내 고릴라를 진정시켰다. 고릴라에게 맛있는 바나나를 주고 선생님을 무사히 구해드렸다. 선생님은 눈물을 글썽이며 존에게 그동안 악어와 사자 이야기를 믿지 않고 벌을 주어서 미안하다고 정중히 사과하셨다. 존과 선생님은 마주 보고 환하게 웃으며 참된 믿음의 친구가 되었다.',
      reasonForChange: '원래 결말도 통쾌했지만, 선생님과 존이 서로의 진심을 이해하고 진정한 화해를 나누는 따뜻한 결말을 만들어보고 싶었기 때문입니다.'
    },
    teacherStamp: '대단해요!',
    teacherComment: '상상력과 따뜻한 배려심이 돋보이는 멋진 결말 재창작입니다!'
  },
  {
    id: 'act-4',
    bookId: 'book-4',
    bookTitle: '마당을 나온 암탉',
    author: '황선미',
    type: 'summary_impression',
    date: '2026-03-18',
    content: {
      motivation: '학교 도서관 추천 도서 목록에서 제목을 보고 잎싹의 모험이 궁금해서 읽게 되었습니다.',
      summary: '양계장에 갇혀 알만 낳던 암탉 잎싹은 마당을 탈출하여 자유를 찾는다. 잎싹은 버려진 청둥오리 알을 품어 새끼 오리 초록머리를 낳고, 족제비의 위험 속에서도 지혜와 사랑으로 초록머리를 당당한 청둥오리로 키워내 넓은 하늘로 날려 보낸다.',
      impressiveScene: '잎싹이 밤마다 족제비로부터 초록머리를 지키기 위해 자신의 날개로 꼭 품어 안고 날카로운 바람을 견디던 장면입니다.',
      impression: '잎싹을 통해 진정한 자유와 어머니의 숭고한 사랑이 얼마나 위대한지 깨달았습니다. 나도 내 삶의 주인이 되어 용기 있게 꿈을 향해 나아가겠습니다.'
    },
    teacherStamp: '독서왕',
    teacherComment: '줄거리 요약이 논리정연하고, 책의 핵심 주제를 깊이 있게 파악하였습니다.'
  },
  {
    id: 'act-5',
    bookId: 'book-5',
    bookTitle: '신기한 스쿨버스: 태양계 탐험',
    author: '조애너 콜',
    type: 'book_quiz',
    date: '2026-03-23',
    content: {
      quizzes: [
        {
          question: '태양계에서 가장 크고 아름다운 고리를 가진 행성은 토성이다.',
          type: 'ox',
          answer: 'O',
          hint: '얼음과 암석 조각들로 이루어진 거대한 고리가 있어요.'
        },
        {
          question: '태양계에서 표면 온도가 가장 뜨겁고 짙은 황산 구름으로 덮인 행성은?',
          type: 'choice',
          options: ['1. 수성', '2. 금성', '3. 화성', '4. 목성'],
          answer: '2. 금성',
          hint: '온실효과 때문에 밤낮없이 섭씨 400도가 넘어요.'
        },
        {
          question: '화성이 붉은색으로 보이는 주된 이유는 토양에 붉은 산화 (   ) 성분이 많기 때문이다.',
          type: 'short',
          answer: '철',
          hint: '녹슨 쇠붙이와 같은 성분이에요.'
        }
      ]
    },
    teacherStamp: '참 잘했어요',
    teacherComment: '과학적 지식을 퀴즈로 쏙쏙 뽑아내어 친구들과 함께 풀기 좋은 문제를 만들었네요.'
  },
  {
    id: 'act-6',
    bookId: 'book-6',
    bookTitle: '세종대왕: 한글을 만든 어진 임금',
    author: '강민숙',
    type: 'character_interview',
    date: '2026-03-29',
    content: {
      intervieweeName: '조선 제4대 임금 세종대왕',
      qaList: [
        {
          question: '전하, 수많은 신하들의 반대에도 불구하고 훈민정음을 창제하신 가장 큰 이유는 무엇입니까?',
          answer: '어리석은 백성들이 억울한 일을 당해도 제 뜻을 펴지 못하는 것이 몹시 안타까웠기 때문이다. 글을 쉽게 깨우쳐 누구나 지혜롭게 살길 바라는 마음뿐이었느니라.'
        },
        {
          question: '집현전 학사들과 측우기, 자격루 같은 과학 발명품도 많이 만드셨는데 가장 보람찬 순간은 언제이셨나요?',
          answer: '농사짓는 백성들이 가뭄과 홍수에 대비하여 풍년을 맞이하고, 정확한 절기를 알아 편안해하는 모습을 보았을 때 가장 기뻤단다.'
        },
        {
          question: '오늘날 한글을 사용하는 초등학생 후손들에게 당부하고 싶으신 말씀이 있으신가요?',
          answer: '아름답고 고운 우리말을 소중히 아끼며 서로를 배려하는 따뜻한 마음을 담아 써주길 바란다.'
        }
      ]
    },
    teacherStamp: '최고예요!',
    teacherComment: '역사적 맥락을 정확히 이해하고 가상 인터뷰를 생생하고 기품 있게 구성했습니다.'
  },
  {
    id: 'act-7',
    bookId: 'book-8',
    bookTitle: '푸른 사자 와니니',
    author: '이현',
    type: 'book_ad',
    date: '2026-04-10',
    content: {
      catchphrase: '작고 연약하다고 기죽지 마! 내 안의 용기를 깨우는 아프리카 초원의 대모험!',
      targetReader: '자신감이 부족하거나 새로운 도전을 앞두고 망설이는 모든 친구들',
      reasonsToRead: [
        '무리에서 쫓겨났지만 포기하지 않고 성장하는 와니니의 뜨거운 용기',
        '서로 다른 동물들이 힘을 합쳐 만들어가는 진정한 우정 이야기',
        '손에 땀을 쥐게 만드는 박진감 넘치는 사바나 초원의 생생한 묘사'
      ]
    },
    teacherStamp: '참 잘했어요',
    teacherComment: '눈길을 사로잡는 문구와 명확한 추천 이유가 친구들의 독서 호기심을 돋우네요!'
  }
];

export const readingMilestones: ReadingMilestone[] = [
  {
    level: 1,
    requiredBooks: 1,
    title: '새싹 독서가',
    badge: '🌱',
    color: 'from-emerald-400 to-teal-500',
    description: '독서 기록장의 첫 발걸음을 뗀 기특한 꿈나무!'
  },
  {
    level: 2,
    requiredBooks: 5,
    title: '책벌레 탐험가',
    badge: '🐛',
    color: 'from-lime-400 to-emerald-500',
    description: '책 읽는 재미에 퐁당 빠져드는 중!'
  },
  {
    level: 3,
    requiredBooks: 10,
    title: '열매 맺는 이야기꾼',
    badge: '🍎',
    color: 'from-amber-400 to-orange-500',
    description: '10권 돌파! 지혜의 열매가 무럭무럭 열려요.'
  },
  {
    level: 4,
    requiredBooks: 20,
    title: '지혜의 숲 개척자',
    badge: '🌲',
    color: 'from-green-500 to-emerald-700',
    description: '책 속 세상을 종횡무진 누비는 멋진 독서가!'
  },
  {
    level: 5,
    requiredBooks: 30,
    title: '생각 챔피언',
    badge: '🏆',
    color: 'from-yellow-400 to-amber-600',
    description: '다양한 분야의 책을 골고루 읽는 지식 마스터!'
  },
  {
    level: 6,
    requiredBooks: 50,
    title: '황금빛 독서 마스터',
    badge: '👑',
    color: 'from-purple-500 to-indigo-600',
    description: '독서 목표 50권 완주! 학교 대표 독서왕!'
  },
  {
    level: 7,
    requiredBooks: 100,
    title: '불멸의 독서 전설',
    badge: '🌟',
    color: 'from-rose-500 to-pink-600',
    description: '100권 돌파! 세상을 밝히는 지혜의 등불!'
  }
];

export const initialBooksByStudent: Record<string, BookEntry[]> = {
  'student-1': initialBooks,
  'student-2': [
    {
      id: 's2-b1',
      date: '2026-03-05',
      title: '코스모스 (청소년을 위한 우주 이야기)',
      author: '칼 세이건 (청소년판)',
      publisher: '사이언스북스',
      pages: 210,
      genre: '과학·수학',
      rating: 5,
      oneLineReview: '끝없이 펼쳐진 신비로운 우주와 별들의 탄생 이야기에 푹 빠졌습니다.',
      stamp: '독서왕',
      hasActivity: true,
      activityId: 's2-act-1',
    },
    {
      id: 's2-b2',
      date: '2026-03-12',
      title: '로봇 친구와 인공지능의 미래',
      author: '이정모',
      publisher: '주니어김영사',
      pages: 145,
      genre: '과학·수학',
      rating: 5,
      oneLineReview: '인공지능 로봇과 인간이 친구가 되어 살아가는 미래 도시를 상상해 보았습니다.',
      stamp: '참 잘했어요',
      hasActivity: true,
      activityId: 's2-act-2',
    },
    {
      id: 's2-b3',
      date: '2026-03-19',
      title: '장영실: 조선 최고의 천재 과학자',
      author: '김하은',
      publisher: '아이세움',
      pages: 160,
      genre: '위인·역사',
      rating: 5,
      oneLineReview: '신분의 한계를 뛰어넘어 자격루와 측우기를 발명한 끈기와 열정에 감동받았습니다.',
      stamp: '최고예요!',
      hasActivity: false,
    },
    {
      id: 's2-b4',
      date: '2026-03-27',
      title: '마법 천자문 1권',
      author: '스튜디오 시리얼',
      publisher: '아울북',
      pages: 172,
      genre: '학습만화',
      rating: 4,
      oneLineReview: '손오공과 함께 한자 마법을 외우며 재미있게 한자를 익혔습니다.',
      stamp: '대단해요!',
      hasActivity: false,
    },
    {
      id: 's2-b5',
      date: '2026-04-05',
      title: '비밀의 화원',
      author: '프랜시스 호지슨 버넷',
      publisher: '시공주니어',
      pages: 280,
      genre: '동화·소설',
      rating: 5,
      oneLineReview: '자연과 꽃을 가꾸며 메리와 콜린의 마음이 건강하게 피어나는 과정이 아름다웠어요.',
      stamp: '하트뿜뿜',
      hasActivity: false,
    }
  ],
  'student-3': [
    {
      id: 's3-b1',
      date: '2026-03-08',
      title: '구름빵',
      author: '백희나',
      publisher: '한솔수북',
      pages: 44,
      genre: '동화·소설',
      rating: 5,
      oneLineReview: '따뜻한 구름빵을 먹고 하늘을 둥둥 날아 아빠에게 배달하는 상상이 정말 귀여웠어요!',
      stamp: '참 잘했어요',
      hasActivity: true,
      activityId: 's3-act-1',
    },
    {
      id: 's3-b2',
      date: '2026-03-16',
      title: '알사탕',
      author: '백희나',
      publisher: '책읽는곰',
      pages: 48,
      genre: '동화·소설',
      rating: 5,
      oneLineReview: '마음의 소리를 들려주는 달콤한 알사탕을 나도 꼭 먹어보고 싶어요.',
      stamp: '독서왕',
      hasActivity: false,
    },
    {
      id: 's3-b3',
      date: '2026-03-25',
      title: '풀꽃 그림책: 나태주 동시집',
      author: '나태주',
      publisher: '예담',
      pages: 88,
      genre: '시·동시',
      rating: 5,
      oneLineReview: '자세히 보아야 예쁘고 오래 보아야 사랑스럽다는 말이 가슴에 남아요.',
      stamp: '반짝별',
      hasActivity: false,
    }
  ]
};

export const initialActivitiesByStudent: Record<string, ActivityData[]> = {
  'student-1': initialActivities,
  'student-2': [
    {
      id: 's2-act-1',
      bookId: 's2-b1',
      bookTitle: '코스모스 (청소년을 위한 우주 이야기)',
      author: '칼 세이건 (청소년판)',
      type: 'book_ad',
      date: '2026-03-06',
      content: {
        catchphrase: '우리는 모두 별에서 온 아이들! 광활한 우주 대모험을 떠나자!',
        targetReader: '밤하늘 별을 바라보며 우주 과학자의 꿈을 키우는 친구들',
        reasonsToRead: [
          '지구와 태양계, 은하계의 신비로운 탄생 비밀을 알기 쉽게 설명해 줍니다.',
          '어렵고 복잡한 천문학을 한 편의 시처럼 아름답게 풀어냅니다.',
          '우주 속에서 지구라는 작은 행성을 아끼고 사랑하는 마음을 배울 수 있습니다.'
        ]
      },
      teacherStamp: '독서왕',
      teacherComment: '우주에 대한 깊은 호기심과 추천 포인트를 잘 살려 광고지를 멋지게 구성했네요!'
    },
    {
      id: 's2-act-2',
      bookId: 's2-b2',
      bookTitle: '로봇 친구와 인공지능의 미래',
      author: '이정모',
      type: 'character_letter',
      date: '2026-03-14',
      content: {
        receiver: '미래에서 온 반려 로봇 알파에게',
        letterGreeting: '안녕 알파! 나는 미래의 로봇 공학자를 꿈꾸는 4학년 민준이야.',
        letterBody: '책 속에서 네가 사람의 마음을 헤아리고 친구가 되어주는 모습을 보며 감동을 받았어. 나도 열심히 공부해서 도움이 필요한 사람들을 따뜻하게 위로하고 안전하게 지켜주는 착한 로봇을 만들고 싶어. 미래에 우리 진짜 친구로 만나자!',
        letterSender: '2026년 3월 14일, 너를 기다리는 민준이가 🚀'
      },
      teacherStamp: '참 잘했어요',
      teacherComment: '진심 어린 편지를 통해 자신의 장래 희망과 과학적 포부를 훌륭하게 표현했습니다.'
    }
  ],
  'student-3': [
    {
      id: 's3-act-1',
      bookId: 's3-b1',
      bookTitle: '구름빵',
      author: '백희나',
      type: 'summary_impression',
      date: '2026-03-09',
      content: {
        motivation: '표지의 귀여운 고양이 그림과 구름으로 빵을 만든다는 이야기가 신기해서 읽었습니다.',
        summary: '비 오는 날 아침, 나뭇가지에 걸린 작은 뭉게구름을 따서 엄마가 맛있는 구름빵을 구워주셨다. 구름빵을 먹고 둥실 떠오른 홍비와 홍시는 꽉 막힌 도로에서 고생하시는 아빠에게 날아가 구름빵을 전해드려 아빠가 무사히 회사에 도착하도록 도왔다.',
        impressiveScene: '빗속을 날아서 회사 버스에 갇혀 계시던 아빠에게 따뜻한 구름빵을 건네던 장면',
        impression: '가족을 사랑하는 따뜻한 마음이 느껴져서 마음이 몽글몽글해졌습니다. 나도 부모님께 효도하고 싶어요.'
      },
      teacherStamp: '참 잘했어요',
      teacherComment: '책의 줄거리와 따스한 감동을 솔직하고 예쁘게 잘 정리했어요!'
    }
  ]
};

export const GENRE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '동화·소설': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  '과학·수학': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  '위인·역사': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  '사회·문화': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  '시·동시': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  '예술·체육': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  '학습만화': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  '철학·인성': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  '기타': { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' },
};
