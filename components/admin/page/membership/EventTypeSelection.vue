<template>
  <div class="field-group">
    <SDropdown v-model="eventData.eventType" :option-list="dateOptionEvent" w-size="x-large" />
    <SInput v-model="eventData.quantity" is-comma-num w-size="small" text-align="right" />
    <img src="~/assets/img/icon/icon_trash.svg" @click="$emit('delete-event')" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import SDropdown from '../../commons/SDropdown.vue';
import SInput from '../../commons/SInput.vue';
import { EVENT_DEFAULT } from '~/assets/js/types';

export default {
  name: 'EventTypeSelection',
  components: { SDropdown, SInput },
  props: {
    event: {
      type: Object,
      required: false,
      default: null
    },
    error: {
      type: Object,
      required: false,
      default: undefined
    }
  },
  data() {
    return {
      eventData: {},
      dateOptionEvent: [
        { value: 'future_exhibition_count', label: '다가오는 전시회' },
        { value: 'ongoing_exhibition_count', label: '진행 중인 전시회' },
        { value: 'completed_exhibition_count', label: '완료된 전시회' },
        { value: 'future_program_count', label: '다가오는 프로그램' },
        { value: 'ongoing_program_count', label: '진행 중인 프로그램' },
        { value: 'completed_program_count', label: '완료된 프로그램' }
      ]
    };
  },

  watch: {
    eventData: {
      handler(newVal) {
        this.$emit('update-event', newVal);
      },
      deep: true
    }
  },
  created() {
    this.eventData = cloneDeep(this.event || EVENT_DEFAULT);
  }
};
</script>

<style scoped lang="scss">
.field-group {
  align-items: center;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 2.6rem;
  margin-right: 2.6rem;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  img {
    cursor: pointer;
  }

  .must {
    color: var(--color-blue);
  }
}
</style>
