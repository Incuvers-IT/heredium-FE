<template>
  <div>
    <STitle emoji="page">쿠폰 설정</STitle>
    <div class="mb-36">
      <h3 class="mb-16">쿠폰 설정</h3>
      <div class="setting-coupon">
        <CouponEditor
          :coupon="couponData"
          :is-issuance="true"
          :error="feedback"
          @update-coupon="(e) => handleUpdateCoupon(e)"
        />
        <div class="box-button">
          <SButton button-type="primary" @click="handleAddCoupon()">검색</SButton>
          <SButton>초기화</SButton>
        </div>
      </div>
    </div>
    <div class="mb-28">
      <h3 class="mb-16">계정 리스트</h3>
      <div class="search mb-24">
        <div class="mb-24">
          <SDropdown v-model="queryOptions.searchDateType" :option-list="dateOptionList" class="mr-16" />
          <SDatepicker v-model="queryOptions.signUpDateFrom" :max="queryOptions.signUpDateTo" />
          <span class="ml-8 mr-8">~</span>
          <SDatepicker v-model="queryOptions.signUpDateTo" :min="queryOptions.signUpDateFrom" />
        </div>
        <div class="mb-24">
          <label>상태</label>
          <SCheckbox v-model="queryOptions.hasNumberOfEntries">입장횟수</SCheckbox>
          <SCheckbox v-model="queryOptions.alreadyLoginedBefore">최근 로그인</SCheckbox>
          <SCheckbox v-model="queryOptions.hasMembership">멤버십</SCheckbox>
          <SCheckbox v-model="queryOptions.alreadyUsedCouponBefore">쿠폰 발급 여부</SCheckbox>
        </div>
        <div>
          <SSearchBar v-model="queryOptions.text" @search="onUserSearch()" />
          <SButton button-type="primary" @click="onUserSearch()">검색</SButton>
          <SButton @click="onUserSearch(true)">초기화</SButton>
        </div>
      </div>
    </div>
    <div class="bottom-div">
      <div class="title-menu">
        <div class="left">
          <SButton button-type="primary" @click="addUser"> + 선택추가</SButton>
        </div>
        <div class="right">
          <SButton class="mr-16">엑셀 일괄업로드</SButton>
          <SButton class="mr-16">엑셀 다운로드</SButton>
          <SDropdown v-model="queryOptions.size" :option-list="optionList" @change="onSizeChange">리스트 수:</SDropdown>
        </div>
      </div>
      <SPageable :table-data="tableData" @getTableData="changePage">
        <template #data="{ data }">
          <table class="admin-table">
            <thead>
              <tr>
                <th>
                  <SCheckbox v-model="isCheckedAll" @input="setCheckedAll" />
                </th>
                <th>NO</th>
                <th>멤버십</th>
                <th>아이디</th>
                <th>이름</th>
                <th>연락처</th>
                <th>최근로그인</th>
                <th>입장횟수</th>
                <th>생성일시</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!data || !data[0]">
                <td colspan="9"><div>리스트가 없습니다.</div></td>
              </tr>
              <tr v-for="(item, index) in data" :key="item.id" @click="item.isChecked = !item.isChecked">
                <td>
                  <div>
                    <SCheckbox v-model="item.isChecked" />
                  </div>
                </td>
                <td>
                  <div>{{ tableData.startCount - index }}</div>
                </td>
                <td>
                  <div class="text-left">{{ item.membershipName }}</div>
                </td>
                <td>
                  <div>{{ item.id }}</div>
                </td>
                <td>
                  <div class="text-left">{{ item.name }}</div>
                </td>
                <td>
                  <div>{{ item.phone }}</div>
                </td>
                <td>
                  <div>{{ item.lastLoginDate }}</div>
                </td>
                <td>
                  <div class="text-right">{{ item.numberOfEntries }}</div>
                </td>
                <td>
                  <div>{{ item.createdDate }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </SPageable>
    </div>
    <div class="mb-36">
      <div class="title-menu">
        <div class="left">
          <h3>선택 계정 리스트</h3>
          <span class="ml-8">({{ selectedData.userList.length }}/{{ selectedData.maxCount }})</span>
        </div>
        <div class="right">
          <SButton button-type="transport-b" class="mr-8" @click="removeSelectedUser(true)">전체 삭제</SButton>
          <SButton button-type="transport-b" class="mr-16" @click="removeSelectedUser()">삭제</SButton>
          <SDropdown v-model="selectedData.pageSize" :option-list="optionList" @change="onSelectSizeChange"
            >리스트 수:</SDropdown
          >
        </div>
      </div>
      <SPagination
        :table-wrap-class="'admin-table-wrap'"
        :table-data="selectedUserList"
        :table-option="{ currentPage: selectedData.tablePage, pageSize: selectedData.pageSize }"
        @onPageChange="onPageChange"
      >
        <template #data="{ data }">
          <table class="admin-table">
            <thead>
              <tr>
                <th>
                  <SCheckbox v-model="selectedData.isCheckedAll" @input="setSelectedCheckedAll" />
                </th>
                <th>NO</th>
                <th>멤버십</th>
                <th>아이디</th>
                <th>이름</th>
                <th>연락처</th>
                <th>최근로그인</th>
                <th>입장횟수</th>
                <th>생성일시</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!data || !data[0]">
                <td colspan="9"><div>리스트가 없습니다.</div></td>
              </tr>
              <tr v-for="item in data" :key="item.id" @click="onSelectedCheck(item.id)">
                <td>
                  <div>
                    <SCheckbox v-model="item.isChecked" />
                  </div>
                </td>
                <td>
                  <div>{{ item.index }}</div>
                </td>
                <td>
                  <div class="text-left">{{ item.membershipName }}</div>
                </td>
                <td>
                  <div>{{ item.id }}</div>
                </td>
                <td>
                  <div class="text-left">{{ item.name }}</div>
                </td>
                <td>
                  <div>{{ item.phone }}</div>
                </td>
                <td>
                  <div>{{ item.lastLoginDate }}</div>
                </td>
                <td>
                  <div class="text-right">{{ item.numberOfEntries }}</div>
                </td>
                <td>
                  <div>{{ item.createdDate }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </SPagination>
    </div>
    <div class="bottom">
      <SButton button-type="primary" :disabled="isConfirmPending" @click="handleOpenModalConfirm">발급</SButton>
    </div>
    <SDialogModal :is-show="isShowErrorModal" @close="isShowErrorModal = false">
      <template #content>{{ errorMsg }}</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="isShowErrorModal = false">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="isShowDoneModal" @close="refreshPage">
      <template #content>쿠폰이 발급되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="refreshPage">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="isConfirmSave" @close="isConfirmSave = false">
      <template #content>변경 사항을 저장하시겠습니까?</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="issuedTicket()">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import STitle from '~/components/admin/commons/STitle';
import SPageable from '~/components/admin/commons/SPageable';
import SButton from '~/components/admin/commons/SButton';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SDropdown from '~/components/admin/commons/SDropdown';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SCheckbox from '~/components/admin/commons/SCheckbox';
import { threeCommaNum } from '~/assets/js/commons';
import SPagination from '~/components/admin/commons/SPagination';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import CouponEditor from '~/components/admin/page/membership/CouponEditor.vue';
import { API_ERROR } from '~/utils/message';
import { COUPON_DEFAULT } from '~/assets/js/types';

export default {
  name: 'CouponPage',
  components: {
    SDialogModal,
    SPagination,
    SCheckbox,
    SDatepicker,
    SDropdown,
    STitle,
    SPageable,
    SButton,
    SSearchBar,
    CouponEditor
  },
  layout: 'admin/default',
  data() {
    return {
      couponData: {},
      couponUsingId: null,
      feedback: {},
      dateOptionList: [{ value: 'CREATED_DATE', label: '등록일시' }],
      queryOptions: {
        page: 0,
        size: 5,
        searchDateType: 'CREATED_DATE',
        signUpDateFrom: '',
        signUpDateTo: '',
        hasNumberOfEntries: false,
        alreadyLoginedBefore: false,
        alreadyUsedCouponBefore: false,
        hasMembership: false,
        text: '',
        excludeIds: []
      },
      tableData: null,
      isCheckedAll: false,
      optionList: [
        { value: 5, label: '5개' },
        { value: 20, label: '20개' },
        { value: 50, label: '50개' }
      ],
      selectedData: {
        maxCount: 500,
        searchText: '',
        isCheckedAll: false,
        tablePage: 0,
        pageSize: 5,
        userList: []
      },
      searchSelectText: '',
      errorMsg: '',
      isShowErrorModal: false,
      isShowDoneModal: false,
      isConfirmPending: false,
      isConfirmSave: false
    };
  },

  computed: {
    selectedUserList() {
      const searchText = this.searchSelectText;
      let userList = this.selectedData.userList;

      if (searchText) {
        userList = userList.filter(
          (user) => user.email.includes(searchText) || user.name.includes(searchText) || user.phone.includes(searchText)
        );
      }

      return userList.map((user, index) => ({
        ...user,
        index: index + 1
      }));
    }
  },
  watch: {
    'tableData.content': {
      deep: true,
      handler(newValue) {
        this.isCheckedAll = newValue.length > 0 ? newValue.every((item) => item.isChecked) : false;
      }
    },
    selectedUserList: {
      deep: true,
      handler(newValue) {
        const startIndex = this.selectedData.pageSize * this.selectedData.tablePage;
        const targetList = newValue.slice(startIndex, this.selectedData.pageSize);

        this.selectedData.isCheckedAll = targetList.length > 0 ? targetList.every((item) => item.isChecked) : false;
      }
    }
  },
  mounted() {
    this.fetch();
  },
  created() {
    this.couponData = cloneDeep(COUPON_DEFAULT);
  },
  methods: {
    validateCouponItem(couponItem) {
      const feedback = {};
      if (!couponItem?.name) {
        feedback.name = true;
      }
      if (!couponItem?.start_date) {
        feedback.start_date = true;
      }
      if (!couponItem?.end_date) {
        feedback.end_date = true;
      }
      if (!couponItem?.coupon_type) {
        feedback.couponType = true;
      }
      if (!couponItem?.discount_percent || isNaN(Number(couponItem?.discount_percent))) {
        feedback.discountPercent = true;
      } else if (Number(couponItem?.discount_percent) > 100) {
        feedback.discountPercent = true;
      }
      if (!couponItem?.image_url) {
        feedback.imageUrl = true;
      }
      if (!couponItem?.is_permanent) {
        if (!couponItem?.number_of_uses || isNaN(Number(couponItem?.number_of_uses))) {
          feedback.numberOfUses = true;
        }
      }
      if (isEmpty(feedback)) {
        return null;
      }
      return feedback;
    },
    handleUpdateCoupon(newCouponData) {
      this.couponData = cloneDeep(newCouponData);
    },
    async handleAddCoupon() {
      const feedback = this.validateCouponItem(this.couponData);

      const startDate = this.couponData.start_date
        ? this.$dayjs(this.couponData.start_date).format('YYYY-MM-DD 00:00:00')
        : '';

      const endDate = this.couponData.end_date
        ? this.$dayjs(this.couponData.end_date).format('YYYY-MM-DD 23:59:59')
        : '';

      const payload = { ...this.couponData, start_date: startDate, end_date: endDate, period_in_days: null };

      if (isEmpty(feedback)) {
        try {
          const response = await this.$axios.post('/admin/coupons/non-membership', payload);
          this.couponUsingId = response?.data;
          this.feedback = {};
          this.couponData = cloneDeep(COUPON_DEFAULT);
        } catch (error) {
          alert(API_ERROR);
        }
      } else {
        this.feedback = feedback;
      }
    },
    async fetch() {
      const signUpDateFrom = this.queryOptions.signUpDateFrom
        ? this.$dayjs(this.queryOptions.signUpDateFrom).format('YYYY-MM-DD 00:00:00')
        : '';
      const signUpDateTo = this.queryOptions.signUpDateTo
        ? this.$dayjs(this.queryOptions.signUpDateTo).format('YYYY-MM-DD 23:59:59')
        : '';

      try {
        this.tableData = await this.$axios.$get('/admin/accounts/with-membership', {
          params: {
            ...this.queryOptions,
            signUpDateFrom,
            signUpDateTo
          }
        });
        this.tableData = {
          ...this.tableData,
          startCount: this.tableData.totalElements - this.tableData.number * this.tableData.size,
          content: this.tableData.content.map((item) => ({ ...item, isChecked: false }))
        };
      } catch (error) {
        alert(API_ERROR);
      }
    },
    setCheckedAll(newValue) {
      this.tableData.content = this.tableData.content.map((info) => ({
        ...info,
        isChecked: newValue
      }));
    },
    setSelectedCheckedAll(newValue) {
      this.selectedData.userList = this.selectedData.userList.map((info) => ({
        ...info,
        isChecked: newValue
      }));
    },
    getThreeCommaNum(num) {
      return threeCommaNum(num);
    },
    changePage(page) {
      this.queryOptions.page = page;
      this.fetch();
    },
    onUserSearch(isReset) {
      if (isReset) {
        this.queryOptions = {
          page: 0,
          size: 5,
          signUpDateFrom: '',
          signUpDateTo: '',
          hasNumberOfEntries: false,
          alreadyLoginedBefore: false,
          alreadyUsedCouponBefore: false,
          hasMembership: false,
          text: '',
          excludeIds: []
        };
      }
      this.queryOptions.page = 0;
      this.fetch();
    },
    addUser() {
      const targetUserList = this.tableData.content.filter((item) => item.isChecked);

      targetUserList.forEach((value) => {
        this.queryOptions.excludeIds.push(value.id);
        this.selectedData.userList.push({
          ...value,
          isChecked: false
        });
      });
      this.selectedData.userList = this.selectedData.userList.map((item, index) => ({ ...item, index: index + 1 }));
      this.fetch();
    },
    removeSelectedUser(isAll) {
      const selectedUserList = [...this.selectedData.userList].filter((user) => user.isChecked);

      if (isAll) {
        this.queryOptions.excludeIds = [];
        this.selectedData.userList = [];
      } else {
        selectedUserList.forEach((user) => {
          const { id } = user;
          const excludeTargetIndex = this.queryOptions.excludeIds.findIndex((item) => item.id === id);
          const selectedTargetIndex = this.selectedData.userList.findIndex((item) => item.id === id);

          this.queryOptions.excludeIds.splice(excludeTargetIndex, 1);
          this.selectedData.userList.splice(selectedTargetIndex, 1);
        });
      }
      this.selectedData.tablePage = 0;
      this.fetch();
    },
    onSelectedCheck(id) {
      const target = this.selectedData.userList.find((item) => item.id === id);

      target.isChecked = !target.isChecked;
    },
    onPageChange(page) {
      this.selectedData.tablePage = page;
      this.selectedData.isCheckedAll = false;
    },
    onSizeChange() {
      this.selectedData.tablePage = 0;
      this.fetch();
    },
    onSelectSizeChange() {
      this.selectedData.tablePage = 0;
      this.selectedData.isCheckedAll = false;
    },
    onSelectSearch(isReset) {
      if (isReset) {
        this.selectedData.searchText = '';
      }
      this.selectedData.tablePage = 0;

      this.searchSelectText = this.selectedData.searchText;
    },
    isValidate() {
      let isValid = false;
      let msg = '';
      if (this.queryOptions.excludeIds.length === 0) {
        msg = '계정를 선택해 주세요.';
      } else if (this.queryOptions.excludeIds.length > 500) {
        msg = '초대권은 한번에 최대 500명에게 발급 가능합니다.';
      } else {
        isValid = true;
      }

      if (!isValid) {
        this.errorMsg = msg;
        this.isShowErrorModal = true;
      }

      return isValid;
    },
    handleOpenModalConfirm() {
      this.isConfirmSave = true;
    },
    async issuedTicket() {
      this.isConfirmPending = true;
      if (this.isValidate()) {
        try {
          await this.$axios.$post('/admin/coupons/assign', {
            account_ids: this.queryOptions.excludeIds,
            coupon_id: this.couponUsingId
          });

          this.isConfirmSave = false;
          this.isShowDoneModal = true;
        } catch (error) {
          alert(API_ERROR);
        }
      }
      this.isConfirmPending = false;
    },
    refreshPage() {
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.setting-coupon {
  background-color: white;
  padding: 2.8rem 3.2rem;

  .box-button {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 8px;
  }
}
.search {
  width: 100%;
  padding: 2.8rem 3.2rem;
  background: #ffffff;
  box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.06);
  border-radius: 0.3rem;

  > div {
    display: flex;
    align-items: center;
  }

  > div:not(:last-child) {
    padding-bottom: 2.4rem;
    border-bottom: 1px solid var(--color-grey-2);
  }

  label {
    font-weight: 500;
    margin-right: 2.8rem;
  }

  button + button {
    margin-left: 0.8rem;
  }

  .view-count {
    margin-left: 1.2rem;
    margin-right: 0.8rem;
  }
}

.search-b {
  display: flex;
  width: 100%;
  padding: 2.8rem 3.2rem;
  background: #ffffff;
  box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.06);
  border-radius: 0.3rem;

  label {
    margin-right: 2.8rem;
  }

  button + button {
    margin-left: 0.8rem;
  }
}

.title-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.6rem;

  .left {
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;
  }
}

.member-price {
  margin-top: 3.3rem;

  input {
    margin-right: 0.8rem;
  }
}

.bottom-div {
  border-bottom: 1px solid var(--color-grey-2);
  padding-bottom: 3.2rem;
  margin-bottom: 3.2rem;
}

.bottom {
  display: flex;
  justify-content: flex-end;
}

.admin-table {
  th {
    &:first-of-type {
      width: 4%;
    }
    &:nth-of-type(2) {
      width: 6%;
    }
    &:nth-of-type(3) {
      width: 15%;
    }
    &:nth-of-type(4) {
      width: 6%;
    }
    &:nth-of-type(5) {
      width: 9%;
    }
    &:nth-of-type(6) {
      width: 12%;
    }
    &:nth-of-type(7) {
      width: 12%;
    }
    &:nth-of-type(8) {
      width: 10%;
    }
    &:last-of-type {
      width: 15%;
    }
  }
}
</style>
