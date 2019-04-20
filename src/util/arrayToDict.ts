type NumDict<V> = { [index:number]:V }


// function arrayToDict<V extends { K: number }, K extends keyof V>(array: V[], key:K): NumDict<V>
function arrayToDict<V>(array: V[], keyFun: (item: V) => number): NumDict<V>
function arrayToDict<T, V>(array: T[], keyFun: (item: T) => number, valueFun: (item: T) => V) : NumDict<V>

function arrayToDict<T, V>(array: T[], keyFun: (item: T) => number, valueFun?: (item: T) => V): NumDict<V> {
    const _valueFun = valueFun ? valueFun : (item:T) => item
    return array.reduce((obj: NumDict<V>, item: T) => ({ ...obj, [keyFun(item)]:_valueFun(item)}), {})
}

// function arrayToDict<V, K extends keyof V>(array: V[], key:K | ((value: V) => number)): NumDict<V> {
//     let keyFun: (value: V) => number
//      if (typeof key === "function") {
//         keyFun = key
//     } else {
//         keyFun = (item: V) => item[key]
//     }
//     return array.reduce((obj: NumDict<V>, item: V) => ({ ...obj, [keyFun(item)]:item}), {})
// }

export default arrayToDict


