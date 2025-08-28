<template>
  <main class="container">
    <div class="m progress-bar">
      <div class="fill"></div>
    </div>
    <div class="title-area">
      <div class="logo-area">
        <img
          src="~assets/img/pc/logo.svg"
          alt="HEREDIUM 로고"
          class="logo"
          width="92"
          height="45"
          style="margin-bottom: 2.2rem; margin-top: 3.0rem;"
        />
        <h2 style="margin-bottom: 1.2rem;">회원가입하고</h2>
        <h2>더 깊은 예술을 경험해보세요!</h2>
      </div>
      <div class="pc progress-bar">
        <div class="fill"></div>
      </div>
      <p style="font-size: 1.4rem; text-align: center; margin-top: 1.5rem;">헤레디움에서 사용할 정보를 입력해주세요.</p>
    </div>
    <section class="register-sec">
      <div v-if="hydrated && !isSocialFlow">
        <h3 style="font-size: 1.8rem; text-align: left;">회원 정보 등록</h3>
        <div class="grid-wrap"></div>
        <div class="input">
          <label>이름</label>
          <UInput :value="userInfo.name" class="h-m" w-size="full" disabled />
        </div>
        <div class="input">
          <label>휴대폰 번호</label>
          <UInput :value="userInfo.mobileNo" class="h-m" w-size="full" disabled />
        </div>
        <div class="input">
          <label>이메일 <b class="must">*</b></label>
          <UInput
            v-model="email"
            class="h-m"
            :class="{ 'is-error': !feedback.email.isValid }"
            :error-msg="feedback.email.text"
            w-size="full"
            placeholder="이메일을 입력하세요"
          ></UInput>
        </div>
        <div class="input">
          <label>비밀번호 <b class="must">*</b></label>
          <UInput
            v-model="password"
            class="h-m"
            :class="{ 'is-error': !feedback.password.isValid }"
            :error-msg="feedback.password.text"
            type="password"
            w-size="full"
            placeholder="8 ~ 16자로 입력해주세요."
          ></UInput>
          <UInput
            v-model="passwordConfirm"
            class="h-m"
            :class="{ 'is-error': !feedback.passwordConfirm.isValid }"
            :error-msg="feedback.passwordConfirm.text"
            type="password"
            w-size="full"
            placeholder="비밀번호를 한번 더 입력해주세요"
          />
        </div>
      </div>
      <div v-if="hydrated">
        <div class="add-info">
          <h3 style="font-size: 1.8rem; text-align: left;">추가 정보 입력</h3>
          <!-- <p class="p2">추가 정보 입력 및 마케팅 정보 수신활용에 동의하시면 혜택을 드려요!</p> -->
        </div>
        <div class="grid-wrap"></div>
        <div class="terms-area">
          <UCheckbox v-model="form.additionalInfoAgreed">
            <strong style="margin-right: 5px;">(선택)</strong>추가 개인정보 수집 및 활용에 동의합니다.
          </UCheckbox>

          <div v-if="form.additionalInfoAgreed" class="add-input">
            <div class="input region-input">
              <label>직업</label>
              <div style="margin-top: 1.2rem;">
                <USelect
                  v-if="hydrated"
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

            <div class="input region-input">
              <label>지역</label>
              <div class="region-row">
                <div class="region-col">
                  <USelect
                    v-if="hydrated"
                    v-model="form.region.state"
                    :option-list="cityOptions"
                    w-size="full"
                    default-text="시/도 선택"
                    :searchable="true"
                    :class="{ 'is-error': !feedback.regionState.isValid }"
                  />
                </div>
                <div class="region-col">
                  <USelect
                    v-if="hydrated"
                    v-model="form.region.district"
                    :option-list="districtOptions"
                    w-size="full"
                    default-text="시/군/구 선택"
                    :searchable="true"
                    :class="{ 'is-error': !feedback.regionDistrict.isValid }"
                  />
                </div>
              </div>
              <p v-if="!feedback.regionState.isValid" class="error-msg">{{ feedback.regionState.text }}</p>
              <!-- <p v-if="!feedback.region.isValid" class="error-msg">
                {{ feedback.region.text }}
              </p> -->
            </div>
          </div>
        </div>
        <div class="terms-area">
          <UCheckbox v-model="isTerms.MARKETING">
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
    </section>
    <div v-if="hydrated">
      <div class="btn-area">
        <UButton w-size="100" :disabled="submitting" @click="onRegister()">완료</UButton>
      </div>
    </div>
    <URegisterModal
      v-if="hydrated"
      :is-show="modal.isTerms"
      :term-target="termTarget"
      :terms-data="termsData"
      @close="modal.isTerms = false"
      @agree="termAgree"
    />
    <UDialogModal :is-show="modal.isError">
      <template #content>필수 입력 항목을 모두 채워주세요.</template>
      <template #modal-btn2>
        <UButton w-size="100" class="feedback-btn" @click="modal.isError = false">확인</UButton>
      </template>
    </UDialogModal>
  </main>
</template>

<script>
import UInput from '~/components/user/common/UInput';
import UButton from '~/components/user/common/UButton';
import USelect from '~/components/user/common/USelect.vue';
import UCheckbox from '~/components/user/common/UCheckbox';
import { REGION_DATA, JOB_OPTIONS } from '~/assets/js/types';
import URegisterModal from '~/components/user/modal/URegisterModal';
import UDialogModal from '~/components/user/modal/UDialogModal';

export default {
  name: 'Register3Page',
  components: { UInput, UButton, USelect, UCheckbox, URegisterModal, UDialogModal },
  beforeRouteLeave(to, from, next) {
    // 페이지를 떠날 때 지우고 싶은 키들
    localStorage.removeItem('snsInfo');
    next();
  },
  async asyncData({ query, $axios, $dayjs, redirect }) {
    const userInfo = await $axios
      .$get('/nice/decrypt', {
        params: {
          encodeData: query.EncodeData
        }
      })
      .catch(() => {
        redirect('/auth/register/register1');
      });
    const now = $dayjs();
    now.format();
    const birthDate = $dayjs(userInfo.birthDate);
    birthDate.format();
    const age = now.get('year') - birthDate.get('year');
    const mon = now.get('month') + 1 - birthDate.get('month');
    const ageTest = () => {
      if (mon < 0 || (mon === 0 && now.get('day') < birthDate.get('day'))) {
        return age - 1;
      } else {
        return age;
      }
    };
    if (ageTest() < 14) {
      redirect('/auth/register/register2', { failed: true });
    }
    return { userInfo };
  },
  data() {
    return {
      encodeData: this.$route.query.EncodeData,
      email: '',
      password: '',
      passwordConfirm: '',
      userInfo: null,
      feedback: {
        email: {
          isValid: true,
          text: ''
        },
        password: {
          isValid: true,
          text: ''
        },
        passwordConfirm: {
          isValid: true,
          text: ''
        },
        job: { isValid: true, text: '' },
        regionState: { isValid: true, text: '' },
        regionDistrict: { isValid: true, text: '' },
      },
      form: {
        region: { state: null, district: null },
        job: null,
        additionalInfoAgreed: false,
      },
      regionData: REGION_DATA,
      jobOptions: JOB_OPTIONS,
      isTerms: {
        MARKETING: false
      },
      modal: {
        isTerms: false,
        isError: false
      },
      termsData: null,
      termTarget: '',
      submitting: false,
      snsToken: null,
      provider: null,
      hydrated: false,
    };
  },
  computed: {
    snsInfo() {
      if (!this.hydrated) {
        // 서버 사이드 렌더링 단계나 최초 Client hydration 에선 항상 이메일 플로우
        return { snsToken: null, provider: null }
      }
      try {
        return JSON.parse(localStorage.getItem('snsInfo')) || { snsToken: null, provider: null }
      } catch {
        return { snsToken: null, provider: null }
      }
    },
    isSocialFlow() {
      const { snsToken, provider } = this.snsInfo
      return Boolean(snsToken && provider)
    },
    cityOptions() {
      return this.regionData.map(r => ({ value: r.state, label: r.state }));
    },
    districtOptions() {
      const region = this.regionData.find(r => r.state === this.form.region.state);
      return region ? region.districts.map(d => ({ value: d, label: d })) : [];
    }
  },
  watch: {
    'form.region.state'(newState) {
      const region = this.regionData.find(r => r.state === newState);
      this.form.region.district = region && region.districts.length
        ? region.districts[0]
        : '';
      // this.feedback.region.isValid = true;
      // this.feedback.region.text = '';
    }
  },
  mounted() {
    this.hydrated = true
  },
  methods: {
    async onRegister() {

      this.submitting = true;

      // 공통 파라미터
      const payload = {
        state: this.form.region.state,
        district: this.form.region.district,
        job: this.form.job,
        additionalInfoAgreed: this.form.additionalInfoAgreed,
        isMarketingReceive: this.isTerms.MARKETING
      };

      payload.gender    = this.userInfo.gender === 'MAN' ? 'M' : 'W';
      payload.birthDate = this.$dayjs(this.userInfo.birthDate).format('YYYY-MM-DD');

      payload.marketingPending  = false;
      payload.isLocalResident   = this.form.region.state === '대전광역시';
      payload.encodeData        = this.encodeData;

      // 이메일 플로우일 때만 이메일/비번 검사, 추가정보는 공통
      const checkEmailPassword = !this.isSocialFlow;
      if (!this.isValidate({ checkEmailPassword })) {
        this.modal.isError = true;
        this.submitting = false;
        return;
      }

      // 소셜 플로우면 validation 스킵
      if (this.isSocialFlow) {
        const { provider, snsToken } = this.snsInfo;
        payload.snsType = provider;
        payload.snsId   = snsToken;
      } else {
        // 이메일·비밀번호 필드 추가
        payload.email           = this.email;
        payload.password        = this.password;
      }

      try {
        const { token } = await this.$axios.$post('/user/auth/sign-up', payload);
        // 토큰 저장 & 유저 정보 조회
        this.$store.commit('service/auth/setAccessToken', token);
        const userInfo = await this.$axios.$get('/user/account/info');
        this.$store.commit('service/auth/setUserInfo', userInfo);
        localStorage.removeItem('snsInfo');
        this.$router.replace('/auth/register/register4');
      } catch (err) {
        const msg = err.response?.data?.MESSAGE;
        // 이메일 중복 오류만 이메일 플로우에서 처리
        if (!this.isSocialFlow && msg === 'DUPLICATE_EMAIL') {
          this.feedback.email.isValid = false;
          this.feedback.email.text    = '이미 사용중인 이메일입니다.';
        }
      } finally {
        this.submitting = false;
      }
    },
    // ✅ 추가정보 검증 (체크박스 켜진 경우만)
    validateAdditionalInfo() {
      // 초기화
      this.feedback.job.isValid = true; this.feedback.job.text = '';
      this.feedback.regionState.isValid = true; this.feedback.regionState.text = '';
      this.feedback.regionDistrict.isValid = true; this.feedback.regionDistrict.text = '';

      if (!this.form.additionalInfoAgreed) return true; // 비동의면 통과

      let ok = true;
      if (!this.form.job) {
        this.feedback.job.isValid = false;
        this.feedback.job.text = '직업을 선택해주세요.';
        ok = false;
      }
      if (!this.form.region.state && !this.form.region.district) {
        this.feedback.regionState.isValid = false;
        this.feedback.regionDistrict.isValid = false;
        this.feedback.regionState.text = '지역를 선택해주세요.';
        ok = false;
      }
      return ok;
    },
    isValidate({ checkEmailPassword = true } = {}) {
      // 필요한 키만 초기화
      const reset = (k) => { this.feedback[k].isValid = true; this.feedback[k].text = ''; };
      ['email','password','passwordConfirm','job','regionState','regionDistrict']
        .forEach(k => this.feedback[k] && reset(k));

      // 1) 이메일/비번 검증 (옵션)
      if (checkEmailPassword) {
        const emailPattern =
          /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])+@([\w_-])*([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;

        if (!this.email) {
          this.feedback.email.isValid = false;
          this.feedback.email.text = '이메일을 입력해주세요.';
        } else if (!emailPattern.test(this.email)) {
          this.feedback.email.isValid = false;
          this.feedback.email.text = '@을 포함한 뒷부분을 확인해주세요.';
        }

        if (!this.password) {
          this.feedback.password.isValid = false;
          this.feedback.password.text = '비밀번호를 입력해 주세요.';
        } else if (this.password.length < 8 || this.password.length > 16) {
          this.feedback.password.isValid = false;
          this.feedback.password.text = '8 ~ 16자리로 입력해주세요.';
        }

        if (!this.passwordConfirm) {
          this.feedback.passwordConfirm.isValid = false;
          this.feedback.passwordConfirm.text = '비밀번호 확인을 입력해 주세요.';
        } else if (this.password !== this.passwordConfirm) {
          this.feedback.passwordConfirm.isValid = false;
          this.feedback.passwordConfirm.text = '비밀번호가 일치하는지 확인해주세요.';
        }
      }

      // 2) ✅ 추가정보 검증 (체크박스 켜진 경우는 소셜/이메일 공통 필수)
      if (this.form.additionalInfoAgreed) {
        if (!this.form.job) {
          this.feedback.job.isValid = false;
          this.feedback.job.text = '직업을 선택해주세요.';
        }
        if (!this.form.region.state && !this.form.region.district) {
          this.feedback.regionState.isValid = false;
          this.feedback.regionDistrict.isValid = false;
          this.feedback.regionState.text = '지역을 선택해주세요.';
        }
      }

      // 하나라도 false면 실패
      return Object.values(this.feedback).every(v => v.isValid);
    },
    async showTerm(target) {
      this.termTarget = target;
      this.termsData = await this.$axios.$get('/user/policies/posting', {
        params: {
          type: this.termTarget
        }
      });
      this.modal.isTerms = true;
    },
    termAgree() {
      this.isTerms[this.termTarget] = true;
      this.modal.isTerms = false;
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

h1 {
  margin: 5.2rem 0 2rem;
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 2.8rem;
}

p {
  font-size: 1.8rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.8rem;
}

.progress-bar {
  position: fixed;
  top: 6rem;
  left: 0;
  right: 0;
  width: 100%;
  height: 0.2rem;
  background: var(--color-grey-1);

  .fill {
    width: 100%;
    height: 100%;
    background: var(--color-black);
  }
}

.register-sec {
  margin: 4rem 0;

  .input + .input {
    margin-top: 2.2rem;
  }

  .input {
    .input-wrap {
      margin-top: 0.7rem;
    }

    .must {
      color: var(--color-u-error);
    }
  }

  .grid-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 1.4rem;
    border-top: 1px solid black;
    padding-top: 2.2rem;
    row-gap: 3.2rem;
    column-gap: 1.6rem;

    .input {
      margin-top: 0 !important;
    }
  }
}

.local-sec {
  padding: 2rem 0;
  border-top: 0.1rem solid var(--color-black);
  border-bottom: 0.1rem solid var(--color-black);

  p {
    margin-top: 1.2rem;
    padding-left: 2.5rem;
    font-size: 1.4rem;
    font-weight: 500;
    text-align: left;
    line-height: 2.2rem;
    word-break: keep-all;
  }
}

.add-info {
  margin-top: 1.8rem;
  p {
    margin-top: 0rem;
  }
  .p1 {
    font-size: 1.8rem; text-align: left; margin-bottom: 1.0rem; margin-top: 2.5rem;
  }
  .p2 {
    font-size: 1.1rem; text-align: left;
  }
}

@media screen and (min-width: 768px) {
  .m {
    display: none;
  }

  .pc {
    display: block;
  }

  .register-sec,
  .local-sec,
  .btn-area,
  .title-area {
    max-width: 43.6rem;
    margin: 0 auto;
  }

  .register-sec {
    margin: 3.7rem auto 3.2rem;

    label {
      font-size: 1.5rem;
      line-height: 160%;
      font-weight: 500;
    }

    .input + .input {
      margin-top: 1.7rem;
    }

    .input {
      .input-wrap {
        margin-top: 1.2rem;
      }
    }

    .grid-wrap {
      margin-top: 1.4rem;
      row-gap: 2.4rem;
      column-gap: 2.8rem;
    }
  }

  .local-sec {
    p {
      padding-left: 3.2rem;
    }
  }

  h1 {
    margin: 12.6rem 0 4rem;
    font-size: 4.2rem;
    line-height: 6.3rem;
  }

  p {
    font-size: 2rem;
    line-height: 3rem;
    text-align: left;
  }

  .progress-bar {
    position: static;
    top: unset;
    left: unset;
    right: unset;
    width: 100%;
    height: 0.4rem;
    background: var(--color-grey-1);

    .fill {
      width: 100%;
      height: 100%;
      background: var(--color-black);
    }
  }

  .add-info {
    margin-top: 2.8rem;
    p {
      margin-top: 0rem;
    }
    .p1 {
      font-size: 1.8rem; text-align: left; margin-bottom: 0.5rem; margin-top: 2.5rem;
    }
    .p2 {
      font-size: 1.3rem; text-align: left;
    }
  }
}

.region-row {
  display: flex;
  gap: 1.6rem;
  margin-top: 1.2rem;
}
.region-row .region-col {
  flex: 1;
}
.region-input{
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
  .region-input{
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

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;

  p {
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--color-grey-6);
    margin: 0 0 2.4rem;

    @media (min-width: 768px) {
      font-size: 1.8rem;
      margin-bottom: 3rem;
      text-align: left;
      width: 100%;
    }
  }
}

.terms-area {
  display:flex; flex-direction:column;
  border: 1px solid var(--color-grey-1);
  padding: 1.5rem 2.0rem;
}

@media screen and (max-width: 767px) {
  .terms-area {
    padding: 1.5rem 0.8rem;
  }
}

.add-input {
  margin-top: 20px;
}

.marketing-info {
    padding: 1.2rem 1.2rem;
    background-color: var(--color-grey-1);
    border: 1px solid var(--color-grey-1);
    font-size: 1.4rem;
    color: var(--color-grey-8);
    margin-bottom: 3.0rem;
    p {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.6;
      text-align: left; /* 기본 왼쪽 정렬 */
    }

    label + label {
      margin-top: 2rem;
    }
    strong {
      font-weight: 700;
    }
  }
</style>
