<template>
  <transition name="fade">
    <div v-if="isMounted">
      <HeaderBase />

      <!-- ✅ 앱에서도 동일한 모달 플로우 실행 -->
      <MarketingPop
        v-if="isShowMarketingPop && userInfo?.marketingPending && !userInfo?.birthDate"
        :is-show="isShowMarketingPop"
        @close="handleMarketingSkipped"
      />

      <NotificationModal
        v-if="showNotificationModal && userInfo?.marketingPending && notificationCode !== null"
        :is-show="showNotificationModal"
        :code="notificationCode"
        :can-next="notificationCanNext"
        @next="openAdditionalInfo"
        @close="showNotificationModal = false"
      />

      <AdditionalInfoModal
        v-if="showAdditionalInfoModal && userInfo?.marketingPending && userInfo?.birthDate"
        :is-show="showAdditionalInfoModal"
        @close="showAdditionalInfoModal = false"
        @issued="onCouponIssued"
      />

      <client-only>
        <section>
          <Swiper ref="mainSwiper" :options="mainSwiperOption" class="main-slider" @slideChange="onMainSlideChange">
            <SwiperSlide v-for="(item, index) in appData.slides" :key="index">
              <a
                :href="item.isUseButton && item.link ? item.link : null"
                :target="item.isNewTab ? '_blank' : ''"
                :class="{ clickable: item.isUseButton && item.link }"
              >
                <img :src="getImage(item.mobileImage)" :alt="item.mobileImageAlt" />
                <div class="bg-wrap" />
                <h2>{{ item.title }}</h2>
                <h3>{{ item.subtitle }}</h3>
                <p>{{ item.schedule }}</p>
              </a>
            </SwiperSlide>
            <div v-if="appData.slides.length > 1" slot="pagination" class="swiper-pagination" />
            <div v-if="currentMainSlide !== 1" slot="button-prev" class="swiper-button-prev">
              <i class="m umic-arrow_backward" />
            </div>
            <div v-if="appData.slides.length !== currentMainSlide" slot="button-next" class="swiper-button-next">
              <i class="m umic-arrow_forward" />
            </div>
          </Swiper>
        </section>
        <section v-if="isLogged && ticketList.length > 0" class="qr-menu">
          <div class="qr-menu-wrap" :class="{ more: ticketList.length >= 3 }">
            <div
              v-for="(item, index) in ticketList"
              :key="item.id"
              class="qr-menu-item"
              :class="{ 'is-today': $dayjs().isSame($dayjs(item.startDate)) }"
              @click="showQRModal(index)"
            >
              <p v-if="item.type === 'INVITE'" class="date">{{ $dayjs(item.endDate).format('YYYY-MM-DD') }} 까지</p>
              <p v-else class="date">
                {{ $dayjs(item.startDate).format('HH:mm') }} - {{ $dayjs(item.endDate).format('HH:mm') }}
              </p>
              <h4>{{ item.title }}</h4>
              <div class="bottom">
                <div class="type-warp">
                  <p v-for="(infoItem, infoIndex) in item.info" :key="infoItem.type" class="type-item">
                    {{ infoItem.type
                    }}<b>{{ infoItem.number }}<template v-if="infoIndex + 1 !== item.info.length">,</template></b>
                  </p>
                </div>
                <img src="~assets/img/app_qr_icon.svg" alt="" />
              </div>
            </div>
          </div>
        </section>
        <UQRModal :is-show="isShowQRModal" :detail-data="selectedTicket" @close="isShowQRModal = false" />
        <UPopupModal
          v-if="appData.popups && appData.popups[0]"
          :is-show="isShowPopup"
          :popup-list="appData.popups"
          @close="isShowPopup = false"
        />
      </client-only>
    </div>
  </transition>
</template>

<script>
import HeaderBase from '~/components/user/sections/HeaderBase.vue';
import UQRModal from '~/components/user/modal/UQRModal.vue';
import UPopupModal from '~/components/user/modal/UPopupModal.vue';
import MarketingPop from '~/components/user/modal/UMarketingModal.vue'
import NotificationModal from '~/components/user/modal/NotificationModal.vue'
import AdditionalInfoModal from '~/components/user/modal/AdditionalInfoModal.vue'

export default {
  name: 'AppPage',
  components: { UPopupModal, UQRModal, HeaderBase, MarketingPop, NotificationModal, AdditionalInfoModal },
  layout: 'none',
  async asyncData({ $axios, query, redirect, req, store }) {
      const isLogged = !!store.getters['service/auth/getAccessToken'];
      const appData = await $axios.$get('/user/common/home/app');
      const ticketList = isLogged ? await $axios.$get('/user/account/tickets/enabled') : [];

      // ▼▼ 여기부터: index.vue와 동일한 EncodeData 처리
      let userPhoneInfo = null;

      const currentUser = store.getters['service/auth/getUserInfo'];
      const needsAuth = query.EncodeData && !currentUser?.birthDate;

      if (needsAuth) {
        try {
          userPhoneInfo = await $axios
            .$get('/nice/decrypt', { params: { encodeData: query.EncodeData } })
            .catch(() => { redirect('/app'); });

          const payload = {
            gender: userPhoneInfo.gender,
            birthDate: userPhoneInfo?.birthDate,
            phone: userPhoneInfo.mobileNo,
            isLocalResident: false,
            isMarketingReceive: false,
            marketingPending: true,
            additionalInfoAgreed: false,
          };
          const updated = await $axios.$put('/user/account/info', payload);
          store.commit('service/auth/setUserInfo', updated);

          // (선택) EncodeData 제거하고 현재 경로 유지하고 싶으면:
          // redirect({ path: '/app', query: {} });
        } catch {
          redirect('/app');
        }
      }
      // ▲▲ 여기까지

      return { isLogged, appData, ticketList, userPhoneInfo };
    },
  data() {
    return {
      isMounted: false,
      mainSwiperOption: {
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        loop: true,
        autoplay: {
          delay: 5000
        },
        effect: 'fade',
        speed: 1000,
        fadeEffect: {
          crossFade: true
        }
      },
      currentMainSlide: 1,
      appData: null,
      isLogged: false,
      ticketList: null,
      selectedTicketIndex: null,
      isShowQRModal: false,
      isShowPopup: false,
      isShowMarketingPop: false,
      showNotificationModal: false,
      showAdditionalInfoModal: false,
      showCouponModal: false,          // (쿠폰 모달 쓰면)
      notificationCode: null,
      notificationCanNext: true,
      issuedCoupons: [],
    };
  },
  computed: {
    mainSwiper() {
      return this.$refs.mainSwiper.$swiper;
    },
    selectedTicket() {
      return this.ticketList[this.selectedTicketIndex] || null;
    },
    userInfo() {
      return this.$store.getters['service/auth/getUserInfo']
    }
  },
  watch: {
    userInfo: {
      immediate: true,
      handler(u) {
        if (u && u.marketingPending === false) {
          this.isShowMarketingPop = false;
          this.showNotificationModal = false;
          this.showAdditionalInfoModal = false;
          return;
        }
        // birthDate 미입력 + marketingPending이면 1단계 마케팅 팝업
        if (u?.marketingPending && !u?.birthDate) {
          this.isShowMarketingPop = true
        }
        // birthDate가 방금 세팅되어 들어온 경우엔 바로 2단계(알림) → 3단계(추가정보)로 이어짐
        if (u?.marketingPending && u?.birthDate && this.notificationCode === null) {
          this.handlePhoneInfo()
        }
      }
    }
  },
  mounted() {
    if (!this.$store.state.deviceInfo.isApp) {
      this.$router.push('/');
    } else {
      this.isMounted = true;
    }

    if (!this.$cookies.get('mainPopupHide')) {
      this.isShowPopup = true;
    }
  },
  methods: {
    getImage(image) {
      return image
        ? `${this.$store.state.BASE_URL}${image.savedFileName}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    showQRModal(index) {
      this.selectedTicketIndex = index;
      this.isShowQRModal = true;
    },
    onMainSlideChange() {
      this.currentMainSlide = this.mainSwiper.realIndex + 1;
    },
    onCouponIssued(coupons) {
      this.issuedCoupons = coupons;
      this.showAdditionalInfoModal = false;
      this.showCouponModal = true;   // 쓰면 표시
    },

    handleMarketingSkipped() {
      this.isShowMarketingPop   = false;
      this.notificationCanNext  = false;  // 다음 버튼 숨김
      this.notificationCode     = 1;
      this.showNotificationModal = true;
    },

    openAdditionalInfo() {
      this.showNotificationModal = false;
      this.showAdditionalInfoModal = true;
    },

    // 생년월일 기반 코드 결정(미성년자: 3, 성인: 1)
    handlePhoneInfo() {
      const birth = this.$dayjs(this.userInfo?.birthDate, 'YYYY-MM-DD');
      const today = this.$dayjs();
      let age = today.year() - birth.year();
      if (today.isBefore(birth.add(age, 'year'))) age--;
      this.notificationCode = age < 19 ? 3 : 1;
      this.showNotificationModal = true;
    },
  }
};
</script>

<style lang="scss" scoped>
.main-slider {
  .swiper-slide {
    position: relative;
    height: calc(100vh - 6rem);
    width: 100vw;
    padding: 4.8rem 2rem;

    img {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      z-index: -1;
    }

    .bg-wrap {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(180deg, rgba(17, 17, 17, 0.1) 0%, rgba(17, 17, 17, 0.2) 100%);
      z-index: -1;
    }

    h2 {
      color: var(--color-white);
      font-weight: 700;
      font-size: 3rem;
      line-height: 140%;
      letter-spacing: -1px;
      margin-bottom: 0.8rem;
      word-break: keep-all;
    }

    h3 {
      color: var(--color-white);
      font-weight: 600;
      font-size: 2.4rem;
      margin-bottom: 2rem;
      line-height: 140%;
      word-break: keep-all;
    }

    p {
      color: var(--color-white);
      font-weight: 600;
      font-size: 1.6rem;
      line-height: 100%;
    }
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: var(--color-white);
    left: 2rem;
    top: 30.3rem;
    font-size: 2.4rem;

    &:after {
      content: '';
    }
  }
  .swiper-button-next {
    left: 6rem;
  }

  .swiper-pagination {
    color: var(--color-white);
    font-weight: 600;
    font-size: 1.4rem;
    line-height: 100%;
    height: 1.5rem;
    width: auto;
    top: 30.3rem;
    left: 9.8rem;
    transform: translateY(-50%);
  }
}

.qr-menu {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 0 0.8rem;
  width: 100%;
  z-index: 9;

  .qr-menu-wrap {
    max-height: 17.6rem;
    overflow-y: auto;
    background-color: var(--color-white);
    border-radius: 0.8rem 0.8rem 0 0;
    padding: 1.2rem;

    &::-webkit-scrollbar {
      height: 0;
      margin-right: 0;
      width: 0;
    }
    &::-webkit-scrollbar-thumb {
      background-color: transparent;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &.more {
      max-height: 28.4rem;
    }
  }

  .qr-menu-item {
    padding: 1.6rem 1.2rem;
    border-radius: 8px;
    border: 1px solid var(--color-u-grey-1);
    background: rgba(235, 235, 235, 0.4);
    margin-bottom: 0.8rem;

    .date {
      position: relative;
      font-weight: 400;
      font-size: 1.2rem;
      line-height: 100%;
      margin-bottom: 1.2rem;
    }

    h4 {
      font-weight: 700;
      font-size: 1.4rem;
      line-height: 160%;
      margin-bottom: 0.7rem;
    }

    .bottom {
      display: flex;
      justify-content: space-between;

      .type-warp {
        flex: 1 0 0;
        display: flex;
        flex-wrap: wrap;
      }

      .type-item {
        font-weight: 400;
        font-size: 1.2rem;
        line-height: 160%;
        margin-right: 0.4rem;

        b {
          font-weight: 500;
          margin-left: 0.4rem;
        }

        &:last-child {
          margin-right: 0;
        }
      }

      img {
        height: 2rem;
        width: 2rem;
        margin-left: 1rem;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    &.is-today {
      color: var(--color-white);
      background-color: var(--color-u-primary);
    }
  }
}
</style>
