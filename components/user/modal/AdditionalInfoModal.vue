<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <!-- Head -->
        <div class="head">
          <h3 class="title">추가 정보 입력</h3>
          <button type="button" class="close-btn" @click="skipMarketing">
            <i class="ic-close"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="body">
          <!-- <div class="subtitle">
            추가 정보 입력 및 마케팅 정보 수신활용에 동의하시면 혜택을 드려요!
          </div> -->
          <!-- <hr class="divider" /> -->
          <div class="terms-area">
            <UCheckbox v-model="form.additionalInfoAgreed">
              <strong style="margin-right: 5px;">(선택)</strong>추가 개인정보 수집 및 활용에 동의합니다.
            </UCheckbox>

            <div v-if="form.additionalInfoAgreed" class="add-input">
              <!-- 직업 입력 -->
              <div class="form-group">
                <label for="jobSelect">직업</label>
                <USelect
                  id="jobSelect"
                  v-model="form.job"
                  :option-list="jobOptions"
                  default-text="선택"
                  w-size="full"
                  :searchable="true"
                  :class="{ 'is-error': !feedback.job.isValid }"
                />
                <p v-if="!feedback.job.isValid" class="error-msg">{{ feedback.job.text }}</p>
              </div>

              <!-- 지역 입력 -->
              <div class="form-group region">
                <label>지역</label>
                <div class="region-selects">
                  <USelect
                    v-model="form.region.state"
                    :option-list="stateOptions"
                    default-text="시/도 선택"
                    w-size="full"
                    :searchable="true"
                    :class="{ 'is-error': !feedback.regionState.isValid }"
                  />
                  <USelect
                    v-model="form.region.district"
                    :option-list="districtOptions"
                    default-text="시/군/구 선택"
                    w-size="full"
                    :searchable="true"
                    :class="{ 'is-error': !feedback.regionDistrict.isValid }"
                  />
                </div>
                <p v-if="!feedback.regionState.isValid || !feedback.regionDistrict.isValid" class="error-msg">{{ feedback.regionState.text }}</p>
              </div>
            </div>
          </div>
          <!-- 동의 항목 -->
          <div class="terms-area">
            <UCheckbox v-model="form.agreeMarketing">
              <strong style="margin-right: 5px;">(선택)</strong> 마케팅 정보 수집에 동의합니다.
            </UCheckbox>
          </div>
          <div class="marketing-info">
            <p class="mi-text">
              고객(정보주체)의 개인정보보호 및 권리는 <br class="only-mobile" />
              <span style="margin-left: -0.7rem;">「개인정보 보호법」및 관계 법령에 따라</span> <br class="only-mobile" />
              헤레디움(사이트)에서 안전하게 관리하고 있습니다.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="foot">
          <UButton button-type="secondary" class="secondary-btn" :disabled="isSaving" @click="skipMarketing">다음에 하기</UButton>
          <!-- <UButton :disabled="!isFormValid" class="primary-btn" @click="submitForm">완료하고 혜택받기</UButton> -->
          <UButton class="primary-btn" :disabled="isSaving" @click="submitForm">선택 내용 저장</UButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import USelect from '~/components/user/common/USelect.vue';
import UCheckbox from '~/components/user/common/UCheckbox.vue';
import UButton from '~/components/user/common/UButton.vue';
import { REGION_DATA, JOB_OPTIONS } from '~/assets/js/types';

export default {
  name: 'AdditionalInfoModal',
  components: { USelect, UCheckbox, UButton },
  props: {
    isShow: { type: Boolean, required: true },
    initialForm: {
      type: Object,
      default: () => ({
        job: null,
        region: { state: null, district: null },
        additionalInfoAgreed: false,
        agreeMarketing: false,     // 또는 isMarketingReceive와 호환
      })
    },
  },
  data() {
    return {
      form: {
        job: null,
        region: { state: null, district: null },
        additionalInfoAgreed: false,
        agreeMarketing: false
      },
      regionData: REGION_DATA,
      jobOptions: JOB_OPTIONS,
      isSaving: false,
      hydrating: false,
      feedback: {
        job: { isValid: true, text: '' },
        regionState: { isValid: true, text: '' },
        regionDistrict: { isValid: true, text: '' },
      },
    };
  },
  computed: {
    stateOptions() {
      return this.regionData.map(r => ({ value: r.state, label: r.state }));
    },
    districtOptions() {
      const region = this.regionData.find(r => r.state === this.form.region.state);
      return region
        ? region.districts.map(d => ({ value: d, label: d }))
        : [];
    },
    isFormValid() {
      return (
        this.form.job &&
        this.form.region.state &&
        this.form.region.district &&
        this.form.additionalInfoAgreed &&
        this.form.agreeMarketing
      );
    },
  },
  watch: {
    // 모달이 열릴 때 초기값 주입
    isShow(newVal) {
      if (newVal) this.$nextTick(() => this.hydrateFromInitial());
    },
    // 부모 프롭 값이 바뀌면(복구/재오픈) 다시 주입
    initialForm: {
      deep: true,
      handler() {
        if (this.isShow) this.hydrateFromInitial();
      }
    },
    'form.region.state'(newState) {
      if (this.hydrating) return;
      // 시/도가 비워지면 군/구도 비움
      if (!newState) {
        this.form.region.district = null;
        return;
      }
      // 현재 시/도 기준 첫 번째 군/구로 세팅
      const hasCurrent = this.districtOptions.some(o => o.value === this.form.region.district);
      if (!hasCurrent) {
        this.form.region.district = this.districtOptions?.[0]?.value || null;
      }
    },
  },
  mounted() {
   // 컴포넌트 마운트 시점에 이미 열려 있으면 한 번 주입
   if (this.isShow) this.hydrateFromInitial();
  },
  methods: {
    hydrateFromInitial() {
      this.hydrating = true;
      const src = this.initialForm || {};
      this.form.additionalInfoAgreed = !!src.additionalInfoAgreed;
      this.form.agreeMarketing      = !!(src.agreeMarketing ?? src.isMarketingReceive);
      this.form.job                 = src.job ?? null;

      // 지역
      const state = src.region?.state ?? src.state ?? null;
      const districtCandidate = src.region?.district ?? src.district ?? null;
      this.form.region.state = state;

      const dists = this.regionData.find(r => r.state === state)?.districts ?? [];
      this.form.region.district = dists.includes(districtCandidate)
        ? districtCandidate
        : (dists[0] || null);
      this.$nextTick(() => { this.hydrating = false; });
    },
     validateAdditionalInfo() {
      // 초기화
      this.feedback.job.isValid = true; this.feedback.job.text = '';
      this.feedback.regionState.isValid = true; this.feedback.regionState.text = '';
      this.feedback.regionDistrict.isValid = true; this.feedback.regionDistrict.text = '';

      if (!this.form.additionalInfoAgreed) return true;

      let ok = true;
      if (!this.form.job) {
        this.feedback.job.isValid = false;
        this.feedback.job.text = '직업을 선택해주세요.';
        ok = false;
      }

      if (!this.form.region.state) {
        this.feedback.regionState.isValid = false;
        this.feedback.regionState.text = '시/도를 선택해주세요.';
        ok = false;
      }

      if (!this.form.region.district) {
        this.feedback.regionDistrict.isValid = false;
        this.feedback.regionState.text = '시/군/구를 선택해주세요.';
        ok = false;
      }

      if (!this.form.region.state && !this.form.region.district) {
        this.feedback.regionState.text = '지역을 선택해주세요.';
        ok = false;
      }

      // 첫 에러로 스크롤/포커스 (선택)
      if (!ok) {
        this.$nextTick(() => {
          const el =
            this.$el.querySelector('.dropdown.is-error .dropdown-btn') ||
            this.$el.querySelector('.error-msg');
          if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
      }
      return ok;
    },
    async submitForm() {
      if (this.isSaving) return;

      if (!this.validateAdditionalInfo()) return;

      this.isSaving = true;

      try {
        const isLocal = (this.form.region.state === '대전광역시');
        const payload = {
          job: this.form.job,
          state: this.form.region.state,
          district: this.form.region.district,
          isLocalResident: isLocal,
          isMarketingReceive: this.form.agreeMarketing,
          marketingPending: false,
          additionalInfoAgreed: this.form.additionalInfoAgreed,
        };

        const res = await this.$axios.$put('/user/account/marketing', payload);
        this.$store.commit('service/auth/setUserInfo', res);

        // ✅ 부모가 스냅샷 갱신하도록 알림
        this.$emit('saved', res);
        this.$emit('issued', res.coupons || []);
        this.$emit('close');
      } catch (err) {
        console.warn('추가정보 저장 실패', err);
      } finally {
        this.isSaving = false;
      }
    },
    async skipMarketing() {
      if (this.isSaving) return;
      this.isSaving = true;

      try {
        // 마케팅 동의 안 함(0)
        const res = await this.$axios.$put('/user/account/marketing', {
          marketingPending: false,
          isMarketingReceive: false,
          isLocalResident: false,
          additionalInfoAgreed: false,
          issueMembershipCoupons: true,
        });

         // ✅ 스토어 반영 + 부모에 통지(스냅샷)
        this.$store.commit('service/auth/setUserInfo', res);
        this.$emit('saved', res);
      } catch (err) {
        console.warn('마케팅 스킵 처리 실패', err);
      } finally {
        this.isSaving = false;
        this.$emit('close');
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 500;
}
.modal-inner {
  position: relative;
  display: flex; flex-direction: column;
  width: 100%; height: 100%; background: #fff;
  @media screen and (min-width: 769px) {
    width: 51rem; height: auto;
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.175);
  }
}
.head {
  display: flex; align-items: center; position: relative;
  height: 6rem; padding: 0 6rem 0 2rem;
  font-weight: 700; font-size: 2rem;
  border-bottom: 1px solid var(--color-u-grey-1);
  @media (min-width: 769px) {
    padding: 3.2rem 3.6rem; font-size: 2.4rem;
  }
  .title { flex: 1; margin: 0; }
  .close-btn {
    position: absolute; top:50%; right:2rem;
    transform: translateY(-50%);
    background:none; border:none; cursor:pointer;
    i { font-size:3.2rem; }
  }
}
.body {
  flex: 1; overflow: visible; padding: 2rem;
  padding-bottom: 6rem;
  @media (min-width: 769px) {
    max-height: 55.0rem;
    padding: 2.4rem 3.6rem;
    padding-bottom: 0;
  }
  .subtitle {
    font-size: 1.6rem; line-height:1.4; margin-bottom:2rem;
  }
  .divider {
    border: none; border-top:1px solid var(--color-u-grey-1); margin-bottom:2rem;
  }
  .form-group {
    margin-top: 1.5rem;
    label { display:block; margin-bottom:0.8rem; font-size:1.4rem; }
    &.region .region-selects {
      display:flex; gap:1.6rem;
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
}
.foot {
  position: static;           /* ← 변경 */
  bottom: 0;                  /* ← 화면(모달) 맨 아래에 고정 */
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1.6rem;
  padding: 2rem 2rem;
  border-top: 1px solid var(--color-u-grey-1);
  background: #fff;
  z-index: 10;                /* ← 본문 위에 뜨도록 */

  button {
    flex: 1;                          /* 양쪽 버튼 동일 너비 */
    height: 4.8rem;                   /* 적당한 높이 */
    font-size: 1.6rem;
    font-weight: 700;
    border-radius: 0.3rem;            /* 높이의 절반으로 하면 완전 pill 형태 */
    cursor: pointer;
    transition: background-color .2s;
  }

  @media (min-width: 769px) {
    padding: 2.0rem 2.0rem 2.0rem;
  }

  /* ── “다음에 하기” 버튼 (항상 흰 배경, 회색 텍스트) ── */
  .secondary-btn {
    background-color: #ffffff !important;
    border: 1px solid var(--color-u-grey-2) !important;
    color: var(--color-u-grey-3) !important;
    cursor: pointer;
  }
  // .secondary-btn:hover {
    /* 필요하면 hover 스타일 추가 */
  // }

  /* ── “완료하고 혜택받기” 버튼 ── */
  .primary-btn {
    background-color: var(--color-u-primary);
    border: none;
    color: #fff;
    cursor: pointer;
  }
  /* → 비활성화 상태 */
  .primary-btn:disabled {
    background-color: var(--color-u-grey-3) !important;
    color: #fff !important;
    cursor: not-allowed;
  }

}
/* 모바일에서 지역 셀렉트가 컨테이너에 맞춰 축소되도록 */
.form-group.region .region-selects {
  display: flex;
  gap: 1.6rem;
}
.form-group.region .region-selects > * {
  flex: 1 1 0;
  min-width: 0;
}

::v-deep .dropdown-menu {
  z-index: 100 !important;
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
    margin-left: 0.5rem;
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

@media (max-width: 768px) {
  .only-mobile { display: inline; } /* 모바일에서만 줄바꿈 보이기 */
  .marketing-info .mi-text { text-align: center !important; } /* 모바일 중앙 정렬 */
}
</style>
