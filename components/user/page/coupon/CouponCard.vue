<template>
  <div
    v-if="showCoupon"
    :class="{ checked: isChecked, 'full-width': isSelection }"
    class="coupon-card"
    @click="toggleCheck"
  >
    <div class="img-wrap">
      <img :src="couponImageSrc" />
    </div>
    <div class="coupon-detail">
      <div>
        <p class="name">{{ detailCoupon.name }}</p>
        <div class="type-discount">
          <span class="type">헤레디움 {{ couponTypeLabel }}</span>
          <span class="discount-text">
            {{ detailCoupon.discount_percent === 100 ? '무료' : `${detailCoupon.discount_percent}%` }} 할인 쿠폰
          </span>
        </div>
        <div class="discount">
          <!-- <div v-if="!isSelection" class="date">
            <img src="~assets/img/icon/icon_discount_tag.svg" />
            <span>{{ detailCoupon.discount_percent === 100 ? '무료' : `${detailCoupon.discount_percent}%` }}</span>
          </div> -->
          <div class="date">
            유효기간:
            <span>{{ expiryDisplayText }}</span>
          </div>
        </div>
      </div>
      <div v-if="rightButton && !isSelection" class="right-action">
        <UButton
          class="use-btn"
          w-size="100"
          button-type="chart"
          :disabled="isExpired || isCouponAwaitingStart || detailCoupon.unused_coupons.length === 0"
          @click.stop="handleOpenModal"
        >
          {{ buttonText }}
        </UButton>
      </div>
      <div class="coupon-remaining">
        <div v-if="!isSelection && !rightButton" class="button">
          <UButton class="reservation-btn" w-size="100" :disabled="buttonDisabled" @click="handleOpenModal">
            QR코드
          </UButton>
        </div>
        <!-- <div v-if="isSelection" class="date">
          <img src="~assets/img/icon/icon_discount_tag.svg" />
          <span>{{ detailCoupon.discount_percent === 100 ? '무료' : `${detailCoupon.discount_percent}%` }}</span>
        </div> -->
        <!-- <div v-if="detailCoupon.unused_coupons.length > 0" class="status active">
          <span>사용가능</span>
        </div>
        <div v-else class="status deactive">
          <span>사용완료</span>
        </div> -->
        <!-- <div>
          <span>{{
            detailCoupon.unused_coupons[0].is_permanent ? '상시할인' : `${detailCoupon.unused_coupons.length}회남음`
          }}</span>
        </div> -->
      </div>
      <modal-coupon-infor :detail-coupon="detailCoupon" :open="openModalQr" @close="handleCloseModal" />
    </div>
    <div v-if="isSelection" class="select-box">
      <input type="radio" class="hidden-radio" :value="detailCoupon.id" @change="handleChange" />
      <div class="circle" :class="{ active: isChecked }"></div>
    </div>
  </div>
</template>

<script>
import UButton from '../../common/UButton.vue';
import ModalCouponInfor from '../../modal/coupon/ModalCouponInfor.vue';
import { imageMixin } from '~/mixins/imageMixin';
import { getDateCommonDateOutput } from '~/assets/js/commons';
import { COUPON_TYPE_OPTION_LIST } from '~/assets/js/types';

export default {
  name: 'CouponCard',
  components: { ModalCouponInfor, UButton },
  mixins: [imageMixin],
  props: {
    detailCoupon: {
      type: Object,
      required: false,
      default: () => {}
    },
    isSelection: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: [String, Number],
      required: false,
      default: ''
    },
    change: {
      type: Function,
      required: true
    },
    modelValue: {
      required: true,
      validator(value) {
        return value === null || ['number', 'string'].includes(typeof value);
      }
    },
    rightButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      openModalQr: false,
      isExpired: false
    };
  },
  computed: {
    primaryCoupon() {
      const unused = this.detailCoupon?.unused_coupons || [];
      if (unused.length > 0) return unused[0];

      const used = this.detailCoupon?.used_coupons || [];
      if (used.length > 0) {
        // 필요하면 정렬 기준을 만료일/사용일 등으로 보강
        // used.sort((a,b)=> dayjs(b.expiration_date) - dayjs(a.expiration_date));
        return used[0];
      }
      return {};
    },
    // firstUnusedCoupon() {
    //   console.log(this.detailCoupon);
    //   return this.detailCoupon?.unused_coupons?.[0] || {};
    // },
    isForeverExpiry() {
      const exp = this.primaryCoupon?.expiration_date || '';
      return /^9999-12-31\b/.test(exp); // "9999-12-31" 또는 "9999-12-31 00:00:00" 등 대응
    },
    fullRangeText() {
      return this.getFormattedDate(this.primaryCoupon?.delivered_date, this.primaryCoupon?.expiration_date);
    },
    startOnlyWithTilde() {
      const txt = String(this.fullRangeText || '');
      const start = txt.split('~')[0]?.trim() || '';
      return start ? `${start} ~` : '';
    },
    expiryDisplayText() {
      return this.isForeverExpiry ? this.startOnlyWithTilde : this.fullRangeText;
    },
    couponTypeLabel() {
      const opt = COUPON_TYPE_OPTION_LIST.find((o) => o.value === this.detailCoupon.coupon_type);
      return opt ? opt.label : this.detailCoupon.coupon_type;
    },
    couponImageSrc() {
      return this.getImage(this.detailCoupon.image_url);
    },
    isChecked() {
      return this.modelValue === this.value;
    },
    isCouponAwaitingStart() {
      // const deliveredDate = this.detailCoupon?.unused_coupons?.[0].delivered_date;
      // if (!deliveredDate) return true;
      const deliveredDate = this.detailCoupon?.unused_coupons?.[0]?.delivered_date;
      if (!deliveredDate) return false;
      const today = this.$dayjs();
      const startDate = this.$dayjs(deliveredDate, 'YYYY-MM-DD HH:mm:ss', true);
      if (!startDate.isValid()) {
        // return true;
        return false;
      }
      return today.isBefore(startDate);
    },
    showCoupon() {
      if (this.isExpired) {
        return false;
      }
      if (this.isSelection && this.isCouponAwaitingStart) {
        return false;
      }
      return true;
    },
    hasUnused() {
      return (this.detailCoupon?.unused_coupons?.length ?? 0) > 0;
    },
    buttonDisabled() {
      // 기존의 버튼 조건
      return this.isExpired || this.isCouponAwaitingStart || !this.hasUnused;
    },
    buttonText() {
      // 비활성일 땐 '사용 불가', 아니면 '쿠폰 사용'
      return this.buttonDisabled ? '사용 불가' : '쿠폰 사용';
    }
  },
  created() {
    this.checkExpiration();
  },
  methods: {
    toggleCheck() {
      if (this.isSelection) {
        this.change(this.value);
      }
    },
    handleChange() {
      this.$emit('input', this.value);
    },
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    handleOpenModal() {
      this.openModalQr = true;
    },
    handleCloseModal() {
      this.openModalQr = false;
      this.$emit('refresh-coupon-list');
    },
    checkExpiration() {
      // this.isExpired = this.detailCoupon?.unused_coupons?.every((coupon) => coupon.is_expired); -- 기존 코드
      const arr = this.detailCoupon?.unused_coupons || [];
      this.isExpired = arr.length > 0 && arr.every((coupon) => coupon.is_expired === true);
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon {
  &-card {
    display: flex;
    align-items: center;
    margin-bottom: 1.2rem;
    column-gap: 1.8rem;
    overflow: hidden;
    border: 1px solid transparent;

    &:hover {
      cursor: pointer;
    }

    .img-wrap {
      height: 10rem;
      width: 10rem;
      padding: 2.5rem;

      > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .name {
      font-weight: 600;
      font-size: 1.4rem;
      color: var(--color-default);
    }

    .discount {
      display: flex;
      column-gap: 12px;
    }

    .date {
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      column-gap: 4px;
      min-width: 5.2rem;
      margin-top: 0.6rem;
    }

    &.checked {
      border: 1px solid var(--color-u-primary);
      background-color: #f7f8f5;
    }
  }

  &-detail {
    display: flex;
    flex: 1;
    row-gap: 8px;
    color: var(--color-u-placeholder);
  }

  &-remaining {
    display: flex;
    align-items: center;
    column-gap: 8px;
    font-size: 1.2rem;

    .button {
      display: block;
      width: 100%;
    }

    .reservation-btn {
      min-width: 83px !important;
      height: 32px;
      font-size: 1.4rem;
      font-weight: 500;
    }

    .status {
      border-radius: 6px;
      padding: 2px 8px;
      width: fit-content;
      font-size: 1.2rem;
      height: 22px;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 100%;
        display: inline-block;
        margin-right: 6px;
      }
    }

    .active {
      background-color: #f0fdf4;
      color: #15803d;
      border: 1px solid #bbf7d0;

      &::before {
        background-color: #22c55e;
      }
    }

    .deactive {
      background-color: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;

      &::before {
        background-color: #ef4444;
      }
    }

    & > div:nth-child(2) > span {
      font-size: 1.2rem;
      font-weight: 700;
      margin-right: 3px;
    }
  }

  .button {
    width: 100% !important;
  }
}

.hidden-radio {
  display: none;
}

.circle {
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-u-grey-2);
  background-color: var(--color-white);
  border-radius: 50%;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, border-color 0.3s;
}
.circle.active {
  border-color: var(--color-u-primary);
  position: relative;
}
.circle.active::after {
  position: absolute;
  left: 50%;
  top: 50%;
  content: '';
  width: 1rem;
  height: 1rem;
  background-color: var(--color-u-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.select-box {
  display: flex;
  justify-content: end;
}

.full-width {
  max-width: unset !important;
}

@media screen and (min-width: 769px) {
  .coupon-card {
    max-width: 100%;
  }
}

.coupon-card {
  .coupon-detail {
    /* 제목: 굵게, 크게 */
    .name {
      font-size: 1.8rem; /* ≈ 18px */
      font-weight: 700;
      line-height: 1.4;
      color: #111; /* 진한 검정 */
      margin: 0 0 0.4rem 0; /* 아래 살짝 간격 */
    }

    /* 본문(설명) */
    .type-discount {
      display: block; /* 줄바꿈 */
      font-size: 1.5rem; /* ≈ 15px */
      font-weight: 400;
      line-height: 1.6;
      color: #111;
      margin: 0 0 0.4rem 0;

      .type,
      .discount-text {
        font-weight: 400; /* 굵기 통일 */
      }
    }

    /* 유효기간: 더 작고 회색 */
    .discount {
      margin-top: -1rem;

      .date {
        font-size: 1.3rem; /* ≈ 13px */
        line-height: 1.6;
        color: #9e9e9e; /* 회색 */
        display: inline-block;
        min-width: unset; /* 기존 최소폭 해제 */
      }
    }
  }
}
:deep(.use-btn[disabled]) {
  background: #e5e5e5 !important;
  color: #a3a3a3 !important;
  border: 1px solid #CCCCCC !important;
  box-shadow: none !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}
/* 오른쪽 액션 버튼 영역 */
.right-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto; /* 오른쪽으로 밀기 */
  padding-right: 3.8rem; /* 살짝 여백 */
}

.right-action .use-btn {
  min-width: 92px !important;
  height: 42px !important;
  font-size: 1.4rem;
  font-weight: 500;
  padding: 2rem;
  border: 1px solid black;
}

/* 작은 화면에서도 버튼이 카드 안에서 잘 맞도록 */
@media (max-width: 768px) {
  .right-action {
    padding-right: 0.4rem;
  }
  .right-action .use-btn {
    min-width: 80px !important;
    height: 32px;
    font-size: 1.3rem;
  }
}

/* 0) flex 아이템이 줄어들 수 있게 (가장 중요) */
.coupon-card .coupon-detail,
.coupon-card .right-action {
  min-width: 0; /* 기본 min-content 해제 → 줄바꿈/축소 허용 */
}

/* 1) 텍스트 오버플로우 방지 */
.coupon-card .name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.coupon-card .type-discount,
.coupon-card .discount .date {
  white-space: normal;
  overflow-wrap: anywhere; /* 긴 토큰도 강제로 줄바꿈 */
}

/* 2) 선택 라디오 영역 고정폭(늘어나지 않게) */
.select-box { flex: 0 0 24px; }
.select-box .circle { width: 20px; height: 20px; }

/* 3) 버튼이 폭을 벌리지 않게 padding 축소 (기존 padding: 2rem 제거) */
.right-action .use-btn {
  min-width: 80px !important; /* 필요시 80~92 조정 */
  height: 32px;
  padding: 0 12px;            /* ← 핵심: 가로 패딩 소형화 */
  border: 1px solid black;
}

/* 4) 모바일 최적화(폰트/이미지/여백 다운) */
@media (max-width: 480px) {
  .coupon-card { column-gap: 12px; }
  .coupon-card .img-wrap { width: 56px; height: 56px; padding: 8px; }

  .coupon-card .coupon-detail .name {
    font-size: clamp(1.4rem, 4vw, 1.6rem);
  }
  .coupon-card .coupon-detail .type-discount {
    font-size: clamp(1.2rem, 3.6vw, 1.4rem);
  }
  .coupon-card .coupon-detail .discount .date {
    font-size: clamp(1.1rem, 3.2vw, 1.3rem);
  }

  .right-action { padding-right: 0; }
}

/* (선택) 선택 모드에서는 버튼을 아래줄로 내려 공간 확보 */
@media (max-width: 480px) {
  .coupon-card.full-width .right-action {
    width: 100%;
    order: 3;                  /* 카드의 마지막 줄로 이동 */
    justify-content: flex-start;
    margin-top: 8px;
  }
}
</style>
