const getBase64 = (file: Blob, cb: any) => {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function () {
    cb(reader.result)
  }
  reader.onerror = function (error) {
    console.log('Error: ', error)
  }
}

export default getBase64
