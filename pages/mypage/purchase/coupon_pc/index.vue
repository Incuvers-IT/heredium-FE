<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head">
        <h2 class="only-pc">쿠폰함</h2>
      </div>
      <div class="ticketing-body">
        <div class="membership_info">
          <div class="membership_icon">
            <img
              v-if="imageSrcByCode(dataMembership.code)"
              :src="imageSrcByCode(dataMembership.code)"
              alt="membership icon"
            />
          </div>
          <div class="name_membership">
            <div>
              <p class="name_class">
                {{ dataMembership.name }} 님의 현재 등급은 <B>{{ dataMembership.membership_name }}</B> 입니다.
              </p>
              <div class="mileage_condition">
                <p v-if="dataMembership.code === 1">
                  마일리지
                  <B
                    >{{
                      Math.max(
                        0,
                        (membershipBenefit.items.find((item) => item.code === 2)?.usage_threshold || 0) - totalMileage
                      )
                    }}점</B
                  >
                  적립시 업그레이드 됩니다.
                </p>
                <p v-if="dataMembership.code === 2">
                  업그레이드 등급 유지기간
                  <b
                    >{{ formatDate(dataMembership.registration_date) }}~{{
                      formatDate(dataMembership.expiration_date)
                    }}</b
                  >
                </p>
                <p v-if="dataMembership.code === 3"><B>미성년자</B>에게 부여되는 등급입니다.</p>
                <!-- 등급 혜택 모달 -->
                <div
                  ref="benefitWrap"
                  class="benefit-hover-wrapper"
                  :class="{ 'push-right': dataMembership.code === 3 }"
                  @mouseenter="onHoverIn"
                  @mouseleave="onHoverOut"
                >
                  <button class="membership_benefit">등급 혜택보기</button>

                  <div
                    v-show="showModal"
                    class="transparent-modal modal-no-center"
                    @mouseenter="onHoverIn"
                    @mouseleave="onHoverOut"
                  >
                    <ModalMembershipInfor
                      v-if="showModal"
                      v-model="showModal"
                      :is-modal-visible="showModal"
                      :data-membership="dataMembership"
                      :benefit-rows="(membershipBenefit && membershipBenefit.items) || []"
                    />
                  </div>
                </div>
              </div>

              <div class="mileage_description">
                <p v-if="dataMembership.code !== 3">
                  마일리지는 <B>멤버십 등급 산정용</B>으로만 사용되며, <br />
                  적립된 마일리지에 따라 <B>등급별 혜택</B>이 제공됩니다
                </p>
                <p v-if="dataMembership.code === 3">
                  <B>만 19세</B>가 도래하는 경우
                  {{ membershipBenefit.items.find((item) => item.code === 1)?.name }} 등급으로 전환되며, <br />
                  {{ dataMembership.membership_name }} 회원의 경우 마일리지 적립이 불가합니다.
                </p>
              </div>
            </div>
          </div>
          <div class="coupon_summary">
            <div>현재 나의 쿠폰</div>
            <div>소멸 예정 쿠폰</div>
          </div>
          <div class="show_coupon">
            <div class="coupon_total">
              <span style="font-size: 28px"> {{ totalCoupons }}</span>
            </div>
            <div class="coupon_expire">
              <span style="font-size: 28px"> {{ expiringCoupons }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Tab UI -->
      <div class="coupon-section">
        <!-- 탭 버튼 영역 -->
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
        <!-- 기간 필터 영역 -->
        <div class="filter-area">
          <div class="filter-buttons" style="display: flex; width: 50%;">
            <button
              v-for="option in filterOptions"
              :key="option"
              :class="{ selected: selectedFilter === option }"
              @click="selectFilter(option)"
            >
              {{ option }}
            </button>
             <!-- 사용자 지정 기간 설정 -->
            <div class="date-range" style="width: 40%; margin-left: 2rem;">
              <UDatepicker v-model="startDate" :max="endDate" />
              <span>~</span>
              <UDatepicker v-model="endDate" :min="startDate" />
            </div>
          </div>
          <button class="filter-submit" @click="applyPeriodFilter">조회</button>
        </div>

        <!-- 테이블 -->
        <UPageable
          :list-data="couponPageModel"
          :show-prev-page="true"
          :show-next-page="true"
          @getListData="onCouponPageChange"
        >
          <template #data="{ data }">
            <table class="coupon-table">
              <tbody>
                <tr>
                  <td colspan="5" style="padding: 0; border: none; background: transparent">
                    <CouponList
                      :key="`page-${couponList.number}-${(data && data.length) || 0}`"
                      class="coupon-list"
                      :data="data"
                      :right-button="true"
                      @refresh-coupon-list="() => loadCouponList(couponList?.number || 0)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </UPageable>
      </div>
    </section>
  </main>
</template>

<script>
import dayjs from 'dayjs';

import ModalMembershipInfor from '~/components/user/modal/membership/ModalMembershipInfor.vue';
import SideBarMyPage from '~/components/user/page/SideBarMyPage.vue';
import UDatepicker from '~/components/user/common/UDatepicker';
import UPageable from '~/components/user/common/UPageable';
import CouponList from '~/components/user/page/coupon/CouponList.vue';
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'MembershipAndCouponPage',
  components: { SideBarMyPage, ModalMembershipInfor, UDatepicker, CouponList, UPageable },
  mixins: [imageMixin],

  async asyncData({ $axios }) {
    const initialPageSize = 5;

    // 기본 기간(최근 1개월)
    const uiStart = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    const uiEnd = dayjs().format('YYYY-MM-DD');

    // 멤버십 정보/마일리지
    const dataMembership = await $axios.$get('/user/membership/info');
    const mileageRes = await $axios.$get(`/user/membershipMileage/${dataMembership.account_id}`, {
      params: { page: 0, size: initialPageSize }
    });
    const totalMileage = mileageRes.totalMileage;

    // 쿠폰 (배열/페이지객체 모두 대응)
    const couponRes = await $axios.$get('/user/coupons/usage', {
      params: {
        tab: 'total',
        startDate: `${uiStart} 00:00:00`,
        endDate: `${uiEnd} 23:59:59`,
        page: 0,
        size: initialPageSize
      }
    });
    let couponList;
    let totalCoupons = 0;
    let expiringCoupons = 0;

    if (Array.isArray(couponRes)) {
      couponList = {
        content: couponRes,
        totalElements: couponRes.length,
        totalPages: 1,
        number: 0,
        size: initialPageSize,
        first: true,
        last: true
      };
    } else {
      couponList = {
        content: couponRes.content || [],
        totalElements: couponRes.totalElements || 0,
        totalPages: couponRes.totalPages || 0,
        number: couponRes.number || 0,
        size: couponRes.size || initialPageSize,
        first: couponRes.first ?? true,
        last: couponRes.last ?? true
      };
      // 합계는 백엔드 값 그대로 사용
      totalCoupons = couponRes.totalCoupons ?? 0;
      expiringCoupons = couponRes.expiringCoupons ?? 0;
    }

    // 멤버십 혜택
    const membershipBenefit = await $axios.$get('/user/membership/benefit');

    return {
      dataMembership,
      totalMileage,
      membershipBenefit,

      // 날짜 바인딩
      startDate: uiStart,
      endDate: uiEnd,
      appliedStartDate: uiStart,
      appliedEndDate: uiEnd,

      // 페이지 데이터
      couponList,
      totalCoupons,
      expiringCoupons
    };
  },
  data() {
    return {
      pageSizeForLoad: 5,

      activeTab: 'total',
      tabs: [
        { key: 'total', label: '전체' },
        { key: 'added', label: '보유 쿠폰' },
        { key: 'used', label: '사용 쿠폰' }
      ],

      filterOptions: ['1개월', '3개월', '6개월', '1년'],
      selectedFilter: '1개월',

      showModal: false,
      hideTimer: null,
      hoverPos: { x: 0, y: 0 }
    };
  },
  computed: {
    couponPageModel() {
      return this.couponList;
    }
  },
  watch: {
    activeTab() {
      this.loadCouponList(0);
    }
  },
  methods: {
    onCouponPageChange(index) {
      this.loadCouponList(index);
    },

    tabParam() {
      if (this.activeTab === 'added') return 'available';
      if (this.activeTab === 'used') return 'used';
      return 'total';
    },

    // 기간 퀵버튼
    selectFilter(option) {
      this.selectedFilter = option;
      const now = dayjs();
      let start;
      switch (option) {
        case '1개월':
          start = now.subtract(1, 'month');
          break;
        case '3개월':
          start = now.subtract(3, 'month');
          break;
        case '6개월':
          start = now.subtract(6, 'month');
          break;
        case '1년':
          start = now.subtract(1, 'year');
          break;
        default:
          return;
      }
      this.startDate = start.format('YYYY-MM-DD');
      this.endDate = now.format('YYYY-MM-DD');
      this.applyPeriodFilter();
    },

    applyPeriodFilter() {
      this.appliedStartDate = this.startDate;
      this.appliedEndDate = this.endDate;
      this.loadCouponList(0);
    },

    async loadCouponList(pageIndex = 0) {
      try {
        const res = await this.$axios.$get('/user/coupons/usage', {
          params: {
            tab: this.tabParam(),
            startDate: `${this.appliedStartDate} 00:00:00`,
            endDate: `${this.appliedEndDate} 23:59:59`,
            page: pageIndex,
            size: this.pageSizeForLoad
          }
        });

        if (Array.isArray(res)) {
          this.couponList = {
            content: res,
            totalElements: res.length,
            totalPages: 1,
            number: 0,
            size: this.pageSizeForLoad,
            first: true,
            last: true
          };
        } else {
          this.couponList = {
            content: res.content || [],
            totalElements: res.totalElements || 0,
            totalPages: res.totalPages || 0,
            number: res.number || 0,
            size: res.size || this.pageSizeForLoad,
            first: !!res.first,
            last: !!res.last
          };
          this.totalCoupons = res.totalCoupons ?? 0;
          this.expiringCoupons = res.expiringCoupons ?? 0;
        }
      } catch (e) {
        console.error(e);
        this.couponList = {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: this.pageSizeForLoad,
          first: true,
          last: true
        };
        this.totalCoupons = 0;
        this.expiringCoupons = 0;
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      return dayjs(dateStr).format('YYYY-MM-DD');
    },

    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },

    onHoverIn() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
      this.showModal = true;
    },
    onHoverOut(e) {
      const wrap = this.$refs.benefitWrap;
      const to = e.relatedTarget;
      if (wrap && to && wrap.contains(to)) return;
      this.hideTimer = setTimeout(() => {
        this.showModal = false;
        this.hideTimer = null;
      }, 120);
    },

    imageSrcByCode(code) {
      const rows = (this.membershipBenefit && this.membershipBenefit.items) || [];
      const row = rows.find((r) => Number(r.code) === Number(code));
      if (row && row.image_url) return this.getImage(row.image_url);
      return null;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 12rem;
}

.ticketing-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.8rem;
  }
}

.head {
  font-size: 2rem;
  font-weight: 700;
  padding-left: 8px;
  border-left: 5px solid var(--color-u-primary);
  margin-bottom: 2rem;
}

.ticketing-body {
  width: 100%;
  height: 200px !important;

  .ticketing-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 4rem;
    padding: 1.6rem 1.6rem 1.7rem;
    background: rgba(235, 235, 235, 0.4);

    .left {
      display: flex;
      align-items: center;
    }

    i {
      margin-right: 0.8rem;
      font-size: 2rem;
    }

    p {
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 1.2rem;

      strong {
        display: inline-flex;
        transform: translateY(0.1rem);
        font-weight: 700;
      }
    }
  }
}

@media screen and (min-width: 768px) {
  .container {
    display: flex;
    margin-bottom: 12.6rem;
    margin-top: 4.8rem;

    > div {
      width: 34.8rem;
      padding-right: 14.8rem;
    }

    > section {
      flex: 1 0 0;
    }
  }

  .ticketing-head {
    h2 {
      font-size: 3.2rem;
      font-weight: 500;
      line-height: 150%;
    }
  }

  .ticketing-body {
    margin-top: 2.6rem;
    margin-bottom: 2.6rem;
    .ticketing-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 2rem;
      padding: 1.6rem 2rem;

      i {
        font-size: 2.4rem;
      }

      p {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 160%;
      }

      a {
        font-size: 1.4rem;
        line-height: 160%;

        i {
          margin-left: 0.4rem;
          margin-right: 0;
          font-size: 2.4rem;
        }
      }
    }
  }

  .box-contents {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .box-membership {
      max-width: 35%;
    }
  }

  .head {
    font-size: 2rem;
    font-weight: 700;
    padding-left: 8px;
    border-left: 5px solid var(--color-u-primary);
    margin-bottom: 2rem;
  }
}
.membership_info {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  width: 100%;
  height: 100%;
  max-height: 300px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #e6e6e6;
  background-color: #fff;
}
.membership_icon {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 30px;
  height: 30px;
  margin-top: 20px;
  margin-left: 1.2rem;
}
.name_membership {
  display: flex;
  flex-direction: column;
  width: 500px;
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 40px;
}
// .name_membership > div > p,
// .name_membership > div > div {
//   margin-bottom: 1rem;
// }
.name_class {
  font-size: 1.5em;
  margin-bottom: 3rem !important;
}
.mileage_condition {
  display: flex;
  flex-direction: row;
  gap: 50px;
  color: #111111;
}
.mileage_description {
  color: #666666;
}
.benefit-hover-wrapper {
  position: relative;
  display: inline-block;
}
.benefit-hover-wrapper.push-right {
  margin-left: auto;
}

.membership_benefit {
  background-color: #111111 !important;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  min-width: 90px;
  min-height: 30px;
  cursor: pointer;
}
.transparent-modal {
  position: absolute;
  transform: translateX(-50%); /* 중앙 정렬 */
  left: 50%;
  top: calc(100% + 10px); /* 버튼 하단에서 10px 띄움 */
  z-index: 10;
  pointer-events: auto;
}
.modal_title {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.modal_icon {
  display: flex;
  flex-direction: row;
}
.modal_name {
  font-size: 17px;
  display: flex;
  flex-direction: row;
}
.coupon_summary {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding-left: 30px;
  border-left: 1px solid #ccc;
  margin-top: 30px;
}
.show_coupon {
  --row-height: 24px;

  display: flex;
  flex-direction: column;
  gap: 4.5rem;
  padding-left: 30px;
  margin-top: 25px;
  margin-left: 60px;
  font-weight: bold;
  font-size: 16px;
}
.coupon-section {
  width: 100%;
  box-sizing: border-box;
}
.tabs {
  display: flex;
}
.tabs button {
  flex: 1;
  padding: 12px;
  border: none;
  background: #fff;
  font-weight: bold;
  color: #000;
  border-bottom: 1px solid #d9d9d9;
  cursor: pointer;
}

.tabs button.active {
  border-bottom: 2px solid #000;
  background: #fff;
}
.filter-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 8px 0;
  gap: 4px;
}
.filter-area button {
  flex: 1;
  min-width: 110px;
  padding: 6px 12px;
  text-align: center;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  cursor: pointer;
}

.filter-area button.selected {
  background: #ffffff;
  border-color: #111111;
}
.date-range {
  display: flex;
  align-items: center;
  gap: 6px;
  ::v-deep(.date-picker) {
    .data-input {
      padding: 0 3rem 0 1.6rem;
      border: 1px solid #ccc;
      background-color: #fff;
      font-size: 1.4rem;
      max-height: 32.8px;
    }

    &.is-active .data-input {
      border-color: #111111;
    }
  }
}
.filter-submit {
  background-color: #111111 !important;
  color: #ffffff;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  max-width: 50px;
  cursor: pointer;
}
.coupon-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-top: 1px solid #111111;

  th,
  td {
    padding: 12px;
    text-align: center;
    word-wrap: break-word;
  }

  th {
    border-top: 1px solid #111111;
    border-bottom: 1px solid #d9d9d9;
  }

  td {
    border-top: 1px solid #d9d9d9;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 200px;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 400px;
  }
  td:nth-child(2) {
    text-align: left;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 200px;
  }

  th:nth-child(4),
  td:nth-child(4),
  th:nth-child(5),
  td:nth-child(5) {
    width: 80px;
  }
  ::v-deep(.coupon-card .coupon-detail) {
    text-align: left;
  }
  .coupon-list {
    display: flex;
    flex-direction: row;
    margin-top: 2rem;
    padding: auto;
  }
}
// ::v-deep(.coupon-card) {
//   border-bottom: 1px solid #e6e6e6;
//   margin-bottom: 0;
// }
::v-deep(.pagination) {
  margin-top: 2.6rem !important;
}
/* UModal 중앙정렬 해제(유지) */
.modal-no-center :deep(.modal-inner) {
  position: static !important;
  top: auto !important;
  left: auto !important;
  transform: none !important;
}

/* 호버 팝업일 때 UModal 오버레이를 없애기 */
.modal-no-center :deep(.modal-wrap.background-white) {
  position: static !important; /* fixed 해제 */
  top: auto !important;
  left: auto !important;
  width: auto !important; /* 전체화면 덮지 않도록 */
  height: auto !important;
  background: transparent !important;
  pointer-events: none !important; /* 오버레이는 이벤트 막지 않게 */
  z-index: auto !important;
}

/* 실제 내용은 이벤트 받도록 */
.modal-no-center :deep(.modal-wrap .modal-inner) {
  position: static !important;
  transform: none !important;
  pointer-events: auto !important;
}

/* 팝업 위치는 버튼 기준 중앙 아래로 고정 */
.benefit-hover-wrapper {
  position: relative;
  display: inline-block;
}
.transparent-modal {
  position: absolute;
  left: 50% !important;
  top: calc(100% + 10px) !important;
  transform: translateX(-50%) !important;
  z-index: 10;
}
</style>
