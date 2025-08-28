<template>
  <!-- PC 전용 -->
  <UModal
    v-if="isPCUrl"
    :is-show="value"
    class="modal-custom only-pc"
    :class="['modal-custom', 'only-pc', { 'cursor-pos': positionMode === 'cursor' }]"
    :style="modalStyleVars"
    :hide-edge-close-btn="true"
    :background-white="true"
    @close="handleClose"
  >
    <template #content>
      <div>
        <div class="title-modal">
          <img
            v-if="imageSrcByCode(dataMembership.code)"
            :src="imageSrcByCode(dataMembership.code)"
            style="width: 48px; height: 48px"
            alt="membership icon"
          />
          <span class="name-membership">
            {{ dataMembership.name }} 님의 현재 등급은 <B>{{ dataMembership.membership_name }}</B> 입니다.
          </span>
        </div>
        <div class="benefit">
          <div class="benefit-box">
            <div class="benefit-box">
              <div class="benefit-row">
                <div class="left">
                  <img :src="imageSrcByCode(1)" class="membership-icon2" />
                  <div class="name_target">
                    <p class="membership-name only-pc">
                      {{ (benefitRows.find((item) => item.code === 1) || {}).name }}
                    </p>
                    <p class="membership-target">만 19세 이상 회원</p>
                  </div>
                </div>
                <div class="right">
                  <div class="benefit-grid" :class="{ 'one-row': getOrderedCouponsByCode(1).length <= 2 }">
                    <span v-for="(c, i) in coupons1" :key="c.id || i" class="benefit-cat">
                      {{ formatCouponText(c) }}<span v-if="i === coupons1.length - 1"> 할인</span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="benefit-row">
                <div class="left">
                  <img :src="imageSrcByCode(2)" class="membership-icon2" />
                  <div class="name_target">
                    <p class="membership-name only-pc">
                      {{ (benefitRows.find((item) => item.code === 2) || {}).name }}
                    </p>
                    <p class="membership-target">
                      마일리지 {{ benefitRows.find((item) => item.code === 2)?.usage_threshold }}점 달성
                      {{ benefitRows.find((item) => item.code === 1)?.name }} 회원
                    </p>
                  </div>
                </div>
                <div class="right">
                  <div class="benefit-grid" :class="{ 'one-row': getOrderedCouponsByCode(2).length <= 2 }">
                    <span v-for="(c, i) in coupons2" :key="c.id || i" class="benefit-cat">
                      {{ formatCouponText(c) }}<span v-if="i === coupons2.length - 1"> 할인</span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="benefit-row">
                <div class="left">
                  <img :src="imageSrcByCode(3)" class="membership-icon2" />
                  <div class="name_target">
                    <p class="membership-name only-pc">
                      {{ (benefitRows.find((item) => item.code === 3) || {}).name }}
                    </p>
                    <p class="membership-target">만 19세 미만 회원</p>
                  </div>
                </div>
                <div class="right">
                  <div class="benefit-grid" :class="{ 'one-row': getOrderedCouponsByCode(3).length <= 2 }">
                    <span v-for="(c, i) in coupons3" :key="c.id || i" class="benefit-cat">
                      {{ formatCouponText(c) }}<span v-if="i === coupons3.length - 1"> 할인</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
  <!-- 모바일 전용 -->
  <UModal
    v-else
    :is-show="value"
    class="modal-custom only-mobile"
    :hide-head="false"
    :hide-edge-close-btn="false"
    :background-white="false"
    @close="handleClose"
  >
    <template #title>
      <div class="title-modal only-mobile">
        <!-- <img
          v-if="imageSrcByCode(dataMembership.code)"
          :src="imageSrcByCode(dataMembership.code)"
          style="width: 48px; height: 48px"
          alt="membership icon"
        /> -->
        <img v-if="dataMembership.code === 1" src="~assets/img/Brown.png" class="membership-icon" />
        <img v-if="dataMembership.code === 2" src="~assets/img/Terracotta.png" class="membership-icon" />
        <img v-if="dataMembership.code === 3" src="~assets/img/Green.png" class="membership-icon" />
        <span class="name-membership only-mobile">
          {{ dataMembership.name }} 님의 현재 등급은<br />
          <B>{{ dataMembership.short_name }}</B>
          입니다.
        </span>
      </div>
    </template>

    <template #content>
      <div class="benefit only-mobile" @click.stop>
        <div class="benefit-box only-mobile">
          <div class="benefit-row only-mobile">
            <!-- <img :src="imageSrcByCode(1)" class="membership-icon2 only-mobile" /> -->
            <img src="~assets/img/Brown.png" class="membership-icon2" />
            <div class="name_target only-mobile">
              <p class="membership-name only-mobile">
                <B>{{ (benefitRows.find((item) => item.code === 1) || {}).short_name }}</B>
              </p>
              <p class="membership-target only-mobile">만 19세 이상 회원</p>
              <div class="benefit-grid only-mobile" :class="{ 'one-row': getOrderedCouponsByCode(1).length <= 2 }">
                <span v-for="(c, i) in coupons1" :key="c.id || i" class="benefit-cat only-mobile">
                  {{ formatCouponText(c) }}<span v-if="i === coupons1.length - 1"> 할인</span>
                </span>
              </div>
            </div>
          </div>

          <div class="benefit-row only-mobile">
            <!-- <img :src="imageSrcByCode(2)" class="membership-icon2 only-mobile" /> -->
            <img src="~assets/img/Terracotta.png" class="membership-icon2" />
            <div class="name_target only-mobile">
              <p class="membership-name only-mobile">
                <B>{{ (benefitRows.find((item) => item.code === 2) || {}).short_name }}</B>
              </p>
              <p class="membership-target only-mobile">
                마일리지 {{ benefitRows.find((item) => item.code === 2)?.usage_threshold }}점 달성
                {{ benefitRows.find((item) => item.code === 1)?.name }} 회원
              </p>
              <div class="benefit-grid only-mobile" :class="{ 'one-row': getOrderedCouponsByCode(2).length <= 2 }">
                <span v-for="(c, i) in coupons2" :key="c.id || i" class="benefit-cat only-mobile">
                  {{ formatCouponText(c) }}<span v-if="i === coupons2.length - 1"> 할인</span>
                </span>
              </div>
            </div>
          </div>

          <div class="benefit-row only-mobile">
            <!-- <img :src="imageSrcByCode(3)" class="membership-icon2 only-mobile" /> -->
            <img src="~assets/img/Green.png" class="membership-icon2" />
            <div class="name_target only-mobile">
              <p class="membership-name only-mobile">
                <B>{{ (benefitRows.find((item) => item.code === 3) || {}).short_name }}</B>
              </p>
              <p class="membership-target only-mobile">만 19세 미만 회원</p>
              <div class="benefit-grid only-mobile" :class="{ 'one-row': getOrderedCouponsByCode(3).length <= 2 }">
                <span v-for="(c, i) in coupons3" :key="c.id || i" class="benefit-cat only-mobile">
                  {{ formatCouponText(c) }}<span v-if="i === coupons3.length - 1"> 할인</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script>
import UModal from '~/components/user/modal/UModal.vue';
import { CATEGORY_STR_TYPE } from '~/assets/js/types';
import { imageMixin } from '~/mixins/imageMixin';

const TYPE_ORDER = ['EXHIBITION', 'PROGRAM', 'COFFEE', 'ARTSHOP'];

export default {
  name: 'ModalMembershipInfor',
  components: { UModal },
  mixins: [imageMixin],
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    dataMembership: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Boolean,
      required: true
    },
    benefitRows: { type: Array, default: () => [] },
    positionMode: { type: String, default: '' },
    anchorPos: { type: Object, default: null }
  },
  data() {
    return {
      closeTimer: null
    };
  },
  computed: {
    coupons1() {
      return this.getOrderedCouponsByCode(1);
    },
    coupons2() {
      return this.getOrderedCouponsByCode(2);
    },
    coupons3() {
      return this.getOrderedCouponsByCode(3);
    },
    isPCUrl() {
      return (
        this.$route.path.includes('/mypage/purchase/membership_pc') ||
        this.$route.path.includes('/mypage/purchase/coupon_pc')
      );
    },
    couponImageSrc() {
      return this.getImage(this.dataMembership.image_url);
    },
    modalStyleVars() {
      if (this.positionMode !== 'cursor' || !this.anchorPos) return {};

      const MODAL_W = 530;
      const MODAL_H = 410;
      const PADDING = 8;
      const OFFSET_Y = 12;

      const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;

      let left = this.anchorPos.x;
      let top = this.anchorPos.y + OFFSET_Y;

      left = Math.max(PADDING, Math.min(left, vw - MODAL_W - PADDING));
      top = Math.max(PADDING, Math.min(top, vh - MODAL_H - PADDING));

      return {
        '--cursor-left': left + 'px',
        '--cursor-top': top + 'px'
      };
    }
  },
  beforeDestroy() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  },
  methods: {
    handleClose() {
      this.$emit('input', false);
      this.$emit('close');
    },
    getCouponsByCode(code) {
      const rows = Array.isArray(this.benefitRows) ? this.benefitRows : [];
      const row = rows.find((r) => Number(r.code) === Number(code));
      return row && Array.isArray(row.coupons) ? row.coupons : [];
    },
    imageSrcByCode(code) {
      const rows = Array.isArray(this.benefitRows) ? this.benefitRows : [];
      const row = rows.find((r) => Number(r.code) === Number(code));
      return row && row.image_url ? this.getImage(row.image_url) : null;
    },
    // 타입 순서 고정 정렬
    getOrderedCouponsByCode(code) {
      const list = this.getCouponsByCode(code);
      return [...list].sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));
    },
    chunkByTwo(arr) {
      const out = [];
      for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2));
      return out.slice(0, 2);
    },
    formatCouponText(c) {
      if (!c) return '';

      // 타입 한글 매핑
      const typeKo = CATEGORY_STR_TYPE[c.type] || c.type || '';

      // 할인율
      const pct = c.discount_percent ?? c.discountPercent ?? '';

      return pct ? `${typeKo} ${pct}%` : typeKo;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-custom {
  ::v-deep .modal-inner {
    width: 520px !important;
    height: 370px !important;
    max-width: 80vw;
    max-height: 80vh;
    border-radius: 12px;
    flex-direction: row;
    transform: translateX(-50%, 50%) !important;
  }
  .title-modal {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    column-gap: 1rem;
    padding: 0 !important;
    margin-bottom: 8px;

    .membership-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }
  }
  .qr-box {
    color: var(--color-u-placeholder);
    border-bottom: 1px solid #d1d5d8;
    padding-bottom: 2rem;

    .name-membership {
      color: var(--color-u-primary);
      font-size: 1.2rem;
    }

    & > p:nth-child(2) {
      margin-bottom: 2rem;
    }
  }

  .benefit {
    &-box {
      display: flex;
      justify-content: space-between;
      column-gap: 1.2rem;
      background-color: #fafafa;
      border-radius: 12px;
      padding: 1.2rem;
    }

    &-card {
      padding: 7px 8px;
      background-color: #fafafa;
      flex: 1;

      &-name {
        color: var(--color-u-placeholder);
      }

      &-quantity {
        font-weight: 700;
        font-size: 1.8rem;
      }
    }
  }
}
.modal-custom.only-pc {
  ::v-deep .modal .head {
    display: none !important;
  }
  ::v-deep .modal .body {
    padding: 3.2rem 3rem 3rem !important; /* top right/left bottom */
  }
}
.benefit-box {
  display: flex;
  flex-direction: column;
  background-color: #fafafa !important;
  border-radius: 12px;
  padding: 1.6rem;
  row-gap: 1.6rem;

  .benefit-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 7rem;
  }
  .membership-icon2 {
    width: 30px;
    height: 30px;
    margin-top: 15px;
    object-fit: contain;
  }
  .left {
    display: flex;
    column-gap: 0.8rem;

    .membership-name {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: -0.7rem;
    }

    .membership-target {
      font-size: 11px;
      color: #7a7a7a;
    }
  }

  .right {
    flex: 1;
    .benefit-info {
      font-size: 1.3rem;
      margin-bottom: -0.7rem;
      text-align: left;
    }

    .benefit-discount {
      font-size: 1.3rem;
      b {
        font-weight: bold;
      }
    }
  }
}

.right .benefit-grid {
  display: grid;
  grid-template-columns: max-content max-content auto;
  grid-auto-rows: auto;
  column-gap: 7px;
  align-items: baseline;
  font-size: 1.3rem; /* 기존과 동일 */
}

.right .benefit-grid .benefit-cat:nth-of-type(1) {
  grid-column: 1;
  grid-row: 1;
}
.right .benefit-grid .benefit-cat:nth-of-type(2) {
  grid-column: 2;
  grid-row: 1;
}
.right .benefit-grid .benefit-cat:nth-of-type(3) {
  grid-column: 1;
  grid-row: 2;
}
.right .benefit-grid .benefit-cat:nth-of-type(4) {
  grid-column: 2;
  grid-row: 2;
}

.right .benefit-grid .discount-suffix {
  grid-column: 3;
  grid-row: 2;
  white-space: nowrap;
}

.right .benefit-grid.one-row {
  grid-template-columns: max-content max-content auto;
}
.right .benefit-grid.one-row .discount-suffix {
  grid-row: 1;
}

.title {
  font-size: 1.3rem;
}
.benefit-box {
  display: flex;
  flex-direction: column;
}
.benefit-content {
  display: block;
  font-size: 1.3rem;
}
.benefit-info {
  display: block;
  line-height: 1.6;
}

.benefit-info .benefit-cat {
  display: inline;
  margin-right: 8px;
}

.benefit-info .benefit-cat:nth-of-type(2)::after {
  content: '';
  display: block;
}

.benefit-info .benefit-cat:last-of-type {
  margin-right: 0;
}
// 모바일 CSS
.modal-custom.only-mobile {
  ::v-deep .modal-inner {
    width: 90vw !important;
    max-width: 360px !important;
    max-height: 80vh !important;
    height: auto !important;
    border-radius: 12px;
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    display: inline-block;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: 20px;
    box-sizing: border-box;
  }

  .title-modal.only-mobile {
    display: flex;
    align-items: left;
    justify-content: left;
    column-gap: 1rem;

    .membership-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }

    .name-membership {
      font-size: 1.6rem;
      font-weight: normal;
      text-align: left;
      line-height: 1.4;
      b {
        font-weight: bold;
      }
    }
  }
  /* 회색 영역이 꽉 차도록 */
  .benefit.only-mobile {
    flex: 1;
    display: flex;
  }
  .benefit-box.only-mobile {
    flex: 1;
  }
  .benefit.only-mobile {
    margin-top: -2.2rem;

    .benefit-box.only-mobile {
      display: flex;
      flex-direction: column;
      background-color: #fafafa;
      border-radius: 12px;
      padding: 2.4rem;
      row-gap: 2.5rem;
    }

    .benefit-row.only-mobile {
      display: flex;
      align-items: flex-start;
      column-gap: 1.4rem;

      .membership-icon2 {
        width: 36px;
        height: 36px;
        margin-top: 5px;
        object-fit: contain;
      }

      .name_target.only-mobile {
        display: flex;
        flex-direction: column;
        gap: 1px !important;
        margin-top: 0.5rem;
      }

      .membership-name.only-mobile {
        // font-weight: bold;
        font-size: 18px;
      }

      .membership-target.only-mobile {
        font-size: 11px;
        color: #7a7a7a;
        margin-bottom: 0.5rem;
      }

      .benefit-info.only-mobile {
        font-size: 12px;
        margin-bottom: 0;
      }
    }
  }
}
.modal-custom.only-mobile {
  ::v-deep .modal .head .close-btn {
    top: 37% !important;
    right: 2.2rem !important;
  }
}
.modal-custom.only-mobile .benefit-row.only-mobile .name_target.only-mobile {
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
}

.modal-custom.only-mobile .benefit-row.only-mobile .benefit-grid.only-mobile {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-auto-rows: auto;
  gap: 2px;
  column-gap: 7px;
  align-items: baseline;
  font-size: 12px;
  line-height: 1.25;
}
.modal-custom.only-mobile .benefit-row.only-mobile .membership-name.only-mobile,
.modal-custom.only-mobile .benefit-row.only-mobile .membership-target.only-mobile {
  line-height: 1.2;
}

.modal-custom.only-mobile .benefit-row.only-mobile .benefit-grid.only-mobile .benefit-cat.only-mobile:nth-of-type(1) {
  grid-column: 1;
  grid-row: 1;
}
.modal-custom.only-mobile .benefit-row.only-mobile .benefit-grid.only-mobile .benefit-cat.only-mobile:nth-of-type(2) {
  grid-column: 2;
  grid-row: 1;
}
.modal-custom.only-mobile .benefit-row.only-mobile .benefit-grid.only-mobile .benefit-cat.only-mobile:nth-of-type(3) {
  grid-column: 1;
  grid-row: 2;
}
.modal-custom.only-mobile .benefit-row.only-mobile .benefit-grid.only-mobile .benefit-cat.only-mobile:nth-of-type(4) {
  grid-column: 2;
  grid-row: 2;
}

.modal-custom.only-mobile .benefit-row.only-mobile .benefit-grid.only-mobile .benefit-cat.only-mobile:last-of-type {
  white-space: nowrap;
}

.modal-custom.only-mobile ::v-deep .modal-wrap {
  pointer-events: auto !important;
}
.modal-custom.only-mobile ::v-deep .close-btn {
  pointer-events: auto !important;
}
</style>
