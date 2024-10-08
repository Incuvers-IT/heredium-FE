<template>
  <div class="create-membership">
    <div class="create-membership__content">
      <div class="field-group">
        <label> Membership Name </label>
        <SInput v-model="membershipName" w-size="large" :class="{ 'is-error': isSubmitted && !membershipName }" />
      </div>
      <div class="field-group">
        <label> Price </label>
        <SInput
          v-model="price"
          is-comma-num
          w-size="large"
          text-align="right"
          :class="{ 'is-error': isSubmitted && !price }"
        />
      </div>
    </div>
    <div class="create-membership__action">
      <SButton button-type="primary" @click="handleAddMembershipOption">
        <i class="ic-plus mb-28"></i>
        Add new
      </SButton>
    </div>
  </div>
</template>

<script>
import SButton from '../../commons/SButton.vue';
import SInput from '../../commons/SInput.vue';

const DEFAULT_MEMBERSHIP_NAME = '';
const DEFAULT_MEMBERSHIP_PRICE = 0;

export default {
  name: 'AddMembershipOption',
  components: { SInput, SButton },
  data() {
    return {
      membershipName: DEFAULT_MEMBERSHIP_NAME,
      price: DEFAULT_MEMBERSHIP_PRICE,
      isSubmitted: false
    };
  },
  methods: {
    handleAddMembershipOption() {
      if (!this.membershipName || !this.price) {
        this.isSubmitted = true;
        return null;
      }

      this.$emit('add-membership-option', {
        name: this.membershipName,
        price: this.price
      });
      this.membershipName = DEFAULT_MEMBERSHIP_NAME;
      this.price = DEFAULT_MEMBERSHIP_PRICE;
      this.isSubmitted = false;
    }
  }
};
</script>

<style scoped lang="scss">
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
      label {
        font-weight: bold;
        margin-right: 8px;
      }
      input {
        width: 200px;
        max-width: 40%;
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
