export abstract class AbstractSaver<T, U extends string | undefined> {
  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  private sessionId: string;
  private denoKV!: Deno.Kv;

  abstract prefixKey: string;

  private async setup() {
    this.denoKV = await Deno.openKv();
  }

  private async isSetup() {
    if (!this.denoKV) {
      await this.setup();
    }
  }

  public async save(value: T, key?: U) {
    await this.isSetup();

    if (key) {
      await this.denoKV.set([this.sessionId, this.prefixKey, key], value);
    } else {
      await this.denoKV.set([this.sessionId, this.prefixKey], value);
    }

    return value;
  }

  public async retrieve(key?: U) {
    await this.isSetup();

    try {
      if (key) {
        return (await this.denoKV.get<T>([this.sessionId, this.prefixKey, key]))
          .value;
      } else {
        return (await this.denoKV.get<T>([this.sessionId, this.prefixKey]))
          .value;
      }
    } catch (error) {
      console.error("error retrieving value", error);
      return null;
    }
  }

  // public async retrieveMany(keys: string[]) {
  //   await this.isSetup();
  //
  //   const values = await this.denoKV.getMany<T>(keys);
  //   values
  // }
}
