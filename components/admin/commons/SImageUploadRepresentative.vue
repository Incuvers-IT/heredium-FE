<template>
  <div class="representative-img">
    <label class="upload-img" @click.stop>
      <img v-if="imageSrc" :src="imageUri" alt="테스트" />
      <span v-if="!imageSrc" class="file-info">
        <i class="ic-plus mb-28"></i>
        <span class="h4 mb-17">이미지를 등록해주세요.</span>
        <span class="bt-1r">5MB 이하의 JPG, GIF, PNG 파일을 선택해주세요.</span>
        <input type="file" accept=".jpg, .jpeg, .png, .gif" class="is-blind" @change="handleFileUpload($event)" />
      </span>
    </label>
    <SButton v-if="imageSrc" button-type="primary" w-size="small" h-size="small" @click="removeImage"> 삭제 </SButton>

    <SDialogModal :is-show="isFileError" @close="isFileError = false">
      <template #content>5MB이하의 JPG, GIF, PNG 파일을 업로드해주세요.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="isFileError = false">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import SDialogModal from '../modal/SDialogModal.vue';
import SButton from './SButton.vue';
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'ImageUploadRepresentative',
  components: { SDialogModal, SButton },
  mixins: [imageMixin],
  props: {
    imageSrc: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: undefined,
      validator(value) {
        return (
          value === undefined ||
          ['PROJECT_THUMBNAIL', 'EVENT_THUMBNAIL', 'PROJECT_DETAIL_IMAGE', 'SMALL'].includes(value)
        );
      }
    }
  },
  data() {
    return {
      isFileError: false
    };
  },
  computed: {
    imageUri() {
      return this.getImage(this.imageSrc);
    }
  },
  methods: {
    async handleFileUpload(e) {
      const response = await this.handleUploadImage(e, this.type);
      if (response) {
        this.$emit('image-uploaded', response);
      }
      e.target.value = null;
      e.target.files = null;
    },
    removeImage() {
      this.$emit('image-removed');
    }
  }
};
</script>

<style scoped lang="scss">
.representative-img {
  position: relative;
  flex: 1 1 56rem;

  .upload-img {
    position: relative;
    display: block;
    width: 100%;
    height: 0;
    padding-bottom: 63.92857142857143%;
    background-color: rgba(221, 221, 221, 0.5);
    border-radius: 0.3rem;
    cursor: pointer;

    img {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
      object-fit: cover;
      object-position: center;
      background-color: #d9d9d9;
    }

    .file-info {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      i {
        font-size: 6.8rem;
      }
    }
  }

  button {
    position: absolute;
    right: 0.8rem;
    top: 0.8rem;
  }
}
</style>
