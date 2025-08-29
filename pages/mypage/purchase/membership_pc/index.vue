<template>
  <main class="container">
    <SideBarMyPage />
    <section>
      <div class="ticketing-head">
        <h2 class="only-pc">멤버십</h2>
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
                        (membershipBenefit.items.find((item) => item.code === 2)?.usage_threshold || 0) -
                          mileageList.totalMileage
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
          <div v-if="dataMembership.code !== 3" class="mileage_summary">
            <div>현재 나의 마일리지</div>
            <div>소멸 예정 마일리지</div>
          </div>
          <div v-if="dataMembership.code !== 3" class="show_mileage">
            <div class="mileage_total">
              <span style="font-size: 28px"> {{ dataMembership.code === 3 ? '-' : mileageList.totalMileage }} </span>M
            </div>
            <div class="mileage_expire">
              <span style="font-size: 28px"> {{ dataMembership.code === 3 ? '-' : mileageList.expiringMileage }} </span
              >M
            </div>
          </div>
        </div>
      </div>
      <!-- Tab UI -->
      <div class="mileage-section">
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
              <UDatepicker v-model="uiStartDate" :max="uiEndDate" />
              <span>~</span>
              <UDatepicker v-model="uiEndDate" :min="uiStartDate" />
            </div>
          </div>
          <button class="filter-submit" @click="applyPeriodFilter">조회</button>
        </div>

        <!-- 테이블 -->
        <UPageable
          :list-data="mileage_list"
          :show-prev-page="true"
          :show-next-page="true"
          @getListData="(pageIndex) => loadMileageList(pageIndex)"
        >
          <template #data="{ data }">
            <table class="mileage-table">
              <thead>
                <tr>
                  <th>승인일자</th>
                  <th>적립내역</th>
                  <th>유효기간</th>
                  <th>적립</th>
                  <th>차감</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!data || data.length === 0 || dataMembership.code === 3">
                  <td colspan="5">
                    <no-mileage />
                  </td>
                </tr>
                <template v-if="dataMembership.code !== 3">
                  <tr v-for="item in data" :key="item.id">
                    <td>{{ formatDate(item.createdDate) }}</td>
                    <td>{{ formatTypeCategory(item.type, item.category) }}</td>
                    <td>{{ item.expirationDate ? formatDate(item.expirationDate) : '-' }}</td>
                    <td>
                      <b>{{
                        item.type === 6 ? '초기화' : [0, 4, 5].includes(item.type) ? `+${item.mileageAmount}M` : '-'
                      }}</b>
                    </td>
                    <td>
                      <b>{{
                        item.type === 1 ? '초기화' : [2, 3].includes(item.type) ? `${item.mileageAmount}M` : '-'
                      }}</b>
                    </td>
                  </tr>
                </template>
                <template v-if="data.length > 0">
                  <tr v-for="n in 5 - data.length" :key="'empty-' + n" class="placeholder-row">
                    <td colspan="5" style="height: 47px; border: none; background: transparent"></td>
                  </tr>
                </template>
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
import UPageable from '~/components/user/common/UPageable';
import NoMileage from '~/components/user/page/membership/NoMileage.vue';
import UDatepicker from '~/components/user/common/UDatepicker';
import { CATEGORY_STR_TYPE, MILEAGE_EVENT_TYPE } from '~/assets/js/types';
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'MembershipAndCouponPage',
  components: { SideBarMyPage, UPageable, NoMileage, ModalMembershipInfor, UDatepicker },
  mixins: [imageMixin],
  async asyncData({ $axios }) {
    const initialPageSize = 5;
    const dayjs = (await import('dayjs')).default;
    const uiStart = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    const uiEnd = dayjs().format('YYYY-MM-DD');

    const dataMembership = await $axios.$get('/user/membership/info');

    // 최초 로드시 최근 1개월만 조회
    const mileageListRes = await $axios.$get(`/user/membershipMileage/${dataMembership.account_id}`, {
      params: {
        page: 0,
        size: initialPageSize,
        startDate: dayjs(uiStart).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endDate: dayjs(uiEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }
    });

    const membershipBenefit = await $axios.$get('/user/membership/benefit');
    const totalPages = Math.ceil(mileageListRes.totalElements / initialPageSize);

    return {
      dataMembership,
      membershipBenefit,
      mileageList: mileageListRes,
      mileage_list: {
        content: mileageListRes.content,
        totalElements: mileageListRes.totalElements,
        totalPages,
        number: mileageListRes.number,
        size: initialPageSize,
        first: mileageListRes.number === 0,
        last: mileageListRes.number === totalPages - 1
      },

      uiStartDate: uiStart,
      uiEndDate: uiEnd,

      appliedStartDate: uiStart,
      appliedEndDate: uiEnd
    };
  },
  data() {
    return {
      activeTab: 'total',
      tabs: [
        { key: 'total', label: '전체' },
        { key: 'added', label: '적립 마일리지' },
        { key: 'used', label: '차감 마일리지' }
      ],
      filterOptions: ['1개월', '3개월', '6개월', '1년'],
      selectedFilter: '1개월',
      pageSizeForLoad: 5,
      showModal: false,
      hideTimer: null,
      hoverPos: { x: 0, y: 0 }
    };
  },
  watch: {
    activeTab() {
      this.loadMileageList(0);
    }
  },
  methods: {
    async loadMileageList(pageIndex = 0) {
      if (!this.dataMembership) return;
      try {
        const params = {
          page: pageIndex,
          size: this.pageSizeForLoad
        };

        if (this.activeTab === 'added') {
          params.types = [0, 4, 5, 6];
        } else if (this.activeTab === 'used') {
          params.types = [1, 2, 3];
        }
        const start = this.appliedStartDate || dayjs().subtract(1, 'month').format('YYYY-MM-DD');
        const end = this.appliedEndDate || dayjs().format('YYYY-MM-DD');

        params.startDate = dayjs(start).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        params.endDate = dayjs(end).endOf('day').format('YYYY-MM-DD HH:mm:ss');

        const res = await this.$axios.$get(`/user/membershipMileage/${this.dataMembership.account_id}`, { params });

        const totalPages = Math.ceil(res.totalElements / this.pageSizeForLoad);
        this.mileage_list = {
          content: res.content,
          totalElements: res.totalElements,
          totalPages,
          number: res.number,
          size: this.pageSizeForLoad,
          first: res.number === 0,
          last: res.number === totalPages - 1
        };

        this.mileageList = { ...this.mileageList, totalMileage: res.totalMileage };
      } catch (e) {
        console.error(e);
        this.mileage_list = {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: this.pageSizeForLoad,
          first: true,
          last: true
        };
        this.mileageList = { totalMileage: 0 };
      }
    },
    imageSrcByCode(code) {
      const rows = (this.membershipBenefit && this.membershipBenefit.items) || [];
      const row = rows.find((r) => Number(r.code) === Number(code));
      if (row && row.image_url) return this.getImage(row.image_url);
      return null;
    },
    getMembershipLabelByCode(code) {
      const items = (this.membershipBenefit && this.membershipBenefit.items) || [];
      const row = items.find((r) => Number(r.code) === Number(code));
      return row ? row.membership_name || row.name : null;
    },
    formatTypeCategory(type, category) {
      const t = Number(type);
      const typeLabel = MILEAGE_EVENT_TYPE?.[t];
      // type.js를 사용하도록 수정
      const upgradeLabel = this.getMembershipLabelByCode(2);

      if (t === 1) return `[사용] ${upgradeLabel} 등급 업그레이드`;
      if (t === 6) return `[취소] ${upgradeLabel} 등급 취소`;

      if (category !== null && category !== undefined) {
        const catKo = CATEGORY_STR_TYPE[category] || '기타';
        const categoryName = `${catKo}`;

        const isAdded = [0, 4, 5].includes(t);
        const prefix = isAdded ? '[적립]' : '[소멸]';

        const suffixByType = {
          2: '유효기간 경과',
          3: '취소'
        };
        const suffix = suffixByType[t];

        return suffix ? `${prefix} ${categoryName} 구매_${suffix}` : `${prefix} 헤레디움 ${categoryName}`;
      }

      return `[${typeLabel || '알 수 없는 내역'}]`;
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      return dayjs(dateStr).format('YYYY-MM-DD');
    },
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

      const uiStart = start.format('YYYY-MM-DD');
      const uiEnd = now.format('YYYY-MM-DD');
      this.uiStartDate = uiStart;
      this.uiEndDate = uiEnd;

      this.appliedStartDate = uiStart;
      this.appliedEndDate = uiEnd;

      this.loadMileageList(0);
    },
    applyPeriodFilter() {
      this.appliedStartDate = this.uiStartDate;
      this.appliedEndDate = this.uiEndDate;
      this.loadMileageList(0);
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    onHoverIn(e) {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
      this.showModal = true;
    },
    onHoverOut(e) {
      // 버튼 ↔ 팝업 사이 이동일 땐 닫지 않음
      const wrap = this.$refs.benefitWrap;
      const to = e.relatedTarget;
      if (wrap && to && wrap.contains(to)) return;

      this.hideTimer = setTimeout(() => {
        this.showModal = false;
        this.hideTimer = null;
      }, 120); // 살짝 딜레이 주어 자연스럽게
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

@media screen and (min-width: 769px) {
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
.mileage_summary {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding-left: 30px;
  border-left: 1px solid #ccc;
  margin-top: 30px;
  align-items: center !important;
}
.show_mileage {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding-left: 30px;
  margin-top: 30px;
  margin-left: 40px;
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  align-items: center;
}
.mileage-section {
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
.mileage-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

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
    width: 350px;
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
}
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
