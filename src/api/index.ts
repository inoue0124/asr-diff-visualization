export default class ApiClient {
  async calculateWer(reference: string, target: string): Promise<Response> {
    const param = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ reference, target }),
    };
    return fetch(
      "https://g9uqdw76fa.execute-api.ap-northeast-1.amazonaws.com/dev/wer",
      param
    );
  }
}
