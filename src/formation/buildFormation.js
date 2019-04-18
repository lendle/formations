import _ from 'lodash'
import Round from '../geometry/Round';
import Whacker from '../geometry/Whacker';
import Base from '../geometry/Base';

export default function buildFormation(slots, baseSize) {
    // const baseSize = parseInt(mutable mbaseSize)
    // const slots = parseInt(mutable mslots)
    
    //ring 0 = base,
    //ring 1 = 1st pods
    //ring 2 = 2nd pods
    //ring 3 = if baseSize > 4, bridges, otherwise just pods on out
    //ring 4 = if baseSize > 4, then pods on bridges in ring 3, otherwise just pods on podLines
    //ring 5... pod lines on out
    const slotsInRing = (ring) => {
      const podLines = Math.round(baseSize/2)
      const bridges = podLines > 2
      if (ring === 0) { return baseSize }
      if (ring === 1) { return baseSize + podLines * 5 }
      if (ring === 2) { return baseSize + podLines * 10 }
      if (ring === 3) { return slotsInRing(ring-1) + (bridges ? 3 * podLines : 5 * podLines) }
      if (ring === 4) { return slotsInRing(ring-1) + (bridges ? 5 * podLines : 5 * baseSize) }
      return slotsInRing(4) + (ring - 4) * (bridges ? 5 * podLines : 5 * baseSize)
    }
   
    //gets dock positions for next ring given currently filled rings
    const nextDockPositions = (rings) => {
      if (rings.length > 10) {
        throw new Error("somethings fucky")
      }
      const bridges = baseSize !== 4
      
      if (rings.length === 1) {
        const base = rings[0]
        return _.range(0, baseSize, 2).map(slot => ({
          left: {c: base, s: slot},
          right: {c: base, s: (slot + baseSize - 1) % baseSize}
        }))
      }
      if (!bridges || rings.length === 2 || rings.length === 4 || rings.length >= 6) {
        // if we're not using bridges
        // or last ring (1) is 1st pods (and we need 2nd pods)
        // or last ring (3) is bridges (and we need 2nd pods on those bridges)
        // or we're way out (last ring >= 5)
        // then we want pods on everything in the last ring
        return rings[rings.length-1].map(component => {
          const isPod = component.slots === 5
          return {
            left: {c: component, s: 1 + (isPod ? 1 : 0)},
            right: {c: component, s: 0 + (isPod ? 1 : 0)}
          }
        })
      } 
      if (bridges && rings.length === 3) {
        // ring 3 is bridges if there are bridges
        const firstPods = rings[1]
        const numBridges = firstPods.length
        return _.range(numBridges).map(bridgeNum => ({
          left: {c: firstPods[(bridgeNum+1)%numBridges], s: 0},
          right: {c: firstPods[bridgeNum], s: 3}
        }))
      }
      if (bridges && rings.length === 5) {
        // if bridges, ring 5 is 2nd pods on bridges
        const secondPods = rings[2]
        const bridgeSecondPods = rings[4]
        return _().zip(secondPods, bridgeSecondPods).flatten().map(component => {
          return ({
          left: {c: component, s: component.slots === 5? 2: 1}, //5 -> pod, !5 (3) -> bridge
          right: {c: component, s: component.slots === 5? 1: 0}
        })}).value()
      }
      throw new Error("mmm")
    }
    
    const addRings = (rings) => {
      const completeRings = rings.length - 1
      
      // if (slotsInRing(completeRings) !== _.flatten(rings).map(c => c.slots).reduce((acc, x) => acc + x, 0)){
      //   console.log({completeRings, slotsInRing: slotsInRing(completeRings), rings})
      // }
      const nextRingSlots = Math.min(slots, slotsInRing(completeRings + 1)) - 
                            slotsInRing(completeRings)
      
      if (nextRingSlots <= 0) return rings
      
      const dockPositions = nextDockPositions(rings)
      const slotGroups = dockPositions.length
  
      
      const slotsPerGroup = Math.floor(nextRingSlots/slotGroups)
      const groupsWithExtraSlot = nextRingSlots % slotGroups
      
      const nextRing = dockPositions.flatMap(({left, right}, groupNum) => {
        //slots in this group
        const slotsToFill = slotsPerGroup + (groupNum < groupsWithExtraSlot ? 1 : 0)
        const isPod = left.c === right.c //left and right docking on same component is a pod, else bridge
        const totalSlots = isPod? 5 : 3
        const slotNumFun = (extra=0) => s => ({slotNum: s + 
                                               slotsInRing(completeRings) + 
                                               slotsPerGroup * groupNum +
                                               Math.min(groupsWithExtraSlot, groupNum) +
                                               extra
                                 })
        // const priorSlots =  + totalSlots * groupNum//todo
        if (slotsToFill === totalSlots) {
          return [new Round(totalSlots, slotNumFun(), left, right)]
        } else {
          //whackers
          const leftHandSlots = Math.floor(slotsToFill/2)
          const rightHandSlots = leftHandSlots + slotsToFill % 2 //maybe one extra
          const whackers = []
          if (leftHandSlots > 0) {
            whackers.push(new Whacker(leftHandSlots, slotNumFun(rightHandSlots), left, "left"))
          }
          if (rightHandSlots > 0) {
            whackers.push(new Whacker(rightHandSlots, slotNumFun(), right, "right"))
          }
          return whackers
        }
      })
      return addRings([...rings, nextRing])
    }
    return _.flatten(addRings([new Base(baseSize, s => ({slotNum: s}))]))
    
  }