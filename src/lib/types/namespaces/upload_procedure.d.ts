export namespace upload_procedure {
  interface Request {
    fileName: string;
    destination: string;
    size: number;
    uploadType: "single" | "multipart";
    chunks: number;
  }

  interface Response {
    status: {
      code: "accepted" | "rejected";
      error?: string;
    };
    presignedURLs: {part: number, url: string}[];
  }
}
