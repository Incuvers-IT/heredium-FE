<template>
  <main class="container">
    <SideBarMyPage />
    <section class="info-sec">
      <div class="my-info-head">
        <h2>내 정보 수정</h2>
        <div v-if="modify === false" class="grid-wrap"></div>
      </div>
      <div v-if="modify === false" class="my-info-body">
        <p class="account-info">계정 정보는 안전하게 보호되고 있어요. <br class="only-mobile" />수정을 원하면 비밀번호를 입력해주세요.</p>
        <UInput
          v-model="password"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          w-size="full"
          class="h-m"
          style="margin-bottom: 1.2rem; max-width: 43.6rem;"
          @enter="onPasswordConfirm"
        />
        <UButton w-size="100" @click="onPasswordConfirm">확인</UButton>
      </div>
      <div v-else class="my-info-body">
        <div class="add-info">
          <p class="p1">회원 정보</p>
        </div>
        <div class="grid-wrap"></div>
        <div class="form-rows">
          <!-- 이름 (읽기전용 입력으로 보여주기) -->
          <div class="form-row">
            <label class="form-label">이름</label>
            <div class="form-field">
              <UInput :value="account.name" readonly disabled class="h-xs" w-size="full" />
            </div>
          </div>
          <!-- 아이디 -->
          <div class="form-row">
            <label class="form-label">아이디</label>
            <div class="form-field">
              <div v-if="!emailChange" class="inline-field">
                <UInput :value="account.email" readonly disabled class="h-xs" w-size="full" />
                <div v-if="!isSNSLogin" class="inline-field">
                  <UButton class="xs" button-type="chart" @click="onEmailChange">아이디 변경</UButton>
                </div>
                <div v-else class="sns-label">
                  [{{
                    SNSLoginType === 'KAKAO' ? '카카오'
                    : SNSLoginType === 'NAVER' ? '네이버'
                    : SNSLoginType === 'GOOGLE' ? '구글'
                    : SNSLoginType === 'APPLE' ? '애플' : '존재하지 않는 SNS'
                  }}]
                </div>
              </div>
              <div v-else>
                <UInput
                  v-model="account.email"
                  class="h-xs"
                  w-size="full"
                  :class="{ 'is-error': !feedback.email.isValid }"
                  :error-msg="feedback.email.text"
                  placeholder="id@gmail.com"
                />
                <div style="margin-top: 8px;">
                  <UButton class="xs" button-type="chart" @click="cancelEmailChange">취소</UButton>
                </div>
              </div>
            </div>
          </div>
          <!-- 비밀번호(변경 버튼) -->
          <div v-if="!isSNSLogin" class="form-row">
            <label class="form-label">새 비밀번호</label>
            <div class="form-field">
              <div v-if="!passwordChange" class="inline-field">
                <UButton class="xs" button-type="chart" @click="onPasswordChange">비밀번호 변경</UButton>
              </div>
              <div v-else class="stack">
                <UInput
                  v-model="newPassword1"
                  type="password"
                  class="h-xs"
                  w-size="full"
                  :class="{ 'is-error': !feedback.newPassword1.isValid }"
                  :error-msg="feedback.newPassword1.text"
                  placeholder="8 ~ 16자로 입력해주세요."
                />
                <UInput
                  v-model="newPassword2"
                  type="password"
                  class="h-xs mt-8"
                  w-size="full"
                  :class="{ 'is-error': !feedback.newPassword2.isValid }"
                  :error-msg="feedback.newPassword2.text"
                  placeholder="비밀번호를 재입력해주세요."
                />
                <div style="margin-top: 8px;">
                  <UButton class="xs" button-type="chart" @click="cancelPasswordChange">취소</UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- 휴대폰 번호 -->
          <div class="form-row">
            <label class="form-label">휴대폰 번호</label>
            <div class="form-field">
              <div class="inline-field">
                <UInput :value="getPhone(account.phone)" readonly disabled class="h-xs" w-size="full" />
                <UButton class="xs" button-type="chart" @click="onPhoneClick">
                  {{ !currentUser?.birthDate?.trim() ? '휴대폰 인증' : '휴대폰 번호 변경' }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="marketing-area"> -->
          <!-- <UCheckbox v-model="account.isMarketingReceive">마케팅 활용 동의 및 광고 수신 동의</UCheckbox> -->
        <!-- </div> -->
        <div class="add-info">
          <p class="p1">추가 정보 입력</p>
          <p class="p2">추가 정보 입력 및 마케팅 정보 수신활용에 동의하시면 혜택을 드려요!</p>
        </div>
        <div class="grid-wrap" style="padding-top: 2.2rem;"></div>
        <div class="terms-area">
          <div class="each-terms">
            <UCheckbox v-model="form.additionalInfoAgreed">
              <strong style="margin-right: 5px;">(선택)</strong>추가 개인정보 수집 및 활용에 동의합니다.
            </UCheckbox>
            <div v-if="form.additionalInfoAgreed" class="grid-gray-wrap"></div>
            <div v-if="form.additionalInfoAgreed" class="add-input">
              <div class="input job-input">
                <label>직업</label>
                <div style="margin-top: 1.2rem;">
                  <USelect
                    v-model="form.job"
                    :option-list="jobOptions"
                    default-text="선택"
                    w-size="full"
                    :searchable="true"
                    :class="{ 'is-error': !feedback.job.isValid }"
                  />
                </div>
                <p v-if="!feedback.job.isValid" class="error-msg">{{ feedback.job.text }}</p>
              </div>

              <div class="input city-input">
                <label>지역</label>
                <div style="margin-top: 1.2rem;">
                  <USelect
                    v-model="form.region.state"
                    :option-list="cityOptions"
                    w-size="full"
                    default-text="시/도 선택"
                    :searchable="true"
                    :class="{ 'is-error': !feedback.regionState.isValid }"
                  />
                  <p v-if="!feedback.regionState.isValid || !feedback.regionDistrict.isValid" class="error-msg">{{ feedback.regionState.text }}</p>
                </div>
              </div>
              <div class="input district-input">
                <USelect
                  v-model="form.region.district"
                  :option-list="districtOptions"
                  w-size="full"
                  default-text="시/군/구 선택"
                  :searchable="true"
                  :class="{ 'is-error': !feedback.regionDistrict.isValid }"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="terms-area">
          <div class="each-terms">
            <UCheckbox v-model="isTerms.MARKETING" class="checkBox">
              <strong style="margin-right: 5px;">(선택)</strong>마케팅 정보 수집에 동의합니다.
            </UCheckbox>
          </div>
          <div class="marketing-info">
            <p>
              고객(정보주체)의 개인정보보호 및 권리는
              「개인정보 보호법」및 관계 법령에 따라 헤레디움(사이트)에서 안전하게 관리하고 있습니다.
            </p>
          </div>
        </div>
        <div class="submit-area">
          <UButton w-size="100" @click="onSaveData">완료</UButton>
          <NuxtLink to="/mypage/info/withdrawal" class="withdrawal-btn">회원탈퇴</NuxtLink>
        </div>
      </div>
      <UDialogModal no-scroll-lock :is-show="modal.isError">
        <template #content>{{ errorMsg }}</template>
        <template #modal-btn2>
          <UButton w-size="100" button-type="primary" @click="modal.isError = false">확인</UButton>
        </template>
      </UDialogModal>
      <UDialogModal
        no-scroll-lock
        :is-show="modal.isSave"
        title="저장 완료"
        @close="modal.isSave = false"
      >
        <template #content>
          저장이 완료되었습니다.
        </template>
        <template #modal-btn2>
          <UButton
            w-size="100"
            button-type="primary"
            @click="onConfirmModal"
          >
            확인
          </UButton>
        </template>
      </UDialogModal>
      <UDialogModal
        no-scroll-lock
        title="선택 동의 해지 안내"
        title-align="center"
        content-align="center"
        :is-show="showCancelWarning"
        @close="showCancelWarning = false"
      >
        <template #content>
          선택 약관 동의를 해지하면<br/>
          추가 혜택이 제한될 수 있어요.<br/>
          그래도 해지하시겠어요?
        </template>
        <template #modal-btn1>
          <UButton button-type="standard" @click="showCancelWarning = false">
            아니요
          </UButton>
        </template>
        <template #modal-btn2>
          <UButton button-type="primary" @click="onConfirmCancelWarning">
            네
          </UButton>
        </template>
      </UDialogModal>
      <UDialogModal
        no-scroll-lock
        :is-show="modal.noChange"
        @close="modal.noChange = false"
      >
        <template #content>변경된 정보가 없습니다.</template>
        <template #modal-btn2>
          <UButton w-size="100" button-type="primary" @click="modal.noChange = false">확인</UButton>
        </template>
      </UDialogModal>
      <!-- 발급 쿠폰 모달 -->
      <!-- <MarketingCoupon
        :is-show="couponModalVisible"
        :coupons="issuedCoupons"
        @close="couponModalVisible = false"
      /> -->
      <AdditionalInfoModal
        v-if="showAdditionalInfoModal && currentUser?.birthDate"
        :is-show="showAdditionalInfoModal"
        :initial-form="{
          job: form.job,
          region: { state: form.region.state, district: form.region.district },
          additionalInfoAgreed: form.additionalInfoAgreed,
          agreeMarketing: isTerms.MARKETING
        }"
        @saved="onAdditionalSaved"
        @close="onAdditionalClosed"
      />
      <PhoneConsentModal
        :is-show="phoneConsent.show"
        :message-html="phoneConsent.message"
        confirm-text="인증하기"
        cancel-text="취소"
        confirm-type="primary"
        cancel-type="secondary"
        confirm-class="btn-fill"
        cancel-class="btn-outline"
        @close="closePhoneConsent"
        @confirm="confirmPhoneConsent"
      />
      <!-- 미성년자 안내 -->
      <UDialogModal
        no-scroll-lock
        :is-show="modal.phoneMinorNotice"
        title="등급 안내"
        title-align="center"
        content-align="center"
        @close="onMinorCancel"
      >
        <template #content>
          <div class="minor-notice-content">
            미성년자 등급으로 분류됩니다.<br/>
            미성년자 등급 선택 시 마일리지가 초기화되며,<br/>
            만 19세가 도래하는 시점까지<br/>
            마일리지 적립 및 사용이 제한됩니다.<br/>
            <span class="highlight">적립 마일리지: {{ mileageTotal }}</span>
          </div>
        </template>
        <template #modal-btn1>
          <UButton button-type="standard" @click="onMinorCancel">취소</UButton>
        </template>
        <template #modal-btn2>
          <UButton button-type="primary" @click="onMinorProceed">전환하기</UButton>
        </template>
      </UDialogModal>

      <!-- 성인 인증 완료 -->
      <UDialogModal
        no-scroll-lock
        :is-show="modal.phoneSuccess"
        title="인증 완료"
        title-align="center"
        content-align="center"
        @close="onPhoneSuccessProceed"
      >
        <template #content>휴대폰 인증이 완료되었습니다.</template>
        <template #modal-btn2>
          <UButton button-type="primary" @click="onPhoneSuccessProceed">추가 정보 입력하고 혜택 받기</UButton>
        </template>
      </UDialogModal>
    </section>
  </main>
</template>

<script>
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';
import UInput from '~/components/user/common/UInput';
import UButton from '~/components/user/common/UButton';
import UDialogModal from '~/components/user/modal/UDialogModal';
import USelect   from '~/components/user/common/USelect';
import UCheckbox from '~/components/user/common/UCheckbox';
import { createFormElement } from '~/assets/js/commons';
import { REGION_DATA, JOB_OPTIONS, GENDER_TYPE } from '~/assets/js/types';
// import MarketingCoupon from '~/components/user/modal/coupon/MarketingCoupon.vue';
import AdditionalInfoModal from '~/components/user/modal/AdditionalInfoModal.vue';
import PhoneConsentModal from '~/components/user/modal/PhoneConsentModal.vue';

export default {
  name: 'MyPage',
  // MarketingCoupon
  components: { UInput, UButton, UDialogModal, SideBarMyPage, USelect, UCheckbox, AdditionalInfoModal, PhoneConsentModal },
  asyncData({ store, redirect }) {
    const isLogged = !!store.getters['service/auth/getAccessToken'];

    if (!isLogged) {
      redirect('/');
    }
  },
  data() {
    return {
      isSNSLogin: false,
      SNSLoginType: '',
      password: '',
      errorMsg: '',
      account: {},
      emailChange: false,
      passwordChange: false,
      errQuery: '',
      newPassword1: '',
      newPassword2: '',
      modify: false,
      modal: {
        isSave: false,
        isError: false,
        noChange:  false,
        phoneMinorNotice: false,
        phoneSuccess: false,
      },
      feedback: {
        email: {
          isValid: true,
          text: ''
        },
        newPassword1: {
          isValid: true,
          text: ''
        },
        newPassword2: {
          isValid: true,
          text: ''
        },
        job: { isValid: true, text: '' },
        regionState: { isValid: true, text: '' },
        regionDistrict: { isValid: true, text: '' },
      },
      form: {
        job: null,
        region: { state: null, district: null },
        additionalInfoAgreed: false,
        marketingAgreedDate: null,
      },
      originalInfo: {
        encodeData: null,
        email: null,
        phone:  null,
        job: null,
        state: null,
        district: null,
        additionalInfoAgreed: false,
        marketingAgreed: false,
      },
      regionWatchReady: false,
      // 경고 모달 표시용
      showCancelWarning: false,
      pendingPayload: null,
      jobOptions: JOB_OPTIONS,
      regionData: REGION_DATA,
      isTerms: { MARKETING: false },
      couponModalVisible: false,
      issuedCoupons: [],
      phoneChange: false,
      showAdditionalInfoModal: false,
      phoneConsent: { show: false, message: '' },
      snapshotOnNextUserSync: false,
      mileageTotal: 0,
      pendingPhoneUserInfo: null,    // 미성년자일 때 PUT 보류용
      prePhoneUserSnapshot: null,
      openAdditionalAfterSuccess: false,
      isSavingPhone: false,
    };
  },
  async fetch() {
    if (this.$route.params.EncodeData) {
      const userInfo = await this.$axios.$get('/nice/decrypt', {
        params: {
          encodeData: this.$route.params.EncodeData
        }
      });

      if (userInfo) {
        this.modify = true;
        this.account = {
          email: this.$route.params.email,
          name: userInfo.name,
          birthday: userInfo.birthDate,
          gender: userInfo.gender,
          phone: userInfo.mobileNo,
          isLocalResident: this.$route.params.isLocalResident === 'true',
          isMarketingReceive: this.$route.params.isMarketingReceive === 'true'
        };

        await this.upsertUserFromPhone(userInfo);
      }
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters['service/auth/getUserInfo']
    },
    // table 렌더링용
    cityOptions() {
      return this.regionData.map(r => ({ value: r.state, label: r.state }));
    },
    districtOptions() {
      const region = this.regionData.find(r => r.state === this.form.region.state);
      return region
        ? region.districts.map(d => ({ value: d, label: d }))
        : [];
    },
  },
  watch: {
    'form.region.state'(newState, oldState) {
      // 초기 하이드레이션 중에는 동작하지 않음(기존값 유지)
      if (!this.regionWatchReady) return;

      // 선택 해제되면 군구도 비움
      if (!newState) {
        this.form.region.district = null;
        return;
      }

      // 사용자가 시/도를 바꿨으면 군구 첫 번째 값으로 초기화
      const opts = this.districtOptions;         // 새 시/도의 군구 목록
      this.form.region.district = opts.length ? opts[0].value : null;
    },
    currentUser: {
      immediate: true,
      deep: false,
      handler(nv) {
        if (!nv) return;
        // ✅ UI만 갱신, 스냅샷 NO
        this.applyUserToForm(nv, { snapshot: this.snapshotOnNextUserSync });
        this.snapshotOnNextUserSync = false; // 한 번만 쓰고 바로 끔
      }
    }
  },
  created() {
    if (this.currentUser) {
      // and seed your 추가 정보 form
      this.form.job                  = this.currentUser.job
      this.form.region.state         = this.currentUser.state
      this.form.region.district      = this.currentUser.district
      this.form.additionalInfoAgreed = this.currentUser.additionalInfoAgreed
      this.isTerms.MARKETING         = this.currentUser.isMarketingReceive
      this.account.isLocalResident   = this.currentUser.isLocalResident
      this.form.marketingAgreedDate  = this.currentUser.marketingAgreedDate

      this.syncOriginalInfoFrom(this.currentUser);

      // 인증 콜백으로 돌아왔으면 phoneChange 플래그 켜기
      if (this.$route.params.EncodeData) {
        this.phoneChange = true;
      }
    }

    this.$nextTick(() => {
      this.SNSLoginType = this.$store.getters['service/auth/getUserInfo']?.provider;
      this.isSNSLogin = this.SNSLoginType !== 'EMAIL';

      if (this.isSNSLogin) {
        this.onPasswordConfirm();
      }

      this.regionWatchReady = true;
    });
  },
  methods: {
    restorePendingPayload() {
      try {
        const raw = sessionStorage.getItem('mypage.pendingPayload');
        if (!raw) return false;
        const p = JSON.parse(raw);

        // 폼/동의 상태 복구
        this.form.job                  = p.job ?? null;
        this.form.region.state         = p.state ?? null;
        this.form.region.district      = p.district ?? null;
        this.form.additionalInfoAgreed = !!p.additionalInfoAgreed;
        this.isTerms.MARKETING         = !!p.isMarketingReceive;
        this.form.marketingAgreedDate  = p.marketingAgreedDate ?? null;

        // 재사용할 수 있게 보관(선택)
        this.pendingPayload = p;

        // 한 번 쓰고 지움
        sessionStorage.removeItem('mypage.pendingPayload');
        return true;
      } catch (e) {
        console.warn('restorePendingPayload failed', e);
        return false;
      }
    },
    // YYYYMMDD 혹은 YYYY-MM-DD 모두 허용
    parseBirthToDate(birthStr) {
      if (!birthStr) return null;

      const s = String(birthStr).replace(/\D/g, ''); // 숫자만
      if (s.length < 8) return null;

      const y = Number(s.slice(0, 4));
      const m = Number(s.slice(4, 6)) - 1; // JS 월은 0부터
      const d = Number(s.slice(6, 8));

      const dt = new Date(y, m, d);
      return Number.isNaN(dt.getTime()) ? null : dt;
    },
    getAgeByDob(dob) {
      if (!dob) return null;
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const mm = today.getMonth() - dob.getMonth();
      if (mm < 0 || (mm === 0 && today.getDate() < dob.getDate())) age--;
      return age;
    },
    onAdditionalSaved(updated) {
      // ① 모달이 최신 유저 객체를 넘겨줄 수 있으면 즉시 스냅샷
      if (updated) {
        this.applyUserToForm(updated, { snapshot: true });
      } else {
        // ② 모달이 스토어만 커밋하고 객체는 안 넘길 때: 다음 currentUser 변경 1회에만 스냅샷
        this.snapshotOnNextUserSync = true;
      }
      this.showAdditionalInfoModal = false;
      this.afterPhoneSynced();
    },
    onAdditionalClosed(payload) {
      // 취소/그냥 닫기 → 스냅샷 예약 해제
      this.showAdditionalInfoModal = false;
    },
    onPhoneClick() {
      if (!this.currentUser?.birthDate?.trim()) {
        this.phoneConsent.show = true;
        this.phoneConsent.message = '멤버십 전환을 위해<br/>본인 인증이 필요합니다.';
        // 체크박스는 모달 내부에서 관리
      } else {
        // 이미 인증됨 → 기존 로직
        this.onPhoneChange();
      }
    },
    closePhoneConsent() {
      this.phoneConsent.show = false;
    },
    confirmPhoneConsent() {
      this.phoneConsent.show = false;
      // ✅ 기존 NICE 연동 로직 그대로
      this.onPhoneChange();
    },
    applyUserToForm(obj, { snapshot = false } = {}) {
      this.form.job                  = obj.job ?? null;
      this.form.region.state         = obj.state ?? null;
      this.form.region.district      = obj.district ?? null;
      this.form.additionalInfoAgreed = !!obj.additionalInfoAgreed;
      this.isTerms.MARKETING         = !!obj.isMarketingReceive;
      this.form.marketingAgreedDate  = obj.marketingAgreedDate ?? null;
      // ✅ 스냅샷은 조건부로만
      if (snapshot) this.syncOriginalInfoFrom(obj);
    },
    async upsertUserFromPhone(userInfo) {
      // 3단계: 전화·성별·생년월일만 저장 (멤버십 로직 없이)
      try {
        await this.apiUpdateIdentity(userInfo);
      } catch (e) {
        console.error('identity save failed', e);
      }

      // 나이 계산 후 모달 분기
      const dob  = this.parseBirthToDate(userInfo.birthDate);
      const age  = this.getAgeByDob(dob);

      const isMinor = age !== null && age < 19;
      if (age !== null) this.minorAge = age;

      // 이후 버튼에서 진행할 때 쓸 원본 저장
      this.pendingPhoneUserInfo = isMinor ? userInfo : null;  // ⬅️ 성인은 null (중복 호출 방지)

      if (isMinor) {
        this.modal.phoneMinorNotice = true;   // 미성년자 팝업
      } else {
        this.modal.phoneSuccess = true;       // 성인 인증 완료 팝업
      }
    },
    // 새로 추가: Step3 저장용 (멤버십/쿠폰 로직 없음)
    async apiUpdateIdentity(userInfo) {
      try {
        const payload = {
          gender: userInfo.gender ?? null,
          birthDate: userInfo.birthDate ?? null,
          phone: userInfo.mobileNo ?? null,
          isLocalResident: false,
          marketingPending: true,
          additionalInfoAgreed: false,
          isMarketingReceive: false,
        };
        const updated = await this.$axios.$put('/user/account/identity', payload);

        // ✅ 여기서 세팅
        this.mileageTotal = Number(updated.totalMileage ?? 0);

        // 스토어/폼 동기화(가벼운 저장)
        this.$store.commit('service/auth/setUserInfo', { ...this.currentUser, ...updated });
        this.applyUserToForm(updated);
        this.syncOriginalInfoFrom({ ...this.currentUser, ...updated });

        return updated;
      } catch (e) {
        const code = e?.response?.data?.code || e?.response?.data?.MESSAGE;
        if (code === 'UNDER_FOURTEEN') {
          this.modal.isError = true;
          this.errorMsg = '만 14세 미만은 이용이 제한돼요.';
          return; // 흐름 중단
        }
        throw e;
      }
    },
    onPhoneSuccessProceed() {
      this.modal.phoneSuccess = false;
      const restored = this.restorePendingPayload();   // ✅ 복구
      if (restored) {
        this.showAdditionalInfoModal = true;          // ✅ 이전 입력값으로 모달 오픈
      } else {
        this.afterPhoneSynced();
      }
    },
    // 미성년자 '전환하기'에만 호출: 멤버십/쿠폰/만료/알림톡까지 백엔드에서 처리
    async apiApplyMembershipByAge(userInfo) {
      const payload = {
        gender: userInfo.gender ?? null,
        birthDate: userInfo.birthDate ?? null,
        phone: userInfo.mobileNo ?? null,
        isLocalResident: false,
        isMarketingReceive: false,
        marketingPending: true,
        additionalInfoAgreed: false,
      };
      const updated = await this.$axios.$put('/user/account/info', payload);

      // 응답 반영 (백엔드가 멤버십/쿠폰 반영한 최신값 반환)
      this.$store.commit('service/auth/setUserInfo', updated);

      const has = (k) => Object.prototype.hasOwnProperty.call(updated, k);
      if (has('email')) this.account.email = updated.email;
      if (has('name'))  this.account.name  = updated.name;
      if (has('birthDate')) this.account.birthday = updated.birthDate;
      if (has('gender'))    this.account.gender   = updated.gender;
      if (has('phone'))     this.account.phone    = updated.phone;

      if (has('job'))                 this.form.job = updated.job;
      if (has('state'))               this.form.region.state = updated.state;
      if (has('district'))            this.form.region.district = updated.district;
      if (has('additionalInfoAgreed')) this.form.additionalInfoAgreed = !!updated.additionalInfoAgreed;
      if (has('isMarketingReceive'))   this.isTerms.MARKETING = !!updated.isMarketingReceive;
      if (has('marketingAgreedDate'))  this.form.marketingAgreedDate = updated.marketingAgreedDate;

      this.syncOriginalInfoFrom(updated);
      return updated;
    },
    // 공통 후처리: 추가정보 모달 노출 여부 계산
    afterPhoneSynced({ deferForSuccess = false } = {}) {
      const needExtra = !this.isAllSelected({
        job: this.form.job,
        state: this.form.region.state,
        district: this.form.region.district,
        additionalInfoAgreed: this.form.additionalInfoAgreed,
        marketingAgreed: this.isTerms.MARKETING,
      });
      const hasBirth = !!(this.$store.getters['service/auth/getUserInfo']?.birthDate?.trim());

      if (deferForSuccess) {
        this.openAdditionalAfterSuccess = hasBirth && needExtra;
      } else {
        this.showAdditionalInfoModal = hasBirth && needExtra;
      }
    },
    // 미성년자 모달 버튼
    async onMinorProceed() {
      this.modal.phoneMinorNotice = false;
      if (this.isSavingPhone) return;
      this.isSavingPhone = true;

      try {
        if (this.pendingPhoneUserInfo) {
          await this.apiApplyMembershipByAge(this.pendingPhoneUserInfo);  // ← 멤버십3 전환 + 쿠폰 등 백엔드 처리
          this.pendingPhoneUserInfo = null;
        }
      } catch (e) {
        const code = e?.response?.data?.code || e?.response?.data?.MESSAGE;
        this.modal.isError = true;
        this.errorMsg = code === 'UNDER_FOURTEEN'
          ? '만 14세 미만은 이용이 제한돼요.'
          : '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        return;
      } finally {
        this.isSavingPhone = false;
      }

      const restored = this.restorePendingPayload();   // ✅ 복구
      if (restored) {
        this.showAdditionalInfoModal = true;          // ✅ 이전 입력값으로 모달 오픈
      } else {
        this.afterPhoneSynced();
      }
    },
    // ▼ 미성년자 팝업: 취소
    onMinorCancel() {
      this.modal.phoneMinorNotice = false;
      // “기존 유지 + 추가 정보 입력 팝업(동일)” → 기존 규칙대로 열기
      this.afterPhoneSynced();
    },
    // 성인 “인증 완료” 모달 닫기
    onPhoneSuccessClose() {
      this.modal.phoneSuccess = false;
      if (this.openAdditionalAfterSuccess) {
        this.showAdditionalInfoModal = true;
        this.openAdditionalAfterSuccess = false;
      }
    },
    syncOriginalInfoFrom(obj) {
      const has = (k) => Object.prototype.hasOwnProperty.call(obj, k);
      const toBool = (v) => (typeof v === 'string' ? v === 'true' : !!v);

      // 기본은 기존 값으로 시작
      const next = { ...this.originalInfo };

      if (has('email'))               next.email = obj.email;
      if (has('phone'))               next.phone = obj.phone;
      if (has('job'))                 next.job = obj.job;
      if (has('state'))               next.state = obj.state;
      if (has('district'))            next.district = obj.district;
      if (has('additionalInfoAgreed')) next.additionalInfoAgreed = toBool(obj.additionalInfoAgreed);
      if (has('isMarketingReceive'))   next.marketingAgreed = toBool(obj.isMarketingReceive);

      this.originalInfo = next;
    },
    isAllSelected({ job, state, district, additionalInfoAgreed, marketingAgreed }) {
      const filled = (v) => (typeof v === 'string' ? v.trim().length > 0 : !!v);
      return (
        filled(job) &&
        filled(state) &&
        filled(district) &&
        !!additionalInfoAgreed &&
        !!marketingAgreed
      );
    },
    async onPasswordConfirm() {
      await this.$axios
        .$get('/user/account', {
          params: {
            password: this.password
          }
        })
        .then((res) => {
          this.modify = true;
          this.account = res;
        })
        .catch(() => {
          if (!this.password) {
            this.modal.isError = true;
            this.errorMsg = '비밀번호를 입력해주세요.';
          } else {
            this.modal.isError = true;
            this.errorMsg = '비밀번호를 다시 확인해주세요.';
          }
        });
    },
    async onPhoneChange() {
      const windowLocation = window.location;
      const returnUrl = `${windowLocation.protocol}//${windowLocation.host}/nice/nice-user-success?isLocalResident=${this.account.isLocalResident}&isMarketingReceive=${this.account.isMarketingReceive}&email=${this.account.email}&returnUrl=mypage-info`;
      const errorUrl = `${windowLocation.protocol}//${windowLocation.host}/mypage/info`;

      await this.$axios
        .$get('/nice/encrypt', {
          params: {
            returnUrl,
            errorUrl
          }
        })
        .then((res) => {
          const form = createFormElement('https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb', {
            m: 'checkplusService',
            recvMethodType: 'get',
            EncodeData: res
          });
          document.querySelector('body').appendChild(form);
          form.submit();
          form.remove();
        })
        .catch((err) => {
          console.log(err);
          alert('에러가 발생했습니다.\n다시 시도해 해주세요.');
          window.location.reload(true);
        });
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };
      const emailPattern =
        /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])+@([\w_-])*([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const emailFeedback = this.feedback.email;
      const newPasswordFeedback1 = this.feedback.newPassword1;
      const newPasswordFeedback2 = this.feedback.newPassword2;
      const jobFb   = this.feedback.job;
      const stFb    = this.feedback.regionState;
      const guFb    = this.feedback.regionDistrict;

      clearValid();

      if (!this.account.email && this.emailChange) {
        emailFeedback.isValid = false;
        emailFeedback.text = '이메일을 입력해주세요.';
      } else if (!emailPattern.test(this.account.email) && this.emailChange) {
        emailFeedback.isValid = false;
        emailFeedback.text = '@을 포함한 뒷부분을 확인해주세요.';
      } else {
        emailFeedback.isValid = true;
        emailFeedback.text = '';
      }
      if (!this.newPassword1 && this.passwordChange) {
        newPasswordFeedback1.isValid = false;
        newPasswordFeedback1.text = '비밀번호를 입력해 주세요.';
      } else if ((this.newPassword1.length < 8 || this.newPassword1.length > 16) && this.passwordChange) {
        newPasswordFeedback1.isValid = false;
        newPasswordFeedback1.text = '8 ~ 16자리로 입력해주세요.';
      } else {
        newPasswordFeedback1.isValid = true;
        newPasswordFeedback1.text = '';
      }

      if (!this.newPassword2 && this.passwordChange) {
        newPasswordFeedback2.isValid = false;
        newPasswordFeedback2.text = '비밀번호 확인을 입력해 주세요.';
      } else if (this.passwordChange && this.newPassword1 !== this.newPassword2) {
        newPasswordFeedback1.isValid = false;
        newPasswordFeedback2.isValid = false;
        newPasswordFeedback2.text = '비밀번호가 일치하는지 확인해주세요.';
      } else {
        newPasswordFeedback2.isValid = true;
        newPasswordFeedback2.text = '';
      }

      // 3) 추가정보 동의 시에만 필수 검사 (직업/시도/시군구)
      if (this.form.additionalInfoAgreed) {
        if (!this.form.job) {
          jobFb.isValid = false; jobFb.text = '직업을 선택해주세요.';
        }
        if (!this.form.region.state) {
          stFb.isValid  = false;
          stFb.text  = '시/도를 선택해주세요.';
        }
        if(!this.form.region.district) {
          guFb.isValid  = false;
          stFb.text  = '시/군/구를 선택해주세요.';
        }
        if (!this.form.region.state && !this.form.region.district) {
          stFb.text  = '지역을 선택해주세요.';
        }
      }

      return isClearForm();
    },
    async onSaveData() {
      if (this.isValidate()) {
        const isLocal = (this.form.region.state === '대전광역시');

        const payload = {
          email: this.account.email,
          password: this.passwordChange ? this.newPassword1 : null,
          isLocalResident: isLocal,
          encodeData: this.$route.params.EncodeData,
          job: this.form.job,
          state: this.form.region.state,
          district: this.form.region.district,
          additionalInfoAgreed: this.form.additionalInfoAgreed,
          isMarketingReceive: this.isTerms.MARKETING,
          marketingAgreedDate: this.form.marketingAgreedDate,
          marketingPending: false,
          phone: this.account.phone,
        }

        const complete = this.isAllSelected({
          job: this.form.job,
          state: this.form.region.state,
          district: this.form.region.district,
          additionalInfoAgreed: this.form.additionalInfoAgreed,
          marketingAgreed: this.isTerms.MARKETING,
        });
        const hasBirth = !!(this.currentUser?.birthDate?.trim());

        if (complete && !hasBirth) {
          // 저장 값 보관 (리다이렉트 왕복 대비)
          this.pendingPayload = payload;
          sessionStorage.setItem('mypage.pendingPayload', JSON.stringify(payload));
          this.phoneConsent.message =
          '마케팅 수신활용동의 혜택 수령을 위해<br/>핸드폰 본인인증이 필요합니다.';
          // 동의 모달(스크린샷) 오픈 → "인증하기"에서 onPhoneChange()
          this.phoneConsent.show = true;
          return;
        }

        // ─── 1) noChange 체크 ───
        const emailChanged = this.emailChange && (payload.email !== this.originalInfo.email);
        const passwordChanged = this.passwordChange && !!this.newPassword1;

        const profileChanged =
          payload.job                  !== this.originalInfo.job ||
          payload.state                !== this.originalInfo.state ||
          payload.district             !== this.originalInfo.district ||
          payload.additionalInfoAgreed !== this.originalInfo.additionalInfoAgreed ||
          payload.isMarketingReceive   !== this.originalInfo.marketingAgreed;

        const phoneChanged    = payload.phone !== this.originalInfo.phone;

        // 값 기준으로 판단
        const noChange = !emailChanged && !passwordChanged && !profileChanged && !phoneChanged;

        if (noChange) {
          this.modal.noChange = true;
          return;
        }
        // ────────────────────────────────────────────────────

        // 2) "원래 완전했는지" 정확히 계산
        const wasComplete = this.isAllSelected({
          job: this.originalInfo.job,
          state: this.originalInfo.state,
          district: this.originalInfo.district,
          additionalInfoAgreed: this.originalInfo.additionalInfoAgreed,
          marketingAgreed: this.originalInfo.marketingAgreed,
        });

        // 3) "지금도 완전한지" 계산
        const isCompleteNow = this.isAllSelected({
          job: this.form.job,
          state: this.form.region.state,
          district: this.form.region.district,
          additionalInfoAgreed: this.form.additionalInfoAgreed,
          marketingAgreed: this.isTerms.MARKETING,
        });

        // 3) “원래 완전 → 지금 빠짐” 일 때만 경고 모달
        if (wasComplete && !isCompleteNow) {
          this.pendingPayload = payload;
          this.showCancelWarning = true;
          return;
        }

        // 아니라면 바로 저장
        await this.doSave(payload);
      }
    },
    // 실제 PUT 호출
    async doSave(payload) {
      const res = await this.$axios
        .$put('/user/account', payload)
        .catch((err) => {
          const errorMessage = err.response.data?.MESSAGE || '';
          if (errorMessage === 'DUPLICATE_EMAIL') {
            this.feedback.email.isValid = false;
            this.feedback.email.text = '중복된 이메일 입니다.';
          }
        });

      if (res) {

        const has = (k) => Object.prototype.hasOwnProperty.call(res, k);

        // 이메일
        if (has('email')) this.account.email = res.email;
        if (has('phone')) this.account.phone = res.phone;

        // 추가 정보 (null도 그대로 반영)
        if (has('job'))                 this.form.job = res.job;
        if (has('state'))               this.form.region.state = res.state;
        if (has('district'))            this.form.region.district = res.district;
        if (has('additionalInfoAgreed')) this.form.additionalInfoAgreed = !!res.additionalInfoAgreed;
        if (has('isMarketingReceive'))   this.isTerms.MARKETING = !!res.isMarketingReceive;
        if (has('marketingAgreedDate'))  this.form.marketingAgreedDate = res.marketingAgreedDate;

        // 스토어도 최신값으로
        this.$store.commit('service/auth/setUserInfo', res);

        // ✅ 원본값을 “방금 저장된 값”으로 동기화
        this.syncOriginalInfoFrom(res);

        // ✅ 변경 플래그/임시 값 초기화
        this.emailChange = false;
        this.passwordChange = false;
        this.newPassword1 = '';
        this.newPassword2 = '';
        this.pendingPayload = null;

        // 쿠폰 모달 / 저장 완료 모달
        this.issuedCoupons = res.coupons || [];
        this.modal.isSave = true;
      }
    },
    // 모달에서 “네” 눌렀을 때
    async onConfirmCancelWarning() {
      this.showCancelWarning = false;
      await this.doSave(this.pendingPayload);
      this.pendingPayload = null;
    },
    onEmailChange() {
      this.emailChange = true;
    },
    onPasswordChange() {
      this.passwordChange = true;
    },
    getGender(gender) {
      return GENDER_TYPE[gender];
    },
    getPhone(phone) {
      return phone?.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
    },
    onConfirmModal() {
      this.newPassword1 = '';
      this.newPassword2 = '';
      this.passwordChange = false;
      this.emailChange = false;
      this.modal.isSave = false;

      if (this.issuedCoupons.length > 0) {
        this.couponModalVisible = true;
      }
    },
    closeCouponModal() {
      this.couponModalVisible = false;
      this.issuedCoupons = [];
    },
    cancelEmailChange() {
      this.emailChange = false;
      this.account.email = this.originalInfo.email; // 기존 값 복원
      this.feedback.email.isValid = true;
      this.feedback.email.text = '';
    },
    cancelPasswordChange() {
      this.passwordChange = false;
      this.newPassword1 = '';
      this.newPassword2 = '';
      this.feedback.newPassword1.isValid = true;
      this.feedback.newPassword1.text = '';
      this.feedback.newPassword2.isValid = true;
      this.feedback.newPassword2.text = '';
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 3.2rem 0 4rem;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 2.8rem;
}

h2 {
  padding-bottom: 1.3rem;
  border-bottom: none;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.8rem;
}

.container {
  margin-bottom: 12rem;
}

.tabs {
  display: flex;
  &.page {
    display: flex;
    margin-bottom: 4rem;
    .tab + .tab {
      margin-left: 2.4rem;
    }
    .tab {
      font-size: 1.8rem;
      font-weight: 500;
      line-height: 1.8rem;
      color: var(--color-grey-4);

      &.nuxt-link-active {
        color: var(--color-u-primary);
        font-weight: 700;
      }
    }
  }
}

.info-sec {
  .my-info-body {
    .account-info{
      margin: 2.4rem 0;
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 2.6rem;
    }

    table {
      table-layout: fixed;
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;

      tr {
        border-bottom: 0.1rem solid rgba(190, 190, 190, 0.4);
      }

      td + td {
        border-left: 0.1rem solid var(--color-black);
      }

      td {
        padding: 2.1rem 1.6rem 1.7rem;
        &:first-of-type {
          width: 36%;
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1.4rem;
        }

        &:last-of-type {
          width: 64%;
          font-size: 1.4rem;
          font-weight: 400;
          line-height: 1.4rem;
        }

        div {
          margin-top: 1.7rem;
        }
      }
    }
    .marketing-area {
      margin-bottom: 4rem;
      padding: 1.8rem 1.6rem;
      background: rgba(235, 235, 235, 0.4);
    }

    .withdrawal-btn {
      position: relative;
      display: inline-block;
      margin-top: 2rem;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--color-u-primary);
      line-height: 1.4rem;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -0.4rem;
        width: 100%;
        height: 0.1rem;
        background-color: var(--color-u-primary);
      }
    }
  }
}

@media screen and (min-width: 769px) {
  h1 {
    margin: 0 0 4.7rem;
    font-size: 4.2rem;
    line-height: 150%;
  }

  .container {
    display: flex;
    margin-bottom: 12rem;
    margin-top: 4.8rem;

    > div {
      width: 34.8rem;
      padding-right: 14.8rem;
    }

    > section {
      flex: 1 0 0;
    }
  }

  .pc-tabs {
    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 160%;
      letter-spacing: 0.25px;
      border-bottom: 1px solid var(--color-black);
      padding-bottom: 1rem;
      margin-bottom: 1.3rem;
    }

    a {
      display: block;
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 160%;
      letter-spacing: 0.25px;
      margin-bottom: 2.6rem;

      &.nuxt-link-active {
        color: var(--color-u-primary);
        font-weight: 700;
      }

      &.big-tab {
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: 0.25px;
      }
    }
  }

  .info-sec {
    .my-info-head h2 {
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
      padding-bottom: 2.6rem;
    }

    .my-info-body {
      .account-info{
        margin: 2rem 0 3.7rem;
        font-size: 2rem;
        line-height: 150%;
      }

      .input-wrap {
        max-width: 31.6rem;
      }

      button.primary {
        max-width: 43.6rem;
      }

      table {
        td {
          height: 5.6rem;
          padding: 0.8rem 2.4rem;

          &:first-of-type {
            width: 17.6rem;
            font-size: 1.6rem;
            font-weight: 700;
            line-height: 160%;
          }

          &:last-of-type {
            width: auto;
            font-size: 1.6rem;
            line-height: 160%;
            padding: 0.8rem 2.4rem;
          }

          div {
            display: inline-block;
            margin-top: 0;
            margin-left: 1.7rem;
          }

          ::v-deep label .text {
            font-weight: 500;
            font-size: 1.6rem;
          }

          .input-wrap {
            margin-left: 0;
            margin-bottom: 0;
          }
        }
      }

      .marketing-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5.2rem;
        padding: 1.8rem 2rem;

        ::v-deep .text {
          font-weight: 500;
          font-size: 1.6rem;
        }
      }

      .withdrawal-btn {
        margin-top: 0;
        line-height: 160%;

        &::after {
          left: 0;
          bottom: 0;
          height: 1px;
        }
      }
    }
  }

  .submit-area {
    position: relative;
    display: flex;
    justify-content: center;

    button {
      width: 15.2rem !important;
    }

    .withdrawal-btn {
      position: absolute !important;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }
}

/* ─── 추가 정보 입력 섹션 ───────────────────────────────── */
.add-info {
  margin-top: 1.8rem;
  p {
    margin-top: 0;
  }
  .p1 {
    font-weight: 700;
    font-size: 1.8rem;
    text-align: left;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }
  .p2 {
    font-size: 1.1rem;
    text-align: left;
    margin-bottom: 1.3rem;
  }
}
@media screen and (min-width: 768px) {
  .add-info {
    margin-top: 2.8rem;
    .p1 {
      margin-bottom: 1.5rem;
    }
    .p2 {
      font-size: 1.3rem;
    }
  }
}

/* ─── 두 칼럼 그리드 ───────────────────────────────────── */
.grid-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid black;
  row-gap: 3.2rem;
  column-gap: 1.6rem;
}
@media screen and (min-width: 768px) {
  .grid-wrap {
    row-gap: 2.4rem;
    column-gap: 2.8rem;
  }
}

.grid-gray-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--color-grey-1);
  margin-top: 1.8rem;
  row-gap: 3.2rem;
  column-gap: 1.6rem;
}
@media screen and (min-width: 768px) {
  .grid-gray-wrap {
    row-gap: 2.4rem;
    column-gap: 2.8rem;
    margin-top: 2.2rem;
  }
}

/* ─── 지역 입력 ───────────────────────────────────────── */
.region-row {
  display: flex;
  gap: 1.6rem;
  margin-top: 1.2rem;
}
.region-input {
  margin-bottom: 2.0rem;
  .error-msg {
    margin-top: 0.8rem;
    font-size: 1.4rem;
    color: var(--color-u-error);
  }
}

/* ─── 동의 체크박스 & 안내 ──────────────────────────────── */
.terms-area {
  .each-terms {
    display: flex;
    flex-direction: column;
    padding: 2.0rem 2.4rem;
    border-top: 1px solid var(--color-grey-1);
    border-bottom: 1px solid var(--color-grey-1);
    label + label {
      margin-top: 2rem;
    }
    strong {
      font-size: 1.4rem;
      font-weight: 700;
    }
    p {
      margin-top: 0.8rem;
      font-size: 1.4rem;
    }
    border: 1px solid var(--color-grey-1);
  }
  button {
    margin-right: 0.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-u-primary);
  }
  .marketing-info {
    padding: 2.0rem 2.4rem;
    margin-bottom: 3.5rem;
    background-color: var(--color-grey-1);
    border: 1px solid var(--color-grey-1);
    font-size: 1.4rem;
    color: var(--color-grey-8);
  }
  @media screen and (max-width: 767px) {
    .each-terms {
      padding: 1.6rem 0.7rem;       /* 예: 모바일용 값 */
    }
    .marketing-info {
      padding: 0.8rem 0.5rem;
      margin-bottom: 2.5rem;
    }
  }
}

/* ─── .add-input 에 Grid 레이아웃 적용 ───────────────── */
.add-input {
  display: grid;
  grid-template-columns: 1fr 1fr;   /* 모바일: 한 칸 */
  grid-template-rows: auto auto;/* 두 행 (직업 / 지역) */
  gap: 1.6rem;                  /* 행 간격 */
  width: 100%;
  margin-top: 1.2rem;
}

.add-input .job-input {
  grid-column: 1/3;  /* 1열부터 3열 직전까지(=두 칸) */
}

.add-input .city-input {
  grid-column: 1;      /* 왼쪽 */
}
.add-input .district-input {
  grid-column: 2;      /* 오른쪽 */
}

/* PC(≥768px) 전용: 2열, 2행 그리드 */
@media screen and (min-width: 768px) {
  .add-input {
    grid-template-columns: 1fr 1fr; /* 두 칸(각각 50%) */
    grid-template-rows: auto auto;  /* 첫째행=직업, 둘째행=지역 */
    width: 50%;
  }
  /* 첫째 행: job-input 이 두 칸을 모두 차지 */
  .add-input .job-input {
    grid-column: 1 / 3;  /* 1열부터 3열 직전까지(=두 칸) */
  }
  /* 둘째 행: city-input 은 왼쪽 칸, district-input 은 오른쪽 칸 */
  .add-input .city-input {
    grid-column: 1;      /* 왼쪽 */
  }
  .add-input .district-input {
    grid-column: 2;      /* 오른쪽 */
  }
}

/* ─── 시군구 레이블 숨기기 ───────────────────────────── */
.district-input > label {
  display: none;
}

/* ─── 시군구 셀렉트와 시/도 셀렉트 높이 정렬 ─────────── */
.district-input {
  /* USelect 컴포넌트가 .u-select 라는 클래스라 가정했을 때 예시 */
  margin-top: 3.4rem;   /* 레이블 아래에서 동일 간격 */
}

/* 기존 table 스타일은 제거(또는 그대로 두고 .form-rows만 새로 추가) */
.form-rows {
  display: grid;
}

/* 한 줄: 좌측 라벨, 우측 필드 */
.form-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: center;
  column-gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(190,190,190,0.4);
}

.form-label {
  font-size: 1.6rem;
  font-weight: 700;
}

.form-field {
  display: block;
}

/* 입력 + 버튼 가로 배치 */
.inline-field {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
}

/* 비번 두 칸 세로 쌓기 */
.stack > * + * {
  margin-top: 8px;
}

.sns-label {
  margin-left: 8px;
  font-size: 1.4rem;
  color: var(--color-grey-6);
}

/* 모바일: 세 번째 이미지처럼 세로 쌓기 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr; /* 라벨/필드 세로 */
    row-gap: 8px;
    border-bottom: 1px solid rgba(190,190,190,0.4);
    padding: 12px 0;
  }
  .form-label {
    font-size: 1.4rem;
  }
  .inline-field {
    grid-template-columns: 1fr; /* 입력과 버튼도 세로 */
    gap: 8px;
  }
}

/* 공통: 인풋 옆에 버튼 */
.inline-field {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;    /* 데스크탑에선 한 줄 */
}

/* 인풋은 남는 공간 가변, 버튼은 내용 크기 */
.inline-field :deep(.u-input),
.inline-field .inline-input {
  flex: 1 1 auto;
  width: auto !important;
  min-width: 0;         /* 길어도 줄어들 수 있게 */
}
.inline-field > * {
  flex: 0 0 auto;       /* 버튼/라벨은 고정 폭 */
  min-width: 0;
}

/* 모바일: 공간 부족하면 다음 줄로 내려감 */
@media (max-width: 768px) {
  .inline-field {
    flex-wrap: wrap;    /* 줄바꿈 허용 */
    gap: 8px;
  }
  /* 인풋은 한 줄 전체 사용 */
  .inline-field :deep(.u-input),
  .inline-field .inline-input {
    flex: 1 1 100%;
  }
  /* 버튼도 100% 폭으로 */
  .inline-field > button,
  .inline-field > .u-button,
  .inline-field > div:has(> .xs) {
    flex: 1 1 100%;
    width: 100%;
  }
}

.stack {
  display: flex;
  flex-direction: column;
}

.stack > * + * {
  margin-top: 8px;
}

.minor-notice-content {
  font-size: 1.4rem;   /* 기존보다 작은 글자 크기 */
  line-height: 2.2rem;
  color: var(--color-grey-8);
}

.minor-notice-content .highlight {
  display: inline-block;
  margin-top: 0.8rem;
  font-weight: 550;
  font-size: 1.6rem; /* 강조 부분만 조금 크게 */
}


.terms-area{
  .error-msg {
    color: var(--color-u-error);
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 160%;
    letter-spacing: 0.25px;
    text-align: left;
    margin-top: 0.7rem;
  }
}

@media screen and (max-width: 768px) {
  .terms-area{
    .error-msg {
      color: var(--color-u-error);
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 160%;
      letter-spacing: 0.25px;
      text-align: left;
      margin-top: 0.5rem;
    }
  }
}
</style>
