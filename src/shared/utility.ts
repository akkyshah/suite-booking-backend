import {v4 as uuidV4} from "uuid";
import {ISlot} from "@custom-types";
import {getSlots} from "slot-calculator";
import {MomentAbstract} from "@/core";

export class Utility {
  static isUndefined(object: any) {
    return object === null || object === undefined
  };

  static isDefined(object: any) {
    return !Utility.isUndefined(object)
  };

  static createUniqueRandomAlphaNumericId() {
    return uuidV4().replace(/-/g, "");
  };

  static mergeSubsequentSlots(startDate: string, endDate: string, bookedSlots: ISlot[]): ISlot[] {
    if (bookedSlots.length === 0) return [];

    const {availableSlots} = getSlots({
      from: startDate,
      to: endDate,
      duration: 24 * 60, // at-least 1 day
      unavailability: bookedSlots
    });

    let [currentSlot, ...remainingAvailableSlots]: ISlot[] = availableSlots;
    currentSlot = {
      from: new MomentAbstract(currentSlot.from).toDateString(),
      to: new MomentAbstract(currentSlot.to).toDateString()
    }

    const mergedSlots = [currentSlot];

    remainingAvailableSlots.map((slot: ISlot) => {

      slot.from = new MomentAbstract(slot.from).toDateString();
      slot.to = new MomentAbstract(slot.to).toDateString();

      if (currentSlot.to === slot.from) {
        currentSlot.to = slot.to;
      } else {
        currentSlot = {from: slot.from, to: slot.to}
        mergedSlots.push(currentSlot);
      }
    });

    return mergedSlots;
  }
}
