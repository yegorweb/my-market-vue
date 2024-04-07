<script setup lang="ts">
import { ref, reactive } from "vue"
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

const uploadInput = ref<HTMLInputElement | null>(null)

let pic = ref<string>('')
let isShowDialog = ref<boolean>(false)
let result = reactive({
  dataURL: '',
  blobURL: '',
})

function selectFile(e: Event) {
  // Reset last selection and results
  pic.value = ''
  result.dataURL = ''
  result.blobURL = ''

  // Get selected files
  const { files } = e.target as HTMLInputElement
  if (!files || !files.length) return

  // Convert to dataURL and pass to the cropper component
  const file = files[0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    // Update the picture source of the `img` prop
    pic.value = String(reader.result)

    // Show the modal
    isShowDialog.value = true

    // Clear selected files of input element
    if (!uploadInput.value) return
    uploadInput.value.value = ''
  }
}
async function getResult() {
  if (!cropper) return
  const base64 = cropper.getDataURL()
  const blob: Blob | null = await cropper.getBlob()
  if (!blob) return

  // const file = await cropper.getFile({
  //   fileName: locales.fileName,
  // })

  console.log({ base64, blob })
  result.dataURL = base64
  result.blobURL = URL.createObjectURL(blob)
  isShowDialog.value = false
}
</script>

<template>
  <div class="w-100">
    <v-btn variant="tonal" class="w-100 text-body-1">
      Загрузить фото
      <input ref="uploadInput" type="file" accept="image/jpg, image/jpeg, image/png, image/gif" @change="selectFile" />
    </v-btn>
    <v-dialog v-model="isShowDialog" max-width="700">
      <v-card class="px-3 pt-3">
        <VuePictureCropper :boxStyle="{
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f8f8',
        margin: 'auto',
      }" :img="pic" :options="{
        viewMode: 1,
        dragMode: 'crop',
        aspectRatio: 1.3,
      }" />
        <v-card-actions class="d-flex justify-center">
          <v-btn class="text-body-1" variant="tonal">Обрезать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style lang="scss" scoped>
input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 0;
  cursor: pointer;
  opacity: 0;
}
</style>