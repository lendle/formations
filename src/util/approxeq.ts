export default function approxeq(a: number, b: number, eps = Math.sqrt(Number.EPSILON)) {
    return Math.abs(a - b) < eps
}