<template>
  <client-only>
    <VDatePicker
      :value="value"
      class="date-picker"
      :class="{ 'is-active': isDatePickerShow }"
      :max-date="max"
      :min-date="min"
      :masks="masks"
      :mode="isTimePicker ? 'dateTime' : ''"
      is24hr="is24hr"
      :valid-hours="Array.from({ length: 24 }, (_, index) => index)"
      @popoverWillShow="setPopoverIsShow(true)"
      @popoverWillHide="setPopoverIsShow(false)"
      @input="onSelected"
    >
      <template #default="{ inputValue, togglePopover }">
        <div>
          <input
            class="data-input"
            :style="{
              width: `${width}rem`
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
  name: 'SDatepicker',
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    },
    // value: normal | large | x-large
    wSize: {
      type: String,
      required: false,
      default: 'normal'
    },
    isError: {
      type: Boolean,
      required: false,
      default: false
    },
    min: {
      type: String,
      required: false,
      default: null
    },
    max: {
      type: String,
      required: false,
      default: null
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    isTimePicker: {
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
        title: 'YYYY.MM'
      }
    };
  },
  created() {
    let width = 14.4;

    switch (this.wSize) {
      case 'normal':
        width = 14.4;
        break;
      case 'large':
        width = 16.4;
        break;
      case 'x-large':
        width = 21.8;
        break;
      case 'xx-large':
        width = 28;
        break;
      default:
        width = 14.4;
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
      const format = this.isTimePicker ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
      const formatDate = date && date !== 'Invalid Date' ? this.$dayjs(date).format(format) : '';

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

  .data-input {
    width: 14.4rem;
    height: 4.4rem;
    padding: 0 3rem 0 1.6rem;
    border: 1px solid var(--color-grey-2);
    border-radius: 0.3rem;
    background-color: var(--color-white);
    cursor: pointer;
    outline: 0;

    &.is-error {
      border: 1px solid var(--color-red);
    }

    &.is-readonly {
      color: var(--color-grey-2);
      cursor: default;

      + i {
        color: var(--color-grey-2);
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
      border-color: var(--color-blue);
    }

    .data-input + i {
      color: var(--color-blue);
    }
  }

  .ic-arrow-left,
  .ic-arrow-right {
    color: var(--color-white);
    font-size: 2.2rem;
  }

  &::v-deep {
    .vc-popover-content {
      border-radius: 0.3rem;
      border-color: var(--color-grey-2);
    }

    .vc-arrow:hover {
      background: transparent;
    }

    .vc-header {
      height: 4.4rem;
      padding: 0;
      background-color: var(--color-blue);
      border-radius: 0.3rem 0.3rem 0 0;

      .vc-title {
        color: var(--color-white);
        font-size: 1.4rem;
      }
    }

    .vc-weeks {
      padding: 1.6rem 1.6rem 1.8rem;

      .vc-weekday {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-black);
        height: 1.8rem;
        width: 3.4rem;
        font-size: 1.2rem;
        padding: 0;
        margin-bottom: 1.5rem;
      }

      .vc-day {
        height: 3.4rem;
        width: 3.4rem;
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
        color: var(--color-blue) !important;
      }

      .vc-highlight {
        height: 3.4rem;
        width: 3.4rem;
        border-radius: 0 !important;
        border: 1px solid var(--color-blue);
        background-color: transparent !important;
      }

      .in-next-month {
        display: none;
      }

      .weekday-1,
      .weekday-7 {
        background-color: var(--color-grey-1) !important;
      }

      .vc-day-content.is-disabled {
        color: var(--color-grey-3);
      }
    }
  }
}
</style>
