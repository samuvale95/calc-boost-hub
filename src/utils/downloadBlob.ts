/** Triggers a browser download of an in-memory file. */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** Date stamp used in the names of the result files, e.g. 2026-10-04. */
export const todayStamp = (): string => new Date().toISOString().split('T')[0];
