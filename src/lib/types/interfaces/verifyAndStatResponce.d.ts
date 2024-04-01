export interface verifyAndStatResponce {
    stats: fs.Stats;
    uploadType: "single" | "multipart";
    chunks: number;
}