<template>
  <div>
    <div v-if="visible" class="bottom-sheet-overlay" @click="closeSheet"></div>
    <transition name="slide-up">
      <div v-if="visible" class="bottom-sheet">
        <div class="bottom-sheet-content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'UBottomSheet',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeSheet() {
      this.$emit('onclose', false);
    }
  }
};
</script>

<style scoped>
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.bottom-sheet-content {
  background: white;
  padding: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
}

/* Transition effect */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}

@media screen and (min-width: 769px) {
  .bottom-sheet {
    position: fixed;
    bottom: unset;
    right: unset;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 500px;
    max-height: 80vh;
    overflow-y: auto;
  }
  .bottom-sheet-content {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  /* Transition effect */
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: none;
  }
}
</style>
