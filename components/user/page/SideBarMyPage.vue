<template>
  <div>
    <h1 class="header only-pc">Mypage</h1>
    <h1 class="header only-mobile">Mypage</h1>
    <section class="tab-sec">
      <div class="only-mobile">
        <div class="tabs page">
          <nuxt-link class="tab" :to="'/mypage/purchase/all'" :class="{ 'nuxt-link-active': isCoffeePurchase }">
            구매내역
          </nuxt-link>
          <NuxtLink class="tab" to="/mypage/info">내 정보 수정</NuxtLink>
        </div>
        <div v-if="isPurchaseRoute" class="tabs grid col-xs-3 mobile-sub-tab">
          <NuxtLink to="/mypage/purchase/all" class="tab">전시·프로그램</NuxtLink>
          <NuxtLink to="/mypage/purchase/coupon" class="tab">쿠폰함</NuxtLink>
          <NuxtLink to="/mypage/purchase/membership" class="tab">멤버십</NuxtLink>
          <!-- <NuxtLink to="/mypage/purchase/coffee" class="tab">커피</NuxtLink> -->
        </div>
      </div>
      <div class="only-pc pc-tabs">
        <h2>구매내역</h2>
        <NuxtLink to="/mypage/purchase/all" class="tab">전시·프로그램</NuxtLink>
        <!-- <NuxtLink to="/mypage/purchase/coffee" class="tab">커피</NuxtLink> -->
        <NuxtLink to="/mypage/purchase/membership_pc" class="tab">멤버십</NuxtLink>
        <NuxtLink to="/mypage/purchase/coupon_pc" class="tab">쿠폰함</NuxtLink>
        <NuxtLink to="/mypage/info" class="big-tab">내 정보 수정</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SideBarMyPage',
  computed: {
    isCoffeePurchase() {
      const pathElementList = this.$route.path.split('/');

      return (
        (pathElementList.includes('purchase') && pathElementList.includes('coffee')) ||
        (pathElementList.includes('purchase') && pathElementList.includes('membership'))
      );
    },
    isPurchaseRoute() {
      return this.$route.path.startsWith('/mypage/purchase');
    }
  }
};
</script>

<style scoped lang="scss">
h1 {
  margin: 3.2rem 0 4rem;
  font-size: 5rem;
  font-weight: 700;
  line-height: 2.8rem;
}

.tabs {
  &.page {
    display: flex;
    margin-bottom: 2rem;

    .tab {
      font-size: 1.8rem;
      font-weight: 500;
      line-height: 1.8rem;
      color: var(--color-grey-4);
      padding: 12px;
      text-align: center;
      flex: 1;
      border-bottom: 1px solid #e5e7eb;

      &.nuxt-link-active {
        color: var(--color-u-primary);
        font-weight: 700;
        border-bottom: 2px solid var(--color-u-primary); 
      }
    }
  }

  &.grid {
    margin-bottom: 4rem;

    .tab + .tab {
      border-left: none;
    }

    .tab {
      padding: 8px;
      border: 0.1rem solid var(--color-grey-2);
      font-size: 1.1rem;
      font-weight: 700;
      line-height: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-grey-3);
      text-align: center;

      &.nuxt-link-active {
        background-color: var(--color-u-primary);
        color: var(--color-white);
      }
    }
  }
}

@media screen and (min-width: 768px) {
  h1 {
    margin: 0 0 4.7rem;
    font-size: 4.2rem;
    line-height: 150%;
  }

  .pc-tabs {
    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 160%;
      letter-spacing: 0.25px;
      padding-bottom: 1rem;
      margin-bottom: 1.3rem;
    }

    a {
      display: block;
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 160%;
      letter-spacing: 0.25px;
      margin-bottom: 2.6rem;

      &.nuxt-link-active {
        color: black;
        font-weight: 700;
        border-bottom: 2px solid black;
        padding-bottom: 0.4rem; /* 밑줄과 텍스트 간 적당한 여백 */
        margin-bottom: 1.8rem; /* 기존 마진에서 밑줄 두께(2px)+여백(4px)만큼 줄여줍니다 */
      }

      &.big-tab {
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 160%;
        letter-spacing: 0.25px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  h1.header.only-mobile {
    font-size: 2.8rem; // 원하는 크기로 조정 (예: 2.4rem~3.2rem)
    line-height: 140%;
    margin: 2rem 0 3rem; // 필요하면 여백도 함께 줄이기
  }
}
</style>
