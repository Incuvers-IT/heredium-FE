<template>
  <div v-if="detailData && mode">
    <div class="top">
      <STitle class="mb-16 mr-16" emoji="pencil">멤버십 {{ mode === 'create' ? '등록' : '수정' }}</STitle>
    </div>
    <div class="contents-info mb-36">
      <div class="representative-img mr-28">
        <SImageUploadRepresentative
          :class="{ 'is-error': feedback?.thumbnailUrl }"
          :image-src="detailData.thumbnail_urls?.small"
          type="PROJECT_THUMBNAIL"
          @image-uploaded="updateThumbnail"
          @image-removed="removeThumbnail"
        />
      </div>
      <div class="info-table">
        <div class="row">
          <label>제목<b class="must">*</b></label>
          <div class="has-feedback">
            <SInput
              v-model="detailData.name"
              maxlength="100"
              w-size="xx-large"
              :class="{ 'is-error': feedback?.name }"
            />
          </div>
        </div>
        <!-- <div class="row">
          <label>내용(선택) </label>
          <div>
            <div>
              <EventTypeSelection
                v-for="(event, index) in detailData.events"
                :key="index"
                :event="event"
                @update-event="(e) => handleUpdateEvent(e, index)"
                @delete-event="handleDeleteEvent(index)"
              />
            </div>
            <SButton button-type="primary" w-size="medium" @click="handleAddEvent"> Add </SButton>
          </div>
        </div> -->
        <div class="row">
          <label>게시물 등록 기간 / 오픈일</label>
          <div>
            <SDatepicker
              v-model="detailData.start_date"
              :class="{ 'is-error': feedback?.start_date }"
              :max="detailData.end_date"
              w-size="xx-large"
            />
            <span class="ml-8 mr-8">~</span>
            <SDatepicker
              v-model="detailData.end_date"
              :class="{ 'is-error': feedback?.end_date }"
              :min="detailData.start_date"
              w-size="xx-large"
            />
          </div>
        </div>
        <div class="row">
          <label>노출여부</label>
          <div>
            <SToggle v-model="detailData.is_enabled">{{ detailData.is_enabled ? '노출' : '미노출' }}</SToggle>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-area">
      <div>
        <section class="membership-coupon has-title-side-btn">
          <h3 class="mb-24">입장권 정보<b class="must">*</b></h3>
          <div>
            <div class="grid-table" :class="{ 'is-error': feedback?.emptyMemberships }">
              <AddMembershipOption @add-membership-option="handlePushMembershipOption" />
              <!-- HEADER -->
              <div class="grid-table-header">노출</div>
              <div class="grid-table-header">멤버십 이름</div>
              <div class="grid-table-header">가격</div>
              <div class="grid-table-header">행동</div>
              <!-- BODY -->
              <template v-for="(membership, membershipIndex) in detailData.memberships">
                <div :key="`membership_${membershipIndex}_checkbox`" class="grid-table-body">
                  <SCheckbox v-model="membership.checked" />
                </div>
                <div
                  v-if="isEdit"
                  :key="`membership_${membershipIndex}_name_edit`"
                  class="grid-table-body membership-name"
                >
                  <SInput v-model="membership.name" w-size="large" :class="{ 'is-error': !membership.name }" />
                </div>
                <div v-else :key="`membership_${membershipIndex}_name`" class="grid-table-body membership-name">
                  {{ membership.name }}
                </div>
                <div
                  v-if="isEdit"
                  :key="`membership_${membershipIndex}_price_edit`"
                  class="grid-table-body membership-price"
                >
                  <SInput
                    v-model="membership.price"
                    is-comma-num
                    w-size="large"
                    text-align="right"
                    :class="{ 'is-error': !membership.price }"
                  />
                  원
                </div>
                <div v-else :key="`membership_${membershipIndex}_price`" class="grid-table-body membership-price">
                  {{ toKoreaCurrency(membership.price) }}
                </div>
                <div :key="`membership_${membershipIndex}_action`" class="grid-table-body membership-action">
                  <!-- <i class="ic-trash" @click="handleDeleteMembershipOption(membershipIndex)"></i> -->
                  <div
                    class="collapse-icon"
                    :class="{ expose: membershipIndexExpanded === membershipIndex }"
                    @click="toggleExposeCoupon(membershipIndex)"
                  >
                    <i class="ic-arrow-next"></i>
                  </div>
                </div>
                <!-- BENEFIT -->
                <CouponEditor
                  v-for="(coupon, couponIndex) in membership.coupons"
                  v-show="membershipIndexExpanded === membershipIndex"
                  :key="`membership_${membershipIndex}_coupon_${couponIndex}`"
                  :coupon="coupon"
                  :show-add-button="couponIndex === membership.coupons.length - 1"
                  :error="feedback?.memberships?.[membershipIndex]?.coupons?.[couponIndex]"
                  @add-coupon="handleAddCoupon(membershipIndex)"
                  @update-coupon="(e) => handleUpdateCoupon(e, membershipIndex, couponIndex)"
                />
              </template>
            </div>
          </div>
        </section>
        <section class="editor mb-16">
          <h3 class="mb-16">전시 콘텐츠<b class="must">*</b></h3>
          <div class="editor-wrap" :class="{ 'is-error': feedback?.contentDetail }">
            <SummernoteEditor v-model.trim="detailData.content_detail" />
          </div>
        </section>
        <section class="mb-16">
          <h3 class="mb-16">Note</h3>
          <SImageUploadRepresentative
            :image-src="detailData.note_image.note_image_url"
            type="PROJECT_DETAIL_IMAGE"
            @image-uploaded="updateNoteImage"
            @image-removed="removeNoteImage"
          />
        </section>
      </div>
      <div class="bottom">
        <SButton @click="modal.isCancel = true">취소</SButton>
        <div class="right">
          <SButton class="mr-8" @click="modal.isReset = true">초기화</SButton>
          <SButton button-type="primary" :disabled="isConfirmPending" @click="checkEdit">저장</SButton>
        </div>
      </div>
    </div>
    <SDialogModal :is-show="modal.isFileError" @close="modal.isFileError = false">
      <template #content>5MB이하의 JPG, GIF, PNG 파일을 업로드해주세요.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="modal.isFileError = false">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isCancel" @close="modal.isCancel = false">
      <template #content>콘텐츠를 저장하지 않고<br />이전페이지로 이동 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isCancel = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="$router.back()">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isReset" @close="modal.isReset = false">
      <template #content>콘텐츠를 저장하지 않고<br />페이지를 새로 고침 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isReset = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="reloadPage">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isConfirmSave" @close="modal.isConfirmSave = false">
      <template #content>변경 사항을 저장하시겠습니까?</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="handleSubmitForm()">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isSave" @close="modal.isSave = false">
      <template #content>콘텐츠가 저장되었습니다.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="$router.go(0)">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import SDatepicker from '../../commons/SDatepicker.vue';
import STitle from '~/components/admin/commons/STitle';
import SButton from '~/components/admin/commons/SButton';
import SInput from '~/components/admin/commons/SInput';
import SToggle from '~/components/admin/commons/SToggle';
import SummernoteEditor from '~/components/admin/commons/Summernote';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import { COUPON_DEFAULT, EVENT_DEFAULT, MEMBERSHIP_DEFAULT, POST_DETAIL } from '~/assets/js/types';
import SCheckbox from '~/components/admin/commons/SCheckbox.vue';
import SImageUploadRepresentative from '~/components/admin/commons/SImageUploadRepresentative.vue';
import { imageMixin } from '~/mixins/imageMixin';
import AddMembershipOption from '~/components/admin/page/membership/AddMembershipOption.vue';
import CouponEditor from '~/components/admin/page/membership/CouponEditor.vue';
import { toKoreaCurrency } from '~/assets/js/converter';
import { API_ERROR } from '~/utils/message';

export default {
  name: 'PostForm',
  components: {
    SDialogModal,
    SummernoteEditor,
    SToggle,
    SInput,
    SButton,
    STitle,
    SCheckbox,
    SImageUploadRepresentative,
    AddMembershipOption,
    CouponEditor,
    SDatepicker
  },
  mixins: [imageMixin],
  props: {
    postDetail: {
      type: Object,
      required: true,
      default: undefined
    },
    mode: {
      type: String,
      required: true,
      default: undefined
    }
  },
  data() {
    return {
      id: null,
      detailData: null,
      detailImageFileName: null,
      membershipEditor: {
        membershipName: '',
        price: ''
      },
      membershipIndexExpanded: null,
      modal: {
        isConfirmSave: false,
        isSave: false,
        isCancel: false,
        isReset: false,
        isFileError: false
      },
      feedback: {},
      isConfirmPending: false,
      isEdit: true
    };
  },
  created() {
    this.detailData = this.postDetail;
    this.isEdit = this.mode === 'edit';
    if (this.isEdit) {
      const events = Object.entries(this.detailData.additional_info)
        .filter(([_, quantity]) => quantity !== null)
        .map(([eventType, quantity]) => ({
          eventType,
          quantity
        }));
      this.detailData = { ...this.postDetail, events };
    }
  },
  methods: {
    reloadPage() {
      window.location.replace(window.location.href);
    },
    toKoreaCurrency,
    reload() {
      this.$router.replace({ path: this.$route.path, query: this.$route.query });
    },
    updateThumbnail(e) {
      this.detailData.thumbnail_urls = e.resizeImage;
    },
    removeThumbnail() {
      this.detailData.thumbnail_urls = { ...POST_DETAIL.thumbnail_url };
    },

    updateNoteImage(e) {
      this.detailData.note_image.note_image_url = e.savedFileName;
      this.detailData.note_image.original_file_name = e.originalFileName;
    },

    removeNoteImage() {
      this.detailData.note_image.note_image_url = '';
      this.detailData.note_image.original_file_name = '';
    },

    handlePushMembershipOption(e) {
      const newMembership = cloneDeep(MEMBERSHIP_DEFAULT);
      newMembership.name = e.name;
      newMembership.price = e.price;
      newMembership.image_url = e.image_url;
      if (Array.isArray(this.detailData?.memberships)) {
        this.detailData.memberships.push(newMembership);
      }
      const indexNewMembership = this.detailData.memberships.length - 1;
      this.membershipIndexExpanded = indexNewMembership;
    },

    toggleExposeCoupon(membershipIndex) {
      if (this.membershipIndexExpanded === membershipIndex) {
        this.membershipIndexExpanded = null;
        return;
      }
      this.membershipIndexExpanded = membershipIndex;
    },

    handleAddEvent() {
      this.detailData.events.push(cloneDeep(EVENT_DEFAULT));
    },

    handleDeleteEvent(index) {
      this.detailData.events.splice(index, 1);
    },

    handleUpdateEvent(newEventData, eventIndex) {
      this.detailData.events[eventIndex] = cloneDeep(newEventData);
    },

    handleAddCoupon(membershipIndex) {
      this.detailData.memberships[membershipIndex].coupons.push(cloneDeep(COUPON_DEFAULT));
    },

    handleUpdateCoupon(newCouponData, membershipIndex, couponIndex) {
      this.detailData.memberships[membershipIndex].coupons[couponIndex] = cloneDeep(newCouponData);
    },

    validateCouponItem(couponItem) {
      const feedback = {};
      if (!couponItem.name) {
        feedback.name = true;
      }
      if (!couponItem.coupon_type) {
        feedback.couponType = true;
      }
      if (!couponItem.discount_percent || isNaN(Number(couponItem.discount_percent))) {
        feedback.discountPercent = true;
      } else if (Number(couponItem.discount_percent) > 100) {
        feedback.discountPercent = true;
      }
      if (!couponItem.period_in_days || isNaN(Number(couponItem.period_in_days))) {
        feedback.periodInDays = true;
      }
      if (!couponItem.image_url) {
        feedback.imageUrl = true;
      }
      if (!couponItem.is_permanent) {
        if (!couponItem.number_of_uses || isNaN(Number(couponItem.number_of_uses))) {
          feedback.numberOfUses = true;
        }
      }
      if (isEmpty(feedback)) {
        return null;
      }
      return feedback;
    },

    validateMembershipItem(membershipItem) {
      let feedback = { coupons: [] };
      const coupons = membershipItem.coupons || [];

      if (!membershipItem.name) {
        feedback.name = true;
      }
      if (!membershipItem.price) {
        feedback.price = true;
      }
      // validate coupon in membership
      if (!coupons.length) {
        feedback = { emptyCoupons: true };
        return feedback;
      }
      for (let couponIndex = 0; couponIndex < coupons.length; couponIndex++) {
        const couponItem = coupons[couponIndex];
        const couponFeedback = this.validateCouponItem(couponItem);
        feedback.coupons[couponIndex] = couponFeedback;
      }

      // check is valid membership
      const onlyHasCouponsFeedback = isEqual(Object.keys(feedback), ['coupons']);
      const emptyErrorCoupon = feedback.coupons.every((couponFeedback) => !couponFeedback);
      if (onlyHasCouponsFeedback && emptyErrorCoupon) {
        return null;
      }
      console.log(feedback);
      return feedback;
    },
    isValidate() {
      const feedbackError = {};
      if (!this.detailData.name) {
        feedbackError.name = true;
      }
      const thumbnail = this.detailData.thumbnail_urls;
      if (!thumbnail || !thumbnail.large || !thumbnail.medium || !thumbnail.small) {
        feedbackError.thumbnailUrl = true;
      }
      const startDate = this.detailData.start_date;
      if (!startDate || !this.$dayjs(startDate, 'YYYY-MM-DD', true).isValid()) {
        feedbackError.start_date = true;
      }
      const endDate = this.detailData.end_date;
      if (!endDate || !this.$dayjs(endDate, 'YYYY-MM-DD', true).isValid()) {
        feedbackError.end_date = true;
      }
      // const detailImage = this.detailData.note_image;
      // if (!detailImage || !detailImage.note_image_url || !detailImage.original_file_name) {
      //   feedbackError.detailImage = true;
      // }
      if (!this.detailData.content_detail) {
        feedbackError.contentDetail = true;
      }

      const memberships = this.detailData?.memberships || [];
      if (!memberships.length) {
        feedbackError.emptyMemberships = true;
      }

      feedbackError.memberships = [];
      for (let membershipIndex = 0; membershipIndex < memberships.length; membershipIndex++) {
        const membershipItem = memberships[membershipIndex];
        const membershipFeedback = this.validateMembershipItem(membershipItem);
        feedbackError.memberships[membershipIndex] = membershipFeedback;
      }
      if (feedbackError.memberships.every((item) => !item)) {
        delete feedbackError.memberships;
      } else {
        // expose coupon if error
        const firstIndexMembershipCouponError = feedbackError.memberships?.findIndex((item) => !!item?.coupons);
        let currentIndexMembershipCouponError = false;
        if (typeof this.membershipIndexExpanded === 'number') {
          currentIndexMembershipCouponError = !!feedbackError.memberships?.[this.membershipIndexExpanded]?.coupons;
        }
        if (firstIndexMembershipCouponError !== -1 && !currentIndexMembershipCouponError) {
          this.membershipIndexExpanded = firstIndexMembershipCouponError;
        }
      }

      return feedbackError;
    },
    checkEdit() {
      // if (this.isEdit) {
      //   this.modal.isConfirmSave = true;
      //   return null;
      // }
      const feedback = this.isValidate();
      if (isEmpty(feedback)) {
        this.modal.isConfirmSave = true;
      } else {
        this.feedback = feedback;
      }
    },
    handleSubmitForm() {
      // if (this.mode === 'create') {
      this.handleRegistrationPost();
      // this.reloadPage();
      // }
      // if (this.mode === 'edit') {
      //   this.handleUpdateEnabledPost();
      // }
    },
    async handleRegistrationPost() {
      this.detailData = { ...this.detailData, additional_info: {}, events: null };
      try {
        if (this.mode === 'create') {
          await this.$axios.post('/admin/posts', this.detailData);
        } else {
          await this.$axios.put('/admin/posts', this.detailData);
        }
        this.modal = Object.assign(this.modal, { isConfirmSave: false, isSave: true });
        // this.reloadPage();
        console.log('ok');
      } catch (error) {
        console.log(API_ERROR);
        alert(API_ERROR);
        this.modal.isConfirmSave = false;
      }
    },
    // async handleUpdateEnabledPost() {
    //   try {
    //     if (typeof this.detailData.id !== 'number') {
    //       return;
    //     }
    //     await this.$axios.put(`/admin/posts/${this.detailData.id}/update-is-enabled`, {
    //       is_enabled: this.detailData.is_enabled
    //     });
    //     this.modal = Object.assign(this.modal, { isConfirmSave: false, isSave: true });
    //   } catch (error) {
    //     alert(API_ERROR);
    //   }
    // }
    handleDeleteMembershipOption(index) {
      if (typeof this.membershipIndexExpanded === 'number') {
        if (this.membershipIndexExpanded === index) {
          this.membershipIndexExpanded = null;
        }
        if (this.membershipIndexExpanded > index) {
          this.membershipIndexExpanded = this.membershipIndexExpanded - 1;
        }
      }
      this.detailData.memberships.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  align-items: center;
}

.must {
  color: var(--color-blue);
}

.representative-img {
  position: relative;
  flex: 1 1 56rem;

  .upload-img {
    position: relative;
    display: block;
    width: 100%;
    height: 0;
    padding-bottom: 63.92857142857143%;
    background-color: rgba(221, 221, 221, 0.5);
    border-radius: 0.3rem;
    cursor: pointer;

    img {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
      object-fit: cover;
      object-position: center;
      background-color: #d9d9d9;
    }

    .file-info {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      i {
        font-size: 6.8rem;
      }
    }
  }

  button {
    position: absolute;
    right: 0.8rem;
    top: 0.8rem;
  }
}

.contents-info {
  display: flex;
  align-items: flex-start;

  .info-table {
    flex: 1 1 calc(100% - 58.8rem);
  }
}

.has-title-side-btn {
  h3 {
    position: relative;
  }
}

.grid-table {
  display: grid;
  grid-template-columns: 7rem 1fr 1fr 15rem;
  box-shadow: 0 0 0 1px var(--color-grey-2);
  overflow: hidden;
  margin-bottom: 2.75rem;
  border-collapse: collapse;
  border-radius: 0.3rem;
  width: 100%;
  gap: 1px;
  background-color: var(--color-grey-2);
  & > div {
    background-color: var(--color-white);
    min-height: 4.5rem;
  }
  .create-membership,
  .benefit-container {
    grid-column: span 4;
  }
  .grid-table-header {
    color: var(--color-grey-4);
    font-weight: bold;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .membership-name,
  .membership-price {
    font-weight: 700;
  }
  .membership-action {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
    i {
      cursor: pointer;
    }
  }
  .grid-table-body {
    padding: 16px 20px;
    & > .collapse-icon {
      transform: rotate(90deg);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    & > .collapse-icon.expose {
      transform: rotate(-90deg);
    }
    & > .collapse-icon > i {
      cursor: pointer;
    }
  }
}

.editor {
  .editor-wrap {
    background-color: var(--color-white);
  }
}

.bottom {
  display: flex;
  justify-content: space-between;
  padding-top: 2.4rem;
  border-top: 1px solid var(--color-grey-2);

  .right {
    display: flex;
  }
}

.feedback-text {
  margin-top: 0.8rem;
  color: var(--color-red);
  font-size: 1.4rem;
  text-align: left;
}
</style>
