function generateCustomFilename(originalFilename: string) {
    // Your logic to generate a custom filename here
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = originalFilename.split('.').pop();
    return `${uniqueSuffix}.${extension}`;
  }

export {generateCustomFilename};