export interface Upload {
    deviceID: string;
    uploadID: string;
    uploadType: "single" | "multipart"
    timestamp: number
    destination: string
  }