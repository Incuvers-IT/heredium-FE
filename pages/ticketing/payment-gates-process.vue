<template>
  <div />
</template>

<script>
export default {
  name: 'PaymentGatesProcess',
  layout: 'none',
  data() {
    return {
      errReason: ''
    };
  },
  async mounted() {
    const { type, id, userType, orderId, paymentKey, amount } = this.$route.query;
    if (!type || !id || !userType || !paymentKey || !amount) {
      alert('잘못 된 접근 입니다.');
      await this.$router.push('/');
    }

    const apiUrl = this.getApiUrl(userType);
    // TODO: update payType
    let payType = 'NICEPAYMENTS';
    let errReason = '';
    let paymentData = null;

    if (this.$store.state.deviceInfo.isApp) {
      if (this.$store.state.deviceInfo.isIOS) {
        payType = 'NICEPAYMENTS_IOS';
      } else if (this.$store.state.deviceInfo.isAndroid) {
        payType = 'NICEPAYMENTS_ANDROID';
      }
    }
    const data = {
      payRequest: {
        orderId,
        paymentKey,
        amount: Number(amount),
        type: payType
      }
    };

    paymentData = await this.$axios.$post(apiUrl, data).catch((err) => {
      const errorMessage = err.response.data?.MESSAGE || '';

      if (errorMessage === 'DATA_NOT_FOUND') {
        errReason = '주문번호를 찾을 수 없습니다.';
      } else if (errorMessage === 'BAD_REQUEST') {
        /**
         * TOSS 자체 에러코드
         * https://docs.tosspayments.com/reference/error-codes#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
         */
        const { code, message } = err.response.data.BODY;

        if (code === 'ALREADY_PROCESSED_PAYMENT') {
          errReason = '이미 완료된 결제 입니다.';
        } else {
          errReason = message;
        }
      } else if (errorMessage === 'BAD_VALID') {
        const state = err.response.data.STATE;

        if (state === 1) {
          errReason = '구매가능한 티켓(4개)을 초과하였어요.';
        } else if (state === 2) {
          errReason = '전시 시작일과 종료일 사이에 존재하지 않는 회차에요.';
        } else if (state === 3) {
          errReason = '예매 오픈일이 지나지 않았거나 회차 시작일이 2주 미만인 티켓이 아니에요.';
        } else if (state === 4) {
          errReason = '회차 종료 1시간 전까지만 예매가 가능해요.';
        } else if (state === 5) {
          errReason = '아쉽지만 선택한 회차가 매진되었어요. 덜 붐비는 회차는 어떠세요?';
        } else {
          errReason = '알수없는 오류. 다시 시도해주세요.';
        }
      } else if (errorMessage === 'DB_ERROR') {
        errReason = '결제오류';
      } else {
        errReason = '알수 없는 오류';
      }

      return null;
    });

    if (paymentData) {
      const paymentDataJSON = JSON.stringify(paymentData);

      await this.$router.push({
        path: '/ticketing/result',
        query: { paymentDataJSON, userType }
      });
    } else if (type && errReason) {
      await this.$router.push({
        name: `ticketing-${type.toLowerCase()}-id`,
        params: {
          id,
          errReason
        }
      });
    }
  },
  methods: {
    getApiUrl(userType) {
      return userType === 'member'
        ? '/user/tickets/user'
        : userType === 'non-member'
        ? '/user/tickets/non-user'
        : '/user/tickets/hana-bank';
    }
  }
};
</script>
