import { ScheduleEntry, ScheduleType } from "@/types/schedule.ts";
import { AbstractSaver } from "@/services/AbstractSaver.ts";

export class ScheduleService extends AbstractSaver<ScheduleEntry, string> {
  prefixKey = "scheduleEntry";

  public static constructKey(date: Date, scheduleType: ScheduleType) {
    return `${date.toLocaleDateString("de")}-${scheduleType}`;
  }
}
