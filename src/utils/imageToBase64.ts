const imageToBase64 = async (file: string): Promise<string> => {
  return fetch(file)
    .then(response => {
      return response.arrayBuffer();
    })
    .then(buffer => {
      return window.btoa(
        [].slice
          .call(new Uint8Array(buffer))
          .map(bin => {
            return String.fromCharCode(bin);
          })
          .join('')
      );
    });
};

export default imageToBase64;
