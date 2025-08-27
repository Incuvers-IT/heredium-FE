<template>
  <client-only>
    <VDatePicker
      :value="value"
      class="date-picker"
      :class="{ 'is-active': isDatePickerShow }"
      :max-date="max"
      :min-date="min"
      :masks="masks"
      :style="{
        width: `${width}`
      }"
      @popoverWillShow="setPopoverIsShow(true)"
      @popoverWillHide="setPopoverIsShow(false)"
      @input="onSelected"
    >
      <template #default="{ inputValue, togglePopover }">
        <div
          :style="{
            width: `${width}`
          }"
        >
          <input
            type="text"
            class="data-input"
            :style="{
              width: `${width}`
            }"
            :class="{
              'is-error': isError,
              'is-readonly': readonly
            }"
            :value="inputValue"
            placeholder="YYYY-MM-DD"
            readonly
            @click="showPopover(togglePopover)"
          />
          <i class="ic-today" />
        </div>
      </template>
      <template #header-left-button>
        <button type="button"><i class="ic-arrow-left" /></button>
      </template>
      <template #header-right-button>
        <button type="button"><i class="ic-arrow-right" /></button>
      </template>
    </VDatePicker>
  </client-only>
</template>

<script>
export default {
  name: 'UDatepicker',
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    },
    // value: full | normal | large | x-large
    wSize: {
      type: String,
      required: false,
      default: 'full'
    },
    isError: {
      type: Boolean,
      required: false,
      default: false
    },
    min: {
      type: [String],
      required: false,
      default: null
    },
    max: {
      type: [String],
      required: false,
      default: null
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      width: 14.4,
      isDatePickerShow: false,
      masks: {
        title: 'YYYY-MM'
      }
    };
  },
  created() {
    let width = '';

    switch (this.wSize) {
      case 'full':
        width = '100%';
        break;
      case 'normal':
        width = '14.4rem';
        break;
      case 'large':
        width = '16.4rem';
        break;
      case 'x-large':
        width = '21.8rem';
        break;
      default:
        width = '14.4rem';
        break;
    }

    this.width = width;
  },
  methods: {
    showPopover(togglePopover) {
      if (!this.readonly) {
        togglePopover();
      }
    },
    setPopoverIsShow(isShow) {
      this.isDatePickerShow = isShow;
    },
    onSelected(date) {
      const formatDate = date && date !== 'Invalid Date' ? this.$dayjs(date).format('YYYY-MM-DD') : '';

      this.$emit('input', formatDate);
      this.$emit('change');
    }
  }
};
</script>

<style lang="scss" scoped>
.date-picker {
  display: inline-flex;
  position: relative;
  color: var(--color-black);
  border-color: var(--color-u-grey-1);

  .data-input {
    width: 14.4rem;
    height: 4.4rem;
    padding: 0 3rem 0 1.6rem;
    border: 1px solid var(--color-u-grey-2);
    background-color: var(--color-white);
    cursor: pointer;
    outline: 0;

    &.is-error {
      border: 1px solid var(--color-u-error);
    }

    &.is-readonly {
      color: var(--color-u-primary);
      cursor: default;

      + i {
        color: var(--color-u-primary);
      }
    }
  }

  i.ic-today {
    position: absolute;
    width: 2.4rem;
    color: var(--color-black);
    font-family: 'simsimicons', serif;
    font-size: 2.4rem;
    top: 50%;
    right: 0.8rem;
    transform: translateY(-50%);
    pointer-events: none;
  }

  &.is-active {
    .data-input {
      border-color: var(--color-u-primary);
    }

    .data-input + i {
      color: var(--color-u-primary);
    }
  }

  .ic-arrow-left,
  .ic-arrow-right {
    color: var(--color-white);
    font-size: 2.2rem;
  }

  &::v-deep {
    .vc-popover-caret {
      background-color: var(--color-u-primary);
    }

    .vc-popover-content {
      border-radius: 0.3rem;
      border-color: var(--color-u-grey-2);
    }

    .vc-arrow:hover {
      background: transparent;
    }

    .vc-header {
      height: 4.4rem;
      padding: 0;
      background-color: var(--color-u-primary);

      .vc-title {
        color: var(--color-white);
        font-size: 1.6rem;
      }
    }

    .vc-weeks {
      padding: 2rem 1.8rem 2.2rem 1.8rem;

      .vc-weekday {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-black);
        height: 1.6rem;
        width: 3.6rem;
        font-size: 1.2rem;
        padding: 0;
        margin-bottom: 2.4rem;
      }

      .vc-day {
        height: 3.6rem;
        width: 3.6rem;
        margin-bottom: 0.4rem;
      }

      .vc-day-content {
        color: var(--color-black);
        border-radius: 0 !important;
        font-size: 1.2rem;
        height: 100%;
        width: 100%;

        &:hover {
          border-radius: 0;
        }
      }

      .vc-highlight-base-start,
      .vc-highlight-base-middle,
      .vc-highlight-base-end {
        width: 100% !important;
        background-color: #ebf7ff !important;
      }

      .vc-highlights + span.vc-day-content.vc-focusable {
        color: var(--color-u-primary) !important;
      }

      .vc-highlight {
        height: 3.4rem;
        width: 3.4rem;
        border-radius: 0 !important;
        border: 1px solid var(--color-u-primary);
        background-color: transparent !important;
      }

      .in-next-month {
        display: none;
      }

      .vc-day-content.is-disabled {
        color: var(--color-u-grey-3);
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .date-picker {
    .data-input {
      height: 5.2rem;
      font-size: 1.8rem;
    }
  }
}

/* iOS에서 값이 투명해 보이는 이슈 방지 */
.data-input {
  color: var(--color-black) !important;
  -webkit-text-fill-color: var(--color-black) !important; /* 핵심 */
  -webkit-appearance: none;
  appearance: none;
  background-clip: padding-box;
}

/* placeholder 색도 명시(스코프 영향 받도록 .data-input 기준) */
.data-input::placeholder {
  color: var(--color-u-grey-2);
  -webkit-text-fill-color: var(--color-u-grey-2);
}

/* readonly일 때도 색 빠지지 않게 */
.data-input[readonly],
.data-input.is-readonly {
  opacity: 1;
  -webkit-text-fill-color: var(--color-black) !important;
}

/* iOS 자동완성 테마가 덮어쓰는 경우 방어 */
.data-input:-webkit-autofill {
  -webkit-text-fill-color: var(--color-black) !important;
  box-shadow: 0 0 0 1000px var(--color-white) inset !important;
  -webkit-box-shadow: 0 0 0 1000px var(--color-white) inset !important;
}
</style>
