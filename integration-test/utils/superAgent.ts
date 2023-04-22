import chai from "chai";

export class SuperAgent {
  private static httpServerUrl: string | undefined;

  static setHttpServerUrl(httpServerUrl?: string) {
    this.httpServerUrl = httpServerUrl;
  }

  static newHttpPostRequest(url: string) {
    return chai.request(SuperAgent.httpServerUrl).post(url);
  };

  static newHttpGetRequest(url: string) {
    return chai.request(SuperAgent.httpServerUrl).get(url);
  };

  static newHttpPatchRequest(url: string) {
    return chai.request(SuperAgent.httpServerUrl).patch(url);
  };

  static newHttpDeleteRequest(url: string) {
    return chai.request(SuperAgent.httpServerUrl).delete(url);
  };
}
