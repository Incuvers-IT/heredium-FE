<template>
  <div class="create-membership">
    <div class="create-membership__content">
      <div class="representative-img mr-28">
        <SImageUploadRepresentative
          v-model="membershipImage"
          :zoom="0.9"
          type="PROJECT_DETAIL_IMAGE"
          :image-src="membershipImage"
          :class="{ 'is-error': isSubmitted && !membershipImage }"
          @image-uploaded="updateThumbnail"
          @image-removed="removeThumbnail"
        />
      </div>
      <div>
        <div class="field-group">
          <label> 멤버십 이름 </label>
          <SInput
            v-model="membershipName"
            w-size="large"
            :class="{ 'is-error': isSubmitted && !membershipName }"
            :disabled="disabled"
          />
        </div>
        <div class="field-group">
          <label> 가격 </label>
          <s-flex-input-grid>
            <template #input>
              <SInput
                v-model="price"
                is-comma-num
                w-size="large"
                text-align="right"
                :class="{ 'is-error': isSubmitted && !price }"
                :disabled="disabled"
              />
            </template>
            <template #content>
              <div class="currency">원</div>
            </template>
          </s-flex-input-grid>
        </div>
      </div>
    </div>
    <div class="create-membership__action">
      <SButton button-type="primary" :disabled="disabled" @click="handleAddMembershipOption">
        <i class="ic-plus mb-28"></i>
        추가
      </SButton>
    </div>
  </div>
</template>

<script>
import SButton from '../../commons/SButton.vue';
import SFlexInputGrid from '../../commons/SFlexInputGrid.vue';
import SImageUploadRepresentative from '../../commons/SImageUploadRepresentative.vue';
import SInput from '../../commons/SInput.vue';

const DEFAULT_MEMBERSHIP_NAME = '';
const DEFAULT_MEMBERSHIP_PRICE = 0;

export default {
  name: 'AddMembershipOption',
  components: { SInput, SButton, SImageUploadRepresentative, SFlexInputGrid },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      membershipName: DEFAULT_MEMBERSHIP_NAME,
      price: DEFAULT_MEMBERSHIP_PRICE,
      membershipImage: '',
      isSubmitted: false
    };
  },
  methods: {
    updateThumbnail(e) {
      this.membershipImage = e.resizeImage.large;
    },
    removeThumbnail() {
      this.membershipImage = '';
    },
    handleAddMembershipOption() {
      if (!this.membershipName || !this.price || !this.membershipImage) {
        this.isSubmitted = true;
        return null;
      }

      this.$emit('add-membership-option', {
        name: this.membershipName,
        price: this.price,
        image_url: this.membershipImage
      });
      this.membershipName = DEFAULT_MEMBERSHIP_NAME;
      this.price = DEFAULT_MEMBERSHIP_PRICE;
      this.membershipImage = '';
      this.isSubmitted = false;
    }
  }
};
</script>

<style scoped lang="scss">
.representative-img {
  position: relative;
  flex: 1 1 56rem;
  width: 132px;
}

.create-membership {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 12px 20px;
  gap: 20px;
  .create-membership__content {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 40px;
    .field-group {
      display: flex;
      justify-content: space-between;
      align-items: center;

      label {
        font-weight: bold;
        margin-right: 8px;
        width: 20%;
      }
      input {
        width: 200px;
        max-width: 40%;
      }

      &:first-child {
        margin-bottom: 24px;
      }
    }
  }
  .create-membership__action {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      margin: 0;
    }
  }
}
</style>
