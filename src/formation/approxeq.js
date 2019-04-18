export default function approxeq(a, b, eps = Math.sqrt(Number.EPSILON)) {
    return Math.abs(a - b) < eps
}