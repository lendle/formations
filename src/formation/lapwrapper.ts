import lap from "./lap"

type ScoreFun<A, B> = (a: A, b: B) => number

//takes a scoreFun that takes an A and a B
//and converts it to a function that takes i, j for i, j in [0, number of as/bs)
//for use with lap()
function cost<A, B>(as: A[], bs: B[], scoreFun: ScoreFun<A, B>) {
  //memoize scoreFun
  const memo = new Map<string, number>()
  return (i: number, j: number): number => {
    if (i >= as.length) {
      //it's free to assign nothing from as to any b
      return 0
    }
    const key = `${i}.${j}`
    if (!memo.has(key)) {
      const a = as[i]
      const b = bs[j]
      memo.set(key, scoreFun(a, b))
    }
    return memo.get(key) as number
  }
}

/**
 * takes two arrays of things and a function that computes a score between a pair of those things
 * and assigns each thing in the first array to a thing in the second array,
 * minimizing the sum of the scores of the assigned pairs
 *
 * The second array can be longer than the first,
 * in which case some things in the second won't get assigned to the first
 * @param as
 * @param bs
 * @param scoreFun
 */
function lapwrapper<A, B>(
  as: A[],
  bs: B[],
  scoreFun: ScoreFun<A, B>
): [A, B][] {
  if (as.length > bs.length) {
    throw new Error("as can't be longer than bs")
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

  const result = lap(bs.length, cost(as, bs, scoreFun))

  if (
    //check everything in a got assigned to something in b
    !result.row.slice(0, as.length).every(r => r >= 0 && r < bs.length) ||
    //check everything in a has a unique b
    new Set(result.row.slice(0, as.length)).size !== as.length ||
    //check the computation didn't explode
    result.cost === Infinity
  ) {
    const allScores = as.flatMap(a =>
      bs.map(b => ({ a, b, score: scoreFun(a, b) }))
    )
    console.error("something's weird", {
      allScores,
      result
    })
  }

  return Array.from(result.row.slice(0, as.length)).map(
    (p: number, i: number) => {
      const a = as[i]
      const b = bs[p]
      return [a, b]
    }
  )
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
