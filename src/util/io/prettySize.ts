//pretty show for KB, MB, GB, TB
export function prettySize(sizeInBytes: number){
    if(sizeInBytes < 1024) return sizeInBytes + " B"
    if(sizeInBytes < 1024 * 1024) return (sizeInBytes / 1024).toFixed(2) + " KB"
    if(sizeInBytes < 1024 * 1024 * 1024) return (sizeInBytes / 1024 / 1024).toFixed(2) + " MB"
    if(sizeInBytes < 1024 * 1024 * 1024 * 1024) return (sizeInBytes / 1024 / 1024 / 1024).toFixed(2) + " GB"
    return (sizeInBytes / 1024 / 1024 / 1024 / 1024).toFixed(2) + " TB"
}