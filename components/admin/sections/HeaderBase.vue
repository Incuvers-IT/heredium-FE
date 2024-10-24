<template>
  <header>
    <div class="header-top">
      <NuxtLink to="/admin" class="logo-area">
        <img src="~assets/img/logo.svg" alt="로고" />
      </NuxtLink>
      <div class="profile-area">
        <div class="profile-info">
          <h4>
            안녕하세요, <span>{{ adminInfo?.name }}</span
            >님!
          </h4>
          <p class="nt-5">{{ adminInfo?.email }}</p>
        </div>
      </div>
    </div>
    <div class="header-body">
      <nav>
        <div
          v-if="isShowByAuthLevel(['ADMIN', 'SUPERVISOR'])"
          class="depth-nav"
          :class="{ 'is-active': depthNavState.common }"
        >
          <button type="button" @click="onTabToggle('common')">
            <span class="h3">전시 · 프로그램 관리</span>
            <i class="ic-expand-more" />
          </button>
          <div v-show="depthNavState.common" class="depth-menu">
            <NuxtLink to="/admin/common/exhibition">
              <span class="bt-1r">전시</span>
            </NuxtLink>
            <NuxtLink to="/admin/common/docent">
              <span class="bt-1r">도슨트</span>
            </NuxtLink>
            <NuxtLink to="/admin/common/program">
              <span class="bt-1r">프로그램</span>
            </NuxtLink>
            <NuxtLink to="/admin/common/membership">
              <span class="bt-1r">멤버십</span>
            </NuxtLink>
            <NuxtLink to="/admin/common/holiday">
              <span class="bt-1r">휴무일 설정</span>
            </NuxtLink>
          </div>
        </div>
        <div
          v-if="isShowByAuthLevel(['ADMIN', 'SUPERVISOR'])"
          class="depth-nav"
          :class="{ 'is-active': depthNavState.ticket }"
        >
          <button type="button" class="h3" @click="onTabToggle('ticket')">
            <span>티켓 관리</span>
            <i class="ic-expand-more" />
          </button>
          <div v-if="depthNavState.ticket" class="depth-menu">
            <template v-if="isShowByAuthLevel(['ADMIN', 'SUPERVISOR'])">
              <NuxtLink to="/admin/ticket/tickets/all">
                <span class="bt-1r">전체내역</span>
              </NuxtLink>
              <NuxtLink to="/admin/ticket/tickets/exhibition">
                <span class="bt-1r">전시 입장권</span>
              </NuxtLink>
              <NuxtLink to="/admin/ticket/tickets/program">
                <span class="bt-1r">프로그램 입장권</span>
              </NuxtLink>
              <NuxtLink to="/admin/ticket/tickets/group">
                <span class="bt-1r">단체 입장권</span>
              </NuxtLink>
              <NuxtLink to="/admin/ticket/tickets/invitation">
                <span class="bt-1r">초대권</span>
              </NuxtLink>
            </template>
            <template v-if="isShowByAuthLevel(['ADMIN', 'SUPERVISOR'])">
              <NuxtLink to="/admin/ticket/group-view">
                <span class="bt-1r">단체 입장권 발급</span>
              </NuxtLink>
              <NuxtLink to="/admin/ticket/invitation">
                <span class="bt-1r">초대권 발급</span>
              </NuxtLink>
              <NuxtLink to="/admin/ticket/coupon">
                <span class="bt-1r">쿠폰 발급</span>
              </NuxtLink>
            </template>
          </div>
        </div>
        <div
          v-if="isShowByAuthLevel(['ADMIN', 'SUPERVISOR', 'MANAGER'])"
          class="depth-nav"
          :class="{ 'is-active': depthNavState.site }"
        >
          <button type="button" class="h3" @click="onTabToggle('site')">
            <span>사이트 관리</span>
            <i class="ic-expand-more" />
          </button>
          <div v-if="depthNavState.site" class="depth-menu">
            <NuxtLink to="/admin/site/slider">
              <span class="bt-1r">이미지 슬라이드</span>
            </NuxtLink>
            <NuxtLink to="/admin/site/popup">
              <span class="bt-1r">팝업</span>
            </NuxtLink>
            <NuxtLink to="/admin/site/notice">
              <span class="bt-1r">공지사항</span>
            </NuxtLink>
            <NuxtLink to="/admin/site/event">
              <span class="bt-1r">이벤트</span>
            </NuxtLink>
          </div>
        </div>
        <div
          v-if="isShowByAuthLevel(['ADMIN', 'SUPERVISOR'])"
          class="depth-nav"
          :class="{ 'is-active': depthNavState.terms }"
        >
          <button type="button" class="h3" @click="onTabToggle('terms')">
            <span>약관 관리</span>
            <i class="ic-expand-more" />
          </button>
          <div v-if="depthNavState.terms" class="depth-menu">
            <NuxtLink to="/admin/terms/privacy">
              <span class="bt-1r">개인정보처리방침</span>
            </NuxtLink>
            <NuxtLink to="/admin/terms/agree">
              <span class="bt-1r">개인정보 수집 및 이용 동의서</span>
            </NuxtLink>
            <NuxtLink to="/admin/terms/service">
              <span class="bt-1r">서비스 이용약관</span>
            </NuxtLink>
            <NuxtLink to="/admin/terms/refund">
              <span class="bt-1r">취소 및 환불약관</span>
            </NuxtLink>
            <NuxtLink to="/admin/terms/video">
              <span class="bt-1r">영상정보처리기기 운영 관리방침</span>
            </NuxtLink>
          </div>
        </div>
        <div v-if="isShowByAuthLevel(['ADMIN', 'SUPERVISOR'])" class="depth-nav">
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/admin/statistics" class="h3 depth-2" custom>
            <a :class="{ 'nuxt-link-active': isActive }" @click="clearAndGo(navigate, href)">통계</a>
          </NuxtLink>
        </div>
        <div
          v-if="isShowByAuthLevel(['ADMIN', 'SUPERVISOR'])"
          class="depth-nav"
          :class="{ 'is-active': depthNavState.user }"
        >
          <button type="button" class="h3" @click="onTabToggle('user')">
            <span>회원 관리</span>
            <i class="ic-expand-more" />
          </button>
          <div v-if="depthNavState.user" class="depth-menu">
            <NuxtLink to="/admin/user/common">
              <span class="bt-1r">계정리스트</span>
            </NuxtLink>
            <NuxtLink to="/admin/user/membership">
              <span class="bt-1r">멤버십</span>
            </NuxtLink>
            <NuxtLink to="/admin/user/hana">
              <span class="bt-1r">하나1Q 계정 리스트</span>
            </NuxtLink>
            <NuxtLink to="/admin/user/nonactive">
              <span class="bt-1r">휴면 계정리스트</span>
            </NuxtLink>
          </div>
        </div>
        <div v-if="isShowByAuthLevel(['ADMIN'])" class="depth-nav">
          <NuxtLink v-slot="{ isActive, href, navigate }" to="/admin/admin" class="h3 depth-2" custom>
            <a :class="{ 'nuxt-link-active': isActive }" @click="clearAndGo(navigate, href)">관리자</a>
          </NuxtLink>
        </div>
        <div
          v-if="isShowByAuthLevel(['ADMIN', 'SUPERVISOR', 'COFFEE'])"
          class="depth-nav"
          :class="{ 'is-active': depthNavState.coffee }"
        >
          <button type="button" class="h3" @click="onTabToggle('coffee')">
            <span>커피</span>
            <i class="ic-expand-more" />
          </button>
          <div v-if="depthNavState.coffee" class="depth-menu">
            <NuxtLink to="/admin/coffee/manage">
              <span class="bt-1r">커피</span>
            </NuxtLink>
            <NuxtLink to="/admin/coffee/order">
              <span class="bt-1r">커피 주문</span>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>
    <div class="header-bottom">
      <NuxtLink v-slot="{ isActive, href, navigate }" to="/admin/myinfo">
        <a :class="{ 'nuxt-link-active': isActive }" @click="clearAndGo(navigate, href)">
          <i class="ic-settings" />
          <p class="nt-5">Setting</p>
        </a>
      </NuxtLink>
      <div class="divider" />
      <button type="button" @click="onLogout">
        <i class="ic-logout" />
        <span class="nt-5">Logout</span>
      </button>
    </div>
  </header>
</template>

<script>
// auth types: ADMIN | SUPERVISOR | MANAGER | COFFEE | USER
export default {
  name: 'HeaderBase',
  data() {
    return {
      nameValue: '이름테스트',
      depthNavState: {
        common: false,
        ticket: false,
        site: false,
        terms: false,
        user: false,
        coffee: false
      }
    };
  },
  async fetch() {
    const adminUserInfo = await this.$axios.$get('/admin/member/info').catch(() => {});
    this.$store.commit('service/auth/setAdminUserInfo', adminUserInfo);
  },
  computed: {
    adminInfo() {
      return this.$store.getters['service/auth/getAdminUserInfo'];
    }
  },
  created() {
    const firstDepthRoute = this.$route.path.split('/')[2] || null;

    Object.keys(this.depthNavState).forEach((key) => {
      if (firstDepthRoute === key) {
        this.depthNavState[`${key}`] = true;
      }
    });
  },
  methods: {
    clearNavState() {
      Object.keys(this.depthNavState).forEach((key) => {
        this.depthNavState[`${key}`] = false;
      });
    },
    onTabToggle(target) {
      Object.keys(this.depthNavState).forEach((key) => {
        if (target !== key) {
          this.depthNavState[`${key}`] = false;
        }
      });
      this.depthNavState[`${target}`] = !this.depthNavState[`${target}`];
    },
    clearAndGo(navigate, href) {
      this.clearNavState();
      navigate(href);
    },
    onLogout() {
      this.$store.dispatch('service/auth/adminLogout');
      this.$router.push('/admin/login');
    },
    isShowByAuthLevel(allowAuthTypes) {
      return allowAuthTypes.includes(this.adminInfo?.auth);
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin appear {
  animation: fade-in 0.2s;
  animation-fill-mode: forwards;
  display: flex;
}

@mixin disappear {
  animation: fade-out 0.2s;
  animation-fill-mode: forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

header {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  flex-direction: column;
  background-color: var(--color-black);
  overflow-y: auto;

  &::-webkit-scrollbar {
    height: 80%;
    margin-right: 12px;
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-4);
    border-radius: 8px;
  }
  &::-webkit-scrollbar-track {
    background-color: var(--color-grey-1);
  }

  .header-top {
    display: flex;
    flex-direction: column;
    padding: 2.8rem 2.4rem 2.6rem;
    border-bottom: 0.1rem solid rgba(255, 255, 255, 0.1);

    .logo-area {
      padding: 0 0.8rem;
    }

    .profile-area {
      display: flex;
      align-items: center;
      margin-top: 2.6rem;

      .profile-img {
        width: 4rem;
        height: 4rem;
        border-radius: 0.3rem;
        object-fit: cover;
        object-position: center;
      }

      .profile-info {
        width: 100%;

        h4 {
          color: var(--color-white);
        }

        .nt-5 {
          margin-top: 0.5rem;
          color: var(--color-white);
        }
      }
    }
  }

  .header-body {
    flex: 1 1 0;
    padding: 0 2.4rem 3rem;
    .depth-nav {
      padding: 2rem 0;
      &.is-active {
        padding: 2rem 0 1rem;
        button {
          color: var(--color-blue);
          i {
            color: var(--color-blue);
            transform: rotate(180deg);
          }
        }
        .depth-menu {
          @include appear;
        }
      }

      a.depth-2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        text-align: left;
        color: var(--color-white);
        transition: 0.2s all ease-in-out;
        cursor: pointer;

        &.nuxt-link-active {
          color: var(--color-blue);
        }
      }

      button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        text-align: left;
        color: var(--color-white);
        transition: 0.2s all ease-in-out;

        i {
          font-size: 2.4rem;
          transition: 0.2s all ease-in-out;
        }
      }

      .depth-menu {
        @include disappear;
        display: flex;
        flex-direction: column;
        padding: 2rem 0 0;
        color: var(--color-white);

        a {
          display: block;
          width: 100%;
          padding: 0.95rem 1.2rem;

          &:hover {
            text-decoration-line: underline;
          }

          &.nuxt-link-active {
            background: var(--color-blue);
            border-radius: 0.3rem;
          }
        }
      }
    }
  }

  .header-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3rem 3.4rem;

    button,
    a {
      display: flex;
      align-items: center;
      color: var(--color-white);
      cursor: pointer;
      i {
        font-size: 2.4rem;
        margin-right: 0.8rem;
      }

      .nt-5 {
        color: var(--color-white);
      }
    }

    .divider {
      width: 0.1rem;
      height: 2.4rem;
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
