<template>
  <div>
    <div :class="tableWrapClass">
      <slot name="data" :data="currentPageData" />
    </div>
    <slot name="pagination">
      <div v-show="!isHidePagination" class="pagination" :class="paginationClass">
        <div class="pagination__wrap">
          <button type="button" class="pagination--prev" :disabled="currentPage === 0" @click="firstPage">
            <i class="ic-arrow-first" />
          </button>
          <button type="button" class="pagination--prev" :disabled="currentPage === 0" @click="prevPage">
            <i class="ic-arrow-pre" />
          </button>
          <ul class="pagination__group">
            <li v-if="pageCount === -1">
              <button type="button" class="active">1</button>
            </li>
            <li
              v-for="index in pageCount + 1"
              v-else
              v-show="Math.floor((index - 1) / 5) === Math.floor(currentPage / 5)"
              :key="index"
            >
              <button type="button" :class="{ active: index === currentPage + 1 }" @click="clickPageNum(index)">
                {{ index }}
              </button>
            </li>
          </ul>
          <button type="button" class="pagination--next" :disabled="currentPage >= pageCount" @click="nextPage">
            <i class="ic-arrow-next" />
          </button>
          <button type="button" class="pagination--next" :disabled="currentPage >= pageCount" @click="lastPage">
            <i class="ic-arrow-end" />
          </button>
        </div>
        <slot name="side" />
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'SPagination',
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [''];
      }
    },
    tableOption: {
      type: Object,
      default: () => ({
        currentPage: 0,
        pageSize: 10
      })
    },
    isWatchTableData: {
      type: Boolean,
      required: false,
      default: true
    },
    isResetPage: {
      type: Boolean,
      required: false,
      default: false
    },
    paginationClass: {
      type: String,
      default: ''
    },
    isHidePagination: {
      type: Boolean,
      required: false,
      default: false
    },
    tableWrapClass: {
      type: String,
      default: 'admin-table-wrap'
    }
  },
  computed: {
    currentPage() {
      return typeof this.tableOption.currentPage === 'string'
        ? Number(this.tableOption.currentPage)
        : this.tableOption.currentPage;
    },
    pageSize() {
      return this.tableOption.pageSize;
    },
    pageCount() {
      return Math.floor((this.tableData.length - 1) / this.pageSize);
    },
    currentPageData() {
      let returnData = [];

      if (this.tableData) {
        const start = this.currentPage * this.pageSize;
        const end = start + this.pageSize;

        returnData = this.tableData.slice(start, end);
      }

      return returnData;
    }
  },
  methods: {
    prevPage() {
      let prevPage = this.currentPage - 1;

      if (prevPage < 0) {
        prevPage = 0;
      }

      this.$emit('onPageChange', prevPage);
    },
    nextPage() {
      let nextPage = this.currentPage + 1;

      if (nextPage > this.pageCount) {
        nextPage = this.pageCount;
      }

      this.$emit('onPageChange', nextPage);
    },
    firstPage() {
      this.$emit('onPageChange', 0);
    },
    lastPage() {
      const isHasRemainder = this.tableData.length % this.pageSize !== 0;
      const lastPage = Math.floor(this.tableData.length / this.pageSize) - (isHasRemainder ? 0 : 1);

      this.$emit('onPageChange', lastPage);
    },
    clickPageNum(index) {
      this.$emit('onPageChange', index - 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  position: relative;
  margin-top: 2.55rem;
}

.pagination__wrap {
  display: flex;
  align-items: center;
  justify-content: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  i {
    font-size: 1.6rem !important;
  }
}

.pagination--prev,
.pagination--next {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  width: 1.6rem;
}

.pagination--prev {
  margin-right: 0.8rem;
}

.pagination--next {
  margin-left: 0.8rem;
}

.pagination--prev:disabled,
.pagination--next:disabled {
  color: var(--color-grey-3);
}

.pagination__group {
  display: flex;
  margin: 0 2.7rem;
}

.pagination__group button {
  color: var(--color-black);
  font-size: 1.6rem;
  width: 1rem;
  line-height: 2.4rem;
  text-align: center;
  margin-right: 1.65rem;
}

.pagination__group li:last-child button {
  margin-right: 0;
}

.pagination__group button.active {
  color: var(--color-blue);
  border-bottom: 1px solid var(--color-blue);
}
</style>
