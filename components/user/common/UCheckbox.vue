<template>
  <label>
    <input :value="value" type="checkbox" :checked="isChecked" :disabled="disabled" @click="onToggle" />
    <span class="toggle" />
    <span v-if="isHasSlotText" class="text"><slot name="default" /></span>
  </label>
</template>

<script>
export default {
  name: 'UCheckbox',
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },
    checkValue: {
      type: [String, Number],
      required: false,
      default: null
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    reverse: {
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
      return this.reverse ? !this.value : this.value;
    }
  },
  methods: {
    onToggle(e) {
      this.$emit('input', !this.value);
      this.$emit('change', e.target.checked);
    }
  }
};
</script>

<style lang="scss" scoped>
label {
  position: relative;
  align-items: center;
  //height: 1.8rem;
  padding-left: 1.4rem;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle {
    position: absolute;
    cursor: pointer;
    width: 1.8rem;
    height: 1.8rem;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    border: 1px solid var(--color-u-grey-2);
    background-color: var(--color-white);
    transition: 0.15s all ease-out;
  }

  input:checked + .toggle {
    border: 0;
    background-color: var(--color-u-primary);
  }

  input:disabled + .toggle {
    border-color: var(--color-grey-2);
    background-color: var(--color-white);
  }

  input:checked + .toggle::after {
    content: '\e912';
    position: absolute;
    top: 56%;
    left: 50%;
    font-family: 'simsimicons', serif;
    font-size: 1.1rem;
    transform: translate(-50%, -50%);
    color: var(--color-white);
    border: 0;
  }

  .text {
    display: inline-flex;
    color: var(--color-black);
    padding-left: 0.7rem;
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 150%;
    cursor: pointer;
    user-select: none;
    //transform: translateY(-0.2rem);
  }
}

@media screen and (min-width: 768px) {
  label {
    .text {
      align-items: center;
      padding-left: 1.2rem;
      line-height: 160%;
      letter-spacing: 0.025rem;
    }

    .toggle {
      width: 2rem;
      height: 2rem;
    }
  }
}
</style>
