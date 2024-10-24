<template>
  <PostForm v-if="initFormData && mode" :post-detail="initFormData" :mode="mode"> </PostForm>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { POST_DETAIL } from '~/assets/js/types';
import PostForm from '~/components/admin/page/membership/PostForm.vue';

export default {
  name: 'EditPost',
  components: {
    PostForm
  },
  layout: 'admin/default',

  data() {
    return {
      mode: null,
      initFormData: null
    };
  },
  computed: {},
  mounted() {
    this.getPostDetail();
  },
  methods: {
    async getPostDetail() {
      try {
        const { data } = await this.$axios.get(`/admin/posts/details`);
        const transformData = data;
        let memberships = transformData.memberships || [];
        memberships = memberships.map((membership) => {
          const membershipId = membership.membership_id;
          if (membershipId) {
            delete membership.membership_id;
          }
          const coupons = membership.coupons.map((coupon) => {
            const couponsId = coupon.coupon_id;
            if (couponsId) {
              delete coupon.coupon_id;
            }
            return {
              ...coupon,
              id: couponsId
            };
          });

          return {
            ...membership,
            id: membershipId,
            coupons
          };
        });
        transformData.memberships = memberships;
        this.initFormData = data;
        this.mode = 'edit';
      } catch (error) {
        if (error.response.status === 404) {
          this.initFormData = cloneDeep(POST_DETAIL);
          this.mode = 'create';
        }
      }
    }
  }
};
</script>
