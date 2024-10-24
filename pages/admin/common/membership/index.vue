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
