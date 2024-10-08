<template>
  <div class="benefit-container">
    <div class="benefit-thumbnail">
      <SImageUploadRepresentative
        :image-src="couponEditor.image_url"
        type="SMALL"
        :class="{ 'is-error': error?.imageUrl }"
        @image-uploaded="updateThumbnail"
        @image-removed="removeThumbnail"
      />
    </div>
    <div class="benefit-information">
      <div class="field-group">
        <label>Coupon name</label>
        <div class="field-value">
          <SInput v-model="couponEditor.name" :class="{ 'is-error': error?.name }" w-size="large" />
        </div>
      </div>
      <div class="field-group">
        <label>Period of use</label>
        <div class="field-value">
          <SInput
            v-model="couponEditor.period_in_days"
            :class="{ 'is-error': error?.periodInDays }"
            is-comma-num
            w-size="large"
          />
        </div>
      </div>
      <div class="field-group">
        <label>Coupon type</label>
        <div class="field-value">
          <SDropdown
            v-model="couponEditor.coupon_type"
            :class="{ 'is-error': error?.couponType }"
            :option-list="couponTypeOptionList"
            w-size="large"
          ></SDropdown>
        </div>
      </div>
      <div class="field-group">
        <label>Number of uses</label>
        <div class="field-value input-group">
          <SInput
            v-model="couponEditor.number_of_uses"
            is-comma-num
            w-size="large"
            :disabled="couponEditor.is_permanent"
            :class="{ 'is-error': error?.numberOfUses }"
          />
          <div>
            <SCheckbox v-model="couponEditor.is_permanent" />
            <p>Permanent discount</p>
          </div>
        </div>
      </div>
      <div class="field-group">
        <label>Discount rate</label>
        <div class="field-value">
          <SInput
            v-model="couponEditor.discount_percent"
            :class="{ 'is-error': error?.discountPercent }"
            is-comma-num
            :maxlength="3"
            w-size="large"
          />
        </div>
      </div>
      <div v-if="showAddButton" class="right">
        <SButton button-type="primary" w-size="medium" @click="$emit('add-coupon')"> Add </SButton>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import SButton from '../../commons/SButton.vue';
import SCheckbox from '../../commons/SCheckbox.vue';
import SImageUploadRepresentative from '../../commons/SImageUploadRepresentative.vue';
import SInput from '../../commons/SInput.vue';
import SDropdown from '../../commons/SDropdown.vue';
import { COUPON_DEFAULT } from '~/assets/js/types';

const COUPON_TYPE_OPTION_LIST = [
  { value: 'DRINK', label: '커피' },
  { value: 'ARTSHOP', label: '아트숍' },
  { value: 'PROGRAM', label: '프로그램' },
  { value: 'EXHIBITION ', label: '전시' }
];

export default {
  name: 'CouponEditor',
  components: { SImageUploadRepresentative, SCheckbox, SInput, SButton, SDropdown },
  props: {
    coupon: {
      type: Object,
      required: true,
      default: COUPON_DEFAULT
    },
    error: {
      type: Object,
      required: false,
      default: undefined
    },
    showAddButton: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      couponEditor: {},
      couponTypeOptionList: COUPON_TYPE_OPTION_LIST
    };
  },

  watch: {
    couponEditor: {
      handler(newVal) {
        this.$emit('update-coupon', newVal);
      },
      deep: true
    }
  },
  created() {
    this.couponEditor = cloneDeep(this.coupon);
  },
  methods: {
    updateThumbnail(e) {
      this.couponEditor.image_url = e.resizeImage.small;
    },
    removeThumbnail() {
      this.couponEditor.image_url = '';
    }
  }
};
</script>

<style scoped lang="scss">
.benefit-container {
  display: flex;
  padding: 12px 20px;
  gap: 60px;
  background-color: #eff6ff !important;
  .benefit-thumbnail {
    width: 471px;
  }
  .benefit-information {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    flex: 1;
    .field-group {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 12px;
      & > label {
        display: flex;
        align-items: center;
      }
      .field-value {
        width: 100%;
      }
      input {
        width: 100%;
      }
      .input-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        input {
          width: calc(100% - 170px);
        }
        p {
          display: inline;
          margin-left: 8px;
        }
      }
    }
  }
  .right {
    display: flex;
    justify-content: end;
  }
}
</style>
