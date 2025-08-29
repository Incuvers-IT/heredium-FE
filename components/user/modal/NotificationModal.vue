<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="head">
          <h3 class="title">{{ title }}</h3>
          <button type="button" class="close-btn" @click="skipMarketing">
            <i class="ic-close"></i>
          </button>
        </div>
        <div class="body">
          <div class="guide-content">
            <div class="guide-icon-div">
              <template v-if="membership">
                <img
                  :src="getImage(membership.image_url)"
                  class="guide-icon-img"
                  :alt="membership.name"
                />
              </template>
              <div class="guide-label">
                {{ membership?.name }}
              </div>
            </div>
            <div class="guide-text">
              <p>{{ membership?.name }} 회원으로 전환됩니다.</p>
              <p>Mypage에서 혜택을 확인할 수 있습니다.</p>
            </div>
          </div>
        </div>

        <div class="foot">
          <UButton w-size='100' button-type="secondary" @click="$emit('next')">
            {{ canNext ? '추가 정보 입력하고 혜택 받기' : '완료' }}
          </UButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import UButton from '~/components/user/common/UButton';

export default {
  name: 'AdditionalInfoModal',
  components: { UButton },
  props: {
    isShow: { type: Boolean, required: true },
    title: { type: String, default: '등급 전환 안내' },
    code: { type: Number, required: true },
    canNext:  { type: Boolean, default: false },
  },
  emits: ['close', 'next'],
  data(){
    return {
      membership: null,  // API 호출로 채워질 객체
    };
  },
  created() {
    // 컴포넌트가 생성되면 code 기반으로 한 번만 호출
    this.fetchMembership();
  },
  methods: {
    async fetchMembership() {
      try {
        // 여기에 실제 API 경로를 맞춰주세요.
        // 예: GET /user/memberships/{code} 또는 /api/membership/code/{code}
        this.membership = await this.$axios.$get(
          `/user/membership/code/${this.code}`
        );
      } catch (err) {
        console.warn('멤버십 정보 조회 실패', err);
        this.membership = null;
      }
    },
    async skipMarketing() {
      try {
        // 마케팅 동의 안 함(0)
        const res = await this.$axios.$put('/user/account/marketing', {
          marketingPending: false,
          isMarketingReceive: false,
          isLocalResident: false,
          additionalInfoAgreed: false,
          issueMembershipCoupons: true,
        });

        this.$store.commit('service/auth/setUserInfo', res);
      } catch (err) {
        console.warn('마케팅 스킵 처리 실패', err);
      } finally {
        this.$emit('close');
      }
    },
    getImage(imageUrl) {
      if (imageUrl) {
        return `${this.$store.state.BASE_URL}${imageUrl}`;
      }
      // fallback: code 3 → green, else brown 아이콘
      return this.code === 3
        ? require('~/assets/img/membership_green.png')
        : require('~/assets/img/membership_brown.png');
    },
  },
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
  display: flex;
  flex-direction: column;
  width: 100%; height: 100%;
  background: #fff;

  @media screen and (min-width: 769px) {
    width: 45.4rem;
    height: auto;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.175);
  }
}
.head {
  display: flex;
  align-items: center;
  position: relative;
  height: 6rem;
  padding: 0 6rem 0 2rem;
  font-weight: 700;
  font-size: 2rem;
  border-bottom: 1px solid var(--color-u-grey-1);
  @media screen and (min-width: 769px) {
    padding: 3.2rem 3.6rem;
    font-size: 2.4rem;
  }
  .title {
    margin: 0;
    flex: 1;
    // text-align: center;
  }
  .close-btn {
    position: absolute;
    top: 50%; right: 2rem;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    i { font-size: 3.2rem; }
  }
}
.body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  @media screen and (min-width: 769px) {
    max-height: 40.8rem;
    padding: 2.4rem 3.6rem;
  }
  .guide-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
  }
  .guide-icon-div {
    width: 100%;
    background-color: var(--color-u-grey-1);
    border-radius: 0.4rem;
    padding: 1.6rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }
  .guide-icon {
    width: 4rem; height: 4rem;
    border-radius: 50%;
    background-color: #6d4029;
    display: flex;
    align-items: center;
    justify-content: center;
    i { font-size: 2rem; color: #fff; }
  }
  .guide-label {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--color-black);
  }
  .guide-text {
    text-align: center;
    font-size: 1.3rem;
    line-height: 1.4;
    p { margin: 0.4rem 0; }
  }
}
.foot {
  position: static;        /* ← 변경 */
  bottom: 0;               /* ← 화면(모달) 맨 아래에 고정 */
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1.6rem;
  padding: 2rem 2rem;
  border-top: 1px solid var(--color-u-grey-1);
  background: #fff;
  z-index: 10;             /* ← 본문 위에 떴다 내리도록 */

  button {
    flex: 1;                          /* 양쪽 버튼 동일 너비 */
    height: 4.8rem;                   /* 적당한 높이 */
    font-size: 1.6rem;
    font-weight: 700;
    border-radius: 0.3rem;            /* 높이의 절반으로 하면 완전 pill 형태 */
    cursor: pointer;
    transition: background-color .2s;
  }

  @media screen and (min-width: 769px) {
    padding: 2.0rem 2.0rem 2.0rem;
    margin-top: 0;
  }
  button[button-type="secondary"] {
    background: transparent;
    border: 1px solid var(--color-u-grey-1);
    color: var(--color-black);
  }
  button:not([button-type="secondary"]) {
    background: var(--color-u-primary);
    color: #fff;
  }
}

.guide-icon-img {
  width: 4rem;
  height: 4rem;
  object-fit: contain;
  border-radius: 50%;
}
</style>
