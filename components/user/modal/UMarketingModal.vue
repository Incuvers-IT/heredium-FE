<template>
  <transition name="fade">
  <div v-if="isShow" class="modal-wrap">
    <div class="modal-inner">
      <div class="head">
        핸드폰 인증
        <button type="button" @click="skipMarketing"><i class="ic-close" /></button>
      </div>
      <div class="body" body-scroll-lock-ignore>
        <h3 style="text-align: center; margin-bottom: 3rem; margin-top: 3.0rem;">멤버십 전환을 위해
        <br/>본인 인증이 필요합니다.</h3>

        <div class="term-select" style="text-align: center;">
          <UCheckbox v-model="isTerms.AGREE">
            <strong>[필수]</strong>
            <button @click="showTerm('AGREE')">&nbsp;개인정보 수집 및 활용</button>에 동의합니다.
          </UCheckbox>
        </div>
        <!-- <form class="content-wrap" @submit.prevent="submitForm">
          <div class="input mb-13">
            <label>거주지</label>
            <div class="region-row">
              <div class="region-col">
                <USelect
                  v-model="form.region.state"
                  :option-list="cityOptions"
                  w-size="full"
                  default-text="시/도 선택"
                />
              </div>
              <div class="region-col">
                <USelect
                  v-model="form.region.district"
                  :option-list="districtOptions"
                  w-size="full"
                  default-text="시/군/구 선택"
                />
              </div>
            </div>
          </div>
          <div class="terms-area">
            <div class="form-group checkbox-group each-terms">
              <UCheckbox v-model="isTerms.MARKETING">
                <strong>[선택]</strong>
                <button type="button" @click="showTerm('MARKETING')">마케팅 활용 동의 및 광고 수집</button> 동의
              </UCheckbox>
            </div>
          </div>
        </form> -->
      </div>
      <div class="foot" body-scroll-lock-ignore>
        <!-- <UButton :disabled="!isTerms.MARKETING" @click="openPhoneModal">휴대폰 인증하고 혜택 받기</UButton> -->
        <UButton button-type="secondary" @click="skipMarketing">취소</UButton>
        <UButton :disabled="!isTerms.AGREE" @click="openPhoneModal">인증하기</UButton>
      </div>
    </div>
    <URegisterModal
      :is-show="modal.isTerms"
      :term-target="termTarget"
      :terms-data="termsData"
      @close="modal.isTerms = false"
      @agree="termAgree"
    />
    <UPhoneModal
      ref="phoneModal"
      :is-show="false"
      @close="$emit('close')"
    />
  </div>
  </transition>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import UButton from '~/components/user/common/UButton';
// import USelect from '~/components/user/common/USelect.vue';
import UCheckbox from '~/components/user/common/UCheckbox';
import URegisterModal from '~/components/user/modal/URegisterModal';
import UPhoneModal from '~/components/user/modal/UPhoneModal.vue';
import { REGION_DATA } from '~/assets/js/types';

export default {
  name: 'AdditionalInfoModal',
  components: { UButton, URegisterModal, UPhoneModal, UCheckbox },
  props: {
    isShow: { type: Boolean, default: false }
  },
  data() {
    return {
      form: {
        region: { state: '대전광역시', district: '동구' },
        birthDate: '1990-01-01',
        gender: 'M',
      },
      regionData: REGION_DATA,
      beforeScroll: 0,
      isTerms: {
        // MARKETING: true,
        AGREE: false,
      },
      modal: {
        isTerms: false,
        isError: false
      },
      termTarget: '',
      termsData: null,
      showPhoneModal: false
    };
  },
  computed: {
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
    },
    isShow(val) {
      if (val) {
        this.beforeScroll = window.scrollY;
        disableBodyScroll(document, {
          allowTouchMove: el => el.hasAttribute('body-scroll-lock-ignore')
        });
      } else {
        clearAllBodyScrollLocks();
        this.restoreScroll();
      }
    }
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
  },
  methods: {
    async skipMarketing() {
      try {
        // 마케팅 동의 안 함(0)
        await this.$axios.$put('/user/account/marketing', {
          marketingPending: false,
          isMarketingReceive: false,
          isLocalResident: false,
          additionalInfoAgreed: false,
          issueMembershipCoupons: true,
        });
      } catch (err) {
        console.warn('마케팅 스킵 처리 실패', err);
      } finally {
        this.$emit('close');
      }
    },
    restoreScroll() {
      this.$nextTick(() => {
        window.scrollTo(0, this.beforeScroll);
        this.beforeScroll = 0;
      });
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
    setCheckedAll(newValue) {
      for (const key in this.isTerms) {
        this.isTerms[key] = newValue;
      }
    },
    close() {
      this.$emit('close')
    },
    openPhoneModal() {
      this.$refs.phoneModal.check()
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
  position: relative;        /* ← 추가 */
  display: flex;
  flex-direction: column;
  height: 100%; width: 100%;
  background: #fff;

  .head {
    display: flex;
    position: relative;
    align-items: center;
    height: 6rem;
    padding: 0 6rem 0 2rem;
    font-weight: 700;
    font-size: 2rem;
    line-height: 100%;
    border-bottom: 1px solid var(--color-u-grey-1);

    button {
      position: absolute;
      top: 50%;
      right: 2rem;
      transform: translateY(-50%);

      i {
        font-size: 3.2rem;
      }
    }
  }
  .body {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    .content-wrap { padding-bottom: 10rem; }
    .form-group { margin-bottom: 1.6rem; }
    .options { display: flex; gap: 1.6rem; }
    .date-selects, .region-selects { display: flex; gap: 1rem; }
    .checkbox-group { font-size: 1.4rem; }
  }
  .foot {
    position: sticky;        /* ← 변경 */
    bottom: 0;               /* ← 화면(모달) 맨 아래에 붙음 */
    left: 0;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.6rem;
    padding: 2rem 2rem;
    border-top: 1px solid var(--color-u-grey-1);
    background: #fff;
    z-index: 10;             /* ← 본문 위에 떠 있도록 */

    button {
      flex: 1;                          /* 양쪽 버튼 동일 너비 */
      height: 4.8rem;                   /* 적당한 높이 */
      font-size: 1.6rem;
      font-weight: 700;
      border-radius: 0.3rem;            /* 높이의 절반으로 하면 완전 pill 형태 */
      cursor: pointer;
      transition: background-color .2s;
    }
  }
}
@media screen and (min-width: 769px) {
  .modal-inner {
    width: 44.4rem; height: auto;
    margin: auto; top: 50%; left: 50%;
    position: absolute; transform: translate(-50%,-50%);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.175);
    .head { padding: 3.2rem 3.6rem; font-size: 2.4rem; }
    .body {
      max-height: 40.8rem;
      padding: 1.4rem 3.6rem;
      .content-wrap { background: rgba(235,235,235,0.4); overflow-y: auto; padding: 2.4rem; }
    }
    .foot {
      position: static;
      padding: 2rem 3.2rem 2.0rem;
      margin-top: 2.5rem;

      button {
        flex: 1;                          /* 양쪽 버튼 동일 너비 */
        height: 4.8rem;                   /* 적당한 높이 */
        font-size: 1.6rem;
        font-weight: 700;
        border-radius: 0.3rem;            /* 높이의 절반으로 하면 완전 pill 형태 */
        cursor: pointer;
        transition: background-color .2s;
      }
    }
  }
}

.terms-area {
  strong {
    margin-right: 0.5rem;
    font-size: 1.7rem;
    font-weight: 700;
    line-height: 100%;
    transform: translateY(0.2rem);
  }

  .each-terms {
    display: flex;
    flex-direction: column;
    padding: 2.4rem 0;
    margin-bottom: 2rem;
    border-top: 1px solid var(--color-grey-1);
    label + label {
      margin-top: 2rem;
    }

    strong {
      font-size: 1.4rem;
    }
  }

  button {
    margin-right: 0.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-u-primary);
    line-height: 150%;
  }
}

.region-row {
  display: flex;
  gap: 1.6rem;
}
.region-row .region-col {
  flex: 1;
}

.term-select {
  button {
    margin-right: 0.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-u-primary);
    line-height: 150%;
  }
}
</style>
