import _ from 'lodash'
import Round from '../geometry/Round';
import Whacker from '../geometry/Whacker';
import Base from '../geometry/Base';

/**
 * Builds a formation using the following rules until we run out of slots
 *    1) Start with the base
 *    2) Add first pods on every other base slot, starting with the slot going up jump run moving left
 *    3) Add second pods on first pods
 *    4) If base size > 4, build bridges between frist pods
 *    5) If there are bridges, build 2nd pods on bridges
 *    6) Build pods on each pod line on out to infinity!
 * 
 * If there are not enough slots to complete a ring of pods/bridges, then build whackers
 * 
 * @param {Number} slots slots in this formation
 * @param {Number} baseSize
 * @returns an array of Components
 */
export default function buildFormation(slots, baseSize) {
  
    /**
     * computes the number of slots in a ring
     * @param {Number} ring index of ring, 
     *         ring 0 = base,
     *         ring 1 = 1st pods
     *         ring 2 = 2nd pods
     *         ring 3 = if baseSize > 4, bridges, otherwise just pods on out
     *         ring 4 = if baseSize > 4, then pods on bridges in ring 3, otherwise just pods on podLines
     *         ring 5... pod lines on out
     */
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
   
    /**
     * gets dock positions for next ring given currently filled rings
     * @param rings an array of rings, 0th starting at base and going out 
     */
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
    
    /**
     * this takes an array of rings starting with at least the Base, and
     * adds rings until all slots are included
     * @param {*} rings array of rings. (a ring is an array of components)
     */
    const addRings = (rings) => {
      const completeRings = rings.length - 1
      
      //compute slots in next ring
      const nextRingSlots = Math.min(slots, slotsInRing(completeRings + 1)) - slotsInRing(completeRings)
      
      if (nextRingSlots <= 0) return rings //we're done
      
      const dockPositions = nextDockPositions(rings)

      // here a 'group' is either a pod, or, if there are less than 5 slots, two whackers
      const slotGroups = dockPositions.length
      
      const slotsPerGroup = Math.floor(nextRingSlots/slotGroups)
      const groupsWithExtraSlot = nextRingSlots % slotGroups
      
      const nextRing = dockPositions.flatMap(({left, right}, groupNum) => {
        //slots in this group
        const slotsToFill = slotsPerGroup + (groupNum < groupsWithExtraSlot ? 1 : 0)
        const isPod = left.c === right.c //left and right docking on same component is a pod, else bridge
        const totalSlotsInGroup = isPod? 5 : 3
        //slotNumFun computes the global slotNum property in the formation for slot number s in this component
        const slotNumFun = (extra=0) => s => ({slotNum: s + //this slot's index within component
                                               slotsInRing(completeRings) + //number of slots in prior rings
                                               slotsPerGroup * groupNum + //number of slots in prior groups in this ring
                                               Math.min(groupsWithExtraSlot, groupNum) + //an extra slot per prior group, up to groupsWithExtraSlot
                                               extra //0 by default, or number of slots in previous whacker, if needed
                                 })
        if (slotsToFill === totalSlotsInGroup) { //if we have to fill the whole group, it's a pod
          return [new Round(totalSlotsInGroup, slotNumFun(), left, right)]
        } else {
          //whackers
          const leftHandSlots = Math.floor(slotsToFill/2)
          const rightHandSlots = leftHandSlots + slotsToFill % 2 //if odd number, right hand whacker gets the extra
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
      //recurse, add more rings to this prior plus this ring
      return addRings([...rings, nextRing])
    }

    return _.flatten(addRings([new Base(baseSize, s => ({slotNum: s}))]))
  }