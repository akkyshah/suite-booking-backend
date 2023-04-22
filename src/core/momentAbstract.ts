import moment, {Moment} from "moment";
import Diff = moment.unitOfTime.Diff;

export class MomentAbstract {
  momentDate: Moment;

  constructor(dateTime?: Moment | string | number) {
    if (!!dateTime) {
      let isValidDate = true;

      try {
        this.momentDate = moment(dateTime);
        if (!this.momentDate.isValid()) {
          isValidDate = false;
        }
      } catch (error: any) {
        throw error;
      }

      if (!isValidDate) {
        throw new Error("invalid date format");
      }

      if (typeof dateTime === "number") {
        this.toUtc();
      } else if (typeof dateTime === "string" && dateTime.endsWith("Z")) {
        this.toUtc();   // if "Z" is appended to the string then moment will parse string to utc-date-time-moment AND then convert to local-date. Hence we need to reconvert to utc.
      }
    } else {
      this.momentDate = moment();
    }
  }

  startOfTheDay = (): MomentAbstract => {
    this.momentDate = this.momentDate.startOf("day");
    return this;
  }

  endOfTheDay = (): MomentAbstract => {
    this.momentDate = this.momentDate.endOf("day");
    return this;
  }

  toUtc = (): MomentAbstract => {
    this.momentDate = this.momentDate.utc()
    return this;
  }

  toLocal = (): MomentAbstract => {
    this.momentDate = this.momentDate.local()
    return this;
  }

  add = (amount: number, unit: string): MomentAbstract => {
    // @ts-ignore
    this.momentDate = this.momentDate.add(amount, unit);
    return this;
  }

  subtract = (amount: number, unit: string): MomentAbstract => {
    // @ts-ignore
    this.momentDate = this.momentDate.subtract(amount, unit);
    return this;
  }

  diff = (moment: Moment | MomentAbstract, diffUnit: Diff): number => {
    if (moment instanceof MomentAbstract) {
      return this.getMoment().diff(moment.getMoment(), diffUnit);
    } else {
      return this.getMoment().diff(moment, diffUnit);
    }
  }

  isBefore = (moment: Moment | MomentAbstract): boolean => {
    if (moment instanceof MomentAbstract) {
      return this.getMoment().isBefore(moment.getMoment());
    } else {
      return this.getMoment().isBefore(moment);
    }
  }

  isAfter = (moment: Moment | MomentAbstract): boolean => {
    if (moment instanceof MomentAbstract) {
      return this.getMoment().isAfter(moment.getMoment());
    } else {
      return this.getMoment().isAfter(moment);
    }
  }

  isSameOrAfter = (moment: Moment | MomentAbstract): boolean => {
    if (moment instanceof MomentAbstract) {
      return this.getMoment().isSameOrAfter(moment.getMoment());
    } else {
      return this.getMoment().isSameOrAfter(moment);
    }
  }

  isSameOrBefore = (moment: Moment | MomentAbstract): boolean => {
    if (moment instanceof MomentAbstract) {
      return this.getMoment().isSameOrBefore(moment.getMoment());
    } else {
      return this.getMoment().isSameOrBefore(moment);
    }
  }

  valueOf = (): number => {
    return this.getMoment().valueOf();
  }

  toJavascriptDate = (): Date => {
    return this.getMoment().toDate()
  }

  toDateString = (): string => {
    return this.getMoment().format("YYYY-MM-DD");
  }

  toIsoString = (): string => {
    return this.getMoment().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
  }

  getMoment = () => {
    return this.momentDate;
  }
}
