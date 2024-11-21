<template>
  <label>
    <input :value="value" type="checkbox" :checked="isChecked" :disabled="disabled" @click="onToggle" />
    <span class="toggle"></span>
    <span v-if="isHasSlotText" class="text"><slot name="default" /></span>
  </label>
</template>

<script>
export default {
  name: 'SToggle',
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    isHasSlotText() {
      return !!this.$slots.default;
    },
    isChecked() {
      return this.value;
    }
  },
  methods: {
    onToggle() {
      this.$emit('input', !this.value);
    }
  }
};
</script>

<style lang="scss" scoped>
label {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding-left: 2.4rem;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle {
    position: absolute;
    cursor: pointer;
    width: 2.4rem;
    height: 1.2rem;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    border-radius: 9999px;
    background-color: var(--color-white);
    border: 1px solid var(--color-blue);
  }

  .toggle::before {
    position: absolute;
    content: '';
    height: 1.2rem;
    width: 1.2rem;
    border: 1px solid var(--color-blue);
    border-radius: 50%;
    top: 50%;
    left: -1px;
    transform: translateY(-50%);
    background-color: white;
    transition: 0.3s all ease-out;
  }

  input:checked + .toggle {
    background-color: var(--color-blue);
  }

  input:checked + .toggle::before {
    transform: translateY(-50%) translateX(1.2rem);
  }

  .text {
    padding-left: 0.7rem;
    cursor: pointer;
    user-select: none;
  }
}
</style>
