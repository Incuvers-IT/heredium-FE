<template>
  <section v-if="isDataReady && !!postDetail" class="contents">
    <section class="banner">
      <img :src="postImageDetail" alt="Heredium membership image" />
    </section>
    <h1 class="membership-section-content">{{ postDetail.name }}</h1>
    <section class="content-detail membership-section-content">
      <div v-html="postDetail.content_detail"></div>
    </section>
    <!-- <UEventCardList class="membership-section-content membership-benefits" :event-list="eventList" /> -->
    <div class="membership-section-content membership-form-container">
      <form>
        <div class="membership-form-content">
          <h3>멤버십 종류 선택</h3>
          <div class="warning-box">
            <img src="~assets/img/emoji/emoji_information.svg" alt="note" width="20px" height="20px" />
            <p>최대 1매까지 예매할 수 있습니다</p>
          </div>

          <div class="membership-radio-list membership-radio-list__mobile">
            <MembershipOption
              v-for="membership in postDetail.memberships"
              :key="membership.membership_id"
              :model-value="membershipIdSelected"
              :membership="membership"
              :change="openBottomSheet"
            >
            </MembershipOption>
          </div>
          <div class="membership-radio-list membership-radio-list__desktop">
            <MembershipOption
              v-for="membership in postDetail.memberships"
              :key="membership.membership_id"
              :model-value="membershipIdSelected"
              :membership="membership"
              :change="updateSelection"
            >
            </MembershipOption>
          </div>

          <div class="total-amount">
            <p>합계</p>
            <h5>
              {{ toKoreaCurrency(totalPrice) }}
            </h5>
          </div>

          <div class="agreement-list">
            <UNoticePolicy :model-value="isAgreeNoticePolicy" @update:modelValue="isAgreeNoticePolicy = $event" />
            <URefundPolicy :model-value="isAgreeRefundPolicy" @update:modelValue="isAgreeRefundPolicy = $event" />
          </div>
        </div>

        <UButton
          class="btn-submit"
          w-size="100"
          h-size="normal"
          :disabled="!membershipIdSelected"
          @click="handleSubmit()"
        >
          결제하기
        </UButton>
      </form>
      <UWarningDialog
        v-if="dialogWarning.open"
        :warning-message="dialogWarning.warningMessage"
        :on-close="closeDialog"
      />
      <UExistedMembershipDialog v-if="hasMembership" :on-confirm="goToMyMembership" />
    </div>
    <section v-if="postImageNote" class="note membership-section-content">
      <img :src="postImageNote" alt="Heredium membership note" />
    </section>
    <UBottomSheet :visible.sync="isShowBottomSheet">
      <div class="total-amount">
        <p>합계</p>
        <h5>
          {{ toKoreaCurrency(totalPrice) }}
        </h5>
      </div>

      <div class="agreement-list">
        <UNoticePolicy :model-value="isAgreeNoticePolicy" @update:modelValue="isAgreeNoticePolicy = $event" />
        <URefundPolicy :model-value="isAgreeRefundPolicy" @update:modelValue="isAgreeRefundPolicy = $event" />
      </div>

      <UButton
        class="btn-submit"
        w-size="100"
        h-size="normal"
        :disabled="!membershipIdSelected"
        @click="handleSubmit()"
      >
        결제하기
      </UButton>
    </UBottomSheet>
  </section>
  <section v-else>
    <MembershipRegistrationUnavailable />
  </section>
</template>

<script>
import { concat } from 'lodash';
import { toKoreaCurrency } from '~/assets/js/converter';
import UBottomSheet from '~/components/user/common/UBottomSheet.vue';
import UButton from '~/components/user/common/UButton.vue';
import UNoticePolicy from '~/components/user/common/UNoticePolicy.vue';
import URefundPolicy from '~/components/user/common/URefundPolicy.vue';
import UExistedMembershipDialog from '~/components/user/modal/dialog/UExistedMembershipDialog.vue';
import UWarningDialog from '~/components/user/modal/dialog/UWarningDialog.vue';
import MembershipOption from '~/components/user/page/membership/MembershipOption.vue';
import MembershipRegistrationUnavailable from '~/components/user/page/membership/MembershipRegistrationUnavailable.vue';
import { imageMixin } from '~/mixins/imageMixin';
import { userMixin } from '~/mixins/userMixin';

export default {
  name: 'MembershipRegistrationPage',
  components: {
    MembershipOption,
    URefundPolicy,
    UButton,
    UNoticePolicy,
    UWarningDialog,
    UExistedMembershipDialog,
    UBottomSheet,
    MembershipRegistrationUnavailable
  },
  mixins: [imageMixin, userMixin],
  props: {},
  async asyncData({ $axios }) {
    try {
      const postDetail = await $axios.$get(`/user/posts`);
      return { postDetail, isDataReady: true };
    } catch (error) {
      console.error(error);
      return { postDetail: null, isDataReady: true };
    }
  },
  data() {
    return {
      isDataReady: false,
      postDetail: null,
      membershipIdSelected: null,
      totalPrice: 0,
      isAgreeNoticePolicy: false,
      isAgreeRefundPolicy: false,
      dialogWarning: {
        open: false,
        warningMessage: null
      },
      hasMembership: false,
      isShowBottomSheet: false
    };
  },
  computed: {
    postImageDetail() {
      return this.getImage(this.postDetail?.thumbnail_urls?.large);
    },
    postImageNote() {
      return this.getImage(this.postDetail?.note_image?.note_image_url);
    },
    eventList() {
      let list = [];
      if (!this.postDetail?.additional_info) {
        return list;
      }
      const additionalInfo = this.postDetail.additional_info;
      const eventList = ['exhibitions', 'programs'];
      const statusList = ['future', 'ongoing', 'completed'];
      for (const status of statusList) {
        for (const event of eventList) {
          const concatList = additionalInfo?.[event]?.[status];
          if (concatList?.length) {
            const adaptedList = concatList.map((item) =>
              Object.assign(item, { tag: status === 'completed' ? 'complete' : 'on-going' })
            );
            list = concat(list, adaptedList);
          }
        }
      }
      return list;
    }
  },
  watch: {
    agreement(newValue) {
      console.log(newValue);
    }
  },
  mounted() {
    this.checkUserLogin({
      callbackUrl: this.$route.fullPath
    });
  },
  methods: {
    toKoreaCurrency,
    updateSelection(membershipOption) {
      if (this.membershipIdSelected === membershipOption.membership_id) {
        return;
      }
      this.membershipIdSelected = membershipOption.membership_id;
      this.totalPrice = membershipOption.price || 0;
    },
    closeDialog() {
      this.dialogWarning = {
        open: false,
        warningMessage: ''
      };
    },
    validateBeforeRegister() {
      if (!this.isAgreeNoticePolicy) {
        this.dialogWarning = {
          open: true,
          warningMessage: '관람 유의사항에 동의해주세요.'
        };
        return false;
      }
      if (!this.isAgreeRefundPolicy) {
        this.dialogWarning = {
          open: true,
          warningMessage: '환불 규정에 동의해주세요.'
        };
        return false;
      }
      return true;
    },
    handleSubmit() {
      const isValid = this.validateBeforeRegister();
      if (!isValid) {
        return null;
      }
      if (!this.membershipIdSelected) {
        return null;
      }

      this.$axios
        .post('/user/membership/register', {
          membership_id: this.membershipIdSelected
        })
        .then(() => {
          this.goToMyMembership();
        })
        .catch((err) => {
          const errorMessage = err.response.data?.MESSAGE || '';
          if (errorMessage === 'MEMBERSHIP_REGISTRATION_ALREADY_EXISTS') {
            this.hasMembership = true;
            return null;
          }
        });
    },
    goToMyMembership() {
      this.$router.push('/mypage/purchase/membership');
    },
    openBottomSheet(membershipOption) {
      this.isShowBottomSheet = true;
      this.updateSelection(membershipOption);
    }
  }
};
</script>

<style lang="css" scoped>
.contents {
  margin: 0 0 4rem;
  display: grid;
  row-gap: 48px;
  grid-template-columns: 1fr;
}
h1 {
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 3.2rem;
  border-bottom: 1px solid var(--color-default);
  padding-bottom: 20px;
  color: var(--color-default);
}

h2 {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 2.4rem;
  color: var(--color-default);
}

.gray-divider {
  color: var(--color-u-grey-2);
  height: 1px;
  margin: 24px 0;
}

.banner {
  width: 100dvw;
  display: flex;
  justify-content: center;
}
.banner img {
  object-fit: contain;
  min-height: 50px;
  width: 100%;
}

.membership-section-content {
  margin-left: 20px;
  margin-right: 20px;
}

form {
  margin-top: 48px;
}
.warning-box {
  margin-top: 24px;
  display: flex;
  justify-content: start;
  gap: 0.8rem;
  color: var(--color-u-grey-4);
}
.warning-box p {
  flex: 1;
}

.membership-radio-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-top: 12px;
}

.membership-form-container .total-amount,
.membership-form-container .agreement-list,
.membership-form-container .btn-submit,
.membership-form-container .membership-radio-list__desktop {
  display: none;
}

.note img {
  width: 100%;
  object-fit: contain;
  height: auto;
}

.total-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.total-amount p {
  font-size: 1.8rem;
  line-height: 2.8rem;
}
.total-amount h5 {
  font-size: 1.8rem;
  line-height: 2.8rem;
  color: var(--color-u-primary);
  font-weight: bold;
}

.agreement-list {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  .agreement-item {
    display: flex;
    align-items: start;
    gap: 0.8rem;
  }
}

.btn-submit {
  display: block;
  margin-top: 24px;
  width: 100%;
}

@media screen and (min-width: 769px) {
  .contents {
    margin: 0 0 8.8rem;
    padding: 0px 38px 12px 38px;
    column-gap: 20px;
    /* grid-template-columns: auto minmax(0, clamp(50%, 0%, 600px)); */
    grid-template-columns: auto 350px;
    grid-template-areas:
      'i2 i2'
      'i1 i4'
      'i3 i3'
      'i5 i5';
  }
  .contents > .banner {
    grid-area: i1;
  }
  .contents > h1 {
    grid-area: i2;
  }
  .contents > .content-detail {
    grid-area: i3;
  }
  .contents > .membership-form-container {
    grid-area: i4;
  }
  .contents > .note {
    grid-area: i5;
  }
  .contents h1 {
    font-weight: 700;
    font-size: 4.2rem;
    line-height: 150%;
  }

  .contents h2 {
    font-style: normal;
    font-weight: 500;
    font-size: 2.4rem;
    line-height: 150%;
    letter-spacing: -1px;
  }

  .contents .banner {
    width: 100%;
    flex: 1;
    justify-content: start;
    align-items: start;
    img {
      width: 100%;
      max-width: 720px;
    }
  }
  .contents .membership-form-container {
    padding: 0;
    margin: 0;
    form {
      margin-top: 0;
    }
  }
  .contents .total-amount,
  .contents .agreement-list {
    display: flex;
  }
  .contents .btn-submit {
    display: block;
  }

  .membership-radio-list__desktop {
    display: flex;
  }
  .membership-radio-list__mobile {
    display: none;
  }
}
</style>
