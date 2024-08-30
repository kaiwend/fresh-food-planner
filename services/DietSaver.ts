import { AbstractSaver } from "@/services/AbstractSaver.ts";
import { Diet } from "@/types/diet.ts";

export class DietService extends AbstractSaver<Diet, undefined> {
  prefixKey = "diet";

  public constructKey() {
    return this.prefixKey;
  }
}
