import { fileValid } from '~/assets/js/commons';

export const imageMixin = {
  methods: {
    getImage(imageUrl) {
      return imageUrl && this.$store.state.BASE_URL + imageUrl;
    },
    async handleUploadImage(e, type) {
      const input = e.target;

      if (input.files && input.files[0]) {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;
        const extension = e.target.accept.split(',');
        const isValid = fileValid.check(e.target.files[0], maxSize, extension) !== null;

        if (!isValid) {
          return null;
        }

        const formData = new FormData();
        formData.append('files', file);
        try {
          const response = await this.$axios.$post('/file', formData, {
            params: { type }
          });
          return response;
        } catch (error) {
          return null;
        }
      }
    }
  }
};
