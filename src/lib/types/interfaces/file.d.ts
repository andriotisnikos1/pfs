export interface file {
    path: string;
}

export interface LSFile {
    name: string;
    type: "file" | "directory";
    size: number;
}