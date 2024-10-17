<template>
  <div>
    <div class="pc-duplicate-grid">
      <div class="left">
        <img :src="getImage(detailData.thumbnail?.savedFileName)" class="title-img" alt="" />
        <div>
          <div class="container">
            <section class="title">
              <h1>{{ detailData.title }}</h1>
              <p>{{ getFormattedDate(detailData.startDate, detailData.endDate) }}</p>
            </section>
            <section class="info only-mobile">
              <div v-if="!isHideInfo" class="info-wrap">
                <h2>운영시간</h2>
                <div class="hour">
                  <BrConvertText :text="detailData.hour" />
                </div>
                <ul class="bullet">
                  <li>비정기 휴관일은 사전에 웹 또는 앱을 통해 공지됩니다.</li>
                </ul>
              </div>
              <div v-if="!isHideInfo" class="info-wrap">
                <h2>이용안내</h2>
                <ul v-if="type === 'COFFEE'" class="bullet">
                  <li>수령 시간을 반드시 지켜주시기 바랍니다.</li>
                  <li>커피 주문 내역은 헤레디움 웹 또는 앱 [마이페이지]에서 확인할 수 있습니다.</li>
                  <li>헤레디움 앱에 있는 QR코드로 커피를 수령할 수 있습니다.</li>
                </ul>
                <ul v-else class="bullet">
                  <li>관람 시간을 반드시 지켜주시기 바랍니다.</li>
                  <li>예매한 관람권은 헤레디움 웹 또는 앱의 [마이페이지]에서 확인 가능합니다.</li>
                  <li>헤레디움 QR관람권을 통해 입장 가능합니다.</li>
                  <li>당일 예매는 각 회차별 종료 30분 전까지 가능합니다.</li>
                </ul>
              </div>
              <button
                v-if="isHideInfo"
                class="hide-button only-mobile"
                type="button"
                :style="{ marginTop: isHideInfo ? '4rem' : '0' }"
                @click="isHideInfo = !isHideInfo"
              >
                상세 정보
                <i v-if="!isHideInfo" class="m umic-arrow_top" />
                <i v-else class="m umic-arrow_bottom" />
              </button>
            </section>
            <section class="info only-pc">
              <div class="info-wrap">
                <h2>운영시간</h2>
                <div class="hour">
                  <BrConvertText :text="detailData.hour" />
                </div>
                <ul class="bullet">
                  <li>매주 월·화요일은 정기 휴관일입니다.</li>
                  <li>비정기 휴관일은 사전에 공지 예정입니다.</li>
                </ul>
              </div>
              <div class="info-wrap">
                <h2>이용안내</h2>
                <ul v-if="type === 'COFFEE'" class="bullet">
                  <li>수령 시간을 반드시 지켜주시기 바랍니다.</li>
                  <li>커피 주문 내역은 헤레디움 웹 또는 앱 [마이페이지]에서 확인할 수 있습니다.</li>
                  <li>헤레디움 앱에 있는 QR코드로 커피를 수령할 수 있습니다.</li>
                </ul>
                <ul v-else class="bullet">
                  <li>관람 시간을 반드시 지켜주시기 바랍니다.</li>
                  <li>예매한 관람권을 헤레디움 웹이나 앱의 마이페이지에서 확인 가능합니다.</li>
                  <li>헤레디움 앱에 있는 QR 관람권으로 관람 가능합니다.</li>
                  <li>당일 예매는 각 회차별 종료 30분 전까지 가능합니다.</li>
                </ul>
              </div>
            </section>
          </div>
          <section v-if="type !== 'COFFEE'" class="group-res">
            <p>15명 이상이 관람 예정이라면 단체 입장권으로 예매 바랍니다.</p>
            <button class="group-res-btn" type="button" @click="goGroupTicketing">단체 예매하기</button>
          </section>
        </div>
      </div>
      <div class="container right">
        <client-only>
          <section class="res-info">
            <div class="cal">
              <h3>1. 날짜 선택</h3>
              <div class="cal-wrap">
                <UCalendar :dates="detailData.dates" :selected-date="selectedDate" @onSelectedDate="onSelectedDate" />
                <div class="cal-info">
                  <div><span /> 예매가능</div>
                  <div><span class="disabled" /> 예매 불가</div>
                  <div><span class="sold-out" /> 매진</div>
                </div>
              </div>
            </div>
            <div class="round">
              <p v-if="roundMaxSize === 0" class="max-round">
                이미 해당 날짜에 입장권을 4매 보유하고 있어요. <br class="only-pc" />회차 변경은 기존 입장권 환불 후
                가능해요.
              </p>
              <p v-if="isEmptyDates" class="max-round">예매 가능한 날이 없어요.</p>
              <template v-if="!isEmptyDates">
                <h3>2. 회차 선택</h3>
                <div class="round-wrap" :style="{ display: selectedDayRounds.length === 0 ? 'block' : 'grid' }">
                  <div v-if="selectedDayRounds.length === 0">관람일을 선택해 주시기 바랍니다.</div>
                  <div v-for="(item, index) in selectedDayRounds" :key="item.id" class="round-item">
                    <input
                      :id="`round${index}`"
                      v-model="selectedRound"
                      type="radio"
                      name="round"
                      :value="item.id"
                      :disabled="item.type !== 'ENABLED' || roundMaxSize === 0"
                    />
                    <label :for="`round${index}`">
                      <span
                        >{{ $dayjs(item.startDate).format('HH:mm') }} ~ {{ $dayjs(item.endDate).format('HH:mm') }}</span
                      >
                      <span v-if="item.type !== 'ENABLED'" class="status">{{ ROUND_DETAIL_TYPE[item.type] }}</span>
                    </label>
                  </div>
                </div>
              </template>
            </div>
            <div v-if="!isEmptyDates && roundMaxSize !== 0" class="count">
              <h3>3. {{ type === 'COFFEE' ? '메뉴' : '인원' }} 선택</h3>
              <div class="count-wrap">
                <div class="count-info">
                  <i class="pc uic-info" />최대 4{{ type === 'COFFEE' ? '잔' : '매' }}까지 예매할 수 있습니다.
                </div>
                <div>
                  <div v-for="item in detailData.prices" :key="item.id" class="count-item">
                    <div class="count-item-top">
                      <div class="count-item-wrap">
                        <div class="count-item-title">{{ item.type }}</div>
                        <div v-if="item.price === 0" class="count-item-price">
                          <b>무료</b>
                        </div>
                        <div v-else class="count-item-price">
                          <b v-if="item.discounts[0] && isHana">
                            {{
                              item.discounts[0].price === 0
                                ? '무료'
                                : Number(item.discounts[0].price).toLocaleString('en') + '원'
                            }}
                          </b>
                          <b v-else>{{ Number(item.price).toLocaleString('en') }}원</b>
                        </div>
                      </div>
                      <UInputSpinner v-model="item.count" :plus-disabled="isDisabledPlus" />
                    </div>
                    <div v-if="item.discounts[0] && isHana" class="count-item-bottom">
                      <p class="origin-price">
                        <del>{{ Number(item.price).toLocaleString('en') }}</del
                        >원 <span class="divider" />
                      </p>
                      <p class="discount-price">
                        <span>{{ item.discounts[0].note }}</span>
                      </p>
                    </div>
                  </div>
                  <UOrderCoupon
                    :coupon-type="type"
                    :init-coupon-id="coupon?.id"
                    :order-price="rawPrice"
                    @update-coupon="handleUpdateCoupon"
                  />
                </div>
                <div class="row-price">
                  <div class="label">합계</div>
                  <div class="cell-price">
                    <b>{{ rawPrice.toLocaleString('en') }}</b
                    >원
                  </div>
                </div>
                <div v-if="coupon?.id" class="row-price">
                  <div class="label">쿠폰</div>
                  <div class="cell-price">
                    <b>{{ totalDiscount.toLocaleString('en') }}</b
                    >원
                  </div>
                </div>
                <div v-if="coupon?.id" class="row-price">
                  <div class="label">지불할 총 금액</div>
                  <div class="cell-price">
                    <b>{{ paymentPrice.toLocaleString('en') }}</b
                    >원
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!isEmptyDates && roundMaxSize !== 0" class="terms">
              <div v-if="type !== 'COFFEE'">
                <UCheckbox v-model="isTerms.notice" />
                관람 시<strong class="terms-strong" role="button" @click="showTerm('notice')"> 유의사항</strong>에
                동의합니다.
              </div>
              <div>
                <UCheckbox v-model="isTerms.REFUND" />
                <strong class="terms-strong" role="button" @click="showRefund('REFUND')">환불 규정</strong>에
                동의합니다.
              </div>
            </div>
            <button
              v-if="!isEmptyDates && roundMaxSize !== 0"
              class="submit-btn mb-16"
              type="button"
              @click="checkAndGoPayment"
            >
              결제하기
            </button>
            <a
              v-if="detailData.isUseButton"
              :href="detailData.buttonLink ? detailData.buttonLink : 'javascript:void(0);'"
              :target="detailData.isNewTab && detailData.buttonLink ? '_blank' : ''"
            >
              <button class="link-btn" type="button">
                {{ detailData.buttonTitle }}
              </button>
            </a>
          </section>
        </client-only>
      </div>
    </div>
    <UDialogModal :is-show="modal.isToday" :hide-edge-close-btn="true" :hide-head="true" @close="modal.isToday = false">
      <template #content>
        당일 예매한 {{ type === 'COFFEE' ? '커피는' : '관람권은' }} 환불되지 않아요.<br />
        계속 예매하시겠어요?
      </template>
      <template #modal-btn1>
        <UButton button-type="secondary" w-size="sm" @click="modal.isToday = false">취소</UButton>
      </template>
      <template #modal-btn2>
        <UButton
          w-size="sm"
          @click="
            modal.isToday = false;
            goPaymentProcess();
          "
        >
          확인
        </UButton>
      </template>
    </UDialogModal>
    <UDialogModal :is-show="modal.isFeedback">
      <template #content>
        {{ feedbackMsg }}
      </template>
      <template #modal-btn2>
        <UButton class="feedback-btn" @click="modal.isFeedback = false">확인</UButton>
      </template>
    </UDialogModal>
    <UTripleDialogModal :is-show="modal.isNonMember">
      <template #content>
        예매를 위해서는 로그인이 필요합니다.<br />
        로그인하시겠습니까?
      </template>
      <template #modal-btn1>
        <UButton h-size="small" button-type="secondary" class="feedback-btn" @click="modal.isNonMember = false">
          취소
        </UButton>
      </template>
      <template #modal-btn2>
        <UButton h-size="small" class="feedback-btn" @click="$router.push('/auth/login')">로그인</UButton>
      </template>
      <template #modal-btn3>
        <UButton h-size="small" class="feedback-btn" @click="nonMemberPayment">비회원 예매</UButton>
      </template>
    </UTripleDialogModal>
    <UDialogModal :is-show="modal.isHana">
      <template #title>{{ initDetailData.title }} 예매</template>
      <template #content>
        예매 전 아래의 주의사항을 숙지해주세요.<br /><br />
        1. 페이지 새로고침, 다른 페이지로 이동 시 할인혜택이 초기화 됩니다.<br />
        2. 페이지 진입 후 30분이 지나면 예매를 진행할 수 없습니다.<br /><br />
        만약 할인혜택이 사라졌다면 하나원큐앱을 통해 예매페이지를 재 진입해주세요.
      </template>
      <template #modal-btn2>
        <UButton class="feedback-btn" @click="modal.isHana = false">확인</UButton>
      </template>
    </UDialogModal>
    <UTermModal :is-show="modal.isTerms" :term-target="termTarget" @close="modal.isTerms = false" @agree="termAgree" />
    <URegisterModal
      :is-show="modal.isRefund"
      :term-target="termTarget"
      :terms-data="termsData"
      @close="modal.isRefund = false"
      @agree="refundAgree"
    />
  </div>
</template>

<script>
import { isEmpty } from 'lodash/lang';
import cloneDeep from 'lodash/cloneDeep';
import UOrderCoupon from '../common/UOrderCoupon.vue';
import UCheckbox from '~/components/user/common/UCheckbox';
import UInputSpinner from '~/components/user/common/UInputSpinner';
import UCalendar from '~/components/user/common/UCalendar';
import { ROUND_DETAIL_TYPE } from '~/assets/js/types';
import UDialogModal from '~/components/user/modal/UDialogModal';
import UButton from '~/components/user/common/UButton';
import UTermModal from '~/components/user/modal/UTermModal';
// import payMixin from '~/store/tosspaymentsMixin';
import payMixin from '~/store/nicepayMixin';
import BrConvertText from '~/components/common/BrConvertText.vue';
import URegisterModal from '~/components/user/modal/URegisterModal';
import { getDateCommonDateOutput } from '~/assets/js/commons';
import UTripleDialogModal from '~/components/user/modal/UTripleDialogModal.vue';
import { discountRound, getBiggestPrice } from '~/utils/order';

export default {
  name: 'TicketingDetail',
  components: {
    UTripleDialogModal,
    URegisterModal,
    BrConvertText,
    UTermModal,
    UButton,
    UCalendar,
    UInputSpinner,
    UCheckbox,
    UDialogModal,
    UOrderCoupon
  },
  mixins: [payMixin],
  props: {
    type: {
      type: String,
      required: false,
      default: 'EXHIBITION' // EXHIBITION | PROGRAM | COFFEE
    },
    id: {
      type: [String, Number],
      required: false,
      default: null
    },
    initDetailData: {
      type: Object,
      required: false,
      default: () => ({})
    },
    initSelectedDate: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      ROUND_DETAIL_TYPE,
      ROUND_MAX_COUNT: 4,
      detailData: null,
      isHideInfo: true,
      selectedDate: '',
      selectedDayRounds: [],
      roundMaxSize: 4,
      selectedRound: null,
      termTarget: '',
      termsData: {},
      isTerms: {
        notice: false,
        REFUND: false
      },
      modal: {
        isToday: false,
        isTerms: false,
        isRefund: false,
        isFeedback: false,
        isHana: this.$store.getters['service/hana/getIsHanaPay'],
        isNonMember: false
      },
      feedbackMsg: '',
      isHana: this.$store.getters['service/hana/getIsHanaPay'],
      coupon: null
    };
  },
  async fetch() {
    if (this.selectedDate) {
      const { ticketNumber, infos } = await this.$axios.$get(`/user/${this.getFetchUrlType}/${this.id}/rounds/info`, {
        params: { date: this.selectedDate }
      });

      this.roundMaxSize = this.ROUND_MAX_COUNT - ticketNumber;
      this.selectedRound = infos.find((item) => item.type === 'ENABLED')?.id || null;
      this.selectedDayRounds = infos;
    }
  },
  computed: {
    isDisabledPlus() {
      return this.detailData.prices.reduce((prev, cur) => prev + cur.count, 0) >= this.roundMaxSize;
    },
    getFetchUrlType() {
      const type = this.type;

      return type === 'EXHIBITION'
        ? 'exhibitions'
        : type === 'PROGRAM'
        ? 'programs'
        : type === 'COFFEE'
        ? 'coffees'
        : '';
    },
    rawPrice() {
      const sumPrice = this.detailData.prices.reduce((prev, cur) => {
        const curPrice = this.isHana && cur.discounts[0] ? cur.discounts[0].price : cur.price;

        return prev + cur.count * curPrice;
      }, 0);
      if (!sumPrice) {
        this.handleResetCoupon();
      }
      return sumPrice;
    },
    isFree() {
      return this.detailData.prices.filter((item) => item.count > 0).reduce((cur, pre) => cur + pre.price, 0) === 0;
    },
    isEmptyDates() {
      return isEmpty(this.detailData.dates);
    },
    totalDiscount() {
      if (!this.coupon?.id) {
        return 0;
      }
      if (!this.detailData?.prices?.length) {
        return 0;
      }
      const discountPercent = this.coupon.discount_percent ? Number(this.coupon.discount_percent) : 0;
      const biggestPrice = getBiggestPrice(this.detailData.prices, this.isHana);

      if (!biggestPrice) {
        return 0;
      }

      return discountRound(biggestPrice, discountPercent);
    },
    paymentPrice() {
      if (!this.coupon?.id || !this.totalDiscount) {
        return this.rawPrice;
      }
      return this.rawPrice - this.totalDiscount;
    }
  },
  created() {
    this.detailData = this.initDetailData;
    this.selectedDate = this.initSelectedDate;

    if (this.$route.params?.errReason) {
      this.feedbackMsg = this.$route.params.errReason;
      this.modal.isFeedback = true;
    }

    // 하나은행 일때 타이틀만 보이는 헤더로 변경되고 타이틀 값이 필요하여 전달
    if (this.isHana) {
      this.$store.commit('service/hana/setTargetData', { title: this.initDetailData.title });
    }
    this.$store.dispatch('service/non-member-pay/clearState');
  },
  mounted() {
    if (this.isHana) {
      window.addEventListener('beforeunload', this.beforeUnloadEvent);
    }
  },
  beforeDestroy() {
    if (this.isHana) {
      window.removeEventListener('beforeunload', this.beforeUnloadEvent);
    }
  },
  methods: {
    beforeUnloadEvent(e) {
      e.returnValue = '';
      return '';
    },
    getFormattedDate(startDate, endDate) {
      return getDateCommonDateOutput(startDate, endDate);
    },
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    },
    onSelectedDate(date) {
      if (!this.$fetchState.pending) {
        this.selectedDate = date;
        this.$fetch();
      }
    },
    goGroupTicketing() {
      this.$router.push({
        path: '/ticketing/group',
        query: { id: this.id, type: this.type, title: this.detailData.title }
      });
    },
    showTerm(target) {
      this.termTarget = target;
      this.modal.isTerms = true;
    },
    async showRefund(target) {
      this.termTarget = target;
      this.termsData = await this.$axios.$get('/user/policies/posting', {
        params: {
          type: this.termTarget
        }
      });
      this.modal.isRefund = true;
    },
    refundAgree() {
      this.isTerms.REFUND = true;
      this.modal.isRefund = false;
    },
    termAgree() {
      this.isTerms[this.termTarget] = true;
      this.modal.isTerms = false;
    },
    checkAndGoPayment() {
      const selectedRoundStartDate =
        this.selectedDayRounds.find((item) => item.id === this.selectedRound)?.startDate || null;
      const isStartBeforeOneDay = this.$dayjs(selectedRoundStartDate).diff(this.$dayjs(), 'm') <= 1440;

      if (this.isValidate() && isStartBeforeOneDay) {
        this.modal.isToday = true;
      } else {
        this.goPaymentProcess();
      }
    },
    isValidate() {
      let isValid = false;

      if (!this.selectedDate) {
        this.feedbackMsg = '관람일을 선택해주세요.';
      } else if (!this.selectedRound) {
        this.feedbackMsg = '회차를 선택해주세요.';
      } else if (this.detailData.prices.reduce((prev, cur) => prev + cur.count, 0) === 0) {
        this.feedbackMsg = '관람 인원을 선택해주세요.';
      } else if (this.type !== 'COFFEE' && !this.isTerms.notice) {
        this.feedbackMsg = '관람 유의사항에 동의해주세요.';
      } else if (!this.isTerms.REFUND) {
        this.feedbackMsg = '환불 규정에 동의해주세요.';
      } else {
        isValid = true;
      }

      if (!isValid) {
        this.modal.isFeedback = true;
      }

      return isValid;
    },
    async goPaymentProcess() {
      if (this.isValidate()) {
        const isLogged = !!this.$store.getters['service/auth/getAccessToken'];
        const isFree = this.isFree;
        const roundId = this.selectedRound;
        const priceList = this.detailData.prices
          .filter((item) => item.count > 0)
          .map((price) => ({ id: price.id, number: price.count }));
        const ticketOrderInfo = {
          kind: this.type,
          roundId,
          prices: priceList
        };

        if (isLogged) {
          if (isFree) {
            await this.$axios
              .$post('/user/tickets/user/free', {
                ticketOrderInfo
              })
              .then((res) => {
                this.$router.push({
                  name: 'ticketing-result',
                  query: {
                    free: 'free'
                  },
                  params: {
                    data: {
                      kind: res.type,
                      title: res.title,
                      uuid: res.uuid,
                      price: 0,
                      prices: [...res.prices],
                      startDate: res.startDate,
                      endDate: res.endDate
                    }
                  }
                });
              })
              .catch((err) => {
                const errorMessage = err.response.data?.MESSAGE || '';

                if (errorMessage === 'BAD_VALID') {
                  const state = err.response.data?.STATE;

                  if (state === 1) {
                    this.feedbackMsg = '구매가능한 티켓(4개)을 초과하였어요.';
                    this.modal.isFeedback = true;
                  } else if (state === 2) {
                    this.feedbackMsg = '전시 시작일과 종료일 사이에 존재하지 않는 회차에요.';
                    this.modal.isFeedback = true;
                    alert('회차가 전시 시작일과 종료일 사이에 존재하지 않음');
                  } else if (state === 3) {
                    this.feedbackMsg = '예매 오픈일이 지나지 않았거나 회차 시작일이 2주 미만인 티켓이 아니에요.';
                    this.modal.isFeedback = true;
                  } else if (state === 4) {
                    this.feedbackMsg = '회차 종료 1시간 전까지만 예매가 가능해요.';
                    this.modal.isFeedback = true;
                  } else if (state === 5) {
                    this.feedbackMsg = '아쉽지만 선택한 회차가 매진되었습니다. 덜 붐비는 회차는 어떠세요?';
                    this.modal.isFeedback = true;
                  }
                } else {
                  alert('알수없는 오류. 다시 시도해주세요.');
                }
              });
          } else {
            const failUrl = `${window.location.origin}${this.$route.fullPath}`;

            await this.requestPayment(
              {
                ticketOrderInfo,
                couponUuid: this.coupon?.uuid ?? null
              },
              this.paymentPrice,
              failUrl,
              {
                id: this.id,
                type: this.type
              },
              'member'
            );
          }
        } else if (this.isHana) {
          this.$store.commit('service/hana/setTargetData', {
            ...ticketOrderInfo,
            id: this.initDetailData.id,
            isFree,
            title: this.initDetailData.title,
            totalPrice: this.rawPrice
          });
          await this.$router.push('/ticketing/hana/pay');
        } else {
          this.modal.isNonMember = true;
        }
      }
    },
    async nonMemberPayment() {
      const isFree = this.isFree;
      const roundId = this.selectedRound;
      const priceList = this.detailData.prices
        .filter((item) => item.count > 0)
        .map((price) => ({ id: price.id, number: price.count }));
      const ticketOrderInfo = {
        kind: this.type,
        roundId,
        prices: priceList
      };
      const nonMemberOrderInfo = {
        ...ticketOrderInfo,
        isFree,
        id: this.id,
        ticketPageUrl: this.$route.path,
        totalPrice: this.rawPrice
      };

      this.$store.commit('service/non-member-pay/setPayTargetData', nonMemberOrderInfo);
      await this.$router.push('/ticketing/non-member/pay1');
    },
    handleUpdateCoupon(coupon) {
      this.coupon = cloneDeep(coupon);
    },
    handleResetCoupon() {
      this.coupon = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.title-img {
  height: 24.5rem;
  width: 100%;
  object-fit: cover;
  margin-bottom: 2rem;
}

.title {
  margin-bottom: 4rem;

  h1 {
    font-size: 2.4rem;
    font-weight: 700;
    line-height: 160%;
    margin-bottom: 1.2rem;
    letter-spacing: -1px;
    word-break: keep-all;
  }
}

.info {
  .info-wrap {
    margin-bottom: 4rem;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    border-bottom: 1px solid var(--color-black);
    padding-bottom: 1.4rem;
    margin-bottom: 1.6rem;
  }

  .hour {
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 150%;
    margin-bottom: 0.8rem;
  }

  .hide-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4.4rem;
    width: 100%;
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 100%;
    border: 1px solid var(--color-black);
    margin-bottom: 4rem;

    i {
      font-size: 1.6rem;
      margin-left: 1.38rem;
    }
  }
}

.group-res {
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  background-color: rgba(235, 235, 235, 0.4);
  width: 100vw;
  margin-bottom: 4rem;

  p {
    flex: 1 0 55.9375%;
    word-break: keep-all;
  }

  .group-res-btn {
    color: var(--color-u-primary);
    width: 40%;
    height: 4.4rem;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 100%;
    margin-left: 1.3rem;
    word-break: keep-all;
    border: 1px solid var(--color-u-primary);
    background-color: var(--color-white);
  }
}

.res-info {
  padding: 0 0 12rem;

  h3 {
    font-size: 1.8rem;
    font-weight: 600;
    line-height: 100%;
    border-top: 1px solid var(--color-black);
    border-bottom: 1px solid var(--color-black);
    padding: 1.7rem 0;
  }

  .cal {
    margin-bottom: 4rem;

    .cal-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: auto;
      padding: 1.6rem;
      background-color: rgba(235, 235, 235, 0.4);
      border: 1px solid var(--color-u-grey-1);
    }

    .cal-info {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 36rem;
      margin-top: 1.7rem;

      > div {
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 100%;
        margin-right: 1.6rem;
      }

      span {
        display: inline-flex;
        height: 12px;
        width: 12px;
        margin-right: 0.8rem;
        background-color: var(--color-white);
        border: 1px solid var(--color-u-grey-1);
        transform: translateY(0.2rem);

        &.disabled {
          background-color: var(--color-u-grey-1);
          border: 1px solid rgba(190, 190, 190, 0.4);
        }

        &.sold-out {
          background-color: rgba(255, 77, 0, 0.1);
          border: 1px solid rgba(255, 77, 0, 0.2);
        }
      }
    }
  }

  .round {
    margin-bottom: 4rem;

    .max-round {
      display: flex;
      color: var(--color-white);
      width: 100%;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      line-height: 160%;
      background-color: var(--color-u-grey-3);
      padding: 1.8rem 2rem;
      word-break: keep-all;
      text-align: center;
      margin-bottom: 4rem;
    }

    .round-wrap {
      display: grid;
      gap: 1.2rem;
      padding: 1.6rem;
      grid-template-columns: 1fr 1fr;
      background-color: rgba(235, 235, 235, 0.4);
      border: 1px solid var(--color-u-grey-1);

      .round-item {
        display: flex;
        flex-direction: column;
        height: 6rem;
      }

      label {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-weight: 400;
        border: 1px solid rgba(190, 190, 190, 0.4);
        background-color: var(--color-white);
        border-radius: 4px;
        cursor: pointer;

        .status {
          color: var(--color-u-grey-3);
          font-size: 1.2rem;
          font-weight: 700;
          line-height: 100%;
        }
      }

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      input:checked + label {
        color: var(--color-white);
        border-color: var(--color-u-primary);
        background: rgba(165, 177, 149, 0.6);
        font-weight: 600;
      }

      input:disabled + label {
        color: var(--color-u-grey-3);
        background-color: var(--color-u-grey-1);
        cursor: default;
      }

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }
    }
  }

  .count {
    margin-bottom: 2.4rem;

    .count-wrap {
      padding: 1.6rem;
      background-color: rgba(235, 235, 235, 0.4);
      border: 1px solid var(--color-u-grey-1);

      .count-info {
        display: flex;
        font-weight: 500;
        font-size: 1.2rem;
        line-height: 100%;
        align-items: center;
        margin-bottom: 1.2rem;

        i {
          font-size: 2rem;
          margin-right: 0.8rem;
          transform: translateY(-0.1rem);
        }
      }

      .count-item {
        padding: 1.4rem 1.6rem 1.6rem;
        border: 1px solid var(--color-u-grey-1);
        border-bottom: 0;
        background-color: var(--color-white);

        .count-item-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .count-item-bottom {
          display: flex;
          align-items: center;
          padding-top: 1rem;
          letter-spacing: -0.05rem;

          .origin-price {
            color: var(--color-u-grey-3);
            font-size: 1.2rem;

            del {
              font-weight: 400;
              margin-right: 0.2rem;
            }
          }

          .discount-price {
            color: var(--color-u-error);
            font-size: 1.2rem;
            font-weight: 500;
          }

          .divider {
            display: inline-flex;
            width: 0.1rem;
            height: 1rem;
            background-color: var(--color-grey-2);
            margin: 0 0.6rem;
          }
        }

        &:first-child {
          border-radius: 4px 4px 0 0;
        }

        .count-item-wrap {
          flex: 1 0 0;
        }

        .count-item-title {
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 120%;
          margin-bottom: 1.2rem;
          word-break: keep-all;
        }

        .count-item-price {
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 100%;

          b {
            font-size: 1.8rem;
            font-weight: 500;
            line-height: 100%;
          }
        }
      }

      .row-price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4.8rem;
        background-color: var(--color-white);
        padding: 0 1.6rem;
        border: 1px solid var(--color-black);

        .label {
          font-size: 1.4rem;
          font-weight: 600;
          line-height: 100%;
        }

        .cell-price {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 100%;

          b {
            font-size: 2rem;
            font-weight: 600;
          }
        }
      }
      .row-price + .row-price {
        border-top: none;
      }
      .row-price:last-child {
        border-radius: 0 0 4px 4px;
      }
    }
  }

  .terms {
    margin-bottom: 2.4rem;

    > div {
      display: block;
      margin-bottom: 1.6rem;

      label {
        margin-right: 1.2rem;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .terms-strong {
      color: var(--color-u-primary);
      font-weight: 700;
      cursor: pointer;
    }
  }

  .submit-btn {
    color: var(--color-white);
    font-size: 2rem;
    height: 4.4rem;
    width: 100%;
    font-weight: 700;
    background-color: var(--color-u-primary);
  }

  .link-btn {
    color: var(--color-u-primary);
    width: 100%;
    height: 4.4rem;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 100%;
    word-break: keep-all;
    border: 1px solid var(--color-u-primary);
  }
}

.feedback-btn {
  width: 50%;
}

@media screen and (min-width: 769px) {
  .pc-duplicate-grid {
    display: block;
    max-width: unset;
    margin: 0 auto;
    padding: 4.8rem 1.4rem 12rem;

    .left {
      max-width: 100%;
      margin-right: 0;
    }

    .right {
      max-width: 100%;
    }
  }

  .title {
    margin-bottom: 5.2rem;

    h1 {
      font-size: 4.2rem;
      line-height: 150%;
      margin-bottom: 1.9rem;
    }

    p {
      font-size: 1.6rem;
      line-height: 160%;
      font-weight: 500;
    }
  }

  .title-img {
    border-radius: 0.8rem;
  }

  .info {
    .info-wrap {
      margin-bottom: 5.2rem;
    }

    h2 {
      font-size: 2.4rem;
      padding-bottom: 1.8rem;
      margin-bottom: 2rem;
    }

    .hour {
      font-weight: 500;
      font-size: 1.8rem;
      line-height: 160%;
      margin-bottom: 1.2rem;
    }

    .hide-button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 4.4rem;
      width: 100%;
      font-size: 1.4rem;
      font-weight: 500;
      line-height: 100%;
      border: 1px solid var(--color-black);
      margin-bottom: 4rem;

      i {
        font-size: 1.6rem;
        margin-left: 1.38rem;
      }
    }
  }

  .group-res {
    padding: 2.4rem;
    width: 100vw;
    max-width: unset;
    margin-left: -1.4rem;
    margin-right: -1.4rem;

    p {
      display: flex;
      align-items: center;
      font-size: 1.8rem;
      line-height: 160%;
    }

    .group-res-btn {
      width: 15.2rem;
      height: 4.4rem;
      font-size: 1.4rem;
      font-weight: 700;
      line-height: 100%;
      margin-left: 1.3rem;
      word-break: keep-all;
    }
  }

  .res-info {
    padding: 0;

    h3 {
      font-size: 2rem;
      font-weight: 700;
      line-height: 150%;
      padding: 1.8rem 0;
    }

    .cal {
      margin-bottom: 5.2rem;

      .cal-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: auto;
        padding: 3.2rem 3.4rem 2.8rem;
        border: 1px solid var(--color-u-grey-1);
      }

      .cal-info {
        max-width: unset;
        margin-top: 1.8rem;

        > div {
          font-size: 1.4rem;
          font-weight: 300;
          line-height: 160%;
        }

        span {
          display: inline-flex;
          height: 12px;
          width: 12px;
          margin-right: 0.8rem;
          background-color: var(--color-white);
          border: 1px solid var(--color-u-grey-1);
          transform: translateY(0.2rem);

          &.disabled {
            background-color: var(--color-u-grey-1);
            border: 1px solid rgba(190, 190, 190, 0.4);
          }

          &.sold-out {
            background-color: rgba(255, 77, 0, 0.1);
            border: 1px solid rgba(255, 77, 0, 0.2);
          }
        }
      }
    }

    .round {
      margin-bottom: 4rem;

      .max-round {
        font-size: 1.8rem;
        line-height: 160%;
        padding: 2.2rem 2rem;
        margin-bottom: 5.8rem;
      }

      .round-wrap {
        padding: 3.2rem 3.4rem;
        grid-template-columns: 1fr 1fr 1fr;

        .round-item {
          display: flex;
          flex-direction: column;
          height: 6.4rem;
        }

        label {
          font-size: 1.6rem;
          line-height: 160%;

          .status {
            font-size: 1.4rem;
            line-height: 160%;
          }
        }
      }
    }

    .count {
      margin-bottom: 3.2rem;

      .count-wrap {
        padding: 3.4rem 3.4rem 3.2rem;
        background-color: rgba(235, 235, 235, 0.4);
        border: 1px solid var(--color-u-grey-1);

        .count-info {
          font-size: 1.4rem;
          line-height: 160%;
          margin-bottom: 1.8rem;

          i {
            font-size: 2rem;
            margin-right: 1rem;
            transform: translateY(-0.1rem);
          }
        }

        .count-item {
          padding: 1.5rem 2.4rem 1.2rem;
          align-items: center;

          .count-item-title {
            font-weight: 700;
            line-height: 160%;
            margin-bottom: 0.4rem;
          }

          .count-item-price {
            line-height: 160%;

            b {
              line-height: 160%;
              margin-right: 0.4rem;
            }
          }
        }

        .row-price {
          height: 5.2rem;
          padding: 0 2.4rem;

          .label {
            font-size: 1.8rem;
            font-weight: 700;
            line-height: 160%;
          }

          .cell-price {
            line-height: 160%;

            b {
              line-height: 150%;
            }
          }
        }
      }
    }

    .terms {
      font-size: 1.6rem;
      margin-bottom: 2.8rem;

      > div {
        margin-bottom: 2rem;
      }
    }

    .submit-btn,
    .link-btn {
      height: 5.2rem;
      font-size: 1.8rem;
    }
  }
}

@media screen and (min-width: 1393px) {
  .pc-duplicate-grid {
    display: flex;
    max-width: 1392px;
    margin: 0 auto;

    .left {
      flex: 1 0 78.4rem;
      max-width: 78.4rem;
      margin-right: 2.8rem;
    }

    .right {
      flex: 1 0 55.2rem;
      max-width: 55.2rem;
    }

    .container {
      padding: 0;
    }
  }

  .title-img {
    height: auto;
    object-fit: cover;
    margin-bottom: 3.6rem;
    aspect-ratio: 784/538;
  }

  .group-res {
    width: 100%;
    margin: 0 auto;
    max-width: 78.4rem;
  }
}

@media screen and (min-width: 1921px) {
  .title-img {
    border-radius: 0.8rem;
  }
}
</style>
