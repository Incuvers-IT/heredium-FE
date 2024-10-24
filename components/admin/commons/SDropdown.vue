<template>
  <div class="dropdown" :class="{ 'is-open': isOpen }" @click="onStopPropagation">
    <div v-if="isHasSlotText" class="label">
      <slot />
    </div>
    <div class="dropdown-wrap">
      <button
        class="dropdown-btn"
        type="button"
        :disabled="disabled"
        :style="{
          width: `${width}rem`
        }"
        @click="onToggleMenu"
      >
        {{ selectedLabel || defaultText }}
      </button>
      <div class="dropdown-icon">
        <i class="ic-expand-more" />
      </div>
      <div v-if="isOpen && optionList && optionList[0]" class="dropdown-menu">
        <button v-for="item in optionList" :key="item.value" type="button" @click="onSelected(item)">
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SDropdown',
  props: {
    value: {
      type: [String, Number, Boolean, null],
      required: false,
      default: null
    },
    // optionList: [{ value: '', label: '' }]
    optionList: {
      type: Array,
      required: false,
      default: () => []
    },
    defaultText: {
      type: String,
      required: false,
      default: '전체'
    },
    // value: x-small | small | normal | large | x-large
    wSize: {
      type: String,
      required: false,
      default: 'normal'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      width: 15.2,
      isOpen: false
    };
  },
  computed: {
    isHasSlotText() {
      return !!this.$slots.default;
    },
    selectedLabel() {
      const targetValue = this.value;
      const isHasNullValue = !!this.optionList.find((item) => item.value === null);
      const targetOption = this.optionList.find((item) => item.value === targetValue);

      return isHasNullValue || (targetValue != null && targetOption) ? targetOption.label : null;
    }
  },
  created() {
    let width = '';

    switch (this.wSize) {
      case 'x-small':
        width = 9.5;
        break;
      case 'small':
        width = 12.2;
        break;
      case 'normal':
        width = 15.2;
        break;
      case 'large':
        width = 20;
        break;
      case 'x-large':
        width = 40;
        break;
      default:
        width = 15.2;
        break;
    }
    this.width = width;
  },
  mounted() {
    document.addEventListener('click', () => {
      this.isOpen = false;
    });
  },
  methods: {
    onStopPropagation(e) {
      e.stopPropagation();
    },
    onToggleMenu() {
      this.isOpen = !this.isOpen;
    },
    onSelected({ value }) {
      this.isOpen = false;
      this.$emit('input', value);
      this.$emit('change');
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;

  .label {
    font-size: 1.4rem;
    margin-right: 1.2rem;
  }

  .dropdown-wrap {
    position: relative;
  }

  .dropdown-btn {
    color: var(--color-black);
    height: 4.4rem;
    width: 14.4rem;
    padding: 0 4.2rem 0 1.6rem;
    border: 1px solid var(--color-grey-2);
    border-radius: 0.3rem;
    text-align: left;
    background-color: var(--color-white);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:disabled {
      color: var(--color-grey-3);
      pointer-events: none;
    }
  }

  .dropdown-icon {
    display: flex;
    position: absolute;
    height: calc(100% - 2px);
    width: 4.1rem;
    align-items: center;
    justify-content: center;
    top: 1px;
    right: 1px;
    font-size: 2.4rem;
    background-color: var(--color-grey-1);
    pointer-events: none;

    i {
      transition: 0.15s all ease-in-out;
    }
  }

  .dropdown-menu {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: calc(100% + 0.6rem);
    left: 0;
    max-height: 20rem;
    overflow-y: auto;
    width: 100%;
    z-index: 10;
    border: 1px solid var(--color-grey-2);
    background-color: var(--color-white);

    & > button {
      min-height: 4rem;
      font-size: 1.4rem;
      padding: 0.5rem 1.6rem;
      text-align: left;

      &:hover {
        background-color: var(--color-grey-1);
      }
    }

    &::-webkit-scrollbar {
      height: 80%;
      margin-right: 12px;
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #d9d9d9;
      border-radius: 8px;
    }
    &::-webkit-scrollbar-track {
      background-color: var(--color-grey-1);
    }
  }

  &.is-open {
    .dropdown-btn {
      border: 1px solid var(--color-blue);
    }

    .dropdown-icon {
      color: var(--color-white);
      background-color: var(--color-blue);

      i {
        transform: rotate(-180deg);
      }
    }
  }
}
</style>
