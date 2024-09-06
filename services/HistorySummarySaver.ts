import { AbstractSaver } from "@/services/AbstractSaver.ts";

export class HistorySummarySaver extends AbstractSaver<string, undefined> {
  prefixKey = "historySummary";

  public constructKey() {
    return this.prefixKey;
  }
}
