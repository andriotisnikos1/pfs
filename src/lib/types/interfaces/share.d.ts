export interface share {
    shareID: string
    path: string
    expires: number
    maxDownloads?: number
    password?: string
    timestamp: number
}