export default (m: string, fatal?: boolean) => {
    console.error("error: ".red + m)
    if (fatal) process.exit(1)
}