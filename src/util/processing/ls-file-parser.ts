export default function (paths: string[], prefix = "") {
    // remove pathing from prefix
    if (prefix.startsWith("/")) prefix = prefix.slice(1)
    else if (prefix.startsWith("./")) prefix = prefix.slice(2)
    // remove pathing from the file paths
    paths = paths.map(p => {
      if (p.startsWith("/")) return p.slice(1)
      else if (p.startsWith("./")) return p.slice(2)
      else return p
    })
    // filter out for prefix files
    paths = paths.filter(p => p.startsWith(prefix))
    // remove prefix from the file paths
    paths = paths.map(p => p.slice(prefix.length + (prefix.length > 0 ? 1 : 0)))
    // distinguish between files and directories
    let list: {name: string, type: "file" | "directory"}[] = []
    paths.forEach(p => {
      if (p.includes("/")) {
        list.push({name: p.split("/")[0], type: "directory"})
      } else {
        list.push({name: p, type: "file"})
      }
    })
    // remove duplicates
    list = list.filter((v, i, a) => a.findIndex(t => (t.name === v.name && t.type === v.type)) === i)
    // sort the list
    list = list.sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1
      if (a.type === "file" && b.type === "directory") return 1
      return a.name.localeCompare(b.name)
    })
    return list.map(l => ({...l, fullPath: `${prefix}/${l.name}`}))
  }