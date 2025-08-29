<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap" @click.self="close">
      <div class="modal-inner">
        <div class="head">
          인증
          <button type="button" @click="close"><i class="ic-close" /></button>
        </div>
        <div class="body" body-scroll-lock-ignore>
          <p class="subtitle">본인 인증을 진행해주세요.</p>
          <div class="btn-area">
            <UButton w-size="100" @click="check">휴대폰 인증</UButton>
          </div>
        </div>
        <UDialogModal :is-show="$route.query.failed">
          <template #content>만 14세 미만의 어린이는 가입할 수 없어요.</template>
          <template #modal-btn2>
            <UButton
              w-size="100"
              class="feedback-btn"
              @click="$router.replace($store.state.deviceInfo.isApp ? '/app' : '/')"
            >확인</UButton>
          </template>
        </UDialogModal>
      </div>
    </div>
  </transition>
</template>

<script>
import UButton from '~/components/user/common/UButton'
import UDialogModal from '~/components/user/modal/UDialogModal'
import { createFormElement } from '~/assets/js/commons'

export default {
  name: 'UPhoneModal',
  components: { UButton, UDialogModal },
  props: {
    isShow: { type: Boolean, default: false }
  },
  methods: {
    async check() {
      const { protocol, host } = window.location

      const isApp = this.$store.state.deviceInfo.isApp
      const base  = `${protocol}//${host}${isApp ? '/app' : '/'}`
      const returnUrl = `${base}`
      const errorUrl  = `${base}?failed=true`

      try {
        const res = await this.$axios.$get('/nice/encrypt', {
          params: { returnUrl, errorUrl }
        })
        const form = createFormElement(
          'https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb',
          { m: 'checkplusService', recvMethodType: 'get', EncodeData: res }
        )
        document.body.appendChild(form)
        form.submit()
        form.remove()
      } catch {
        alert('에러가 발생했습니다.\n다시 시도해 해주세요.')
        window.location.reload(true)
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}

.modal-inner {
  background: #fff;
  width: 90%;
  max-width: 43.6rem;
  margin: 20rem auto;
  border-radius: 0.3rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.head {
  position: relative;
  padding: 1.6rem 1.6rem 1.2rem;
  font-size: 2rem;
  font-weight: 700;
  border-bottom: 1px solid var(--color-u-grey-1);

  button {
    position: absolute;
    top: 1.6rem;
    right: 1.6rem;
    background: none;
    border: none;
    cursor: pointer;
    i { font-size: 2.4rem; }
  }
}

.body {
  padding: 2rem 1.6rem;
  text-align: center;

  .subtitle {
    margin: 0 0 2.4rem;
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 1.4;
  }

  .btn-area {
    button {
      width: 100%;
      max-width: 26rem;
      margin: 0 auto;
    }
  }
}

/* desktop tweaks */
@media screen and (min-width: 768px) {
  .modal-inner {
    margin: 30rem auto;
    width: 60.4rem;
  }
  .head {
    padding: 2.4rem 3.6rem 2rem;
    font-size: 2.4rem;
  }
  .body {
    padding: 2.4rem 3.6rem;
    .subtitle {
      font-size: 1.8rem;
      margin-bottom: 3.2rem;
    }
    .btn-area {
      button { max-width: 30rem; }
    }
  }
}
</style>
