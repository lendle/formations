import lap from "./lap"

//takes a scoreFun that takes an A and a B
//and converts it to a function that takes i, j for i, j in [0, number of as/bs)
//for use with lap()
function cost<A, B>(as: A[], bs: B[], scoreFun: (a: A, b: B) => number) {
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
  scoreFun: (a: A, b: B) => number
): [A, B][] {
  if (as.length !== bs.length) {
    throw new Error("idxList1 and idxList2 have diff lenghts")
  }
  const assignments = lap(as.length, cost(as, bs, scoreFun)).col

  return Array.from(assignments).map((p: number, i: number) => {
    const a = as[p]
    const b = bs[i]
    return [a, b]
  })
}

export default lapwrapper