<template>
  <div class="benefit-container">
    <div class="benefit-thumbnail">
      <SImageUploadRepresentative
        :image-src="couponEditor.image_url"
        type="SMALL"
        :class="{ 'is-error': error?.imageUrl }"
        :disabled="disabled"
        @image-uploaded="updateThumbnail"
        @image-removed="removeThumbnail"
      />
    </div>
    <div class="benefit-information">
      <div class="field-group">
        <label>쿠폰명<b class="must">*</b></label>
        <div class="field-value">
          <SInput
            v-model="couponEditor.name"
            :disabled="disabled"
            :class="{ 'is-error': error?.name }"
            w-size="large"
          />
        </div>
      </div>
      <div class="field-group">
        <label>사용기간<b class="must">*</b></label>
        <div v-if="isIssuance">
          <SDatepicker
            v-model="couponEditor.start_date"
            :max="couponEditor.end_date"
            :class="{ 'is-error': error?.start_date }"
          />
          <span class="ml-8 mr-8">~</span>
          <SDatepicker
            v-model="couponEditor.end_date"
            :min="couponEditor.start_date"
            :class="{ 'is-error': error?.end_date }"
          />
        </div>
        <div v-else class="field-value">
          <SInput
            v-model="couponEditor.period_in_days"
            :disabled="disabled"
            :class="{ 'is-error': error?.periodInDays }"
            is-comma-num
            w-size="large"
          />
        </div>
      </div>
      <div class="field-group">
        <label>쿠폰종류<b class="must">*</b></label>
        <div class="field-value">
          <SDropdown
            v-model="couponEditor.coupon_type"
            :disabled="disabled"
            :class="{ 'is-error': error?.couponType }"
            :option-list="couponTypeOptionList"
            w-size="large"
          ></SDropdown>
        </div>
      </div>
      <div class="field-group">
        <label>사용횟수</label>
        <div class="field-value input-group">
          <SInput
            v-model="couponEditor.number_of_uses"
            is-comma-num
            w-size="large"
            :disabled="couponEditor.is_permanent || disabled"
            :class="{ 'is-error': error?.numberOfUses }"
          />
          <div>
            <SCheckbox v-model="couponEditor.is_permanent" :disabled="disabled" />
            <p>Permanent discount</p>
          </div>
        </div>
      </div>
      <div class="field-group">
        <label>할인율<b class="must">*</b></label>
        <div class="field-value">
          <SInput
            v-model="couponEditor.discount_percent"
            :class="{ 'is-error': error?.discountPercent }"
            is-comma-num
            maxlength="3"
            w-size="large"
            :disabled="disabled"
          />
        </div>
      </div>
      <div v-if="showAddButton && !disabled" class="right">
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
import SDatepicker from '../../commons/SDatepicker.vue';
import { COUPON_DEFAULT } from '~/assets/js/types';

const COUPON_TYPE_OPTION_LIST = [
  { value: '', label: '선택' },
  { value: 'COFFEE', label: '커피' },
  { value: 'ARTSHOP', label: '아트숍' },
  { value: 'PROGRAM', label: '프로그램' },
  { value: 'EXHIBITION ', label: '전시' }
];

export default {
  name: 'CouponEditor',
  components: { SImageUploadRepresentative, SCheckbox, SInput, SButton, SDropdown, SDatepicker },
  props: {
    coupon: {
      type: Object,
      required: false,
      default: null
    },
    error: {
      type: Object,
      required: false,
      default: undefined
    },
    showAddButton: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isIssuance: {
      type: Boolean,
      required: false,
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
    this.couponEditor = cloneDeep(this.coupon || COUPON_DEFAULT);
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
  .must {
    color: var(--color-blue);
  }
}
</style>
