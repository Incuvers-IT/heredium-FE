<template>
  <KeepAlive>
    <div class="center box">
      <div v-if="!data || data?.length === 0"><no-coupon /></div>
      <div v-else>
        <client-only>
          <coupon-card
            v-for="item in data"
            :key="`coupon-${item.id}-${item.unused_coupons?.length}`"
            :detail-coupon="item"
            :is-selection="isSelection"
            :right-button="rightButton"
            :value="item.id"
            :model-value="selectedCouponId"
            :change="updateSelection"
            @refresh-coupon-list="handleRefreshCouponList"
          />
        </client-only>
      </div>
    </div>
  </KeepAlive>
</template>

<script>
import CouponCard from './CouponCard.vue';
import NoCoupon from './NoCoupon.vue';

export default {
  name: 'CouponList',
  components: { NoCoupon, CouponCard },
  props: {
    data: {
      type: Array,
      required: false,
      default: () => []
    },
    isSelection: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedCouponId: {
      type: Number,
      required: false,
      default: null
    },
    rightButton: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {};
  },

  methods: {
    updateSelection(id) {
      this.$emit('toggle-coupon-select', id);
    },
    handleRefreshCouponList() {
      this.$emit('refresh-coupon-list');
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  & > div {
    height: 100%;
    width: 100%;
  }
}
</style>
