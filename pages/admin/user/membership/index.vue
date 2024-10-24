<template>
  <div>
    <STitle emoji="people">멤버십 회원</STitle>
    <div class="search mb-28">
      <div class="mb-24">
        <SDropdown v-model="queryOptions.searchDateType" class="mr-16" :option-list="dateOptionList" />
        <SDatepicker v-model="queryOptions.startDate" w-size="large" :max="queryOptions.endDate" />
        <span class="ml-8 mr-8">~</span>
        <SDatepicker v-model="queryOptions.endDate" w-size="large" :min="queryOptions.startDate" />
        <SDivLine is-big />
        <SDropdown v-model="queryOptions.gender" class="mr-24" :option-list="genderOptionList">성별:</SDropdown>
        <SDropdown v-model="queryOptions.isMarketingReceive" :option-list="marketingOptionList"
          >마케팅 수신 동의:</SDropdown
        >
      </div>
      <div>
        <SSearchBar v-model="queryOptions.text" @search="onSearch" />
        <SButton button-type="primary" @click="onSearch()">검색</SButton>
        <SButton @click="onSearch(true)">초기화</SButton>
      </div>
    </div>
    <div class="top-menus mb-16">
      <SButton w-size="large" class="mr-16" @click="downloadExcel">엑셀 다운로드</SButton>
      <SDropdown v-model="queryOptions.size" :option-list="pageSizeList" @change="onSelectSizeChange"
        >리스트 수:</SDropdown
      >
    </div>

    <SPageable :table-data="tableData" @getTableData="onChangePage(page)">
      <template #data="{ data }">
        <table class="admin-table">
          <thead>
            <tr>
              <th>No</th>
              <th>멤버십 구분</th>
              <th>아이디</th>
              <th>이름</th>
              <th>연락처</th>
              <th>결제상태</th>
              <th>결제일시</th>
              <th>멤버십횟수</th>
              <th>전시사용횟수</th>
              <th>프로그램사용횟수</th>
              <th>음료사용횟수</th>
              <th>성별</th>
              <th>마케팅수신동의</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td colspan="13"><div>리스트가 없습니다.</div></td>
            </tr>
            <template>
              <tr v-for="(item, index) in data" :key="item.id">
                <td>
                  <div>{{ tableData.startCount - index }}</div>
                </td>
                <td>
                  <div>{{ item.membership_name }}</div>
                </td>
                <td>
                  <div class="text-left">{{ item.id }}</div>
                </td>
                <td>
                  <div>{{ item.name }}</div>
                </td>
                <td>
                  <div>{{ item.phone }}</div>
                </td>
                <td>
                  <div>{{ item.payment_status }}</div>
                </td>
                <td>
                  <div>{{ item.payment_date }}</div>
                </td>
                <td>
                  <div>{{ item.number_of_membership }}</div>
                </td>
                <td>
                  <div>{{ item.number_of_display_used }}</div>
                </td>
                <td>
                  <div>{{ item.number_of_program }}</div>
                </td>
                <td>
                  <div>{{ item.number_of_drink }}</div>
                </td>
                <td>
                  <div>{{ item.gender }}</div>
                </td>
                <td>
                  <div>{{ item.isMarketingReceive ? '동의' : '미동의' }}</div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </template>
    </SPageable>
  </div>
</template>

<script>
import STitle from '~/components/admin/commons/STitle';
import SDropdown from '~/components/admin/commons/SDropdown';
import SButton from '~/components/admin/commons/SButton';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SDivLine from '~/components/admin/commons/SDivLine';
import { GENDER_TYPE, PAGE_SIZE_OPTIONS } from '~/assets/js/types';
import SPageable from '~/components/admin/commons/SPageable';

export default {
  name: 'MembershipUserPage',

  components: { SDatepicker, STitle, SDropdown, SButton, SSearchBar, SDivLine, SPageable },
  directives: {},

  filters: {},
  layout: 'admin/default',
  props: {},
  data() {
    const INIT_QUERY_OPTIONS = {
      page: this.$route.query.page || 0,
      size: Number(this.$route.query.size) || 20,
      text: this.$route.query.text || '',
      searchDateType: this.$route.query.searchDateType || 'CREATED_DATE',
      startDate: this.$route.query.startDate || '',
      endDate: this.$route.query.endDate || '',
      gender: this.$route.query.gender || null,
      isMarketingReceive: this.$route.query.isMarketingReceive || null
    };

    return {
      initQueryOptions: INIT_QUERY_OPTIONS,
      queryOptions: { ...INIT_QUERY_OPTIONS },
      queryOptionsSaved: { ...INIT_QUERY_OPTIONS },
      marketingOptionList: [
        { value: null, label: '전체' },
        { value: true, label: '동의' },
        { value: false, label: '미 동의' }
      ],
      genderOptionList: [
        { value: null, label: '전체' },
        { value: 'man', label: GENDER_TYPE.MAN },
        { value: 'woman', label: GENDER_TYPE.WOMAN }
      ],
      dateOptionList: [
        { value: 'CREATED_DATE', label: '가입일시' },
        { value: 'LAST_LOGIN_DATE', label: '최근 로그인' }
      ],
      pageSizeList: [...PAGE_SIZE_OPTIONS],
      tableData: []
    };
  },
  async fetch() {
    await this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});

    const startDate = this.queryOptions.startDate
      ? this.$dayjs(this.queryOptions.startDate).format('YYYY-MM-DD 00:00:00')
      : '';
    const endDate = this.queryOptions.endDate
      ? this.$dayjs(this.queryOptions.endDate).format('YYYY-MM-DD 23:59:59')
      : '';

    this.tableData = await this.$axios.$get('/admin/accounts/', {
      params: {
        ...this.queryOptions,
        startDate,
        endDate
      }
    });
    this.tableData.startCount = this.tableData.totalElements - this.tableData.number * this.tableData.size;
  },
  methods: {
    onChangePage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.$fetch();
      }
    },
    onSearch(isReset) {
      if (isReset) {
        this.queryOptions = { ...this.initQueryOptions };
      }
      this.queryOptions.page = 0;
      if (!this.$fetchState.pending) {
        this.$fetch();
      }
    },
    onSelectSizeChange(size) {
      if (!this.$fetchState.pending) {
        this.queryOptions.size = size;
        this.$fetch();
      }
    },
    downloadExcel() {
      const fileName = '멤버십 회원';
      const startDate = this.queryOptions.startDate
        ? this.$dayjs(this.queryOptions.startDate).format('YYYY-MM-DD 00:00:00')
        : '';
      const endDate = this.queryOptions.endDate
        ? this.$dayjs(this.queryOptions.endDate).format('YYYY-MM-DD 23:59:59')
        : '';

      this.$axios
        .$get('/admin/accounts/excel', {
          responseType: 'blob',
          params: {
            ...this.queryOptions,
            fileName,
            startDate,
            endDate
          }
        })
        .then((res) => {
          const href = URL.createObjectURL(res);
          const link = document.createElement('a');

          link.href = href;
          link.setAttribute('download', `${fileName}.XLSX`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        });
    }
  }
};
</script>

<style scoped lang="scss">
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

  > div:first-child {
    padding-bottom: 2.4rem;
    border-bottom: 1px solid var(--color-grey-2);
  }

  label {
    margin-right: 2.8rem;
  }

  button + button {
    margin-left: 0.8rem;
  }
}
.top-menus {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.admin-table {
  th {
    /* NO */
    &:first-of-type {
      width: 100px;
      min-width: 100px;
    }
    /* Membership */
    &:nth-of-type(2) {
      width: 15vw;
      min-width: 200px;
    }
    /* ID */
    &:nth-of-type(3) {
      width: 120px;
      min-width: 120px;
    }
    /* Name */
    &:nth-of-type(4) {
      width: 15vw;
      min-width: 200px;
    }
    /* Phone */
    &:nth-of-type(5) {
      width: 120px;
      min-width: 120px;
    }
    /* Payment status */
    &:nth-of-type(6) {
      width: 100px;
      min-width: 100px;
    }
    /* Payment date */
    &:nth-of-type(7) {
      width: 173px;
      min-width: 173px;
    }
    /* Number of membership */
    &:nth-of-type(8) {
      width: 100px;
      min-width: 100px;
    }
    /* Number of display uses */
    &:nth-of-type(9) {
      width: 120px;
      min-width: 120px;
    }
    /* Number of program uses */
    &:nth-of-type(10) {
      width: 120px;
      min-width: 120px;
    }
    /* Number of drink uses */
    &:nth-of-type(11) {
      width: 120px;
      min-width: 120px;
    }
    /* Gender */
    &:nth-of-type(12) {
      width: 120px;
      min-width: 120px;
    }
    /* Agree to receive marketing */
    &:last-of-type {
      width: 100px;
      min-width: 100px;
    }
  }
}
</style>
