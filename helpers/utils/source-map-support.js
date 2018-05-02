//      
const filenameRE = /\(([^)]+\.js):(\d+):(\d+)\)$/

module.exports.applySourcemaps = applySourcemaps;

async function applySourcemaps (e     )                {
  if (!e || typeof e.stack !== 'string' || e.sourceMapsApplied) {
    return
  }

  const lines = e.stack.split('\n')

  const result = await Promise.all(lines.map((line) => {
    return rewriteTraceLine(line)
  }))

  e.stack = result.join('\n')
  // This is to make sure we don't apply the sourcemaps twice on the same object
  e.sourceMapsApplied = true
}

async function rewriteTraceLine (trace        )                  {
  const m = trace.match(filenameRE)
//console.log(31,trace, m);
  if (m == null) {
    return trace
  }

  const filePath = m[1]
  const mapPath = `${filePath}.map`

  // Load these on demand.
  const fs = require('fs')
  const promisify = require('./promisify')

  const readFile = promisify(fs.readFile)
  const access = promisify(fs.access)

  try {
    await access(mapPath, (fs.constants || fs).R_OK)
  } catch (err) {
  //console.log(32,err);
    return trace
  }

  //console.log(33,mapPath);
  const mapContents = await readFile(mapPath)
  const {SourceMapConsumer} = require('source-map')
  const map = new SourceMapConsumer(JSON.parse(mapContents))
  //console.log(44,map);
  const originalPosition = map.originalPositionFor({
    line: Number(m[2]),
    column: Number(m[3])
  });
  console.log(originalPosition);

  if (originalPosition.source != null) {
    const { source, line, column } = originalPosition
    const mappedPosition = `(${source.replace(/^webpack:\/\/\//, '')}:${String(line)}:${String(column)})`
    return trace.replace(filenameRE, mappedPosition)
  }

  return trace
}
