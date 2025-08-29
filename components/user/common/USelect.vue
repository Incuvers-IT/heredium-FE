<template>
  <div
    ref="root"
    class="dropdown"
    :class="[{ 'is-open': isOpen, 'is-error': isError }, wSize]"
    :style="{ width }"
  >
    <!-- slot 으로 라벨을 넣고 싶을 때 -->
    <div v-if="isHasSlotText" class="txt-body1">
      <slot></slot>
    </div>

    <div class="dropdown-wrap" :style="{ width }">
      <!-- 선택된 값 표시 버튼 -->
      <div
        class="dropdown-btn"
        :class="{ disabled, 'is-error': isError }"
        :style="{ width }"
        @click.stop="toggle"
      >
        <span class="selected-text">
          {{ currentLabel || defaultText || '선택' }}
        </span>
        <div class="dropdown-icon">
          <!-- PC / 모바일 대응 -->
          <i class="only-pc uic-arrow_bottom rotate" />
          <i class="only-mobile uic-arrow_bottom rotate" />
       </div>
      </div>

      <!-- 커스텀 옵션 리스트 -->
      <ul v-if="isOpen" class="dropdown-menu" :style="{ width }">
        <!-- 검색창 -->
        <li v-if="searchable" class="dropdown-item search-input">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="검색"
            @click.stop
          />
        </li>
        <!-- 기본 힌트 옵션 -->
        <li
          v-if="defaultText"
          class="dropdown-item hint"
          @click.stop="select(null)"
        >
          {{ defaultText }}
        </li>
        <!-- 실제 옵션 -->
        <li
          v-for="item in filteredOptions"
          :key="item.value"
          class="dropdown-item"
          :class="{ selected: item.value === selected }"
          @click.stop="select(item.value)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'USelect',
  props: {
    value: {
      type: [String, Number, Boolean, null],
      default: null
    },
    optionList: {
      type: Array,
      default: () => []
    },
    defaultText: {
      type: String,
      default: ''
    },
    wSize: {
      type: String,
      default: 'normal' // 'small' | 'normal' | 'full'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isCalIcon: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    error: { type: Boolean, default: false },        // 에러 여부 (간단)
    errorMsg: { type: String, default: '' }          // 에러 메시지 (텍스트)
  },
  data() {
    return {
      width: '40rem',
      isOpen: false,
      selected: this.value,
      searchTerm: ''
    };
  },
  computed: {
    isError() { return !!(this.error || this.errorMsg); },
    // 검색어가 있을 때 옵션 필터
    filteredOptions() {
      if (!this.searchable || !this.searchTerm) {
        return this.optionList;
      }
      const term = this.searchTerm.toLowerCase();
      return this.optionList.filter(o =>
        o.label.toLowerCase().includes(term)
      );
    },
    isHasSlotText() {
      return !!this.$slots.default;
    },
    currentLabel() {
      const f = this.optionList.find(o => o.value === this.selected);
      return f ? f.label : '';
    }
  },
  watch: {
    value(v) { this.selected = v; },
    wSize: 'calcWidth'
  },
  mounted() {
    this.calcWidth();
    document.addEventListener('click', this.onClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onClickOutside);
  },
  methods: {
    calcWidth() {
      switch (this.wSize) {
        case 'xsmall':  this.width = '15rem'; break;
        case 'small':  this.width = '25rem'; break;
        case 'full':   this.width = '100%'; break;
        default:       this.width = '40rem'; break;
      }
    },
    toggle() {
      if (!this.disabled) this.isOpen = !this.isOpen;
    },
    select(val) {
      if (this.disabled) return;
      this.selected = val;
      this.$emit('input', val);
      this.$emit('change', val);
      this.isOpen = false;
    },
    onClickOutside(e) {
      const root = this.$refs.root;
      // ref 가 없거나, 이미 언마운트된 상태라면 그냥 무시
      if (!root || !root.contains) return;

      if (!root.contains(e.target)) {
        this.isOpen = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-block;
  vertical-align: top;

  &.small { /* wSize="small" */
    width: 25rem !important;
  }
  &.normal {
    width: 40rem;
  }
  &.full { /* wSize="full" */
    width: 100%;
  }

  .dropdown-wrap {
    position: relative;
  }

  .dropdown-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.6rem;
    height: 4.5rem;
    border: 1px solid var(--color-u-grey-2);
    background: var(--color-white);
    color: var(--color-black);
    cursor: pointer;
    user-select: none;
    border-radius: 0.5rem;

    &.disabled {
      color: var(--color-grey-3);
      background: var(--color-grey-1);
      cursor: not-allowed;
    }

    .selected-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-icon {
      flex: 0 0 auto;
      margin-left: 0.8rem;
      i {
        font-size: 2.4rem;
        &.rotate { transition: transform .2s; }
      }
    }
  }

  .dropdown-icon i {
    transform: rotate(-90deg);
    transition: transform .2s;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    max-height: 22.1rem;
    margin: 0;
    padding: 0;
    list-style: none;
    background: var(--color-white);
    border: 1px solid var(--color-u-grey-2);
    overflow-y: auto;
    border-radius: 0.5rem;
  }

  .dropdown-item {
    padding: 1rem 1.6rem;
    cursor: pointer;
    white-space: nowrap;
    &:hover { background: var(--color-grey-1); }
    &.selected { background: var(--color-grey-2); }
  }

  .dropdown-item.hint {
    font-style: italic;
    color: var(--color-grey-4);
  }
}

/* 기존 pc/m 규칙 복사해서 only-로 하나 더 만들어줍니다 */
i.only-mobile {
  display: none;
}
@media screen and (max-width: 768px) {
  i.only-pc {
    display: none !important;
  }
  i.only-mobile {
    display: block !important;
  }
}
/* 회전 토글은 그대로 */
.dropdown.is-open .dropdown-icon i.rotate {
  transform: rotate(-270deg);
}

/* dropdown.vue 아래쪽에 추가 */
.dropdown-item.search-input {
  padding: 0.8rem 1.6rem;       /* 위아래 0.8rem, 좌우 1.6rem 패딩 */
  box-sizing: border-box;      /* padding 포함해서 width 계산 */

  input {
    display: block;            /* 블록 레벨로 만들어서 */
    width: 100%;               /* li 너비 가득 채우기 */
    padding: 0.6rem 0.8rem;     /* 입력창 안쪽 여백 */
    border: 1px solid var(--color-u-grey-2);
    border-radius: 0.5rem;
    font-size: 1.4rem;
    line-height: 1.4;
    outline: none;

    /* 포커스 시 테두리 강조 */
    &:focus {
      border-color: var(--color-u-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-u-primary-rgb), 0.2);
    }
  }
}

/* 만약 li 높이가 너무 크면 이렇게 최소 높이만 잡아줄 수도 있습니다 */
.dropdown-item.search-input {
  min-height: auto;
}

.dropdown.is-error {
  .dropdown-btn {
    border-color: rgba(var(--color-u-error-rgb, 255,77,79), 0.6) !important;
    box-shadow: 0 0 0 1px rgba(var(--color-u-error-rgb, 255,77,79), 0.3) inset;

    &:focus-within {
      box-shadow:
        0 0 0 1px rgba(var(--color-u-error-rgb, 255,77,79), 0.4) inset,
        0 0 0 2px rgba(255, 77, 79, 0.15); // 바깥 glow 연하게
    }
  }

  /* 열렸을 때 목록 외곽선도 에러색으로 맞추고 싶다면 */
  .dropdown-menu {
    border-color: var(--color-u-error) !important;
  }

  .error-msg {
    color: var(--color-u-error);
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 160%;
    letter-spacing: 0.25px;
    text-align: left;
  }
}

/* 모바일 폰트 축소 대응 (선택) */
@media screen and (max-width: 768px) {
  .dropdown.is-error .error-msg {
    font-size: 0.5rem;
    margin-top: 0.4rem;
  }
}
</style>
