<template>
  <div>
    <STitle emoji="page">쿠폰 설정</STitle>
    <div class="mb-36">
      <h3 class="mb-16">쿠폰 설정</h3>
      <div class="setting-coupon">
        <CouponEditor
          v-if="couponData"
          :coupon="couponData"
          :is-issuance="true"
          :error="feedback"
          :refresh-time="syncCouponDataTime"
          @update-coupon="(e) => handleUpdateCoupon(e)"
        />
        <div class="box-button">
          <SButton button-type="primary" @click="handleSaveCouponIssuancePage">저장</SButton>
          <SButton @click="resetCoupon">초기화</SButton>
        </div>
      </div>
    </div>
    <div class="mb-28">
      <h3 class="mb-16">계정 리스트</h3>
      <div class="search mb-24">
        <div class="mb-24">
          <SDropdown v-model="queryOptions.searchDateType" :option-list="dateOptionList" class="mr-16" />
          <SDatepicker v-model="queryOptions.signUpDateFrom" :max="queryOptions.signUpDateTo" :show-clean-icon="true" />
          <span class="ml-8 mr-8">~</span>
          <SDatepicker v-model="queryOptions.signUpDateTo" :min="queryOptions.signUpDateFrom" :show-clean-icon="true" />
        </div>
        <div class="mb-24">
          <label>상태</label>
          <SCheckbox v-model="queryOptions.hasNumberOfEntries">입장횟수</SCheckbox>
          <SCheckbox v-model="queryOptions.hasMembership">멤버십</SCheckbox>
          <SCheckbox v-model="queryOptions.alreadyDeliveredAdminSiteCoupon">쿠폰 발급 여부</SCheckbox>
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
          <SButton class="mr-16" @click="exportMemberTable">엑셀 다운로드</SButton>
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
                <th>계정</th>
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
              <tr v-for="(item, index) in data" :key="item.id">
                <td>
                  <div>
                    <SCheckbox v-model="item.isChecked" @click="item.isChecked = !item.isChecked" />
                  </div>
                </td>
                <td>
                  <div>{{ exportParams.page * exportParams.size + index + 1 }}</div>
                </td>
                <td>
                  <div>{{ item.membershipName }}</div>
                </td>
                <td>
                  <div>{{ item.email }}</div>
                </td>
                <td>
                  <div>{{ item.name }}</div>
                </td>
                <td>
                  <div>{{ item.phone }}</div>
                </td>
                <td>
                  <div>
                    <p>
                      {{ item?.lastLoginDate && $dayjs(item?.lastLoginDate).format('YYYY-MM-DD') }}
                    </p>
                    <p>
                      {{ item?.lastLoginDate && $dayjs(item?.lastLoginDate).format('HH:mm:ss') }}
                    </p>
                  </div>
                </td>
                <td>
                  <div>{{ item.numberOfEntries }}</div>
                </td>
                <td>
                  <div>
                    <p>
                      {{ item?.createdDate && $dayjs(item?.createdDate).format('YYYY-MM-DD') }}
                    </p>
                    <p>
                      {{ item?.createdDate && $dayjs(item?.createdDate).format('HH:mm:ss') }}
                    </p>
                  </div>
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
        </div>
        <div class="right">
          <SButton button-type="transport-b" class="mr-8" @click="removeSelectedUser(true)">전체 삭제</SButton>
          <SButton button-type="transport-b" class="mr-8" @click="removeSelectedUser()">삭제</SButton>
          <input
            ref="accountFile"
            type="file"
            accept=".xlsx, .XLSX"
            class="is-blind"
            @change="uploadAccountFile($event)"
          />
          <SButton button-type="transport-b" class="mr-8" @click="$refs.accountFile.click()">엑셀 파일 업로드</SButton>
          <SDownloadExcelTemplate
            button-type="transport-b"
            class="mr-16"
            file-name="쿠폰 발급"
            url="/file/template/coupon-issuance/download"
          />
          <SDropdown v-model="selectedData.pageSize" :option-list="optionList" @change="onSelectSizeChange"
            >리스트 수:</SDropdown
          >
        </div>
      </div>
      <SPagination
        :table-wrap-class="'admin-table-wrap'"
        :table-data="selectedData.userList"
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
                <th>계정</th>
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
              <tr v-for="(item, index) in data" :key="item.id">
                <td>
                  <div>
                    <SCheckbox v-model="item.isChecked" />
                  </div>
                </td>
                <td>
                  <div>{{ selectedData.tablePage * selectedData.pageSize + index + 1 }}</div>
                </td>
                <td>
                  <div>{{ item.membershipName }}</div>
                </td>
                <td>
                  <div>{{ item.email }}</div>
                </td>
                <td>
                  <div>{{ item.name }}</div>
                </td>
                <td>
                  <div>{{ item.phone }}</div>
                </td>
                <td>
                  <div>{{ item.lastLoginDate }}</div>
                </td>
                <td>
                  <div>{{ item.numberOfEntries }}</div>
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
      <template #content>쿠폰 발송을 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="issuedTicket()">확인</SButton>
      </template>
    </SDialogModal>
    <UploadAccountIssuance
      v-if="uploadResult"
      :success-cases="uploadResult.success_cases"
      :failed-cases="uploadResult.failed_cases"
      @close="uploadResult = null"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { omit } from 'lodash';
import STitle from '~/components/admin/commons/STitle';
import SPageable from '~/components/admin/commons/SPageable';
import SButton from '~/components/admin/commons/SButton';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SDropdown from '~/components/admin/commons/SDropdown';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SCheckbox from '~/components/admin/commons/SCheckbox';
import { fileValid, threeCommaNum } from '~/assets/js/commons';
import SPagination from '~/components/admin/commons/SPagination';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import CouponEditor from '~/components/admin/page/membership/CouponEditor.vue';
import { API_ERROR } from '~/utils/message';
import { COUPON_DEFAULT } from '~/assets/js/types';
import { downloadMixin } from '~/mixins/donloadMixin';
import { getCouponIssuanceStorage, removeCouponIssuanceStorage, setCouponIssuanceStorage } from '~/utils/storage';
import SDownloadExcelTemplate from '~/components/admin/commons/SDownloadExcelTemplate.vue';
import UploadAccountIssuance from '~/components/admin/modal/UploadAccountIssuance.vue';

const INIT_GET_ACCOUNT_PARAMS = {
  page: 0,
  size: 5,
  searchDateType: 'CREATED_DATE',
  signUpDateFrom: '',
  signUpDateTo: '',
  hasNumberOfEntries: false,
  alreadyLoginedBefore: false,
  alreadyDeliveredAdminSiteCoupon: false,
  hasMembership: false,
  text: '',
  excludeIds: []
};

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
    CouponEditor,
    SDownloadExcelTemplate,
    UploadAccountIssuance
  },
  mixins: [downloadMixin],
  layout: 'admin/default',
  data() {
    return {
      couponData: null,
      syncCouponDataTime: 0,
      couponUsingId: null,
      couponSaved: null,
      feedback: {},
      dateOptionList: [{ value: 'CREATED_DATE', label: '생성일시' }],
      queryOptions: cloneDeep(INIT_GET_ACCOUNT_PARAMS),
      exportParams: cloneDeep(INIT_GET_ACCOUNT_PARAMS),
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
      isConfirmSave: false,
      uploadResult: null
    };
  },

  watch: {
    'tableData.content': {
      deep: true,
      handler(newValue) {
        this.isCheckedAll = newValue.length > 0 ? newValue.every((item) => item.isChecked) : false;
      }
    }
  },
  mounted() {
    const couponIdStored = getCouponIssuanceStorage();
    if (couponIdStored) {
      this.getPageDataSaved(couponIdStored);
    } else {
      this.couponData = cloneDeep(COUPON_DEFAULT);
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    validateCouponItem(couponItem) {
      const feedback = {};
      if (!couponItem?.name) {
        feedback.name = true;
      }

      const today = this.$dayjs().startOf('day');
      const startDate = this.$dayjs(couponItem.start_date, 'YYYY-MM-DD', true);
      const endDate = this.$dayjs(couponItem.end_date, 'YYYY-MM-DD', true);

      if (!couponItem?.start_date || !startDate.isValid()) {
        feedback.start_date = true;
      }
      if (couponItem.start_date && startDate.isBefore(today)) {
        feedback.start_date = true;
      }

      if (!couponItem?.end_date || !endDate.isValid()) {
        feedback.end_date = true;
      }
      if (couponItem.end_date && endDate.isBefore(today)) {
        feedback.end_date = true;
      }

      if (couponItem.start_date && couponItem.end_date && endDate.isBefore(startDate)) {
        feedback.start_date = true;
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
      if (payload.coupon_id) {
        delete payload.coupon_id;
      }

      if (isEmpty(feedback)) {
        try {
          const response = await this.$axios.post('/admin/coupons/non-membership', payload);
          this.feedback = {};
          return response?.data;
        } catch (error) {
          alert(API_ERROR);
          return false;
        }
      } else {
        this.errorMsg = '쿠폰 정보를 모두 입력해 주세요.';
        this.isShowErrorModal = true;
        this.feedback = feedback;
        return false;
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
        this.updateExportParams();
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
          alreadyDeliveredAdminSiteCoupon: false,
          hasMembership: false,
          text: '',
          excludeIds: []
        };
        this.updateExportParams();
      }
      this.queryOptions.page = 0;
      this.fetch();
    },
    addUser() {
      const targetUserList = this.tableData.content.filter((item) => item.isChecked);

      targetUserList.forEach((value) => {
        this.queryOptions.excludeIds.push(value.id);
        this.updateExportParams();
        this.selectedData.userList.push({
          ...value,
          isChecked: false
        });
      });
      this.selectedData.userList = this.selectedData.userList.map((item, index) => ({ ...item, index: index + 1 }));
      const isLastPage = this.tableData?.totalPages === this.queryOptions?.page + 1;
      const isCheckedAllRecord = targetUserList.length && targetUserList.length === this.tableData?.content?.length;
      if (isLastPage && isCheckedAllRecord) {
        this.queryOptions.page = Math.max(0, this.queryOptions.page - 1);
      }
      this.fetch();
    },
    removeSelectedUser(isAll) {
      if (isAll) {
        this.queryOptions.excludeIds = [];
        this.updateExportParams();
        this.selectedData.userList = [];
      } else {
        const selectedUserRemain = [...this.selectedData.userList].filter((user) => !user.isChecked);

        this.selectedData.userList = selectedUserRemain;
        this.queryOptions.excludeIds = selectedUserRemain.map((item) => item.id);
        this.updateExportParams();
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
      if (!this.selectedData?.userList?.length) {
        msg = '계정을 선택해 주세요.';
      } else {
        isValid = true;
      }

      if (!isValid) {
        this.errorMsg = msg;
        this.isShowErrorModal = true;
      }

      return isValid;
    },
    async handleOpenModalConfirm() {
      if (!this.isValidate()) {
        return;
      }
      // IF COUPON IS EDITED THEN CALL API SAVE COUPON
      if (!this.isEqualCouponSaved()) {
        const isAddedCoupon = !!(await this.handleAddCoupon());
        if (!isAddedCoupon) {
          return;
        }
      }

      this.isConfirmSave = true;
    },
    async issuedTicket() {
      this.isConfirmPending = true;
      if (this.isValidate()) {
        try {
          const accountIds = this.selectedData.userList.map((item) => item.id);
          await this.$axios.$post('/admin/coupons/assign', {
            account_ids: accountIds,
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
    },
    updateExportParams() {
      this.exportParams = cloneDeep(this.queryOptions);
    },
    exportMemberTable() {
      const params = cloneDeep(this.exportParams);
      params.signUpDateFrom = params.signUpDateFrom
        ? this.$dayjs(params.signUpDateFrom).format('YYYY-MM-DD 00:00:00')
        : '';
      params.signUpDateTo = params.signUpDateTo ? this.$dayjs(params.signUpDateTo).format('YYYY-MM-DD 23:59:59') : '';
      delete params.page;
      delete params.size;
      params.fileName = '계정리스트';
      this.downloadExcel(params.fileName, '/admin/accounts/with-membership/excel', params);
    },
    resetCoupon() {
      this.couponData = cloneDeep(COUPON_DEFAULT);
      this.syncCouponDataTime = Date.now();
    },
    async handleSaveCouponIssuancePage() {
      if (isEqual(omit(this.couponData, ['tempId']), omit(COUPON_DEFAULT, ['tempId']))) {
        removeCouponIssuanceStorage();
        return;
      }
      if (this.isEqualCouponSaved()) {
        return;
      }
      const couponSaved = await this.handleAddCoupon();
      if (couponSaved) {
        setCouponIssuanceStorage(couponSaved.coupon_id);
        this.couponUsingId = couponSaved.coupon_id;
        couponSaved.start_date = this.$dayjs(couponSaved.start_date).format('YYYY-MM-DD');
        couponSaved.end_date = this.$dayjs(couponSaved.end_date).format('YYYY-MM-DD');
        this.couponData = cloneDeep(couponSaved);
        this.couponSaved = cloneDeep(couponSaved);
        this.syncCouponDataTime = Date.now();
      }
    },
    async getPageDataSaved(couponIdStored) {
      if (!couponIdStored) return false;
      // TODO: get coupon data
      this.couponUsingId = couponIdStored;
      try {
        const couponResponse = await this.$axios.get(`/admin/coupons/${couponIdStored}`);
        const couponData = couponResponse?.data;
        if (!couponData) {
          return false;
        }

        couponData.start_date = this.$dayjs(couponData.start_date).format('YYYY-MM-DD');
        couponData.end_date = this.$dayjs(couponData.end_date).format('YYYY-MM-DD');
        this.couponData = cloneDeep(couponData);
        this.couponSaved = cloneDeep(couponData);

        return true;
      } catch (error) {
        return false;
      }
    },
    async uploadAccountFile(e) {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      const extension = e.target.accept.split(',');
      const isValid = fileValid.check(e.target.files[0], maxSize, extension) !== null;

      if (!isValid) {
        this.isFileError = true;
        return null;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await this.$axios.$post(`/admin/accounts/coupon-issuance/upload`, formData);
        console.log(res);
        this.uploadResult = cloneDeep(res);
        const successCases = res.success_cases || [];
        if (!Array.isArray(successCases)) {
          return;
        }
        for (const account of successCases) {
          if (this.selectedData.userList.some((item) => item.id === account.id)) {
            continue;
          }
          this.selectedData.userList.push(account);
          this.queryOptions.excludeIds.push(account.id);
        }
        this.fetch();
      } catch (error) {
        const errorMessage = error.response.data?.MESSAGE || '';
        switch (errorMessage) {
          case 'INVALID_EXCEL_FILE':
            alert('xlsx 파일을 선택해주세요.');
            break;
          case 'INVALID_EXCEL_COLUMNS':
            alert('업로드된 엑셀 파일의 열이 지정된 템플릿과 일치하지 않습니다.');
            break;
          default:
            alert(API_ERROR);
            break;
        }
      }
      e.target.value = null;
      e.target.files = null;
    },
    isEqualCouponSaved() {
      if (!this.couponSaved || !this.couponData) {
        return false;
      }
      const couponSaved = cloneDeep(this.couponSaved);
      delete couponSaved.coupon_id;
      const currentCoupon = cloneDeep(this.couponData);
      delete currentCoupon.coupon_id;
      return isEqual(couponSaved, currentCoupon);
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
      width: 207px;
      min-width: 207px;
    }
    &:nth-of-type(4) {
      width: 14%;
    }
    &:nth-of-type(5) {
      width: 9%;
    }
    &:nth-of-type(6) {
      width: 10%;
    }
    &:nth-of-type(7) {
      width: 12%;
    }
    &:nth-of-type(8) {
      width: 6%;
    }
    &:last-of-type {
      width: 15%;
    }
  }
}
</style>
