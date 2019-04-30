import lap from "./lap"

type ScoreFun<A, B> = (a: A, b: B) => number

//takes a scoreFun that takes an A and a B
//and converts it to a function that takes i, j for i, j in [0, number of as/bs)
//for use with lap()
function cost<A, B>(as: A[], bs: B[], scoreFun: ScoreFun<A, B>) {
  //memoize scoreFun
  const memo = new Map<string, number>()
  return (i: number, j: number): number => {
    const key = `${i}.${j}`
    if (!memo.has(key)) {
      const a = as[i]
      const b = bs[j]
      memo.set(key, scoreFun(a, b))
    }
    return memo.get(key)!
  }
}

/**
 * takes two arrays of things of equal length and a function that computes a score between a pair of those things
 * and assigns each thing in the first list to a thing in the second list, minimizing the sum of the scores of the assigned pairs
 * an
 * @param as
 * @param bs
 * @param scoreFun
 */
function lapwrapper<A, B>(
  as: A[],
  bs: B[],
  scoreFun: ScoreFun<A, B>
): [A, B][] {
  if (as.length !== bs.length) {
    throw new Error("as and bs have diff lenghts")
  }

  const badScores = as.flatMap(a =>
    bs.flatMap(b => {
      const score = scoreFun(a, b)
      return score < 0 || score === Infinity ? [{ a, b, score }] : []
    })
  )

  if (badScores.length > 0) {
    console.warn("Scores should be non-negative and not infinity: ", badScores)
  }

  const result = lap(as.length, cost(as, bs, scoreFun))

  if (
    !result.row.every(r => r >= 0 && r < as.length) ||
    new Set(result.row).size != as.length ||
    result.cost === Infinity
  ) {
    const allScores = as.flatMap(a =>
      bs.map(b => ({ a, b, score: scoreFun(a, b) }))
    )
    console.log("something's weird", {
      allScores,
      result
    })
  }
  // const assignments = result.col

  // return Array.from(assignments).map((p: number, i: number) => {
  //   const a = as[p]
  //   const b = bs[i]
  //   return [a, b]
  // })

  return Array.from(result.row).map((p: number, i: number) => {
    const a = as[i]
    const b = bs[p]
    return [a, b]
  })
}

/**
 * returns a function that (returns a function that) tries functions in funs(a,b) in order until it finds
 * a result that isn't undefined, and returns that. if nothing is found, fallback is used, which must be a propper
 * ScoreFun
 * @param funs score functions to try
 * @param fallback fallback score function
 */
export const combineScoreFuns = <A, B>(
  ...funs: ((a: A, b: B) => number | undefined)[]
) => (fallback: ScoreFun<A, B>) => (a: A, b: B) => {
  for (let i = 0; i < funs.length; i++) {
    const fun = funs[i]
    const val = fun(a, b)
    if (val) {
      return val
    }
  }
  return fallback(a, b)
}

export default lapwrapper
