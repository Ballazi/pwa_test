export const StringSlice = (text, char) => {
  return text === ''
    ? ''
    : text?.length > char
    ? text.slice(0, char) + '...'
    : text;
};

export const emptyObjectValidator = (obj) => {
  return Object.keys(obj).length === 0;
};

export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let fileInfo;

    let baseURL = '';

    // Make new FileReader

    let reader = new FileReader();

    // Convert the file to base64 text

    reader.readAsDataURL(file);

    // on reader load somthing...

    reader.onload = () => {
      // Make a fileInfo Object

      console.log('Called', reader);

      baseURL = reader.result;

      console.log(baseURL);

      resolve(baseURL);
    };

    console.log(fileInfo);
  });
};

export const getBase64Multiple = (files) => {
  return new Promise((resolve) => {
    const base64Array = [];

    const processFile = (index) => {
      if (index >= files.length) {
        // All files have been processed, resolve with the array of Base64 representations
        resolve(base64Array);
        return;
      }

      const file = files[index];

      // Make new FileReader
      const reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load something...
      reader.onload = () => {
        const baseURL = reader.result;
        base64Array.push(baseURL);

        // Process the next file in the array
        processFile(index + 1);
      };
    };

    // Start processing the first file in the array
    processFile(0);
  });
};

export const getBase64MultipleArray = (files) => {
  return new Promise((resolve) => {
    const base64Array = [];

    const processFile = (index) => {
      if (index >= files.length) {
        // All files have been processed, resolve with the array of { base_64, file_name } objects
        resolve(base64Array);
        return;
      }

      const file = files[index];

      // Make new FileReader
      const reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load something...
      reader.onload = () => {
        const base64Data = reader.result;
        const fileName = file.name;
        base64Array.push({ file_data: base64Data, file_name: fileName });

        // Process the next file in the array
        processFile(index + 1);
      };
    };

    // Start processing the first file in the array
    processFile(0);
  });
};

export const getBase64SingleFile = (file) => {
  return new Promise((resolve) => {
    // Make new FileReader
    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load something...
    reader.onload = () => {
      const base64Data = reader.result;
      const fileName = file.name;
      resolve({ file_data: base64Data, file_name: fileName });
    };
  });
};

export const getFilesFromBase64 = (base64Array) => {
  const files = [];

  for (const base64 of base64Array) {
    // Split the Base64 data URL to get the MIME type and data
    const [, base64Data] = base64.split(',');
    const mimeType = base64.match(/:(.*?);/)[1];
    const byteCharacters = atob(base64Data);

    // Create a UInt8Array to hold the binary data
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the UInt8Array and MIME type
    const blob = new Blob([byteArray], { type: mimeType });

    // Create a File object from the Blob
    const fileName = `file_${Date.now()}.${mimeType.split('/')[1]}`;
    const file = new File([blob], fileName, { type: mimeType });

    files.push(file);
  }

  return files;
};
