<template>
  <main class="container">
    <div class="m progress-bar">
      <div class="fill"></div>
    </div>
    <div class="register-wrap">
      <div class="logo-area">
        <img
          src="~assets/img/pc/logo.svg"
          alt="HEREDIUM 로고"
          class="logo"
          width="92"
          height="45"
          style="margin-bottom: 2.2rem; margin-top: 3.0rem;"
        />
        <div><h2 style="margin-bottom: 1.2rem;">회원가입하고<br/><br/>더 깊은 예술을 경험해보세요!</h2></div>
      </div>
      <div class="pc progress-bar">
        <div class="fill"></div>
      </div>
      <p>가입을 위해 약관에 동의해 주세요.</p>
      <div class="terms-area">
        <div class="all-terms">
          <UCheckbox v-model="isAllChecked" @input="setCheckedAll"><strong>약관 전체 동의</strong></UCheckbox>
        </div>
        <div class="each-terms">
          <UCheckbox v-model="isTerms.AGE"><strong>[필수]</strong> 만 14세 이상이에요.</UCheckbox>
          <UCheckbox v-model="isTerms.SERVICE">
            <strong>[필수]</strong> <button @click="showTerm('SERVICE')">서비스 이용약관</button> 동의</UCheckbox
          >
          <UCheckbox v-model="isTerms.AGREE">
            <strong>[필수]</strong>
            <button @click="showTerm('AGREE')">개인정보 수집 및 이용동의서</button> 동의</UCheckbox
          >
          <!-- <UCheckbox v-model="isTerms.MARKETING">
            <strong>[선택]</strong>
            <button @click="showTerm('MARKETING')">마케팅 활용 동의 및 광고 수집</button> 동의
          </UCheckbox> -->
        </div>
      </div>
      <UButton w-size="100" :disabled="submitting" @click="onNextRegister">다음</UButton>
    </div>
    <URegisterModal
      :is-show="modal.isTerms"
      :term-target="termTarget"
      :terms-data="termsData"
      @close="modal.isTerms = false"
      @agree="termAgree"
    />
    <UDialogModal :is-show="modal.isError">
      <template #content>필수 약관에 동의해주세요.</template>
      <template #modal-btn2>
        <UButton w-size="100" class="feedback-btn" @click="modal.isError = false">확인</UButton>
      </template>
    </UDialogModal>
  </main>
</template>

<script>
// import UDatepicker from '~/components/user/common/UDatepicker';
import UCheckbox from '~/components/user/common/UCheckbox';
import UButton from '~/components/user/common/UButton';
import URegisterModal from '~/components/user/modal/URegisterModal';
import UDialogModal from '~/components/user/modal/UDialogModal';
import { createFormElement } from '~/assets/js/commons';

export default {
  name: 'Register1Page',
  // UDatepicker
  components: { URegisterModal, UCheckbox, UButton, UDialogModal},
  data() {
    return {
      termTarget: '',
      termsData: null,
      isAllChecked: false,
      isTerms: {
        AGE: false,
        SERVICE: false,
        AGREE: false,
        // MARKETING: false
      },
      modal: {
        isTerms: false,
        isError: false
      },
      submitting: false,
    };
  },
  watch: {
    // 마케팅 동의 저장
    isTerms: {
      deep: true,
      handler(v) {
        this.isAllChecked = !Object.values(v).some(x => !x);
        // localStorage.setItem('isMarketing', JSON.stringify(v.MARKETING));
      }
    },
  },
  methods: {
    async showTerm(target) {
      this.termTarget = target;
      this.termsData = await this.$axios.$get('/user/policies/posting', {
        params: {
          type: this.termTarget
        }
      });
      this.modal.isTerms = true;
    },
    termAgree() {
      this.isTerms[this.termTarget] = true;
      this.modal.isTerms = false;
    },
    setCheckedAll(newValue) {
      for (const key in this.isTerms) {
        this.isTerms[key] = newValue;
      }
    },
    async onNextRegister() {
      if (this.isTerms.AGE && this.isTerms.SERVICE && this.isTerms.AGREE) {
        // this.$router.push({ path: '/auth/register/register2', query: { auto: 1 } });
        await this.phoneAuth();
      } else {
        this.modal.isError = true;
      }
    },
    async phoneAuth() {                                   // ✅ register2.check() 그대로 이식
      if (this.submitting) return;
      this.submitting = true;

      const { protocol, host } = window.location;
      const returnUrl = `${protocol}//${host}/auth/register/register3`;
      const errorUrl  = `${protocol}//${host}/auth/register/register1`;

      try {
        const res = await this.$axios.$get('/nice/encrypt', { params: { returnUrl, errorUrl } });
        const form = createFormElement(
          'https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb',
          { m: 'checkplusService', recvMethodType: 'get', EncodeData: res }
        );
        document.body.appendChild(form);
        form.submit();
        setTimeout(() => form.remove(), 0); // iOS 등에서 안전하게 제거
      } catch (err) {
        console.error(err);
        alert('에러가 발생했습니다.\n다시 시도해 해주세요.');
        window.location.reload(true);
      } finally {
        this.submitting = false;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

h2 {
  margin: 3.0rem 0 2rem;
  font-size: 2.7rem;
  font-weight: 700;
  text-align: center;
}

p {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.8rem;
}

.pc {
  display: none;
}

.progress-bar {
  position: fixed;
  top: 6rem;
  left: 0;
  right: 0;
  width: 100%;
  height: 0.2rem;
  background: var(--color-grey-1);

  .fill {
    width: 33.3%;
    height: 100%;
    background: var(--color-black);
  }
}

.terms-area {
  .all-terms {
    margin: 4rem 0 2.2rem;
  }

  strong {
    margin-right: 0.5rem;
    font-size: 1.7rem;
    font-weight: 700;
    line-height: 100%;
    transform: translateY(0.2rem);
  }

  .each-terms {
    display: flex;
    flex-direction: column;
    padding: 2.4rem 0;
    margin-bottom: 2rem;
    border-top: 1px solid var(--color-grey-1);
    border-bottom: 1px solid var(--color-grey-1);

    label + label {
      margin-top: 2rem;
    }

    strong {
      font-size: 1.4rem;
    }

    p {
      margin-top: 0.8rem;
      font-size: 1.3rem;     /* 안내문은 좀 더 작게 1.4rem */
      margin-left: 3rem;
    }
  }

  button {
    margin-right: 0.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-u-primary);
  }
}

@media screen and (min-width: 768px) {
  .m {
    display: none;
  }

  .pc {
    display: block;
  }

  .register-wrap {
    max-width: 43.6rem;
    margin: 0 auto;
  }

  h1 {
    margin: 12.6rem 0 4rem;
    font-size: 4.2rem;
    line-height: 6.3rem;
  }

  p {
    margin-top: 2.4rem;
    font-size: 1.7rem;
    line-height: 3rem;
    text-align: center;
  }

  .progress-bar {
    position: static;
    top: unset;
    left: unset;
    right: unset;
    width: 100%;
    height: 0.4rem;
    background: var(--color-grey-1);

    .fill {
      width: 33.3%;
      height: 100%;
      background: var(--color-black);
    }
  }

  .terms-area {
    .all-terms {
      margin: 4.8rem 0 2.4rem;
    }
    .each-terms {
      display: flex;
      flex-direction: column;
      padding: 2rem 0 0;
      border-top: 0.1rem solid var(--color-grey-1);
      border-bottom: unset;

      label + label {
        margin-top: 1.3rem;
      }
    }

    strong {
      line-height: 160%;
      transform: unset;
    }
  }

  .container {
    padding-top: 3.2rem;
    margin-bottom: 12rem;

    .input {
      label {
        font-size: 1.6rem;
        line-height: 160%;
        letter-spacing: 0.25px;

        &.bold {
          font-weight: 700;
        }
      }

      &.mb-13 {
        margin-bottom: 1.3rem;
      }
    }

    textarea {
      height: 18.8rem;
      padding: 1.3rem 1.6rem 0;
      font-size: 1.8rem;
      line-height: 160%;

      &::placeholder {
        font-size: 1.8rem;
        line-height: 160%;
        font-weight: 500;
      }
    }

    .btn-area {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 1.6rem;
      margin-top: 4rem;

      button {
        width: 15.2rem !important;

        &:first-child {
          justify-self: flex-end;
        }
      }
    }
  }
}

// .marketing_area {
//   margin-bottom: 5.2rem;
// }

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;

  p {
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--color-grey-6);
    margin: 0 0 2.4rem;

    @media (min-width: 768px) {
      font-size: 1.8rem;
      margin-bottom: 3rem;
      text-align: left;
      width: 100%;
    }
  }
}
</style>
