// backend type set
export const POLICY_TYPE = Object.freeze({
  PRIVACY: '개인정보처리방침',
  SERVICE: '서비스 이용 약관',
  AGREE: '개인정보 수집 및 이용 동의서',
  REFUND: '취소 및 환불 정책',
  VIDEO: '영상정보처리기기 운영 관리방침'
});

export const AUTH_TYPE = Object.freeze({
  ADMIN: '최고 관리자',
  SUPERVISOR: '운영 관리자',
  MANAGER: '일반 관리자',
  COFFEE: '카페 직원',
  USER: '유저'
});

export const GENDER_TYPE = Object.freeze({
  MAN: '남',
  WOMAN: '여'
});

export const DOCENT_STATE_TYPE = Object.freeze({
  SCHEDULE: '예정',
  PROGRESS: '진행',
  TERMINATION: '종료'
});

export const EXHIBITION_STATE_TYPE = Object.freeze({
  SCHEDULE: '예정',
  BOOKING: '예매',
  PROGRESS: '진행',
  TERMINATION: '종료'
});

export const LOG_ACTION = Object.freeze({
  SUCCESS: '성공',
  FAIL: '실패',
  INSERT: '추가',
  UPDATE: '수정',
  DELETE: '삭제'
});

export const LOG_TYPE = Object.freeze({
  LOGIN: '로그인',
  ACCOUNT: '마이페이지',
  EXHIBITION: '전시',
  PROGRAM: '프로그램',
  TICKET: '티켓',
  HOLIDAY: '휴일',
  POPUP: '팝업 관리',
  DOCENT: '도센트',
  ADMIN: '관리자정보',
  POLICY: '개인정보처리방침',
  SLIDE: '슬라이드',
  NOTICE: '공지사항',
  EVENT: '이벤트'
});

export const PROGRAM_STATE_TYPE = Object.freeze({
  SCHEDULE: '예정',
  BOOKING: '예매',
  PROGRESS: '진행',
  TERMINATION: '종료'
});

export const TICKET_KIND_TYPE = Object.freeze({
  EXHIBITION: '전시',
  PROGRAM: '프로그램',
  COFFEE: '커피'
});

export const TICKET_STATE_TYPE = Object.freeze({
  PAYMENT: '결제 완료',
  ISSUANCE: '발급',
  USER_REFUND: '회원 환불',
  ADMIN_REFUND: '관리자 환불',
  USED: '사용 완료',
  EXPIRED: '기간 만료'
});

export const COUPON_STATE_TYPE = Object.freeze({
  NUMBER_OF_ENTRIES: '입장횟수',
  CREATED_DATE: '생성일시',
  USER_REFUND: '최근 로그인',
  LAST_LOGIN_DATE: '관리자 환불',
  MEMBERSHIP: '멤버십',
  ISSUANCE_STATUS: '쿠폰 발급 여부'
});

export const TICKET_TYPE = Object.freeze({
  NORMAL: '입장권',
  GROUP: '단체 입장권',
  INVITE: '초대권'
});

// user type set

export const USER_PAYMENT_TYPE = Object.freeze({
  PAYMENT: '결제 완료',
  ISSUANCE: '발급',
  USER_REFUND: '환불',
  ADMIN_REFUND: '환불',
  USED: '사용 완료',
  EXPIRED: '기간 만료'
});

export const ROUND_DETAIL_TYPE = Object.freeze({
  ENABLED: '예매 가능',
  CLOSE: '마감',
  SOLD_OUT: '매진',
  HOLIDAY: '휴무일'
});

// frontend type set
export const PAGE_SIZE_OPTIONS = [
  { value: 20, label: '20개' },
  { value: 30, label: '30개' },
  { value: 50, label: '50개' }
];

export const SEARCH_USER_TYPE = Object.freeze({
  CREATED_DATE: '가입일',
  LAST_LOGIN_DATE: '최근로그인'
});

export const CHART_TYPE = Object.freeze({
  COME: '입장',
  PRICE: '매출',
  SIGN_UP: '회원가입'
});

export const CHART_DATE_TYPE = Object.freeze({
  DAY: 'Day',
  MONTH: 'Month',
  DAY_WEEK: 'DayWeek',
  HOUR: 'Hour'
});

export const NOTICE_DETAIL = Object.freeze({
  title: '',
  isEnabled: true,
  isNotice: true,
  postDate: '',
  contents: '',
  files: []
});

export const TERMS_DETAIL = Object.freeze({
  id: null,
  title: '',
  postDate: '',
  isEnabled: false,
  contents: '',
  type: ''
});

export const EVENT_DETAIL = Object.freeze({
  title: '',
  isEnabled: true,
  startDate: '',
  endDate: '',
  contents: '',
  files: [],
  thumbnail: null
});

export const POPUPS_DETAIL = Object.freeze({
  title: '',
  isEnabled: true,
  startDate: '',
  endDate: '',
  pcImage: null,
  pcImageAlt: '',
  mobileImage: null,
  mobileImageAlt: '',
  isHideToday: true,
  isNewTab: true,
  link: ''
});

export const SLIDES_DETAIL = Object.freeze({
  title: '',
  subtitle: '',
  schedule: '',
  isEnabled: true,
  startDate: '',
  endDate: '',
  pcImage: null,
  pcImageAlt: '',
  mobileImage: null,
  mobileImageAlt: '',
  isUseButton: true,
  isNewTab: true,
  link: ''
});

export const EXHIBITION_DETAIL = Object.freeze({
  thumbnail: null, // file
  detailImage: null, // file
  title: '',
  subtitle: '',
  halls: ['A', 'B'], // ['A', 'B'],
  isEnabled: false,
  state: 'SCHEDULE',
  startDate: '', // 2022-10-10 00:00:00,
  endDate: '', // 2022-11-10 23:59:59,
  bookingDate: '', // 2022-10-06 00:00:00
  hour: '',
  contents: '',
  isUseButton: false,
  buttonTitle: '',
  buttonLink: '',
  isNewTab: false,
  /**
   * - rounds item
   *
   * {
   *   id: 1,
   *   startDate: '2022-10-10 09:00:00',
   *   endDate: '2022-10-10 10:00:00',
   *   limitNumber: 10
   * }
   */
  rounds: [],
  prices: [
    {
      isEnabled: true,
      type: '성인',
      price: 0,
      discounts: [
        {
          note: '',
          type: 'HANA_BANK',
          price: 0,
          enabled: false
        }
      ]
    },
    {
      isEnabled: true,
      type: '청소년',
      price: 0,
      discounts: [
        {
          note: '',
          type: 'HANA_BANK',
          price: 0,
          enabled: false
        }
      ]
    },
    {
      isEnabled: true,
      type: '유아 및 어린이',
      price: 0,
      discounts: [
        {
          note: '',
          type: 'HANA_BANK',
          price: 0,
          enabled: false
        }
      ]
    }
  ],
  writers: []
});

export const EXHIBITION_WRITERS = {};

export const EXHIBITION_WRITERS_INFO = {};

export const DOCENTS_DETAIL = {
  thumbnail: null,
  title: '',
  subtitle: '',
  halls: ['A', 'B'],
  isEnabled: false,
  startDate: '',
  endDate: '',
  infos: []
};

export const ADMIN_DETAIL = {
  email: null,
  name: '',
  password: '',
  phone: '',
  auth: 'SUPERVISOR'
};

export const EVENT_DEFAULT = {
  eventType: 'ongoing_exhibition_count',
  quantity: 0
}


export const POST_DETAIL = {
  name: '',
  memberships: [],
  note_image: {
    note_image_url: '',
    original_file_name: ''
  },
  is_enabled: true,
  content_detail: '',
  thumbnail_urls: {
    small: '',
    medium: '',
    large: ''
  },
  end_date: '',
  start_date: '',
  events:[{...EVENT_DEFAULT}],
};

export const COUPON_DEFAULT = {
  name: '',
  coupon_type: '',
  discount_percent: '',
  period_in_days: 0,
  image_url: '',
  number_of_uses: 1,
  is_permanent: false,
  startDate: '',
  endDate: ''
};

export const MEMBERSHIP_DEFAULT = {
  name: '',
  price: 0,
  image_url: '',
  checked: false,
  coupons: [{ ...COUPON_DEFAULT }]
};

export const CONTENT_TAG = {
  complete: '완전한',
  'on-going': '일어나고있다'
};
