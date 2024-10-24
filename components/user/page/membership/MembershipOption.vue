<template>
  <div class="membership-option" :class="{ checked: isChecked }" @click="toggleCheck">
    <input type="radio" :value="modelValue" :checked="isChecked" class="hidden-radio" />
    <div class="content">
      <img :src="membershipImage" />
    </div>
  </div>
</template>

<script>
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'MembershipOption',
  mixins: [imageMixin],
  props: {
    modelValue: {
      required: true,
      validator(value) {
        return typeof value === 'string' || typeof value === 'number' || value === null || value === undefined;
      }
    },
    membership: {
      type: Object,
      required: true
    },
    change: {
      type: Function,
      required: true
    }
  },
  computed: {
    isChecked() {
      return this.modelValue === this.membership?.membership_id;
    },
    membershipImage() {
      return this.getImage(this.membership?.image_url);
    }
  },
  methods: {
    toggleCheck() {
      this.change({ ...this.membership });
    }
  }
};
</script>

<style scoped lang="scss">
.membership-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  cursor: pointer;
  background-color: #f7f8f5;

  .hidden-radio {
    display: none;
  }
  .content {
    max-width: 100%;
  }
  img {
    object-fit: contain;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    height: auto;
    max-height: 200px;
    border-radius: 8px;
    border: 2px solid transparent;
    cursor: pointer;
    pointer-events: none;
  }
}
@media screen and (min-width: 769px) {
  .membership-option.checked img {
    border-color: var(--color-u-primary);
  }
}
</style>
