<!-- eslint-disable vue/no-mutating-props -->
<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner" @click="$emit('close')">
        <div class="modal" @click="(e) => e.stopPropagation()">
          <div class="head">
            <button type="button" class="close-btn" @click="$emit('close')">
              <i class="ic-close" />
            </button>
          </div>
          <div class="body tm-1m">
            <div class="contents-info mb-36">
              <div class="representative-img mr-28">
                <SImageUploadRepresentative
                  :image-src="historyItem.thumbnail_urls?.small"
                  type="PROJECT_THUMBNAIL"
                  disabled
                />
              </div>
              <div class="info-table">
                <div class="row">
                  <label>제목<b class="must">*</b></label>
                  <div class="has-feedback">
                    <SInput v-model="historyItem.name" maxlength="100" w-size="xx-large" readonly />
                  </div>
                </div>
                <div class="row">
                  <label>세부 설명</label>
                  <div class="has-feedback">
                    <SInput v-model="historyItem.sub_title" maxlength="100" w-size="xx-large" readonly />
                  </div>
                </div>
                <div class="row">
                  <label>게시물 등록 기간 / 오픈일</label>
                  <div>
                    <SDatepicker
                      v-model="historyItem.start_date"
                      :max="historyItem.end_date"
                      w-size="xx-large"
                      readonly
                    />
                    <span class="ml-8 mr-8">~</span>
                    <SDatepicker
                      v-model="historyItem.end_date"
                      :min="historyItem.start_date"
                      w-size="xx-large"
                      readonly
                    />
                  </div>
                </div>
                <div class="row">
                  <label>오픈일 지정</label>
                  <div>
                    <SDatepicker
                      v-model="historyItem.open_date"
                      :min="historyItem.start_date"
                      w-size="xx-large"
                      readonly
                    />
                  </div>
                </div>
                <div class="row">
                  <label>노출여부</label>
                  <div>
                    <SToggle v-model="historyItem.is_enabled" disabled>
                      {{ historyItem.is_enabled ? '노출' : '미노출' }}
                    </SToggle>
                  </div>
                </div>
              </div>
            </div>

            <div class="edit-area">
              <div>
                <section class="membership-coupon has-title-side-btn">
                  <h3 class="mb-24">멤버십 정보<b class="must">*</b></h3>
                  <div>
                    <div class="grid-table">
                      <!-- HEADER -->
                      <div class="grid-table-header">노출</div>
                      <div class="grid-table-header">멤버십 이름</div>
                      <div class="grid-table-header">가격</div>
                      <div class="grid-table-header">결제버튼 활성화</div>
                      <div class="grid-table-header">세부내용</div>
                      <!-- BODY -->
                      <template v-for="(membership, membershipIndex) in historyItem.memberships">
                        <div
                          v-show="!membership.is_deleted"
                          :key="`${membership.tempId}_checkbox`"
                          class="grid-table-body checkbox-cell"
                        >
                          <SCheckbox v-model="membership.is_enabled" disabled />
                        </div>
                        <div
                          v-show="!membership.is_deleted"
                          :key="`${membership.tempId}_name_edit`"
                          class="grid-table-body membership-name"
                        >
                          <SInput v-model="membership.name" w-size="full" readonly />
                        </div>
                        <div
                          v-show="!membership.is_deleted"
                          :key="`${membership.tempId}_price_edit`"
                          class="grid-table-body"
                        >
                          <SFlexInputGrid>
                            <template #input>
                              <SInput
                                v-model="membership.price"
                                is-comma-num
                                w-size="full"
                                text-align="right"
                                readonly
                              />
                            </template>
                            <template #content>
                              <div class="currency">원</div>
                            </template>
                          </SFlexInputGrid>
                        </div>
                        <div
                          v-show="!membership.is_deleted"
                          :key="`${membership.tempId}_active-register`"
                          class="grid-table-body checkbox-cell"
                        >
                          <SCheckbox v-model="membership.is_register_membership_button_shown" disabled />
                        </div>
                        <div
                          v-show="!membership.is_deleted"
                          :key="`${membership.tempId}_action`"
                          class="grid-table-body membership-action"
                        >
                          <div
                            class="collapse-icon"
                            :class="{
                              expose: membershipIndexExpanded === membershipIndex
                            }"
                            @click="toggleExposeCoupon(membershipIndex)"
                          >
                            <i class="ic-arrow-next"></i>
                          </div>
                        </div>
                        <!-- BENEFIT -->
                        <CouponEditor
                          v-for="coupon in membership.coupons"
                          v-show="membershipIndexExpanded === membershipIndex"
                          :key="`${membership.tempId}_coupon_${coupon.tempId}`"
                          :coupon="coupon"
                          :validate-before-add-new-coupon="true"
                          disabled
                        />
                      </template>
                    </div>
                  </div>
                </section>
                <section class="editor mb-16">
                  <h3 class="mb-16">멤버십 콘텐츠<b class="must">*</b></h3>
                  <SummernoteEditor v-model.trim="historyItem.content_detail" disabled />
                </section>
                <section class="mb-16">
                  <h3 class="mb-16">Note</h3>
                  <SImageUploadRepresentative
                    :image-src="historyItem?.note_image?.note_image_url"
                    type="PROJECT_DETAIL_IMAGE"
                    disabled
                  />
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import SCheckbox from '../../commons/SCheckbox.vue';
import SDatepicker from '../../commons/SDatepicker.vue';
import SFlexInputGrid from '../../commons/SFlexInputGrid.vue';
import SImageUploadRepresentative from '../../commons/SImageUploadRepresentative.vue';
import SInput from '../../commons/SInput.vue';
import SToggle from '../../commons/SToggle.vue';
import CouponEditor from './CouponEditor.vue';
import SummernoteEditor from '~/components/admin/commons/Summernote';

export default {
  name: 'HistoryModal',
  components: {
    SDatepicker,
    SImageUploadRepresentative,
    SInput,
    CouponEditor,
    SToggle,
    SFlexInputGrid,
    SCheckbox,
    SummernoteEditor
  },
  props: {
    isShow: {
      type: Boolean,
      required: true,
      default: false
    },
    historyItem: {
      type: Object,
      required: true,
      default: undefined
    }
  },
  data() {
    return {
      membershipIndexExpanded: null
    };
  },
  methods: {
    toggleExposeCoupon(membershipIndex) {
      if (this.membershipIndexExpanded === membershipIndex) {
        this.membershipIndexExpanded = null;
        return;
      }
      this.membershipIndexExpanded = membershipIndex;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-inner {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(var(--color-white), 0.3);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.modal {
  overflow: auto;
  width: 80%;
  height: 80%;
  background-color: var(--color-white);
  translate: 10% 10%;

  .head {
    position: sticky;
    top: 0;
    right: 0;
    min-height: 5.2rem;
    margin-bottom: 2.2rem;
    padding: 1.4rem 1.6rem;
    background-color: white;
    z-index: 1;

    .close-btn {
      position: absolute;
      top: 50%;
      right: 1.2rem;
      transform: translateY(-50%);
      font-size: 2.4rem;
    }
  }

  .body {
    padding: 0 3.2rem;
    word-break: keep-all;
    margin-bottom: 3.2rem;
  }

  .foot {
    display: flex;
    justify-content: center;
    margin-bottom: 3.6rem;
  }
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
  grid-template-columns: 7rem 1fr 1fr 20rem 15rem;
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
  .benefit-container,
  .delete-membership {
    grid-column: span 5;
  }
  .checkbox-cell {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .grid-table-header {
    color: var(--color-grey-4);
    font-weight: bold;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .membership-name {
    display: flex;
    gap: 12px;
    align-items: center;
    font-weight: 700;
    .price-input {
      flex: 1;
    }
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
  .delete-membership {
    margin-top: -1px;
    button {
      width: 100%;
    }
  }
}

.bottom {
}
</style>
